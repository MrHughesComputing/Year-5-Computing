"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

/* =========================
   TYPES
========================= */

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
};

type QuizResult = {
  submitted: boolean;
  score: number;
  answers: number[];
};

type ScreenshotMap = Record<number, string>;
type QuizOrderMap = Record<number, number[][]>;

type LearnerProfile = {
  className: string;
  studentName: string;
  storageKey: string;
};

/* =========================
   CONSTANTS
========================= */

const REGISTRY_KEY = "year5-pupil-registry";
const CURRENT_PROFILE_KEY = "year5-current-profile";

/* =========================
   SHUFFLE ENGINE
========================= */

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizOrder(quiz: QuizQuestion[]): number[][] {
  return quiz.map((q) =>
    shuffleArray(q.options.map((_, i) => i))
  );
}

/* =========================
   DEMO QUIZ (KEEP YOUR BANK)
========================= */

const quizBank: Record<number, QuizQuestion[]> = {
  1: [
    {
      prompt: "What is a condition?",
      options: ["Check true/false", "Sprite", "Sound", "Colour"],
      answer: 0,
    },
    {
      prompt: "What does a condition do?",
      options: ["Decides", "Draws", "Deletes", "Moves"],
      answer: 0,
    },
  ],
};

/* =========================
   STORAGE HELPERS
========================= */

function buildQuiz(lessonId: number): QuizQuestion[] {
  return quizBank[lessonId] || [];
}

/* =========================
   MAIN COMPONENT
========================= */

export default function Home() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  const [quizState, setQuizState] = useState<Record<number, QuizResult>>({});
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number[]>>(
    {}
  );
  const [quizOrderMap, setQuizOrderMap] = useState<QuizOrderMap>({});

  const selectedLessonId = 1;

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_PROFILE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
    }
  }, []);

  /* =========================
     LOAD DATA PER PUPIL
  ========================= */

  useEffect(() => {
    if (!profile) return;

    const savedQuiz = localStorage.getItem(
      `${profile.storageKey}-quiz-results`
    );
    const savedOrder = localStorage.getItem(
      `${profile.storageKey}-quiz-order`
    );

    setQuizState(savedQuiz ? JSON.parse(savedQuiz) : {});
    setQuizOrderMap(savedOrder ? JSON.parse(savedOrder) : {});
  }, [profile]);

  /* =========================
     SAVE ORDER
  ========================= */

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      `${profile.storageKey}-quiz-order`,
      JSON.stringify(quizOrderMap)
    );
  }, [quizOrderMap, profile]);

  /* =========================
     QUIZ BUILD
  ========================= */

  const quiz = useMemo(() => buildQuiz(selectedLessonId), [selectedLessonId]);

  const lessonOrder = useMemo(() => {
    const existing = quizOrderMap[selectedLessonId];
    if (existing) return existing;
    return buildQuizOrder(quiz);
  }, [quiz, quizOrderMap, selectedLessonId]);

  useEffect(() => {
    if (!quiz.length) return;
    if (!quizOrderMap[selectedLessonId]) {
      setQuizOrderMap((prev) => ({
        ...prev,
        [selectedLessonId]: buildQuizOrder(quiz),
      }));
    }
  }, [quiz]);

  const submitted = quizState[selectedLessonId];
  const answers =
    currentAnswers[selectedLessonId] || Array(quiz.length).fill(-1);

  /* =========================
     ACTIONS
  ========================= */

  const chooseAnswer = (q: number, option: number) => {
    if (submitted?.submitted) return;

    const updated = [...answers];
    updated[q] = option;

    setCurrentAnswers((prev) => ({
      ...prev,
      [selectedLessonId]: updated,
    }));
  };

  const submitQuiz = () => {
    let score = 0;

    quiz.forEach((q, i) => {
      const selected = answers[i];
      const original = lessonOrder[i][selected];

      if (original === q.answer) score++;
    });

    setQuizState((prev) => ({
      ...prev,
      [selectedLessonId]: {
        submitted: true,
        score,
        answers,
      },
    }));
  };

  /* =========================
     UI
  ========================= */

  return (
    <main style={{ padding: 30 }}>
      <h1>Quiz Demo</h1>

      {quiz.map((q, qi) => {
        const order = lessonOrder[qi];

        return (
          <div key={qi} style={{ marginBottom: 20 }}>
            <h3>{q.prompt}</h3>

            {order.map((originalIndex, displayIndex) => {
              const text = q.options[originalIndex];
              const isCorrect = originalIndex === q.answer;
              const selected = answers[qi] === displayIndex;

              return (
                <button
                  key={displayIndex}
                  onClick={() => chooseAnswer(qi, displayIndex)}
                  style={{
                    display: "block",
                    margin: "6px 0",
                    padding: 10,
                    background:
                      submitted?.submitted && isCorrect
                        ? "#d1fae5"
                        : selected
                        ? "#ddd6fe"
                        : "#fff",
                  }}
                >
                  {text}
                </button>
              );
            })}
          </div>
        );
      })}

      <button onClick={submitQuiz}>Submit</button>
    </main>
  );
}
