#!/usr/bin/env python3
"""
AcademiaPro - Automated PowerSchool Cloud Sync Worker
------------------------------------------------------
Headless background scraper that logs into PowerSchool (HISD Connect or standard),
extracts live courses, periods, teachers, and grades, and pushes them to Firebase Firestore.
"""

import os
import re
import sys
import json
import time
import requests

DEFAULT_FIREBASE_CONFIG = {
    "apiKey": "AIzaSyCs9TwwOTWRoypz5xVQJrT1CtNMBiUt12Y",
    "projectId": "school-helper-5a829"
}

def clean_course_name(name):
    if not name:
        return ""
    name = re.sub(r"^[\d\s()A-Za-z]+[-:]\s*", "", name)
    name = re.sub(r"Email.*$", "", name, flags=re.IGNORECASE)
    name = re.sub(r"-\s*Rm:.*$", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s*\.\s*$", "", name)
    return name.strip()

def parse_powerschool_text(raw_text):
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


def scrape_powerschool_headless(portal_url, username, password):
    from playwright.sync_api import sync_playwright

    print(f"🌐 Launching headless browser to connect to: {portal_url}")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = context.new_page()

        print("🔑 Loading PowerSchool login portal...")
        page.goto(portal_url, wait_until="networkidle", timeout=30000)

        student_tab = page.query_selector("#btn-student-login, a[href*='student'], li.student-tab")
        if student_tab and student_tab.is_visible():
            student_tab.click()
            time.sleep(1)

        print("👤 Entering login credentials...")
        account_input = page.query_selector("#fieldAccount, input[name='account'], input#username, input[type='text']")
        password_input = page.query_selector("#fieldPassword, input[name='pw'], input#password, input[type='password']")

        if not account_input or not password_input:
            raise Exception("Could not find username or password inputs on PowerSchool login page.")

        account_input.fill(username)
        password_input.fill(password)

        submit_btn = page.query_selector("#btn-enter, button[type='submit'], input[type='submit'], #signin-btn")
        if submit_btn:
            submit_btn.click()
        else:
            password_input.press("Enter")

        print("⏳ Waiting for Grades and Attendance dashboard...")
        page.wait_for_load_state("networkidle", timeout=25000)
        time.sleep(2)

        current_url = page.url
        print(f"📍 Current URL: {current_url}")

        if "login" in current_url.lower() or "error" in current_url.lower():
            error_el = page.query_selector(".feedback-alert, .error, #login-error")
            err_msg = error_el.inner_text() if error_el else "Invalid credentials or login failed."
            raise Exception(f"PowerSchool Login Failed: {err_msg}")

        if "guardian" not in current_url.lower() and "home.html" not in current_url.lower():
            page.goto(f"{portal_url.rstrip('/')}/guardian/home.html", wait_until="networkidle", timeout=15000)

        page_text = page.evaluate("() => document.body.innerText")
        browser.close()

        return parse_powerschool_text(page_text)


def sync_to_firebase_cloud(scraped_data, fb_email, fb_password, api_key=None, project_id=None):
    api_key = api_key or os.environ.get("FIREBASE_API_KEY") or DEFAULT_FIREBASE_CONFIG["apiKey"]
    project_id = project_id or os.environ.get("FIREBASE_PROJECT_ID") or DEFAULT_FIREBASE_CONFIG["projectId"]

    print(f"🔥 Authenticating with Firebase Cloud for {fb_email}...")
    auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    auth_resp = requests.post(auth_url, json={"email": fb_email, "password": fb_password, "returnSecureToken": True})
    
    if auth_resp.status_code != 200:
        raise Exception(f"Firebase Auth Error ({auth_resp.status_code}): {auth_resp.text}")

    auth_data = auth_resp.json()
    id_token = auth_data["idToken"]
    uid = auth_data["localId"]

    doc_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/users/{uid}"
    headers = {"Authorization": f"Bearer {id_token}"}
    
    doc_resp = requests.get(doc_url, headers=headers)
    planner_data = {}
    
    if doc_resp.status_code == 200:
        fields = doc_resp.json().get("fields", {})
        if "dataString" in fields:
            try:
                planner_data = json.loads(fields["dataString"].get("stringValue", "{}"))
            except Exception:
                planner_data = {}
    
    classes = planner_data.get("classes", [])
    assignments = planner_data.get("assignments", [])
    settings = planner_data.get("settings", {})
    active_sem_id = settings.get("activeSemesterId", "sem-current")

    if scraped_data.get("studentName") and not settings.get("studentName"):
        settings["studentName"] = scraped_data["studentName"]

    updated_count = 0
    created_count = 0

    for idx, pc in enumerate(scraped_data.get("classes", [])):
        ps_name = pc["className"]
        grade = pc.get("gradePercent")

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
            created_count += 1
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

            cat_id = (matched_class.get("gradeCategories", [{}])[0].get("id"))

            if snapshot:
                snapshot["scoreEarned"] = grade
                snapshot["maxScore"] = 100
                snapshot["status"] = "completed"
                snapshot["notes"] = f"Auto-synced from PowerSchool on {time.strftime('%Y-%m-%d %H:%M')}"
                updated_count += 1
            else:
                assignments.append({
                    "id": f"asg-ps-{int(time.time() * 1000) + idx}",
                    "semesterId": active_sem_id,
                    "classId": matched_class["id"],
                    "title": "PowerSchool Current Grade Snapshot",
                    "description": "Auto-synced from PowerSchool background cloud worker",
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
                updated_count += 1

    planner_data["classes"] = classes
    planner_data["assignments"] = assignments
    planner_data["settings"] = settings
    planner_data["lastCloudSync"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    payload = {
        "fields": {
            "dataString": {"stringValue": json.dumps(planner_data)},
            "updatedAt": {"stringValue": time.strftime("%Y-%m-%dT%H:%M:%SZ")}
        }
    }

    save_resp = requests.patch(f"{doc_url}?updateMask.fieldPaths=dataString&updateMask.fieldPaths=updatedAt", 
                               headers=headers, json=payload)

    if save_resp.status_code != 200:
        raise Exception(f"Firestore Save Error ({save_resp.status_code}): {save_resp.text}")

    print(f"✨ Successfully synced with Firebase Cloud! ({created_count} new courses, {updated_count} grades updated)")


def main():
    print("=" * 60)
    print("🚀 AcademiaPro PowerSchool Automated Background Sync")
    print("=" * 60)

    username = os.environ.get("PS_USERNAME")
    password = os.environ.get("PS_PASSWORD")
    portal_url = os.environ.get("PS_PORTAL_URL", "https://hisdconnect.houstonisd.org/public/")
    
    fb_email = os.environ.get("FIREBASE_EMAIL")
    fb_password = os.environ.get("FIREBASE_PASSWORD")

    if not username or not password:
        print("❌ Error: Missing PS_USERNAME or PS_PASSWORD environment variables.")
        print("Please configure your GitHub Secrets or environment variables.")
        sys.exit(1)

    try:
        scraped_data = scrape_powerschool_headless(portal_url, username, password)
        print(f"\n✅ Scraped {len(scraped_data.get('classes', []))} classes from PowerSchool:")
        for c in scraped_data.get("classes", []):
            grade_str = f"{c['gradePercent']}%" if c['gradePercent'] is not None else "No grade"
            print(f"  • [{c.get('period', 'N/A')}] {c['className']} | {c.get('teacher', 'No Teacher')} | Rm: {c.get('room', 'N/A')} -> {grade_str}")

        with open("powerschool_latest.json", "w") as f:
            json.dump(scraped_data, f, indent=2)
        print("\n💾 Saved latest snapshot to powerschool_latest.json")

        if fb_email and fb_password:
            sync_to_firebase_cloud(scraped_data, fb_email, fb_password)
        else:
            print("\nℹ️ Set FIREBASE_EMAIL and FIREBASE_PASSWORD to sync directly into your live AcademiaPro cloud gradebook.")

        print("\n🎉 PowerSchool Sync finished successfully!")

    except Exception as e:
        print(f"\n❌ PowerSchool Sync Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
