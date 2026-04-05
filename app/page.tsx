"use client";

import { useState, useEffect } from "react";

const lessons = [
  { id: 1, title: "Conditions", description: "Understanding conditions", objective: "Explain true/false conditions", task: "Create an action when a rule is true" },
  { id: 2, title: "If... Then...", description: "Single outcome selection", objective: "Use if... then...", task: "Make a sprite react to a condition" },
  { id: 3, title: "If... Then... Else...", description: "Branching logic", objective: "Use two outcomes", task: "Create correct/incorrect responses" },
];

export default function Home() {
  const [selected, setSelected] = useState(lessons[0]);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const markComplete = () => {
    if (!completed.includes(selected.id)) {
      const updated = [...completed, selected.id];
      setCompleted(updated);
      localStorage.setItem("progress", JSON.stringify(updated));
    }
  };

  const progress = Math.round((completed.length / lessons.length) * 100);

  return (
    <main style={{ padding: 30, fontFamily: "Arial", maxWidth: 1400 }}>
      <h1>APSR Year 5 Computing</h1>
      <p>Selection in Scratch</p>

      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <strong>Progress: {progress}%</strong>
        <div style={{ height: 10, background: "#eee", marginTop: 5 }}>
          <div style={{ width: `${progress}%`, height: 10, background: "#0f172a" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Sidebar */}
        <div style={{ width: 280 }}>
          <h3>Lessons</h3>
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
                textAlign: "left",
                background: selected.id === l.id ? "#dbeafe" : "#f5f5f5",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            >
              <strong>{l.title}</strong>
              <div style={{ fontSize: 12 }}>{l.description}</div>
              {completed.includes(l.id) && <div>✅ Completed</div>}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1 }}>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>

          <div style={{ background: "#fafafa", padding: 20, borderRadius: 10 }}>
            <h3>Learning Objective</h3>
            <p>{selected.objective}</p>

            <h3>Scratch Task</h3>
            <p>{selected.task}</p>

            <a
              href="https://scratch.mit.edu/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "10px 16px",
                background: "#0f172a",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Open Scratch
            </a>

            <div style={{ marginTop: 20 }}>
              <button
                onClick={markComplete}
                style={{
                  padding: "10px 16px",
                  background: "green",
                  color: "white",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
