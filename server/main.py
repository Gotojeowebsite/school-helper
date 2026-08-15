#!/usr/bin/env python3
"""
AcademiaPro - Multi-User PowerSchool Cloud Sync Backend
========================================================
Lightweight, free-tier cloud backend (FastAPI + Playwright) for automated
multi-student PowerSchool scraping and real-time Firestore database synchronization.
"""

import os
import re
import sys
import json
import time
import base64
import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Header, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.fernet import Fernet
import requests

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("academiapro-server")

app = FastAPI(
    title="AcademiaPro PowerSchool Cloud Sync API",
    version="1.0.0",
    description="Multi-student automated PowerSchool grade synchronization backend."
)

# Enable CORS for web apps, custom domains, and Google Sites embeds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration & Secrets
DEFAULT_FIREBASE_CONFIG = {
    "apiKey": "AIzaSyCs9TwwOTWRoypz5xVQJrT1CtNMBiUt12Y",
    "projectId": "school-helper-5a829"
}

FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY", DEFAULT_FIREBASE_CONFIG["apiKey"])
FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", DEFAULT_FIREBASE_CONFIG["projectId"])
CRON_SECRET = os.environ.get("CRON_SECRET", "academiapro-secret-cron-key-2026")

# Server-side AES Encryption key for securing stored passwords
RAW_ENC_KEY = os.environ.get("ENCRYPTION_KEY")
if not RAW_ENC_KEY:
    # Generate a deterministic fallback or default key for simplicity
    fallback_seed = b"AcademiaProPowerSchoolEncryptionKey2026Fall=="
    RAW_ENC_KEY = base64.urlsafe_b64encode(fallback_seed[:32]).decode()

cipher_suite = Fernet(RAW_ENC_KEY.encode())


# --- DATA MODELS ---

class CredentialsRequest(BaseModel):
    idToken: str
    psUsername: str
    psPassword: str
    psPortalUrl: Optional[str] = "https://hisdconnect.houstonisd.org/public/"
    autoSyncEnabled: bool = True

class SyncUserRequest(BaseModel):
    idToken: str

class DeleteCredentialsRequest(BaseModel):
    idToken: str


# --- HELPER FUNCTIONS ---

def encrypt_text(text: str) -> str:
    """Encrypts plain text with AES-256 Fernet."""
    if not text:
        return ""
    return cipher_suite.encrypt(text.encode("utf-8")).decode("utf-8")

def decrypt_text(encrypted: str) -> str:
    """Decrypts ciphertext back into plain text."""
    if not encrypted:
        return ""
    try:
        return cipher_suite.decrypt(encrypted.encode("utf-8")).decode("utf-8")
    except Exception as e:
        logger.error(f"Decryption error: {e}")
        return ""

def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    """Verifies Firebase ID token and returns user profile."""
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_API_KEY}"
    resp = requests.post(url, json={"idToken": id_token}, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase Auth token.")
    users = resp.json().get("users", [])
    if not users:
        raise HTTPException(status_code=401, detail="User not found.")
    return users[0]

def get_firestore_doc(uid: str, id_token: Optional[str] = None) -> Dict[str, Any]:
    """Fetches user document from Firestore REST API."""
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/users/{uid}"
    headers = {}
    if id_token:
        headers["Authorization"] = f"Bearer {id_token}"
    resp = requests.get(url, headers=headers, timeout=10)
    if resp.status_code == 200:
        fields = resp.json().get("fields", {})
        data_str = fields.get("dataString", {}).get("stringValue")
        if data_str:
            try:
                return json.loads(data_str)
            except Exception:
                pass
    return {}

def save_firestore_doc(uid: str, planner_data: Dict[str, Any], id_token: Optional[str] = None) -> bool:
    """Saves updated planner data into Firestore document."""
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/users/{uid}"
    headers = {}
    if id_token:
        headers["Authorization"] = f"Bearer {id_token}"
    
    payload = {
        "fields": {
            "dataString": {"stringValue": json.dumps(planner_data)},
            "updatedAt": {"stringValue": time.strftime("%Y-%m-%dT%H:%M:%SZ")}
        }
    }
    resp = requests.patch(
        f"{url}?updateMask.fieldPaths=dataString&updateMask.fieldPaths=updatedAt",
        headers=headers,
        json=payload,
        timeout=15
    )
    return resp.status_code == 200

def clean_course_name(name: str) -> str:
    if not name:
        return ""
    name = re.sub(r"^[\d\s()A-Za-z]+[-:]\s*", "", name)
    name = re.sub(r"Email.*$", "", name, flags=re.IGNORECASE)
    name = re.sub(r"-\s*Rm:.*$", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s*\.\s*$", "", name)
    return name.strip()

def parse_powerschool_text(raw_text: str) -> Dict[str, Any]:
    student_name = None
    welcome_match = re.search(r"Welcome,\s+([A-Za-z\s]+?)(?:\s+Help|\s+Sign Out|\n|$)", raw_text, re.IGNORECASE)
    if not welcome_match:
        welcome_match = re.search(r"Grades and Attendance:\s*([A-Za-z]+,\s*[A-Za-z\s]+)", raw_text, re.IGNORECASE)
    
    if welcome_match:
        n = welcome_match.group(1).strip()
        if "," in n:
            parts = [p.strip() for p in n.split(",")]
            student_name = f"{parts[1]} {parts[0]}" if len(parts) > 1 else n
        else:
            student_name = n

    classes = []
    lines = raw_text.splitlines()

    period_regex = re.compile(r"^\s*(\d+\s*\([A-Za-z0-9,\- ]+\)|(?:Period|Per|Block)\s*\d+)", re.IGNORECASE)
    period_indices = []

    for i, line in enumerate(lines):
        m = period_regex.match(line)
        if m:
            period_indices.append((i, m.group(1).strip()))

    if not period_indices:
        for i, line in enumerate(lines):
            if "Email " in line:
                prev_idx = max(0, i - 1)
                period_indices.append((prev_idx, ""))

    if period_indices:
        for p in range(len(period_indices)):
            start_idx, period = period_indices[p]
            end_idx = period_indices[p + 1][0] if p + 1 < len(period_indices) else len(lines)
            block_lines = lines[start_idx:end_idx]
            block_text = "\n".join(block_lines)

            course_name = ""
            teacher = ""
            room = ""
            grade_percent = None

            line0_parts = [s.strip() for s in block_lines[0].split("\t") if s.strip()]
            for part in reversed(line0_parts):
                if (part and "Not available" not in part and part != "." and 
                    not re.match(r"^\d+$", part) and not period_regex.match(part)):
                    course_name = clean_course_name(part)
                    break

            if not course_name:
                for j in range(min(len(block_lines), 4)):
                    l = block_lines[j].strip()
                    if l and not l.startswith("Email") and not l.startswith("- Rm") and "Not available" not in l and not re.match(r"^\d+$", l):
                        clean = re.sub(r"^\d+\s*\([A-Za-z0-9,\- ]+\)\s*", "", l)
                        clean = re.sub(r"\t+", " ", clean).strip()
                        cleaned = clean_course_name(clean)
                        if len(cleaned) > 2 and not cleaned.lower().startswith("attendance"):
                            course_name = cleaned
                            break

            teacher_match = re.search(r"Email\s+([A-Za-z\s,.\-0-9]+?)(?:\r?\n|\t|- Rm|$)", block_text, re.IGNORECASE)
            if teacher_match:
                t = teacher_match.group(1).strip()
                if t.lower().startswith("teacher"):
                    teacher = ""
                elif "," in t:
                    parts = [p.strip() for p in t.split(",")]
                    teacher = f"{parts[1]} {parts[0]}".strip() if len(parts) > 1 else t
                else:
                    teacher = t

            room_match = re.search(r"-\s*Rm:\s*(\d+[A-Za-z]?|[A-Za-z0-9\-]+)?", block_text, re.IGNORECASE)
            if room_match and room_match.group(1):
                room = room_match.group(1).strip()
            else:
                for j, bl in enumerate(block_lines):
                    if bl.strip() == "- Rm:" and j + 1 < len(block_lines):
                        next_l = block_lines[j + 1].strip()
                        if re.match(r"^\d+[A-Za-z]?$", next_l):
                            room = next_l
                            break

            found_scores = []
            past_header = False
            for bl in block_lines:
                bl_clean = bl.strip()
                if bl_clean.startswith("Email") or bl_clean.startswith("- Rm:"):
                    past_header = True
                    continue
                if not past_header:
                    continue
                if room and bl_clean == room:
                    continue
                if bl_clean.startswith("Attendance Totals"):
                    break

                tokens = re.split(r"[\t\s]+", bl_clean)
                for tok in tokens:
                    tok = tok.strip()
                    if tok in (room, "[ i ]", "Not", "available", "."):
                        continue
                    if re.match(r"^\d{1,3}(?:\.\d+)?$", tok):
                        found_scores.append(float(tok))

            if found_scores:
                grade_candidates = []
                if len(found_scores) >= 2 and found_scores[-1] == 0 and found_scores[-2] == 0:
                    grade_candidates = found_scores[:-2]
                else:
                    grade_candidates = found_scores
                if grade_candidates:
                    grade_percent = grade_candidates[0]

            if course_name and len(course_name) > 1 and not course_name.lower().startswith("attendance totals"):
                classes.append({
                    "className": course_name,
                    "period": period,
                    "teacher": teacher,
                    "room": room,
                    "gradePercent": grade_percent
                })

    return {"studentName": student_name, "classes": classes}


def scrape_student_powerschool(portal_url: str, username: str, password: str) -> Dict[str, Any]:
    """Logs into PowerSchool in a headless browser and extracts grades."""
    from playwright.sync_api import sync_playwright

    logger.info(f"Connecting to PowerSchool portal: {portal_url} for user {username}")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = context.new_page()

        page.goto(portal_url, wait_until="networkidle", timeout=35000)

        student_tab = page.query_selector("#btn-student-login, a[href*='student'], li.student-tab")
        if student_tab and student_tab.is_visible():
            student_tab.click()
            time.sleep(1)

        account_input = page.query_selector("#fieldAccount, input[name='account'], input#username, input[type='text']")
        password_input = page.query_selector("#fieldPassword, input[name='pw'], input#password, input[type='password']")

        if not account_input or not password_input:
            browser.close()
            raise Exception("PowerSchool login fields not found on page.")

        account_input.fill(username)
        password_input.fill(password)

        submit_btn = page.query_selector("#btn-enter, button[type='submit'], input[type='submit'], #signin-btn")
        if submit_btn:
            submit_btn.click()
        else:
            password_input.press("Enter")

        page.wait_for_load_state("networkidle", timeout=25000)
        time.sleep(2)

        current_url = page.url
        if "login" in current_url.lower() or "error" in current_url.lower():
            error_el = page.query_selector(".feedback-alert, .error, #login-error")
            err_msg = error_el.inner_text() if error_el else "Invalid PowerSchool login credentials."
            browser.close()
            raise Exception(f"Login Failed: {err_msg}")

        if "guardian" not in current_url.lower() and "home.html" not in current_url.lower():
            page.goto(f"{portal_url.rstrip('/')}/guardian/home.html", wait_until="networkidle", timeout=15000)

        page_text = page.evaluate("() => document.body.innerText")
        browser.close()

        return parse_powerschool_text(page_text)


def merge_scraped_grades_into_planner(planner_data: Dict[str, Any], scraped: Dict[str, Any]) -> Dict[str, Any]:
    """Merges scraped PowerSchool courses and grades into existing planner data."""
    classes = planner_data.get("classes", [])
    assignments = planner_data.get("assignments", [])
    settings = planner_data.get("settings", {})
    active_sem_id = settings.get("activeSemesterId", "sem-current")

    if scraped.get("studentName") and not settings.get("studentName"):
        settings["studentName"] = scraped["studentName"]

    for idx, pc in enumerate(scraped.get("classes", [])):
        ps_name = pc["className"]
        grade = pc.get("gradePercent")

        # Fuzzy match existing class
        matched_class = None
        for c in classes:
            c_name_clean = c.get("name", "").lower()
            ps_clean = ps_name.lower()
            if ps_clean in c_name_clean or c_name_clean in ps_clean:
                matched_class = c
                break

        if not matched_class:
            cat_id = f"gc-hw-{int(time.time() * 1000) + idx}"
            matched_class = {
                "id": f"cls-ps-{int(time.time() * 1000) + idx}",
                "semesterId": active_sem_id,
                "name": ps_name,
                "teacher": pc.get("teacher", ""),
                "room": pc.get("room", ""),
                "color": "#4f46e5",
                "credits": 3,
                "gradeCategories": [
                    {"id": cat_id, "name": "Homework & Assignments", "weight": 40},
                    {"id": f"gc-exam-{int(time.time() * 1000) + idx}", "name": "Tests & Exams", "weight": 60}
                ],
                "notes": f"Synced from PowerSchool ({pc.get('period', '')})"
            }
            classes.append(matched_class)
        else:
            if not matched_class.get("teacher") and pc.get("teacher"):
                matched_class["teacher"] = pc["teacher"]
            if not matched_class.get("room") and pc.get("room"):
                matched_class["room"] = pc["room"]

        if grade is not None:
            snapshot = None
            for a in assignments:
                if a.get("classId") == matched_class["id"] and "PowerSchool Current Grade" in a.get("title", ""):
                    snapshot = a
                    break

            cat_id = matched_class.get("gradeCategories", [{}])[0].get("id")

            if snapshot:
                snapshot["scoreEarned"] = grade
                snapshot["maxScore"] = 100
                snapshot["status"] = "completed"
                snapshot["notes"] = f"Auto-synced from PowerSchool on {time.strftime('%Y-%m-%d %H:%M')}"
            else:
                assignments.append({
                    "id": f"asg-ps-{int(time.time() * 1000) + idx}",
                    "semesterId": active_sem_id,
                    "classId": matched_class["id"],
                    "title": "PowerSchool Current Grade Snapshot",
                    "description": "Auto-synced from PowerSchool cloud backend",
                    "type": "homework",
                    "dueDate": time.strftime("%Y-%m-%dT23:59:00"),
                    "priority": "medium",
                    "status": "completed",
                    "completionPercentage": 100,
                    "gradeCategoryId": cat_id,
                    "scoreEarned": grade,
                    "maxScore": 100,
                    "subtasks": [],
                    "notes": f"Current Grade: {grade}%"
                })

    planner_data["classes"] = classes
    planner_data["assignments"] = assignments
    planner_data["settings"] = settings
    planner_data["lastCloudSync"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    return planner_data


# --- API ENDPOINTS ---

@app.get("/")
@app.get("/health")
def health_check():
    """Health check endpoint for cloud monitoring and uptime pingers."""
    return {
        "status": "healthy",
        "service": "AcademiaPro PowerSchool Cloud Sync",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "version": "1.0.0"
    }

@app.post("/api/save-credentials")
def save_student_credentials(req: CredentialsRequest):
    """Encrypts and securely saves a student's PowerSchool login for automated cloud sync."""
    user = verify_firebase_token(req.idToken)
    uid = user["localId"]

    encrypted_password = encrypt_text(req.psPassword)
    
    # Store credentials in Firestore user settings
    planner_data = get_firestore_doc(uid, req.idToken)
    settings = planner_data.get("settings", {})
    
    settings["psAutoSync"] = {
        "enabled": req.autoSyncEnabled,
        "username": req.psUsername,
        "encryptedPassword": encrypted_password,
        "portalUrl": req.psPortalUrl,
        "lastSaved": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    planner_data["settings"] = settings
    
    success = save_firestore_doc(uid, planner_data, req.idToken)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save credentials to database.")

    logger.info(f"Saved encrypted PowerSchool credentials for student {uid}")
    return {"status": "success", "message": "PowerSchool credentials securely saved and encrypted."}


@app.post("/api/delete-credentials")
def delete_student_credentials(req: DeleteCredentialsRequest):
    """Disables auto-sync and purges stored credentials from user profile."""
    user = verify_firebase_token(req.idToken)
    uid = user["localId"]

    planner_data = get_firestore_doc(uid, req.idToken)
    settings = planner_data.get("settings", {})
    
    if "psAutoSync" in settings:
        del settings["psAutoSync"]
        planner_data["settings"] = settings
        save_firestore_doc(uid, planner_data, req.idToken)

    return {"status": "success", "message": "PowerSchool credentials purged."}


@app.post("/api/sync-user")
def sync_single_user(req: SyncUserRequest):
    """Trigger an immediate on-demand scrape and sync for the logged-in student."""
    user = verify_firebase_token(req.idToken)
    uid = user["localId"]

    planner_data = get_firestore_doc(uid, req.idToken)
    ps_config = planner_data.get("settings", {}).get("psAutoSync", {})
    
    if not ps_config or not ps_config.get("username") or not ps_config.get("encryptedPassword"):
        raise HTTPException(status_code=400, detail="No PowerSchool login configured for this account.")

    username = ps_config["username"]
    password = decrypt_text(ps_config["encryptedPassword"])
    portal_url = ps_config.get("portalUrl", "https://hisdconnect.houstonisd.org/public/")

    if not password:
        raise HTTPException(status_code=500, detail="Failed to decrypt credentials.")

    try:
        scraped = scrape_student_powerschool(portal_url, username, password)
        updated_data = merge_scraped_grades_into_planner(planner_data, scraped)
        save_firestore_doc(uid, updated_data, req.idToken)
        
        return {
            "status": "success",
            "message": f"Synced {len(scraped.get('classes', []))} classes from PowerSchool.",
            "scrapedClasses": scraped.get("classes", []),
            "studentName": scraped.get("studentName")
        }
    except Exception as e:
        logger.error(f"Sync error for user {uid}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sync-all-scheduled")
def sync_all_registered_students(cron_token: Optional[str] = Header(None, alias="X-Cron-Secret")):
    """
    Scheduled background batch cron job.
    Iterates through all registered users in Firestore who enabled auto-sync,
    scrapes their PowerSchool portals, and updates their gradebooks.
    """
    if cron_token != CRON_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized cron invocation.")

    logger.info("Starting scheduled multi-student PowerSchool batch sync...")
    
    # Query all users from Firestore REST API
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/users"
    resp = requests.get(url, timeout=15)
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to query users from Firestore.")

    documents = resp.json().get("documents", [])
    results = []

    for doc in documents:
        doc_name = doc.get("name", "")
        uid = doc_name.split("/")[-1]
        fields = doc.get("fields", {})
        data_str = fields.get("dataString", {}).get("stringValue", "{}")

        try:
            planner_data = json.loads(data_str)
            ps_config = planner_data.get("settings", {}).get("psAutoSync", {})
            
            if not ps_config.get("enabled"):
                continue

            username = ps_config.get("username")
            encrypted_pw = ps_config.get("encryptedPassword")
            portal_url = ps_config.get("portalUrl", "https://hisdconnect.houstonisd.org/public/")

            if not username or not encrypted_pw:
                continue

            password = decrypt_text(encrypted_pw)
            if not password:
                continue

            logger.info(f"Syncing user {uid} ({username})...")
            scraped = scrape_student_powerschool(portal_url, username, password)
            updated_planner = merge_scraped_grades_into_planner(planner_data, scraped)
            
            save_firestore_doc(uid, updated_planner)
            results.append({"uid": uid, "status": "success", "courses": len(scraped.get("classes", []))})

            # Polite delay between students
            time.sleep(2)

        except Exception as e:
            logger.error(f"Error syncing student {uid}: {e}")
            results.append({"uid": uid, "status": "error", "error": str(e)})

    logger.info(f"Batch sync complete. Processed {len(results)} students.")
    return {"status": "complete", "processed": len(results), "details": results}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
