# APSR Year 5 Computing App

This application is a browser-based computing platform designed for use at **Aldenham Prep School Riyadh**.

It delivers a structured **Year 5 computing curriculum** focused on **introducing programming concepts through Scratch**, including sequencing, events, and simple logic, supported by interactive lessons, quizzes, and progress tracking.

---

## 🚀 Core Features

* Pupil login system (localStorage-based)
* Pupil account access codes
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
* Import pupil result exports from other classroom devices
* View pupil access codes when pupils forget them
* Class-based filtering
* Progress indicators:

  * Good progress
  * Partial progress
  * Not started
* Identify pupils requiring support
* Ability to:

  * Review imported quiz scores and screenshot evidence
  * Reset pupil progress
  * Delete pupil data
  * Open pupil workspace

---

## 🧱 Technical Stack

* Next.js (App Router)
* TypeScript
* localStorage (no backend)
* Supabase cloud sync for cross-device teacher results
* Vercel deployment

---

## ⚠️ Important System Constraints

* Data is stored locally first, then synced to Supabase when configured
* Cross-device teacher results require Supabase environment variables
* Teachers can collect cross-device results using the pupil **Export for Teacher** button and the dashboard **Import Pupil Results** button
* No user authentication system
* Pupil access codes and the teacher dashboard password are classroom-level controls, not production-secure authentication
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

* Supabase is used for cloud result syncing
* localStorage remains as a fallback for classroom resilience
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

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run `supabase-schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Add the real values from Supabase Project Settings > API:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

5. Install dependencies and run the app.

```bash
npm install
npm run dev
```

When Supabase is configured, pupil progress, quiz results, and screenshots sync automatically. The teacher dashboard can then use **Refresh Cloud Results** to load results from all devices.

---
