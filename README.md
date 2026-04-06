# APSR Year 5 Computing App

This application is a browser-based computing platform designed for use at **Aldenham Prep School Riyadh**.

It delivers a structured **Year 5 computing curriculum** focused on **introducing programming concepts through Scratch**, including sequencing, events, and simple logic, supported by interactive lessons, quizzes, and progress tracking.

---

## 🚀 Core Features

* Pupil login system (localStorage-based)
* Class grouping (multiple Year 5 classes)
* Structured lesson delivery:

  * Key Question
  * Common Misconceptions
  * Success Criteria (implicit through outcomes)
  * Teaching Content
  * Step-by-step practical guide (Scratch)

---

## 🧠 Curriculum Focus

The Year 5 curriculum introduces core programming concepts:

* Sequencing (ordering instructions)
* Events (what starts a program)
* Basic movement and control
* Simple repetition (loops)
* Introduction to selection (basic conditions)
* Creating simple interactive projects

This forms the **foundation for Year 6 progression into logic and decision-making**.

---

## 🧪 Assessment System

* 10-question quizzes per lesson
* Randomised answer order
* Immediate score feedback
* No retakes (to maintain assessment integrity)

---

## 📸 Evidence of Learning

* Screenshot upload per lesson
* Pupils upload Scratch work as evidence
* Stored locally in the browser

---

## 📊 Progress Tracking

* Lesson completion tracking
* Progress percentage displayed
* Quiz completion recorded
* Data stored per pupil

---

## 👨‍🏫 Teacher Dashboard

* Password protected access
* View pupils saved on the device
* Class-based filtering
* Progress indicators:

  * Good progress
  * Partial progress
  * Not started
* Identify pupils requiring support
* Ability to:

  * Reset pupil progress
  * Delete pupil data
  * Open pupil workspace

---

## 🧱 Technical Stack

* Next.js (App Router)
* TypeScript
* localStorage (no backend)
* Vercel deployment

---

## ⚠️ Important System Constraints

* All data is stored **locally in the browser**
* No cross-device syncing
* No user authentication system
* Teacher dashboard password is **not production-secure**
* Data will be lost if:

  * Browser cache is cleared
  * Device is changed

---

## 🧠 Data Architecture

Each pupil is assigned a unique storage key:

```ts id="4q0q1y"
year5-{className}-{studentName}
```

This isolates:

* Progress
* Quiz results
* Quiz randomisation
* Screenshots

---

## 👨‍🏫 Teacher Dashboard

Access via:

```bash id="lq6yvc"
/teacher
```

Password:

```bash id="m8jz6p"
APSR2026
```

> This is a classroom-level access control only and not a secure authentication system.

---

## 🎯 Purpose

This platform is designed to:

* Introduce pupils to **core programming concepts**
* Build confidence in **Scratch development**
* Support **independent learning in the classroom**
* Provide teachers with **clear progress visibility**
* Prepare pupils for **Year 6 logical programming progression**

---

## 🚫 Development Constraints

* No backend integration
* No database
* No authentication system
* Must remain lightweight and classroom-ready

---

## 📌 Status

> **Version: Year 5 – V3.1 (Production Ready)**

* Stable
* Classroom deployable
* Inspection-aligned (COBIS / BSO context)

---

## 🔄 Future Improvements (Optional)

* Export / reporting tools
* Cross-device sync (future development)
* Enhanced feedback system
* Mastery-based indicators

---
