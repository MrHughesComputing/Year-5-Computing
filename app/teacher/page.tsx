"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TEACHER_PASSWORD = "APSR2026";
const SESSION_KEY = "teacher-unlocked";

export default function TeacherPage() {
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    setUnlocked(saved === "true");
  }, []);

  const unlock = () => {
    if (password === TEACHER_PASSWORD) {
      localStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const lock = () => {
    localStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  if (!unlocked) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Teacher Login</h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: 10, marginBottom: 10 }}
        />

        <br />

        <button onClick={unlock}>Unlock</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Teacher Dashboard</h1>

      <button onClick={() => router.push("/")}>Back</button>
      <button onClick={lock}>Lock</button>
    </main>
  );
}
