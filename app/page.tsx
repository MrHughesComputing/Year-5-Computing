"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = {
  id: number;
  week: number;
  term: "Summer Term 1" | "Summer Term 2";
  title: string;
  shortTitle: string;
  description: string;
  objective: string;
  task: string;
  vocab: string[];
  teaching: {
    whatIsIt: string;
    whyItMatters: string;
    teacherModel: string;
    guidedPractice: string;
    keyQuestion: string;
    misconception: string;
  };
  scratchLink: string;
};

const lessons: Lesson[] = [
  {
    id: 1,
    week: 1,
    term: "Summer Term 1",
    title: "Conditions",
    shortTitle: "Intro to Conditions",
    description: "Understanding conditions in Scratch",
    objective: "I can explain that a condition can be true or false.",
    task: "Create a sprite action that only happens when one rule is true.",
    vocab: ["condition", "true", "false", "decision"],
    teaching: {
      whatIsIt:
        "A condition is a check in a program. It asks whether something is true or false.",
      whyItMatters:
        "Conditions help programs make decisions instead of doing the same thing every time.",
      teacherModel:
        "Show simple examples such as: if it rains, open an umbrella. Then connect this to a Scratch condition block.",
      guidedPractice:
        "Ask pupils to identify whether different statements are true or false and predict what a program should do next.",
      keyQuestion:
        "How does a computer know whether it should carry out an action?",
      misconception:
        "Pupils may think a condition is an action. Clarify that it is a check, not the action itself.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 2,
    week: 2,
    term: "Summer Term 1",
    title: "If... Then...",
    shortTitle: "Single Outcome Selection",
    description: "Using if... then... in Scratch",
    objective: "I can use an if... then... block to make a simple decision.",
    task: "Make a sprite react only when a condition is true.",
    vocab: ["if", "then", "selection", "action"],
    teaching: {
      whatIsIt:
        "An if... then... block tells the computer to do something only when a condition is true.",
      whyItMatters:
        "It allows programs to respond to events instead of always running the same way.",
      teacherModel:
        "Model a sprite saying hello only if it touches a colour or if a key is pressed.",
      guidedPractice:
        "Pupils copy one short if... then... program, test it, then change the condition.",
      keyQuestion:
        "What happens if the condition is false in an if... then... block?",
      misconception:
        "Pupils may expect the action to happen anyway. Emphasise that nothing inside the block runs if the condition is false.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 3,
    week: 3,
    term: "Summer Term 1",
    title: "If... Then... Else...",
    shortTitle: "Branching",
    description: "Using two outcomes in Scratch",
    objective: "I can create code with two different outcomes.",
    task: "Create a quiz-style response with a correct and incorrect outcome.",
    vocab: ["else", "branch", "outcome", "selection"],
    teaching: {
      whatIsIt:
        "If... then... else... lets a program choose between two different outcomes.",
      whyItMatters:
        "It makes programs smarter because they can react differently depending on what happens.",
      teacherModel:
        "Model a short question in Scratch where the user gets one message if correct and another if incorrect.",
      guidedPractice:
        "Pupils build a simple right/wrong answer checker, then improve the messages.",
      keyQuestion:
        "Why is the else part useful in a program?",
      misconception:
        "Pupils may think else means repeat. Clarify that it means the second outcome when the condition is false.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 4,
    week: 4,
    term: "Summer Term 1",
    title: "Selection + Loops",
    shortTitle: "Continuous Checking",
    description: "Using selection inside repetition",
    objective: "I can explain how a program keeps checking for an event.",
    task: "Create a script that keeps checking for a key press or collision.",
    vocab: ["loop", "repeat", "forever", "check"],
    teaching: {
      whatIsIt:
        "A loop repeats code. When a condition is placed inside a loop, the program can keep checking it again and again.",
      whyItMatters:
        "This is how games and interactive projects respond in real time.",
      teacherModel:
        "Show a forever loop that checks whether a sprite is touching something and responds immediately.",
      guidedPractice:
        "Pupils build a sprite that reacts whenever a condition becomes true during the program.",
      keyQuestion:
        "Why does a program need to keep checking some conditions repeatedly?",
      misconception:
        "Pupils may think one check is enough. Explain that live programs need continuous checking.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 5,
    week: 5,
    term: "Summer Term 1",
    title: "Asking Questions",
    shortTitle: "Input + Decisions",
    description: "Using ask/answer with conditions",
    objective: "I can use a player’s answer inside a condition.",
    task: "Create one interactive question using ask, answer, and a condition.",
    vocab: ["input", "answer", "question", "response"],
    teaching: {
      whatIsIt:
        "The ask block collects input from the user. The answer can then be checked using a condition.",
      whyItMatters:
        "It makes programs interactive because the computer responds to the user.",
      teacherModel:
        "Model asking a question, collecting the answer, and checking whether it matches the expected response.",
      guidedPractice:
        "Pupils create one question and test both correct and incorrect answers.",
      keyQuestion:
        "How does Scratch remember what the user typed?",
      misconception:
        "Pupils may think the answer block is the question. Clarify that it stores the user’s response.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 6,
    week: 6,
    term: "Summer Term 1",
    title: "Designing a Quiz",
    shortTitle: "Planning Logic",
    description: "Planning a Scratch quiz before coding",
    objective: "I can plan the steps and decisions for a quiz program.",
    task: "Plan a short quiz with at least two questions before opening Scratch.",
    vocab: ["algorithm", "plan", "flowchart", "sequence"],
    teaching: {
      whatIsIt:
        "Planning means deciding the order, questions, and outcomes before you start coding.",
      whyItMatters:
        "Good plans make programs easier to build, test, and improve.",
      teacherModel:
        "Model one simple flowchart for a quiz question showing ask, answer, check, and feedback.",
      guidedPractice:
        "Pupils plan their own two-question quiz using notes or a simple flowchart.",
      keyQuestion:
        "Why is it useful to plan a program before writing code?",
      misconception:
        "Pupils may want to jump straight into coding. Reinforce that planning saves time and reduces bugs.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 7,
    week: 7,
    term: "Summer Term 1",
    title: "Debugging",
    shortTitle: "Fixing Logic",
    description: "Finding and fixing errors in selection code",
    objective: "I can test a program and fix logic mistakes.",
    task: "Test a quiz or decision program and fix at least one logic error.",
    vocab: ["debug", "error", "test", "fix"],
    teaching: {
      whatIsIt:
        "Debugging means finding and correcting mistakes in a program.",
      whyItMatters:
        "Even good programmers make mistakes. Testing and debugging make the program work properly.",
      teacherModel:
        "Model a broken condition, test it, identify the problem, and correct it.",
      guidedPractice:
        "Pupils use a test checklist and try both correct and incorrect answers.",
      keyQuestion:
        "What should you do first when your program does not behave as expected?",
      misconception:
        "Pupils may think debugging means starting again. Show them how to test small parts and fix specific mistakes.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 8,
    week: 1,
    term: "Summer Term 2",
    title: "Build a Quiz",
    shortTitle: "First Working Question",
    description: "Creating the first question in a quiz",
    objective: "I can build a working quiz question using input and selection.",
    task: "Create one complete quiz question with feedback for correct and incorrect answers.",
    vocab: ["quiz", "input", "condition", "feedback"],
    teaching: {
      whatIsIt:
        "This lesson brings together asking questions, checking answers, and giving feedback.",
      whyItMatters:
        "It turns coding knowledge into a working project.",
      teacherModel:
        "Build one complete quiz question from start to finish and narrate every decision.",
      guidedPractice:
        "Pupils copy one working example, then change the wording or answers.",
      keyQuestion:
        "What parts are needed for one working quiz question?",
      misconception:
        "Pupils may add too much too quickly. Keep the first version simple and complete.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 9,
    week: 2,
    term: "Summer Term 2",
    title: "Expand the Quiz",
    shortTitle: "Multiple Questions",
    description: "Adding more questions and structure",
    objective: "I can extend my quiz to include multiple questions.",
    task: "Add at least one more question and keep the quiz organised.",
    vocab: ["extend", "structure", "score", "sequence"],
    teaching: {
      whatIsIt:
        "Extending means adding more content while keeping the program clear and organised.",
      whyItMatters:
        "A good project must still be easy to follow when it becomes longer.",
      teacherModel:
        "Show how to repeat the same question-answer-feedback structure for more than one question.",
      guidedPractice:
        "Pupils add a second question and keep the code in a sensible order.",
      keyQuestion:
        "How can you make your quiz bigger without making it messy?",
      misconception:
        "Pupils may copy blocks without organising them. Emphasise structure and readability.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 10,
    week: 3,
    term: "Summer Term 2",
    title: "Testing and Improving",
    shortTitle: "Refining Accuracy",
    description: "Checking quiz logic and improving reliability",
    objective: "I can test my project and improve weak areas.",
    task: "Test each question and improve any part that does not work correctly.",
    vocab: ["test", "improve", "logic", "edge case"],
    teaching: {
      whatIsIt:
        "Testing checks whether a program works in different situations, not just once.",
      whyItMatters:
        "A project that only works sometimes is not reliable.",
      teacherModel:
        "Show different types of answers and discuss what should happen in each case.",
      guidedPractice:
        "Pupils test each other’s work and look for bugs or unclear feedback.",
      keyQuestion:
        "Why should you test a project in more than one way?",
      misconception:
        "Pupils may think one successful test means the program is finished.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 11,
    week: 4,
    term: "Summer Term 2",
    title: "Enhancing the Program",
    shortTitle: "Better User Experience",
    description: "Improving the design and feedback of the quiz",
    objective: "I can improve my project so it is clearer and more enjoyable.",
    task: "Improve the design, messages, and feedback in your quiz.",
    vocab: ["enhance", "design", "user experience", "feedback"],
    teaching: {
      whatIsIt:
        "Enhancing means making the program better for the person using it.",
      whyItMatters:
        "A good program is not only correct, but also clear and enjoyable to use.",
      teacherModel:
        "Show how better wording, layout, and feedback improve the experience for the user.",
      guidedPractice:
        "Pupils improve instructions, result messages, and the overall presentation of the quiz.",
      keyQuestion:
        "What makes a program easier and more enjoyable to use?",
      misconception:
        "Pupils may focus only on decoration. Remind them that improvement should help the user understand and use the program better.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 12,
    week: 5,
    term: "Summer Term 2",
    title: "Consolidation",
    shortTitle: "Final Project Review",
    description: "Finishing, reviewing, and evaluating the quiz",
    objective: "I can complete my quiz and reflect on what I learned.",
    task: "Finish your project and write one strength and one next step.",
    vocab: ["evaluate", "review", "complete", "reflect"],
    teaching: {
      whatIsIt:
        "Consolidation means bringing your learning together and reviewing what you can now do.",
      whyItMatters:
        "Reflection helps you recognise strengths and identify what to improve next time.",
      teacherModel:
        "Show an example of a completed quiz and evaluate it using clear success criteria.",
      guidedPractice:
        "Pupils review their own project, then explain one strength and one improvement point.",
      keyQuestion:
        "How do you know whether your final project is successful?",
      misconception:
        "Pupils may think finished means perfect. Explain that evaluation is about judging quality and thinking about next steps.",
    },
    scratchLink: "https://scratch.mit.edu/",
  },
];

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("year5-computing-progress");
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("year5-computing-progress", JSON.stringify(completed));
  }, [completed]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  const progress = Math.round((completed.length / lessons.length) * 100);

  const markComplete = () => {
    if (!completed.includes(selectedLesson.id)) {
      setCompleted([...completed, selectedLesson.id]);
    }
  };

  const resetProgress = () => {
    setCompleted([]);
  };

  const groupedLessons = useMemo(() => {
    return {
      "Summer Term 1": lessons.filter((lesson) => lesson.term === "Summer Term 1"),
      "Summer Term 2": lessons.filter((lesson) => lesson.term === "Summer Term 2"),
    };
  }, []);

  return (
    <main
      style={{
        padding: 30,
        fontFamily: "Arial, sans-serif",
        maxWidth: 1500,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>APSR Year 5 Computing</h1>
      <p style={{ fontSize: 22, marginTop: 0 }}>Selection in Scratch</p>

      <div style={{ marginTop: 20, marginBottom: 30 }}>
        <strong style={{ fontSize: 20 }}>Progress: {progress}%</strong>
        <div
          style={{
            height: 14,
            background: "#e5e7eb",
            borderRadius: 999,
            marginTop: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#0f172a",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
        <aside style={{ width: 360 }}>
          <h2>Lessons</h2>

          {(["Summer Term 1", "Summer Term 2"] as const).map((term) => (
            <div key={term} style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 10 }}>{term}</h3>
              {groupedLessons[term].map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 14,
                    marginBottom: 10,
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    background:
                      selectedLessonId === lesson.id ? "#dbeafe" : "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
                    Week {lesson.week} • {lesson.shortTitle}
                  </div>
                  <strong style={{ fontSize: 18 }}>{lesson.title}</strong>
                  <div style={{ fontSize: 14, marginTop: 6 }}>{lesson.description}</div>
                  {completed.includes(lesson.id) && (
                    <div style={{ marginTop: 8, color: "green", fontWeight: 700 }}>
                      ✅ Completed
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}

          <button
            onClick={resetProgress}
            style={{
              marginTop: 10,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Reset Progress
          </button>
        </aside>

        <section style={{ flex: 1 }}>
          <h2 style={{ fontSize: 40, marginBottom: 10 }}>{selectedLesson.title}</h2>
          <p style={{ fontSize: 22, marginTop: 0 }}>{selectedLesson.description}</p>

          <div
            style={{
              background: "#f8fafc",
              padding: 24,
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              marginBottom: 24,
            }}
          >
            <h3 style={{ fontSize: 28 }}>Learning Objective</h3>
            <p style={{ fontSize: 20 }}>{selectedLesson.objective}</p>

            <h3 style={{ fontSize: 28, marginTop: 24 }}>Scratch Task</h3>
            <p style={{ fontSize: 20 }}>{selectedLesson.task}</p>

            <a
              href={selectedLesson.scratchLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 18,
                padding: "14px 20px",
                background: "#0f172a",
                color: "white",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Open Scratch in a new tab
            </a>

            <div style={{ marginTop: 22 }}>
              <button
                onClick={markComplete}
                style={{
                  padding: "14px 20px",
                  background: "green",
                  color: "white",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              marginBottom: 24,
            }}
          >
            <h3 style={{ fontSize: 30, marginTop: 0 }}>Teaching Section</h3>

            <h4 style={{ fontSize: 24 }}>What is it?</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.whatIsIt}</p>

            <h4 style={{ fontSize: 24 }}>Why does it matter?</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.whyItMatters}</p>

            <h4 style={{ fontSize: 24 }}>Teacher Model</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.teacherModel}</p>

            <h4 style={{ fontSize: 24 }}>Guided Practice</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.guidedPractice}</p>

            <h4 style={{ fontSize: 24 }}>Key Question</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.keyQuestion}</p>

            <h4 style={{ fontSize: 24 }}>Common Misconception</h4>
            <p style={{ fontSize: 19 }}>{selectedLesson.teaching.misconception}</p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 14,
              border: "1px solid #cbd5e1",
            }}
          >
            <h3 style={{ fontSize: 30, marginTop: 0 }}>Key Vocabulary</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {selectedLesson.vocab.map((word) => (
                <span
                  key={word}
                  style={{
                    background: "#e2e8f0",
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontSize: 18,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
