# AcademiaPro — Academic Organizer & Homework Tracker

**AcademiaPro** is an academic management web application built for high school and college students. It provides a platform to track homework assignments, exam schedules, class timetables, weighted grade category calculations, cumulative GPA, and "What-If" grade simulations.

---

## 🌟 Key Features

### 1. Executive Dashboard
- **Live Metrics**: Real-time cumulative GPA, pending task counts, upcoming exam countdowns, and completion velocity.
- **Urgent Action Center**: Automatic surfacing of overdue assignments and tasks due within the next 7 days.
- **Today's Class Schedule**: Real-time period schedule with room locations and instructor names.
- **Exam Countdown**: Instant visibility into upcoming midterms and finals with days remaining.

### 2. Assignment & Task Manager
- **Multi-Type Classification**: Homework, Essays, Lab Reports, Projects, Quizzes, Readings, and Presentations.
- **Subtask Step Checklists**: Break complex projects into actionable steps with dynamic progress bars.
- **Due Date Intelligence**: Exact timestamps, countdown badges, and overdue warnings.
- **Advanced Filtering**: Filter by Class, Type, Priority, Status (*Active, Due Soon, Overdue, Completed*), and Sort order.
- **Grade Logging**: Record earned scores against category maximums.

### 3. Dedicated Exam Tracker
- **Test Management**: Track exam dates, start times, durations (minutes), room locations, and assigned seat numbers.
- **Study Topics**: Attach list of revision topics directly to exam cards.
- **Live Countdowns**: Color-coded badges (*Today, Tomorrow, In X Days, Completed*).

### 4. Interactive Academic Calendar
- **Month Grid & Day Details**: Full calendar view with color-coded assignment indicators and exam badges matching course themes.
- **Click-to-Add**: Click any day cell on the calendar to schedule a task or exam directly.
- **Event Inspection**: Click any event pill to view details or edit.

### 5. Weekly Timetable & Schedule
- **Period Matrix**: Monday through Friday hourly grid showing class blocks, room numbers, and times.
- **Custom Periods**: Add or remove scheduled periods dynamically.

### 6. Gradebook & "What-If" Grade Simulator
- **Weighted Categories**: Support for weighted grading systems (e.g., Homework 20%, Quizzes 25%, Unit Exams 35%, Final 20%).
- **Cumulative GPA Engine**: Weighted 4.0-scale GPA calculation based on course credit hours.
- **"What-If" Grade Simulator**: Interactive scenario modeling. Calculate the exact score needed on your next exam or final to achieve a target letter grade (e.g. 90% A).

### 7. Settings, Sync & Data Portability
- **iCal (.ics) Calendar Feed**: Export all assignments and exams directly to Google Calendar, Apple Calendar, and Outlook.
- **JSON Backup & Restore**: One-click full data export and import.
- **Light & Dark Theme Engine**: System-aware theme toggle with custom HSL color tokens.
- **Demo Preset Reset**: Instant reset button to populate sample coursework.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus global search bar |
| `Q` | Open Quick Add menu |
| `Esc` | Close active modal dialog |

---

## 🚀 Running the App Locally

To run the application locally, open [`index.html`](index.html) in any modern web browser or start a local HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Or using Node http-server / npx
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 📁 Architecture

- [`index.html`](index.html) — Semantic HTML5 application shell, modals, and responsive layout.
- [`css/style.css`](css/style.css) — Design system with light/dark theme variables, typography, and responsive breakpoints.
- [`js/data.js`](js/data.js) — Data models, local storage persistence, reactive observer store, GPA calculator, and iCal generator.
- [`js/app.js`](js/app.js) — View controllers, interactive calendar engine, grade simulator, modals, and search.
- [`homework_tracker_features_research.md`](homework_tracker_features_research.md) — Comprehensive research document analyzing 10+ homework platforms.
