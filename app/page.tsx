"use client";

import { useState } from "react";

const lessons = [
  {
    title: "Conditions",
    description: "Understanding conditions in Scratch",
    objective: "I can explain that a condition can be true or false.",
    task: "Create a sprite action that only happens when one rule is true.",
    scratch: "https://scratch.mit.edu/",
  },
  {
    title: "If... Then...",
    description: "Single outcome selection",
    objective: "I can use an if... then... block to make a simple decision.",
    task: "Create a sprite that reacts only when a condition is met.",
    scratch: "https://scratch.mit.edu/",
  },
  {
    title: "If... Then... Else...",
    description: "Branching logic",
    objective: "I can create code with two different outcomes.",
    task: "Create a quiz-style response with a correct and incorrect outcome.",
    scratch: "https://scratch.mit.edu/",
  },
];

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);

  return (
    <main style={{ padding: 30, fontFamily: "Arial, sans-serif", maxWidth: 1400 }}>
      <h1>APSR Year 5 Computing</h1>
      <p>Selection in Scratch</p>

      <div style={{ display: "flex", gap: 24, marginTop: 24, alignItems: "flex-start" }}>
        <aside style={{ width: 280 }}>
          <h3>Lessons</h3>
          {lessons.map((lesson) => (
            <button
              key={lesson.title}
              onClick={() => setSelectedLesson(lesson)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                marginBottom: 12,
                cursor: "pointer",
                border: "1px solid #ccc",
                background: selectedLesson.title === lesson.title ? "#dbeafe" : "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <strong>{lesson.title}</strong>
              <div style={{ fontSize: 13, marginTop: 4 }}>{lesson.description}</div>
            </button>
          ))}
        </aside>

        <section style={{ flex: 1 }}>
          <h2>{selectedLesson.title}</h2>
          <p>{selectedLesson.description}</p>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginTop: 20,
              background: "#fafafa",
            }}
          >
            <h3>Learning Objective</h3>
            <p>{selectedLesson.objective}</p>

            <h3>Scratch Task</h3>
            <p>{selectedLesson.task}</p>

            <div style={{ marginTop: 16 }}>
              <a
                href={selectedLesson.scratch}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "12px 18px",
                  background: "#0f172a",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Open Scratch in a new tab
              </a>
            </div>
          </div>

          <div
            style={{
              border: "1px dashed #bbb",
              borderRadius: 10,
              padding: 20,
              marginTop: 24,
              background: "#fff",
            }}
          >
            <h3>Teacher Note</h3>
            <p>
              Scratch cannot be embedded directly here because the Scratch website blocks iframe
              access. Pupils should click the button above to open Scratch in a separate tab.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
