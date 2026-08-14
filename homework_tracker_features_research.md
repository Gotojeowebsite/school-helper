# Homework & Assignment Tracker — Feature Research & Specification

> **Purpose**: This document provides an exhaustive analysis of popular homework/assignment tracking platforms. It is structured so that an AI agent (Gemini Flash 3.7) can use it with subagents to build a comprehensive school helper web application. Each section is self-contained and can be delegated to a subagent independently.

---

## Table of Contents

1. [Platform Analysis](#platform-analysis)
   - [Google Classroom](#1-google-classroom)
   - [MyHomework App](#2-myhomework-app)
   - [iStudiez Pro](#3-istudiez-pro)
   - [Todoist (Student Use)](#4-todoist-student-use)
   - [Notion (Student Use)](#5-notion-student-use)
   - [My Study Life](#6-my-study-life)
   - [Power Planner](#7-power-planner)
   - [Schoology](#8-schoology)
   - [Canvas LMS](#9-canvas-lms)
   - [Planboard](#10-planboard)
2. [Cross-Platform Feature Matrix](#cross-platform-feature-matrix)
3. [Must-Have Features (Tier 1 — Core)](#must-have-features-tier-1--core)
4. [Expected Features (Tier 2 — Important)](#expected-features-tier-2--important)
5. [Differentiator Features (Tier 3 — Nice-to-Have)](#differentiator-features-tier-3--nice-to-have)
6. [Recommended Feature Set for Our App](#recommended-feature-set-for-our-app)
7. [Data Model Specification](#data-model-specification)
8. [UI/UX Design Patterns Summary](#uiux-design-patterns-summary)
9. [Subagent Task Breakdown](#subagent-task-breakdown)

---

## Platform Analysis

### 1. Google Classroom

**Category**: Learning Management System (LMS) — Teacher & Student  
**Pricing**: Free with Google Workspace for Education  
**Platforms**: Web, iOS, Android

#### Features

| Feature | Details |
|---|---|
| **Assignment Creation** | Teachers create assignments with title, instructions, due date, point value, topic, rubric. Supports attachments (Google Drive, links, YouTube, file uploads). Can assign to all students or specific individuals. Scheduling for later and draft saving. |
| **Assignment Types** | Assignments, Quiz Assignments (Google Forms), Questions (short answer/multiple choice), Materials (resources, no submission). |
| **Due Date Handling** | Date + optional time picker during creation. Due dates auto-sync to Google Calendar for both teachers and students. |
| **Calendar** | Deep Google Calendar integration. Each class gets its own calendar. All deadlines visible across all classes in one unified view. |
| **Notifications** | Email notifications for new assignments, comments, grades. Configurable preferences. Mobile push notifications. |
| **Class Organization** | Individual class creation with class codes or email invites. "Classwork" tab uses "Topics" for content organization. "Stream" for chronological announcements. |
| **Grade Tracking** | Built-in gradebook. Supports weighted categories, overall grade calculation, rubric-based grading, grade export. Students see individual grades. |
| **Collaboration** | Real-time Google Docs/Sheets/Slides collaboration. Individual or shared document copies. Google Meet integration. |
| **Unique Features** | Guardian email summaries for parents, originality reports (plagiarism detection), Practice Sets with auto-grading, massive ecosystem of add-ons. |

#### UI/UX Patterns
- Clean Material Design interface
- Color-coded classes (user-selectable header image/color)
- Top navigation: Stream, Classwork, People, Grades
- Card-based layout for assignments on the stream
- White background with class accent colors
- Full-featured mobile app mirrors desktop

---

### 2. MyHomework App

**Category**: Student Planner  
**Pricing**: Free (ads) / Premium ($4.99/year)  
**Platforms**: Web, iOS, Android, Mac, Windows, Chrome Extension

#### Features

| Feature | Details |
|---|---|
| **Assignment Tracking** | Add homework with class, type (homework, test, study, project, etc.), due date, description, priority, reminders. Mark as complete. |
| **Assignment Types** | Homework, Test, Quiz, Project, Lab, Paper, Exam, Study, Presentation, Other. |
| **Class Schedule** | Build schedule with class name, teacher, time, location, days. Supports block scheduling (A/B days, rotating). |
| **Calendar** | Calendar view by day, week, or month showing assignments and classes. |
| **Due Date Handling** | Date picker during assignment creation. Tests handled by choosing "Test"/"Exam" type and setting date. |
| **Notifications** | Per-assignment reminders (1 day before, 1 hour before, at time). Push notifications on mobile. |
| **Class Organization** | Add classes with name, teacher, room, schedule details. Color-coded. Assignments linked to classes. |
| **Grade Tracking** | ❌ Not available. |
| **Collaboration** | Limited — teachers can share homework lists that students subscribe to. |
| **Sync** | Cross-platform cloud sync with free account. |
| **Unique Features** | Broadest platform support (almost every OS). Block/rotating schedule support. Teacher-shared homework lists. |

#### UI/UX Patterns
- Simple, clean, student-focused design
- List-based primary view of assignments
- Tab navigation: Homework, Classes, Calendar
- Customizable themes (premium)
- Pastel color palette for classes
- Home screen widgets

---

### 3. iStudiez Pro

**Category**: Academic Planner  
**Pricing**: One-time purchase (~$9.99–$11.99)  
**Platforms**: Mac, iPhone, iPad, Android, Windows

#### Features

| Feature | Details |
|---|---|
| **Schedule** | Detailed daily/weekly schedule views. Regular and irregular schedules (block, A/B day, rotating). Holidays and vacations. |
| **Assignment Tracking** | Title, due date, description, type, priority, partner (classmate), notifications. Cloud storage integration for attachments. Status tracking: pending, in progress, completed, overdue. |
| **Grade Tracking** | ✅ Comprehensive — per-course grades, GPA calculation, individual assignment grades, weights, multiple grading systems (letter, percentage, points, custom). |
| **Instructor Details** | Store professor info: name, email, phone, office hours, office location. |
| **Calendar** | Syncs with system calendars (Apple Calendar, Google Calendar, etc.). |
| **Semester Management** | Organize by semesters/terms with start/end dates. |
| **Planner View** | "Planner" tab: today's schedule + upcoming assignments + recent grades at a glance. |
| **Unique Features** | Robust GPA tracking, "Partner" feature for group assignments, complex academic schedule support, polished native apps. |

#### UI/UX Patterns
- Information-dense, professional design
- Tab navigation: Planner, Schedule, Assignments, Grades, Courses
- Sidebar navigation on iPad/Mac for multi-pane layouts
- Customizable course colors
- Clean typography

---

### 4. Todoist (Student Use)

**Category**: General Task Manager (adapted for students)  
**Pricing**: Free / Pro ($4/month) / Business ($6/month)  
**Platforms**: Web, Windows, macOS, iOS, Android, Linux, Apple Watch, Browser Extensions

#### Features

| Feature | Details |
|---|---|
| **Task Management** | Create tasks with due dates, priorities (P1–P4, color-coded), labels, descriptions. |
| **Projects** | One project per class/course. Projects have sections (e.g., "Readings," "Problem Sets," "Exams"). |
| **Sub-tasks** | Break complex assignments into smaller sub-tasks. |
| **Recurring Dates** | Natural language input: "every Monday," "next Friday." Tasks can recur. |
| **Filters & Views** | Custom filters by criteria. Today, Upcoming, project-specific views. Board (Kanban) view. |
| **Labels/Tags** | Custom labels for flexible categorization ("reading," "essay," "exam-prep"). |
| **Natural Language** | "Quick Add" parses dates, priorities, labels, projects from a single line (e.g., "Finish Math homework p1 #Math tomorrow"). |
| **Collaboration** | Shared projects, task assignment, comments. |
| **Integrations** | Google Calendar, Outlook, Slack, IFTTT, Zapier, email, browser extensions. |
| **Gamification** | Karma score tracking task completion streaks. |
| **Grade Tracking** | ❌ Not available. |
| **Unique Features** | Natural language processing for task creation, extensive integrations, Karma gamification, highly flexible. |

#### UI/UX Patterns
- Clean, minimalist design with white space
- Left sidebar for project navigation
- Central task list area
- Color-coded priorities (red, orange, blue, grey)
- Natural language Quick Add bar
- Light and dark themes

---

### 5. Notion (Student Use)

**Category**: All-in-One Workspace (adapted for students)  
**Pricing**: Free for personal use / Plus ($8/month)  
**Platforms**: Web, Windows, macOS, iOS, Android

#### Features

| Feature | Details |
|---|---|
| **Databases** | Relational databases for assignments, courses, grades. Views: Table, Board (Kanban), Calendar, List, Gallery, Timeline. |
| **Assignment Tracking** | Database entries with properties: Name, Course (relation), Due Date, Status (Not Started/In Progress/Completed), Priority, Type, Notes (rich text page). |
| **Pages & Blocks** | Rich text editor with block system. Text, headings, to-do lists, code blocks, embeds, callouts, images, tables. |
| **Templates** | Hundreds of student planner templates from the community. |
| **Relations & Rollups** | Link databases together (assignments ↔ courses). Calculate grades, count completions with formulas. |
| **Calendar View** | Database calendar view shows items by date property. Separate Notion Calendar app integrates with Google Calendar. |
| **Reminders** | Set on date properties ("Remind 1 day before," "On the day at 9 AM"). Less robust than dedicated planners. |
| **Collaboration** | Real-time co-editing, shared workspaces, comments, mentions, granular permissions. |
| **Grade Tracking** | ✅ Possible via databases — Grade (number) property + Rollup properties for weighted averages and GPA. Requires manual setup. |
| **AI Features** | Notion AI for summarizing notes, generating outlines, brainstorming. |
| **Unique Features** | Unparalleled flexibility, relational databases, all-in-one workspace, community templates, Notion AI. |

#### UI/UX Patterns
- Clean, modern, monochromatic (black and white with accents)
- Left sidebar with collapsible page tree
- Block-based editor with slash commands (`/`)
- Customizable with covers, emoji icons, colors
- Light and dark themes

---

### 6. My Study Life

**Category**: Student Planner (purpose-built)  
**Pricing**: Free  
**Platforms**: Web, iOS, Android, Windows

#### Features

| Feature | Details |
|---|---|
| **Schedule/Timetable** | Detailed class timetable: subject, teacher, room, start/end time, day. Weekly and rotation-based schedules (A/B days). |
| **Task Tracking** | Add tasks with title, subject, type (Homework, Revision, Other), due date, description, completion status. |
| **Exam Tracking** | ✅ Dedicated exam section: subject, module, date, start time, duration, seat number, room, reminders. |
| **Dashboard** | "Today" view: current day's classes + upcoming tasks + upcoming exams at a glance. |
| **Academic Year** | Supports academic years with terms/semesters and rotation schedules within terms. |
| **Cloud Sync** | Free cloud sync across all devices. |
| **Grade Tracking** | ❌ Not available in free version. |
| **Collaboration** | ❌ Minimal — personal planner only. |
| **Unique Features** | Dedicated exam tracking with seat/room/duration fields. Rotation schedule support. Completely free. Purpose-built for students. |

#### UI/UX Patterns
- Clean, organized, purpose-built for students
- Tab navigation: Dashboard, Schedule, Tasks, Exams
- Timetable grid view for schedule
- Blue color scheme with customizable subject colors
- Card-based display for tasks and exams

---

### 7. Power Planner

**Category**: Student Planner  
**Pricing**: Free / Premium (~$1.99)  
**Platforms**: iOS, Android, Windows

#### Features

| Feature | Details |
|---|---|
| **Schedule** | Class schedules with time, room, day. Semester-based. |
| **Assignment Tracking** | Add with name, class, date, details, type (Homework, Quiz, Test, Project). **Completion percentage slider** (0–100%) for partial progress. |
| **Grade Tracking** | ✅ Comprehensive — weighted categories, GPA calculation. **"What If" grade calculator** — see what grade you need on an upcoming assignment to achieve a target final grade. |
| **Calendar** | Calendar view shows classes, assignments, exams. |
| **Semester Management** | Organize by semesters and years. |
| **Notifications** | Reminders for assignments and exams. Push notifications. |
| **Image Attachments** | Attach images to assignments. |
| **Cloud Sync** | Sync across devices with account. |
| **Unique Features** | "What If" grade calculator, completion percentage tracking, strong GPA/grade tracking. |

#### UI/UX Patterns
- Modern, clean design (UWP on Windows)
- Sidebar/menu navigation: Semesters, Classes, Calendar, Agenda
- Color-coded classes
- Card-based item display
- Blue/white primary colors

---

### 8. Schoology (PowerSchool)

**Category**: Learning Management System (LMS)  
**Pricing**: Free basic / Enterprise for institutions  
**Platforms**: Web, iOS, Android

#### Features

| Feature | Details |
|---|---|
| **Assignment Types** | Assignments, Tests/Quizzes (built-in builder), Discussions, Media Albums, Files/Links, External Tools (LTI), SCORM Packages. |
| **Grading** | Full gradebook: weighted categories, grade scales, custom scales, assignment exceptions (missing/incomplete/excused), drop lowest, rounding rules, final grade overrides, CSV export. Standards-based/mastery grading. |
| **Content Organization** | Course content organized into "Folders" (modules/units). Materials nested and ordered within folders. |
| **Calendar** | Unified calendar: assignment due dates, events, personal items. iCal feed for external sync. Month/week/day views. |
| **Communication** | Course feed/updates, direct messaging, group discussions. |
| **Groups** | Course-level and school-level groups with their own discussions, assignments, members. |
| **Analytics** | Student engagement, assignment completion rates, grade distributions. |
| **Notifications** | Configurable by type: course updates, grades, due dates, comments, messages, overdue items. Email + push. |
| **Parent Accounts** | Parent/guardian accounts for monitoring progress. |
| **Unique Features** | Strong LTI integration, built-in quiz builder, standards-based grading, teacher analytics, Resources area for content management. |

#### UI/UX Patterns
- Left-side navigation for courses, groups, resources
- Top nav: Courses, Groups, Resources, Messages
- Feed/list format within courses
- White + blue/green color scheme
- Card-based course dashboard
- "Upcoming" sidebar widget

---

### 9. Canvas LMS

**Category**: Learning Management System (LMS)  
**Pricing**: Free for teachers (Canvas Free) / Enterprise  
**Platforms**: Web, iOS (Canvas Student / Canvas Teacher), Android

#### Features

| Feature | Details |
|---|---|
| **Course Structure** | Customizable navigation per course. Modules with prerequisites and completion requirements. Rich content pages. |
| **Assignments** | Online submissions (text, file, URL, media), external tools (LTI), group assignments, peer reviews. Rubrics. Turnitin integration. Differentiated due dates per section/student. |
| **Quizzes** | "New Quizzes" engine: multiple choice, true/false, fill-in-blank, matching, essay, numerical, formula, file upload. Item banks. Moderation (extra attempts, time extensions). |
| **Gradebook** | SpeedGrader for inline annotation. Assignment groups (weighted). Grade posting policies (auto/manual). Late policies (deduct per day/hour). Missing submission policies. What-If grades (student-facing). Learning Mastery gradebook. Grade history + audit trail. |
| **Calendar** | Unified calendar across all courses: assignments, events, to-dos. Create personal to-do items. Scheduler for appointment sign-ups (office hours). iCal feed. Month/week/agenda views. |
| **Notifications** | Most granular system available — per activity type AND per channel (email, push, SMS). Options: immediate, daily summary, weekly summary, off. |
| **Collaboration** | Google Docs / Office 365 integration for real-time collaborative editing. Group assignments. Peer reviews. Discussions. |
| **Conferences** | Built-in video (BigBlueButton) or Zoom/Teams integration. |
| **Analytics** | Page views, participation, submissions, grades. "New Analytics" for deeper insights. |
| **API** | Extensive REST API for custom integrations. |
| **Unique Features** | SpeedGrader, granular notifications, extensive LTI/API, Modules with prerequisites, What-If grades, Commons for OER sharing, peer reviews, Blueprint courses. |

#### UI/UX Patterns
- Dashboard: Card View (course cards), Recent Activity, or List View
- Left global nav: Dashboard, Courses, Calendar, Inbox, History, Help
- Left course nav (customizable per course)
- Clean, modern, white/gray/blue scheme
- Responsive design
- Separate mobile apps for students and teachers

---

### 10. Planboard

**Category**: Lesson Planning Tool (Teacher-facing)  
**Pricing**: Free  
**Platforms**: Web (responsive)

#### Features

| Feature | Details |
|---|---|
| **Lesson Planning** | Calendar-based lesson plan creation: title, subject, date/period, description, standards alignment, resources/attachments. |
| **Standards** | Align to curriculum standards (Common Core, state standards). Browse and attach. |
| **Calendar** | Weekly/daily calendar as primary interface. Plans organized by period and day. |
| **Timetable Setup** | Define school schedule with periods, days, rotation patterns. |
| **Templates** | Save and reuse lesson plan templates. |
| **Sharing** | Share with admins, colleagues, substitutes. Print plans. |
| **Year Overview** | High-level view of entire year's plans. |
| **Note** | Teacher-facing only — not a student tracker, but informs how assignment data is structured from the teaching side. |

---

## Cross-Platform Feature Matrix

| Feature | Google Classroom | MyHomework | iStudiez Pro | Todoist | Notion | My Study Life | Power Planner | Schoology | Canvas |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Assignment Creation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assignment Types | ✅ | ✅ | ✅ | ⚠️ Labels | ⚠️ Properties | ✅ | ✅ | ✅ | ✅ |
| Due Dates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calendar View | ✅ (Google Cal) | ✅ | ✅ | ⚠️ Upcoming | ✅ | ⚠️ Dashboard | ✅ | ✅ | ✅ |
| Class Schedule | ❌ | ✅ | ✅ | ❌ | ⚠️ Manual | ✅ | ✅ | ❌ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ⚠️ Basic | ✅ | ✅ | ✅ | ✅ |
| Grade Tracking | ✅ | ❌ | ✅ | ❌ | ⚠️ Manual | ❌ | ✅ | ✅ | ✅ |
| GPA Calculation | ❌ | ❌ | ✅ | ❌ | ⚠️ Manual | ❌ | ✅ | ❌ | ❌ |
| Exam Tracking | ⚠️ As Assignment | ✅ Type | ⚠️ As Assignment | ❌ | ⚠️ Manual | ✅ Dedicated | ✅ Type | ✅ | ✅ |
| Semester Mgmt | ❌ | ❌ | ✅ | ❌ | ⚠️ Manual | ✅ | ✅ | ✅ | ✅ |
| Sub-tasks | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Collaboration | ✅ | ⚠️ | ⚠️ Partner | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| File Attachments | ✅ | ⚠️ Premium | ✅ | ✅ | ✅ | ❌ | ⚠️ Images | ✅ | ✅ |
| Block Schedules | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cross-Platform Sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| External Cal Sync | ✅ Google | ⚠️ Premium | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ iCal | ✅ iCal |
| What-If Grades | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Natural Language | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Must-Have Features (Tier 1 — Core)

> These features are present in virtually every homework tracking app and are non-negotiable for a competitive product.

### 1. Assignment/Task Creation & Management
- **Add assignments** with: title, description, due date + time, priority level, type/category
- **Assignment types**: Homework, Test/Exam, Quiz, Project, Essay, Lab, Presentation, Reading, Other
- **Status tracking**: Not Started → In Progress → Completed (or simple checkbox)
- **Edit and delete** assignments
- **Overdue highlighting** — visually flag items past their due date

### 2. Class/Course Organization
- **Create and manage classes** with: name, teacher/instructor name, room/location, color
- **Color-coding** per class — every platform does this, it's essential for quick visual scanning
- **Link assignments to classes** — every assignment belongs to a specific class

### 3. Calendar View
- **Visual calendar** showing all assignments, exams, and events by date
- **Multiple views**: day, week, month
- **Click-to-add** — create assignments directly from the calendar
- **Color-coded entries** matching their class color

### 4. Schedule / Timetable
- **Weekly class schedule** display showing class blocks by day and time
- **Support for schedule types**: fixed weekly, A/B day (block), rotating schedules
- **Class details on schedule**: name, room, teacher, time

### 5. Dashboard / Today View
- **Single-glance overview** of: today's classes, upcoming assignments (next 7 days), overdue items, upcoming exams
- **Priority surfacing** — show the most urgent items first
- **Quick actions** — mark complete, add new assignment directly from dashboard

### 6. Due Date Management
- **"Upcoming" list** sorted by due date across all classes
- **Overdue items** highlighted with warning color (red)
- **Due today / Due this week** filters
- **Time remaining** indicator (e.g., "Due in 2 days")

### 7. Notifications & Reminders
- **Customizable reminders**: 1 day before, 1 hour before, at due time, custom
- **Push notifications** on mobile
- **Visual indicators** in-app for upcoming and overdue items
- **Browser notifications** for web apps

### 8. Cross-Platform Data Persistence
- **Local storage** at minimum (localStorage/IndexedDB for web apps)
- **Cloud sync** if backend available
- **Data persists** across sessions

---

## Expected Features (Tier 2 — Important)

> Most successful apps include these. Users expect them.

### 9. Grade Tracking
- **Record grades** per assignment (points, percentage, or letter)
- **Weighted categories** per class (e.g., Homework 20%, Exams 40%, Projects 25%, Participation 15%)
- **Calculate overall course grade** based on weighted categories
- **GPA calculation** across all classes (on a 4.0 scale)

### 10. Exam / Test Tracking
- **Dedicated exam entries** with: subject, date, start time, duration, location/room, seat number
- **Visual distinction** from regular homework (different icon, color, or section)
- **Countdown** to exam date

### 11. Semester / Term Management
- **Organize by semesters** with start/end dates
- **Archive past semesters** — don't delete, just hide
- **Semester selector** in the UI

### 12. Sub-tasks / Checklists
- **Break assignments into steps** (sub-tasks or checklist items)
- **Progress bar** based on sub-task completion
- **Completion percentage** (Power Planner style: 0–100% slider)

### 13. Search & Filter
- **Search** assignments by keyword
- **Filter by**: class, type, status (active/completed/overdue), priority, date range
- **Sort by**: due date, priority, class, date added

### 14. File Attachments & Notes
- **Attach files** to assignments (images, PDFs, documents)
- **Rich text notes** per assignment
- **Links** to external resources

---

## Differentiator Features (Tier 3 — Nice-to-Have)

> These set an app apart from competitors. Implement as many as feasible.

### 15. "What-If" Grade Calculator
- Input a hypothetical grade on an upcoming assignment
- See how it affects the overall course grade and GPA
- *Found in: Power Planner, Canvas LMS*

### 16. External Calendar Sync
- Export to Google Calendar, Apple Calendar, Outlook via iCal feed
- Two-way sync if possible
- *Found in: Google Classroom, Canvas, Schoology, iStudiez Pro*

### 17. Natural Language Input
- Type "Math homework due Friday" and auto-parse: class = Math, type = Homework, due = Friday
- *Found in: Todoist*

### 18. Collaboration / Sharing
- Share assignment lists with classmates
- Group project tracking (assign partners, track group progress)
- Teacher → Student assignment pushing
- *Found in: Google Classroom, Todoist, Notion, Schoology, Canvas*

### 19. Gamification
- Completion streaks
- Points/XP for on-time submissions
- Achievement badges
- Productivity score
- *Found in: Todoist (Karma), Classcipe*

### 20. Analytics / Insights
- Completion rate trends over time
- Workload distribution across classes (bar chart)
- On-time vs. late submission rates
- Study time logging
- *Found in: Schoology, Canvas*

### 21. Parent / Guardian View
- Separate view for parents to see assignments and progress
- Email digest summaries
- *Found in: Google Classroom, Schoology, Canvas*

### 22. Recurring Assignments
- Set up repeating tasks (e.g., "Weekly reading log every Sunday")
- Auto-create new instances
- *Found in: Todoist*

### 23. Themes & Customization
- Light / Dark mode toggle
- Custom color themes
- Customizable dashboard layout
- *Found in: MyHomework (premium), Todoist, Notion*

### 24. Offline Mode
- Full functionality without internet
- Queue changes and sync when connection restored

### 25. Home Screen Widgets
- Quick-glance widget for upcoming assignments
- Today's schedule widget
- *Found in: MyHomework, Power Planner*

---

## Recommended Feature Set for Our App

> Based on the research, here is the recommended feature set prioritized for a web-based school helper application.

### Phase 1 — MVP (Must Ship)
1. ✅ Assignment CRUD (create, read, update, delete) with all fields
2. ✅ Assignment types (Homework, Test, Quiz, Project, Essay, Lab, Presentation, Reading, Other)
3. ✅ Class/course management with color coding
4. ✅ Calendar view (month, week, day)
5. ✅ Dashboard/Today view with upcoming items and overdue alerts
6. ✅ Due date management with overdue highlighting
7. ✅ Weekly schedule/timetable view
8. ✅ Local storage persistence (localStorage or IndexedDB)
9. ✅ Notifications (browser notifications + in-app visual alerts)
10. ✅ Responsive design (mobile + desktop)

### Phase 2 — Feature Complete
11. ✅ Grade tracking with weighted categories
12. ✅ GPA calculation
13. ✅ Dedicated exam tracking with duration, room, seat
14. ✅ Semester/term management
15. ✅ Sub-tasks/checklists per assignment
16. ✅ Search and filter functionality
17. ✅ File attachment support (at minimum, image attachments)
18. ✅ Light/Dark theme toggle

### Phase 3 — Differentiators
19. ✅ "What-If" grade calculator
20. ✅ Analytics dashboard (completion rates, workload distribution)
21. ✅ Recurring assignments
22. ✅ Natural language input for quick add
23. ✅ Export to iCal
24. ✅ Gamification (streaks, XP)

---

## Data Model Specification

> These data models define the core entities for the application. Each entity includes all fields identified across the researched platforms.

### Class / Course
```
Class {
  id: string (UUID)
  name: string                        // e.g., "Biology 101"
  teacher: string                     // e.g., "Mrs. Johnson"
  room: string                        // e.g., "Room 204"
  color: string                       // hex color, e.g., "#4A90D9"
  schedule: ScheduleEntry[]           // array of schedule slots
  semesterId: string                  // foreign key to Semester
  gradeCategories: GradeCategory[]    // weighted grade categories
  credits: number                     // credit hours (for GPA)
  notes: string                       // optional notes
  createdAt: datetime
  updatedAt: datetime
}
```

### Schedule Entry
```
ScheduleEntry {
  id: string (UUID)
  classId: string                     // foreign key to Class
  dayOfWeek: number                   // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string                   // "08:30" (24h format)
  endTime: string                     // "09:45"
  room: string                        // can override class room
  scheduleType: string                // "weekly" | "a-day" | "b-day" | "rotation"
  rotationDay: number                 // for rotation schedules
}
```

### Assignment
```
Assignment {
  id: string (UUID)
  title: string                       // e.g., "Chapter 5 Review Questions"
  description: string                 // rich text or plain text
  classId: string                     // foreign key to Class
  type: enum                          // "homework" | "test" | "quiz" | "project" |
                                      // "essay" | "lab" | "presentation" | "reading" | "other"
  dueDate: datetime                   // date and time
  priority: enum                      // "high" | "medium" | "low"
  status: enum                        // "not-started" | "in-progress" | "completed"
  completionPercentage: number        // 0–100 (Power Planner style)
  grade: number | null                // grade received (points or percentage)
  gradeCategory: string               // which weighted category (e.g., "Homework", "Exams")
  subtasks: Subtask[]                 // checklist items
  attachments: Attachment[]           // file attachments
  reminders: Reminder[]               // notification reminders
  isRecurring: boolean
  recurringPattern: string | null     // e.g., "weekly", "biweekly"
  notes: string
  createdAt: datetime
  updatedAt: datetime
}
```

### Exam (extends Assignment concept but with dedicated fields)
```
Exam {
  id: string (UUID)
  title: string                       // e.g., "Midterm Exam"
  classId: string                     // foreign key to Class
  date: date                          // exam date
  startTime: string                   // "14:00"
  duration: number                    // minutes (e.g., 90)
  room: string                        // exam room/location
  seatNumber: string                  // seat assignment (My Study Life feature)
  description: string                 // study topics, format, etc.
  grade: number | null
  reminders: Reminder[]
  status: enum                        // "upcoming" | "completed"
  createdAt: datetime
  updatedAt: datetime
}
```

### Subtask
```
Subtask {
  id: string (UUID)
  assignmentId: string                // foreign key to Assignment
  title: string
  isCompleted: boolean
  order: number                       // display order
}
```

### Grade Category
```
GradeCategory {
  id: string (UUID)
  classId: string                     // foreign key to Class
  name: string                        // e.g., "Homework", "Exams", "Projects"
  weight: number                      // percentage weight (e.g., 30 for 30%)
}
```

### Semester / Term
```
Semester {
  id: string (UUID)
  name: string                        // e.g., "Fall 2026"
  startDate: date
  endDate: date
  isActive: boolean                   // currently active semester
  createdAt: datetime
}
```

### Reminder
```
Reminder {
  id: string (UUID)
  targetId: string                    // assignment or exam ID
  targetType: enum                    // "assignment" | "exam"
  triggerBefore: number               // minutes before due date
  isTriggered: boolean                // has already fired
}
```

### Attachment
```
Attachment {
  id: string (UUID)
  assignmentId: string
  fileName: string
  fileType: string                    // MIME type
  fileData: string                    // base64 or blob URL
  createdAt: datetime
}
```

---

## UI/UX Design Patterns Summary

> Common patterns observed across all researched platforms.

### Navigation Patterns
| Pattern | Used By | Recommendation |
|---|---|---|
| **Tab bar** (bottom mobile, top desktop) | My Study Life, MyHomework | ✅ Use for mobile |
| **Left sidebar** | Todoist, Notion, Canvas, Schoology | ✅ Use for desktop |
| **Top nav bar** | Google Classroom | Alternative |
| **Dashboard-first** | My Study Life, iStudiez Pro, Canvas | ✅ Use as default landing |

### Color & Visual Patterns
- **Class color-coding** — universally used, essential
- **Priority colors** — Red (high), Orange (medium), Blue/Green (low)
- **Status indicators** — Green (completed), Red (overdue), Yellow/Orange (due soon), Gray (not started)
- **White/light backgrounds** with colored accents — most common
- **Card-based layouts** for items — universal

### Layout Patterns
- **Dashboard**: split into sections — Today's Schedule (left/top), Upcoming Assignments (center), Quick Stats (right/sidebar)
- **Calendar**: full-width, color-coded dots/bars on dates
- **Assignment List**: sortable table or card list with class color indicator, type icon, due date, status
- **Class Detail**: header with class color, tabs for assignments/grades/schedule

### Interaction Patterns
- **Click/tap to mark complete** (checkbox or swipe)
- **Quick add** button always accessible (floating action button on mobile, top bar on desktop)
- **Drag-and-drop** for rescheduling on calendar
- **Inline editing** where possible
- **Confirmation for destructive actions** (delete)
- **Smooth transitions** between views

### Typography & Spacing
- **Clean sans-serif fonts** (Inter, Roboto, SF Pro, system fonts)
- **Clear hierarchy**: page title (24–32px) → section header (18–20px) → item title (14–16px) → metadata (12–13px)
- **Generous whitespace** between sections
- **Compact but readable** item rows (48–64px height)

---

## Subagent Task Breakdown

> This section defines how to split the build into independent tasks for subagents.

### Subagent 1: Design System & CSS Foundation
**Task**: Create the core CSS design system
- Define CSS custom properties (colors, typography, spacing, shadows, border-radius)
- Create color palette with light/dark theme support
- Define class color presets (10–12 colors)
- Build utility classes (layout, spacing, typography)
- Implement responsive breakpoints (mobile: <768px, tablet: 768–1024px, desktop: >1024px)
- Create component base styles: buttons, inputs, cards, modals, dropdowns, badges, tooltips

### Subagent 2: Data Layer & State Management
**Task**: Build the data model, storage, and state management
- Implement all data models (Class, Assignment, Exam, Semester, etc.) as JavaScript classes or objects
- Build localStorage/IndexedDB persistence layer with CRUD operations
- Create a simple state management system (pub/sub or event-based)
- Implement search and filter logic
- Build grade calculation engine (weighted averages, GPA)
- Build "What-If" grade calculator logic
- Implement data import/export (JSON, iCal)

### Subagent 3: Dashboard & Navigation
**Task**: Build the main layout, navigation, and dashboard
- Create responsive layout shell (sidebar for desktop, bottom tabs for mobile)
- Build navigation system with active state tracking
- Build Dashboard view: today's schedule, upcoming assignments, overdue alerts, quick stats
- Implement view routing (Dashboard, Calendar, Assignments, Classes, Grades, Schedule, Settings)

### Subagent 4: Assignment & Exam Management
**Task**: Build all assignment and exam CRUD interfaces
- Assignment list view with filtering, sorting, and search
- Assignment creation/edit form (all fields from data model)
- Assignment detail view with subtasks, attachments, notes
- Exam creation/edit form with dedicated fields (duration, room, seat)
- Exam list view
- Mark complete / update status interactions
- Completion percentage slider
- Sub-task checklist management
- Overdue and priority visual indicators

### Subagent 5: Calendar View
**Task**: Build the full calendar component
- Month view with day cells showing assignment/exam indicators (color-coded dots)
- Week view with time blocks for classes and assignment due times
- Day view with detailed hourly timeline
- Click-on-date to create new assignment
- Click-on-event to view/edit assignment
- Navigation between months/weeks
- Today highlight
- Mini calendar for quick date navigation

### Subagent 6: Class & Schedule Management
**Task**: Build class management and timetable views
- Class list view with color indicators
- Class creation/edit form (name, teacher, room, color, schedule, grade categories)
- Class detail page (assignments for this class, grades, schedule)
- Weekly timetable/schedule view (grid of time slots × days)
- Support for A/B day and rotation schedules
- Instructor details view

### Subagent 7: Grade Tracking & Analytics
**Task**: Build grade tracking, GPA calculation, and analytics
- Grade entry per assignment (inline or modal)
- Per-class grade summary with weighted category breakdown
- Overall GPA display
- "What-If" grade calculator interface
- Grade trends chart (over time)
- Analytics dashboard: completion rates, workload distribution by class, on-time stats
- Visual charts (bar charts, progress rings, line graphs — using Canvas API or SVG)

### Subagent 8: Settings, Themes & Notifications
**Task**: Build settings panel, theming, and notification system
- Settings page: semester management, notification preferences, theme selection, data management
- Light/Dark theme toggle with smooth transition
- Semester CRUD (create, edit, archive, select active)
- Browser notification permission handling
- Reminder scheduling logic (check reminders against current time)
- In-app notification center (bell icon with notification list)
- Data export (JSON backup) and import
- About/Help section

---

> [!IMPORTANT]
> **For Gemini Flash 3.7**: Each subagent task above is designed to be self-contained. Subagent 1 (Design System) and Subagent 2 (Data Layer) should be built FIRST, as all other subagents depend on them. Subagents 3–8 can then be built in parallel, referencing the design system and data layer. Final integration should merge all components into a single `index.html` file or a modular file structure.
