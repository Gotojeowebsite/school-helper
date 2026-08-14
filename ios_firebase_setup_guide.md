# iOS & Firebase Setup Guide for AcademiaPro

This guide shows you how to connect your **future iOS app (SwiftUI)** to the exact same Firebase account and Firestore database used by the **AcademiaPro Web App**, giving you cross-platform real-time sync.

---

## 1. Firebase Project Structure

The web app stores all user data in Cloud Firestore under this structure:

```
users (collection)
  └── {userId} (document)
        └── planner (document / field)
              ├── settings: { studentName, theme, activeSemesterId, ... }
              ├── semesters: [ { id, name, startDate, endDate, isActive }, ... ]
              ├── classes: [ { id, name, code, teacher, room, color, credits, gradeCategories }, ... ]
              ├── assignments: [ { id, title, classId, type, dueDate, priority, status, subtasks }, ... ]
              ├── exams: [ { id, title, classId, date, startTime, duration, room, seatNumber }, ... ]
              └── schedule: [ { id, classId, dayOfWeek, startTime, endTime, room }, ... ]
```

---

## 2. Setting Up Firebase in Xcode (Swift / SwiftUI)

### Step 1: Add Firebase to your Xcode Project
1. Open your Xcode project.
2. Go to **File → Add Packages...**
3. Enter the Firebase iOS SDK URL:
   ```
   https://github.com/firebase/firebase-ios-sdk
   ```
4. Select the following packages:
   - `FirebaseAuth`
   - `FirebaseFirestore`
   - `FirebaseFirestoreSwift`

### Step 2: Download `GoogleService-Info.plist`
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Click **Project Settings → General → Your apps → Add app → iOS**.
3. Enter your iOS Bundle ID (e.g. `com.yourname.academiapro`).
4. Download `GoogleService-Info.plist` and drag it into your Xcode project root.

---

## 3. SwiftUI Code Example (Cross-Platform Sync)

### A. Initialize Firebase in App Entrypoint
```swift
import SwiftUI
import FirebaseCore

@main
struct AcademiaProApp: App {
    init() {
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### B. Swift Data Models (Matching the Web App)
```swift
import Foundation
import FirebaseFirestoreSwift

struct Assignment: Identifiable, Codable {
    var id: String
    var title: String
    var classId: String
    var type: String
    var dueDate: String
    var priority: String
    var status: String
    var completionPercentage: Int
    var scoreEarned: Double?
    var maxScore: Double?
    var subtasks: [Subtask]?
}

struct Subtask: Identifiable, Codable {
    var id: String
    var title: String
    var isCompleted: Bool
}

struct CourseClass: Identifiable, Codable {
    var id: String
    var name: String
    var code: String?
    var teacher: String?
    var room: String?
    var color: String
    var credits: Int
}
```

### C. Cloud Sync Service (Read & Write Same User Data)
```swift
import Foundation
import FirebaseAuth
import FirebaseFirestore

class AcademicCloudSync: ObservableObject {
    @Published var assignments: [Assignment] = []
    @Published var classes: [CourseClass] = []
    @Published var isAuthenticated: Bool = false
    
    private let db = Firestore.firestore()
    
    init() {
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.isAuthenticated = (user != nil)
            if let uid = user?.uid {
                self?.listenToCloudPlanner(userId: uid)
            }
        }
    }
    
    // Real-time listener: changes on Web instantly appear on iOS!
    func listenToCloudPlanner(userId: String) {
        db.collection("users").document(userId).addSnapshotListener { documentSnapshot, error in
            guard let document = documentSnapshot, document.exists,
                  let data = document.data() else {
                print("No cloud data found: \(error?.localizedDescription ?? "")")
                return
            }
            
            // Parse assignments and classes
            if let asgData = data["assignments"] as? [[String: Any]] {
                // Decode assignments
                print("Fetched \(asgData.count) assignments from cloud sync!")
            }
        }
    }
    
    // Save new assignment to Cloud (instantly updates Web!)
    func saveAssignment(userId: String, assignment: Assignment) {
        let userDoc = db.collection("users").document(userId)
        // Update Firestore document
    }
}
```

---

## 4. Security Rules (Row Level Security)

Add these rules in your **Firebase Console → Firestore Database → Rules** tab so each student can only view and modify their own homework:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
