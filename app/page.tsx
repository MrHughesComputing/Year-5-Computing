"use client";

import { useState } from "react";

const lessons = [
  {
    title: "Conditions",
    description: "Understanding conditions in Scratch",
    scratch: "https://scratch.mit.edu/",
  },
  {
    title: "If... Then...",
    description: "Single outcome selection",
    scratch: "https://scratch.mit.edu/",
  },
  {
    title: "If... Then... Else...",
    description: "Branching logic",
    scratch: "https://scratch.mit.edu/",
  },
];

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>APSR Year 5 Computing</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        
        {/* Sidebar */}
        <div style={{ width: 250 }}>
          <h3>Lessons</h3>
          {lessons.map((lesson) => (
            <div
              key={lesson.title}
              onClick={() => setSelectedLesson(lesson)}
              style={{
                padding: 10,
                marginBottom: 10,
                cursor: "pointer",
                background:
                  selectedLesson.title === lesson.title
                    ? "#ddd"
                    : "#f5f5f5",
              }}
            >
              <strong>{lesson.title}</strong>
              <div style={{ fontSize: 12 }}>{lesson.description}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <h2>{selectedLesson.title}</h2>
          <p>{selectedLesson.description}</p>

          <h3>Scratch Activity</h3>
          <a href={selectedLesson.scratch} target="_blank">
            Open Scratch
          </a>

          <div style={{ marginTop: 20 }}>
            <iframe
              src="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
              width="100%"
              height="500"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
