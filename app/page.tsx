"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Lesson = {
  id: number;
  week: number;
  term: "Summer Term 1" | "Summer Term 2";
  title: string;
  shortTitle: string;
  description: string;
  objective: string;
  overview: string;
  whyItMatters: string;
  vocab: string[];
  scratchSteps: string[];
  scratchTask: string;
  keyQuestion: string;
  misconception: string;
  correctOutcome: string;
  wrongOutcome: string;
  scratchLink: string;
};

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

const lessons: Lesson[] = [
  {
    id: 1,
    week: 1,
    term: "Summer Term 1",
    title: "Conditions",
    shortTitle: "Intro to Conditions",
    description: "Understanding conditions in Scratch",
    objective: "I can explain that a condition can be true or false.",
    overview:
      "A condition is a check in a program. It asks whether something is true or false before the program decides what to do next.",
    whyItMatters:
      "Conditions help programs make decisions instead of doing the same thing every time.",
    vocab: ["condition", "true", "false", "decision"],
    scratchSteps: [
      "Open Scratch and choose a sprite.",
      "Add an event block such as ‘when green flag clicked’.",
      "Find a control block that uses a condition.",
      "Choose a sensing or operator block that can be true or false.",
      "Place that condition into the control block.",
      "Add an action inside the block, such as ‘say hello’.",
      "Run the program and test when the condition is true.",
      "Change the condition and test it again.",
    ],
    scratchTask:
      "Create a sprite action that only happens when one rule is true.",
    keyQuestion:
      "How does a computer know whether it should carry out an action?",
    misconception:
      "A condition is not the action itself. It is the check that decides whether the action should happen.",
    correctOutcome: "The sprite only acts when the condition is true.",
    wrongOutcome:
      "The sprite acts all the time or never acts because the condition is not being checked properly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 2,
    week: 2,
    term: "Summer Term 1",
    title: "If... Then...",
    shortTitle: "Single Outcome Selection",
    description: "Using if... then... in Scratch",
    objective:
      "I can use an if... then... block to make a simple decision.",
    overview:
      "An if... then... block tells the computer to do something only when a condition is true.",
    whyItMatters:
      "This lets programs respond to events instead of always running in the same way.",
    vocab: ["if", "then", "selection", "action"],
    scratchSteps: [
      "Open Scratch and pick a sprite.",
      "Add ‘when green flag clicked’.",
      "Drag in an ‘if... then...’ block from Control.",
      "Choose a condition, such as ‘touching edge?’ or ‘key space pressed?’.",
      "Place the condition inside the if space.",
      "Add one action inside the then section, such as ‘say hello’.",
      "Run the code and check what happens when the condition is true.",
      "Test what happens when the condition is false.",
    ],
    scratchTask:
      "Make a sprite react only when a condition is true.",
    keyQuestion:
      "What happens if the condition is false in an if... then... block?",
    misconception:
      "Nothing inside the block runs when the condition is false.",
    correctOutcome:
      "The action happens only when the rule is met.",
    wrongOutcome:
      "The action happens all the time because the condition is missing or outside the block.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 3,
    week: 3,
    term: "Summer Term 1",
    title: "If... Then... Else...",
    shortTitle: "Branching",
    description: "Using two outcomes in Scratch",
    objective:
      "I can create code with two different outcomes.",
    overview:
      "If... then... else... lets a program choose between two different outcomes.",
    whyItMatters:
      "It allows a program to respond differently when the answer is right or wrong.",
    vocab: ["else", "branch", "outcome", "selection"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Use ‘ask ... and wait’ to collect an answer.",
      "Drag in an ‘if... then... else...’ block.",
      "Compare the answer to the correct response using an operator block.",
      "Put the check inside the if space.",
      "Add a correct message in the then section.",
      "Add a different message in the else section.",
      "Test with both a correct and incorrect answer.",
    ],
    scratchTask:
      "Create a quiz-style response with a correct and incorrect outcome.",
    keyQuestion:
      "Why is the else part useful in a program?",
    misconception:
      "Else is not repetition. It is the second outcome when the condition is false.",
    correctOutcome:
      "The program gives one response for true and another for false.",
    wrongOutcome:
      "The same response appears every time because both outcomes are not set clearly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 4,
    week: 4,
    term: "Summer Term 1",
    title: "Selection + Loops",
    shortTitle: "Continuous Checking",
    description: "Using selection inside repetition",
    objective:
      "I can explain how a program keeps checking for an event.",
    overview:
      "A loop repeats code. A condition inside a loop can be checked again and again.",
    whyItMatters:
      "This is how games and interactive projects respond in real time.",
    vocab: ["loop", "repeat", "forever", "check"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Add a ‘forever’ block from Control.",
      "Place an ‘if... then...’ block inside the forever loop.",
      "Choose a condition such as ‘key pressed?’ or ‘touching mouse-pointer?’.",
      "Place the condition inside the if section.",
      "Add an action inside the then section.",
      "Run the program and try the action several times.",
      "Notice that the condition is checked continuously.",
    ],
    scratchTask:
      "Create a script that keeps checking for a key press or collision.",
    keyQuestion:
      "Why does a program need to keep checking some conditions repeatedly?",
    misconception:
      "One check is not enough in a live program. It must keep checking while the program runs.",
    correctOutcome:
      "The sprite responds as soon as the event happens.",
    wrongOutcome:
      "The program only checks once because the selection block is not inside a loop.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 5,
    week: 5,
    term: "Summer Term 1",
    title: "Asking Questions",
    shortTitle: "Input + Decisions",
    description: "Using ask/answer with conditions",
    objective:
      "I can use a player’s answer inside a condition.",
    overview:
      "The ask block collects input from the user. The answer block stores what the user typed.",
    whyItMatters:
      "It makes projects interactive because the computer responds to the player.",
    vocab: ["input", "answer", "question", "response"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Use ‘ask ... and wait’ to ask a question.",
      "Add an ‘if... then... else...’ block.",
      "Use an operator block to compare ‘answer’ to the correct response.",
      "Place that comparison into the if space.",
      "Add feedback in the then section.",
      "Add different feedback in the else section.",
      "Test with several different answers.",
    ],
    scratchTask:
      "Create one interactive question using ask, answer, and a condition.",
    keyQuestion:
      "How does Scratch remember what the user typed?",
    misconception:
      "The answer block stores the user response, not the question itself.",
    correctOutcome:
      "The program checks the user’s answer and gives suitable feedback.",
    wrongOutcome:
      "The program cannot judge the response because the answer block was not used correctly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 6,
    week: 6,
    term: "Summer Term 1",
    title: "Designing a Quiz",
    shortTitle: "Planning Logic",
    description: "Planning a Scratch quiz before coding",
    objective:
      "I can plan the steps and decisions for a quiz program.",
    overview:
      "Planning means deciding the order, questions, and outcomes before coding.",
    whyItMatters:
      "Good plans make programs easier to build, test, and improve.",
    vocab: ["algorithm", "plan", "flowchart", "sequence"],
    scratchSteps: [
      "Write the first question you want to ask.",
      "Write the correct answer beside it.",
      "Decide what should happen when the answer is correct.",
      "Decide what should happen when the answer is wrong.",
      "Repeat this for a second question.",
      "Put the steps into a simple order or flowchart.",
      "Only after planning, open Scratch.",
      "Build the first question from your plan.",
    ],
    scratchTask:
      "Plan a short quiz with at least two questions before opening Scratch.",
    keyQuestion:
      "Why is it useful to plan a program before writing code?",
    misconception:
      "Planning is not a delay. It helps avoid mistakes and messy code later.",
    correctOutcome:
      "The program is easier to build because the logic is already clear.",
    wrongOutcome:
      "The coding becomes confusing because the steps were not planned first.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 7,
    week: 7,
    term: "Summer Term 1",
    title: "Debugging",
    shortTitle: "Fixing Logic",
    description: "Finding and fixing errors in selection code",
    objective:
      "I can test a program and fix logic mistakes.",
    overview:
      "Debugging means finding and correcting mistakes in a program.",
    whyItMatters:
      "Testing and debugging help programs work reliably.",
    vocab: ["debug", "error", "test", "fix"],
    scratchSteps: [
      "Run the program once and watch carefully.",
      "Test a correct answer or true condition.",
      "Test an incorrect answer or false condition.",
      "Notice which part is not behaving properly.",
      "Check the condition block first.",
      "Check whether blocks are in the correct order.",
      "Change one thing at a time.",
      "Retest after each change.",
    ],
    scratchTask:
      "Test a quiz or decision program and fix at least one logic error.",
    keyQuestion:
      "What should you do first when your program does not behave as expected?",
    misconception:
      "Debugging does not mean starting again. It means finding the exact problem and fixing it.",
    correctOutcome:
      "The program works after careful testing and small changes.",
    wrongOutcome:
      "The problem remains because the code was changed without testing methodically.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 8,
    week: 1,
    term: "Summer Term 2",
    title: "Build a Quiz",
    shortTitle: "First Working Question",
    description: "Creating the first question in a quiz",
    objective:
      "I can build a working quiz question using input and selection.",
    overview:
      "This lesson combines asking questions, checking answers, and giving feedback into one working quiz item.",
    whyItMatters:
      "It turns separate coding skills into a real project.",
    vocab: ["quiz", "input", "condition", "feedback"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Ask your first question.",
      "Use answer in a comparison block.",
      "Place the comparison inside an ‘if... then... else...’ block.",
      "Write correct feedback in then.",
      "Write incorrect feedback in else.",
      "Test with a right answer.",
      "Test with a wrong answer.",
    ],
    scratchTask:
      "Create one complete quiz question with feedback for correct and incorrect answers.",
    keyQuestion:
      "What parts are needed for one working quiz question?",
    misconception:
      "A good first version should be simple and complete before extra features are added.",
    correctOutcome:
      "The quiz question works fully from question to feedback.",
    wrongOutcome:
      "The question appears, but the answer is not checked properly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 9,
    week: 2,
    term: "Summer Term 2",
    title: "Expand the Quiz",
    shortTitle: "Multiple Questions",
    description: "Adding more questions and structure",
    objective:
      "I can extend my quiz to include multiple questions.",
    overview:
      "Expanding means adding more content while keeping the code clear and organised.",
    whyItMatters:
      "A larger project still needs to stay easy to understand and test.",
    vocab: ["extend", "structure", "score", "sequence"],
    scratchSteps: [
      "Finish one working question first.",
      "Copy the structure for a second question.",
      "Change the wording and correct answer.",
      "Add new correct and incorrect feedback.",
      "Place the second question after the first one.",
      "Check that the order still makes sense.",
      "Test both questions.",
      "Improve any part that feels unclear.",
    ],
    scratchTask:
      "Add at least one more question and keep the quiz organised.",
    keyQuestion:
      "How can you make your quiz bigger without making it messy?",
    misconception:
      "Copying code is useful only if it stays organised and is edited carefully.",
    correctOutcome:
      "The quiz has more than one question and still makes sense.",
    wrongOutcome:
      "The quiz becomes confusing because the questions are out of order or not edited correctly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 10,
    week: 3,
    term: "Summer Term 2",
    title: "Testing and Improving",
    shortTitle: "Refining Accuracy",
    description: "Checking quiz logic and improving reliability",
    objective:
      "I can test my project and improve weak areas.",
    overview:
      "Testing checks whether a project works in different situations, not just once.",
    whyItMatters:
      "Reliable projects work for different answers and different users.",
    vocab: ["test", "improve", "logic", "edge case"],
    scratchSteps: [
      "Run the quiz from the beginning.",
      "Try a correct answer.",
      "Try an incorrect answer.",
      "Try an unusual answer, such as a capital letter or space.",
      "Record what went wrong.",
      "Fix one issue at a time.",
      "Retest after each fix.",
      "Ask a partner to test it too.",
    ],
    scratchTask:
      "Test each question and improve any part that does not work correctly.",
    keyQuestion:
      "Why should you test a project in more than one way?",
    misconception:
      "One successful test does not prove the project is fully correct.",
    correctOutcome:
      "The project works more reliably because it has been tested properly.",
    wrongOutcome:
      "Hidden mistakes remain because testing was too limited.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 11,
    week: 4,
    term: "Summer Term 2",
    title: "Enhancing the Program",
    shortTitle: "Better User Experience",
    description: "Improving the design and feedback of the quiz",
    objective:
      "I can improve my project so it is clearer and more enjoyable.",
    overview:
      "Enhancing means improving the experience for the person using the program.",
    whyItMatters:
      "A good program should be correct, clear, and enjoyable to use.",
    vocab: ["enhance", "design", "user experience", "feedback"],
    scratchSteps: [
      "Look at the instructions on screen.",
      "Make them shorter and clearer.",
      "Improve the feedback messages.",
      "Check that the questions are easy to read.",
      "Add useful visual or sound feedback.",
      "Keep the code organised while improving the design.",
      "Test whether the quiz is easier to use.",
      "Ask a partner what could still be better.",
    ],
    scratchTask:
      "Improve the design, messages, and feedback in your quiz.",
    keyQuestion:
      "What makes a program easier and more enjoyable to use?",
    misconception:
      "Improvement is not just decoration. It should help the user understand and use the program better.",
    correctOutcome:
      "The project feels clearer and more polished for the user.",
    wrongOutcome:
      "Extra features are added, but the quiz becomes less clear or harder to use.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 12,
    week: 5,
    term: "Summer Term 2",
    title: "Consolidation",
    shortTitle: "Final Project Review",
    description: "Finishing, reviewing, and evaluating the quiz",
    objective:
      "I can complete my quiz and reflect on what I learned.",
    overview:
      "Consolidation means bringing your learning together and reviewing your final project.",
    whyItMatters:
      "Reflection helps you identify strengths and next steps.",
    vocab: ["evaluate", "review", "complete", "reflect"],
    scratchSteps: [
      "Run your project from start to finish.",
      "Check that each question works properly.",
      "Check the messages and feedback.",
      "Fix any final errors.",
      "Review your vocabulary and coding choices.",
      "Decide one strength in your project.",
      "Decide one thing you would improve next time.",
      "Save and present your final version.",
    ],
    scratchTask:
      "Finish your project and identify one strength and one next step.",
    keyQuestion:
      "How do you know whether your final project is successful?",
    misconception:
      "Finished does not mean perfect. Reflection is about judging quality and identifying improvements.",
    correctOutcome:
      "The final project is complete and the pupil can explain its strengths.",
    wrongOutcome:
      "The project is rushed and not reviewed carefully before being called finished.",
    scratchLink: "https://scratch.mit.edu/",
  },
];

function buildQuiz(lesson: Lesson): QuizQuestion[] {
  return [
    {
      prompt: `What is the main idea of the lesson '${lesson.title}'?`,
      options: [
        lesson.overview,
        "Drawing backgrounds",
        "Typing faster",
        "Changing the stage size",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement matches the lesson objective?",
      options: [
        lesson.objective,
        "I can design a website",
        "I can build a spreadsheet",
        "I can edit a video",
      ],
      answer: 0,
    },
    {
      prompt: "Why does this topic matter?",
      options: [
        lesson.whyItMatters,
        "It makes the computer heavier",
        "It deletes bugs automatically",
        "It changes the mouse settings",
      ],
      answer: 0,
    },
    {
      prompt: "Which of these words belongs to this lesson vocabulary?",
      options: [lesson.vocab[0], "printer", "folder", "camera"],
      answer: 0,
    },
    {
      prompt: "Which of these words also belongs to this lesson vocabulary?",
      options: [lesson.vocab[1], "battery", "monitor stand", "charger"],
      answer: 0,
    },
    {
      prompt: "What key question should you be able to answer by the end of the lesson?",
      options: [
        lesson.keyQuestion,
        "What colour is the Scratch logo?",
        "How old is Scratch?",
        "Where is the keyboard made?",
      ],
      answer: 0,
    },
    {
      prompt: "Which answer shows the common misconception from this lesson?",
      options: [
        lesson.misconception,
        "You must always use ten sprites",
        "Scratch only works online",
        "Quizzes cannot use text",
      ],
      answer: 0,
    },
    {
      prompt: "What should happen when the lesson is done correctly?",
      options: [
        lesson.correctOutcome,
        "Nothing should happen",
        "The project should close",
        "The program should stay blank",
      ],
      answer: 0,
    },
    {
      prompt: "What problem shows that the code or understanding is wrong?",
      options: [
        lesson.wrongOutcome,
        "The project saves correctly",
        "The code runs clearly",
        "The user understands the task",
      ],
      answer: 0,
    },
    {
      prompt: "Which action should pupils take in Scratch for this lesson?",
      options: [
        lesson.scratchTask,
        "Change the computer wallpaper",
        "Open a word processor",
        "Print the screen",
      ],
      answer: 0,
    },
  ];
}

const pastel = {
  page: "#f8fafc",
  text: "#334155",
  title: "#1e293b",
  panel: "#ffffff",
  panelSoft: "#fdf2f8",
  panelBlue: "#eff6ff",
  panelMint: "#ecfeff",
  panelLilac: "#f5f3ff",
  panelPeach: "#fff7ed",
  border: "#dbe4f0",
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
  navy: "#334155",
  green: "#10b981",
  greenSoft: "#d1fae5",
  amber: "#f59e0b",
  amberSoft: "#fef3c7",
  rose: "#f43f5e",
  shadow: "0 10px 30px rgba(148, 163, 184, 0.14)",
};

type ScreenshotMap = Record<number, string>;

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizState, setQuizState] = useState<Record<number, QuizResult>>({});
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number[]>>(
    {}
  );
  const [screenshots, setScreenshots] = useState<ScreenshotMap>({});

  useEffect(() => {
    const savedProgress = localStorage.getItem("year5-computing-progress");
    const savedQuiz = localStorage.getItem("year5-computing-quiz-results");
    const savedScreenshots = localStorage.getItem("year5-computing-screenshots");

    if (savedProgress) setCompleted(JSON.parse(savedProgress));
    if (savedQuiz) setQuizState(JSON.parse(savedQuiz));
    if (savedScreenshots) setScreenshots(JSON.parse(savedScreenshots));
  }, []);

  useEffect(() => {
    localStorage.setItem("year5-computing-progress", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("year5-computing-quiz-results", JSON.stringify(quizState));
  }, [quizState]);

  useEffect(() => {
    localStorage.setItem("year5-computing-screenshots", JSON.stringify(screenshots));
  }, [screenshots]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const quiz = useMemo(() => buildQuiz(selectedLesson), [selectedLesson]);
  const submittedResult = quizState[selectedLesson.id];
  const selectedAnswers =
    currentAnswers[selectedLesson.id] || Array(quiz.length).fill(-1);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const selectedScreenshot = screenshots[selectedLesson.id];

  const groupedLessons = useMemo(
    () => ({
      "Summer Term 1": lessons.filter(
        (lesson) => lesson.term === "Summer Term 1"
      ),
      "Summer Term 2": lessons.filter(
        (lesson) => lesson.term === "Summer Term 2"
      ),
    }),
    []
  );

  const markComplete = () => {
    if (!completed.includes(selectedLesson.id)) {
      setCompleted((prev) => [...prev, selectedLesson.id]);
    }
  };

  const resetProgress = () => {
    setCompleted([]);
    setQuizState({});
    setCurrentAnswers({});
    setScreenshots({});
    localStorage.removeItem("year5-computing-progress");
    localStorage.removeItem("year5-computing-quiz-results");
    localStorage.removeItem("year5-computing-screenshots");
  };

  const chooseAnswer = (questionIndex: number, optionIndex: number) => {
    if (submittedResult?.submitted) return;
    const updated = [...selectedAnswers];
    updated[questionIndex] = optionIndex;
    setCurrentAnswers((prev) => ({ ...prev, [selectedLesson.id]: updated }));
  };

  const submitQuiz = () => {
    if (submittedResult?.submitted) return;
    if (selectedAnswers.some((answer) => answer === -1)) {
      alert("Please answer all 10 questions before submitting.");
      return;
    }
    let score = 0;
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) score += 1;
    });
    setQuizState((prev) => ({
      ...prev,
      [selectedLesson.id]: {
        submitted: true,
        score,
        answers: selectedAnswers,
      },
    }));
  };

  const handleScreenshotUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setScreenshots((prev) => ({
          ...prev,
          [selectedLesson.id]: result,
        }));
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const clearScreenshot = () => {
    setScreenshots((prev) => {
      const updated = { ...prev };
      delete updated[selectedLesson.id];
      return updated;
    });
  };

  return (
    <main
      style={{
        padding: 32,
        fontFamily: "Inter, Arial, sans-serif",
        maxWidth: 1520,
        margin: "0 auto",
        background: pastel.page,
        color: pastel.text,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 45%, #ecfeff 100%)",
          border: `1px solid ${pastel.border}`,
          borderRadius: 28,
          padding: 28,
          boxShadow: pastel.shadow,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "#7c3aed",
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              APSR Computing Platform
            </div>
            <h1
              style={{
                fontSize: 52,
                lineHeight: 1.05,
                margin: "8px 0 10px",
                color: pastel.title,
              }}
            >
              APSR Year 5 Computing
            </h1>
            <p style={{ fontSize: 22, margin: 0 }}>Selection in Scratch</p>
          </div>
          <div
            style={{
              minWidth: 320,
              background: "rgba(255,255,255,0.7)",
              border: `1px solid ${pastel.border}`,
              borderRadius: 22,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              style={{
                height: 14,
                background: "#e2e8f0",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                }}
              />
            </div>
            <div style={{ fontSize: 14, marginTop: 10, color: "#64748b" }}>
              {completed.length} of {lessons.length} lessons marked complete
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        <aside
          style={{
            background: pastel.panel,
            border: `1px solid ${pastel.border}`,
            borderRadius: 24,
            padding: 22,
            boxShadow: pastel.shadow,
            position: "sticky",
            top: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h2 style={{ fontSize: 34, margin: 0, color: pastel.title }}>
              Lessons
            </h2>
            <button
              onClick={resetProgress}
              style={{
                border: `1px solid ${pastel.border}`,
                background: pastel.panelLilac,
                color: pastel.title,
                borderRadius: 999,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {(["Summer Term 1", "Summer Term 2"] as const).map((term) => (
            <div key={term} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {term}
              </div>
              {groupedLessons[term].map((lesson) => {
                const active = selectedLessonId === lesson.id;
                const done = completed.includes(lesson.id);
                const hasScreenshot = Boolean(screenshots[lesson.id]);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: 16,
                      marginBottom: 10,
                      borderRadius: 18,
                      border: active
                        ? "1px solid #c4b5fd"
                        : `1px solid ${pastel.border}`,
                      background: active
                        ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                        : pastel.panel,
                      cursor: "pointer",
                      boxShadow: active
                        ? "0 8px 22px rgba(124, 58, 237, 0.12)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 6,
                      }}
                    >
                      Week {lesson.week} • {lesson.shortTitle}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: pastel.title,
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: 6,
                        color: pastel.text,
                      }}
                    >
                      {lesson.description}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 10,
                      }}
                    >
                      {done && (
                        <span
                          style={{
                            color: pastel.green,
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          ✓ Completed
                        </span>
                      )}
                      {hasScreenshot && (
                        <span
                          style={{
                            color: "#b45309",
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          📷 Screenshot added
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <section style={{ display: "grid", gap: 24 }}>
          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                alignItems: "start",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: pastel.panelLilac,
                    color: "#6d28d9",
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  {selectedLesson.term} • Week {selectedLesson.week}
                </div>
                <h2
                  style={{
                    fontSize: 48,
                    lineHeight: 1.05,
                    margin: "0 0 10px",
                    color: pastel.title,
                  }}
                >
                  {selectedLesson.title}
                </h2>
                <p style={{ fontSize: 22, margin: 0 }}>
                  {selectedLesson.description}
                </p>
              </div>
              {submittedResult?.submitted && (
                <div
                  style={{
                    background: pastel.greenSoft,
                    color: "#065f46",
                    borderRadius: 18,
                    padding: 18,
                    minWidth: 190,
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    Quiz Locked
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    {submittedResult.score}/10
                  </div>
                  <div style={{ fontSize: 14 }}>
                    No retakes for this lesson
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: pastel.panelBlue,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 26,
                boxShadow: pastel.shadow,
              }}
            >
              <h3
                style={{
                  fontSize: 32,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Learn This First
              </h3>
              <div style={{ fontSize: 18, lineHeight: 1.7 }}>
                <p>
                  <strong>What is this topic?</strong>
                  <br />
                  {selectedLesson.overview}
                </p>
                <p>
                  <strong>Why does it matter?</strong>
                  <br />
                  {selectedLesson.whyItMatters}
                </p>
                <p>
                  <strong>Key question</strong>
                  <br />
                  {selectedLesson.keyQuestion}
                </p>
                <p>
                  <strong>Watch out for this</strong>
                  <br />
                  {selectedLesson.misconception}
                </p>
              </div>
            </div>

            <div
              style={{
                background: pastel.panelMint,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 26,
                boxShadow: pastel.shadow,
              }}
            >
              <h3
                style={{
                  fontSize: 32,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Step-by-Step in Scratch
              </h3>
              <ol
                style={{
                  paddingLeft: 24,
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.75,
                }}
              >
                {selectedLesson.scratchSteps.map((step, index) => (
                  <li key={index} style={{ marginBottom: 10 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 34,
                    marginTop: 0,
                    marginBottom: 8,
                    color: pastel.title,
                  }}
                >
                  Lesson Quiz
                </h3>
                <p style={{ fontSize: 18, margin: 0 }}>
                  10 questions based on this lesson. Once submitted, the quiz is
                  locked and cannot be retaken.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  style={{
                    background: pastel.accentSoft,
                    color: pastel.accent,
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 800,
                  }}
                >
                  10 Questions
                </span>
                {submittedResult?.submitted && (
                  <span
                    style={{
                      background: pastel.greenSoft,
                      color: "#065f46",
                      borderRadius: 999,
                      padding: "10px 14px",
                      fontWeight: 800,
                    }}
                  >
                    Submitted
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
              {quiz.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 18,
                    padding: 20,
                    background: qIndex % 2 === 0 ? "#fff" : "#fcfcff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 19,
                      marginBottom: 14,
                      color: pastel.title,
                    }}
                  >
                    {qIndex + 1}. {question.prompt}
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {question.options.map((option, oIndex) => {
                      const chosen = selectedAnswers[qIndex] === oIndex;
                      const locked = submittedResult?.submitted;
                      const isCorrect =
                        submittedResult?.submitted && question.answer === oIndex;
                      const isWrongChoice =
                        submittedResult?.submitted &&
                        chosen &&
                        question.answer !== oIndex;
                      return (
                        <button
                          key={oIndex}
                          onClick={() => chooseAnswer(qIndex, oIndex)}
                          disabled={locked}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            borderRadius: 14,
                            border: isCorrect
                              ? "1px solid #86efac"
                              : isWrongChoice
                              ? "1px solid #fca5a5"
                              : chosen
                              ? "1px solid #c4b5fd"
                              : `1px solid ${pastel.border}`,
                            background: isCorrect
                              ? "#ecfdf5"
                              : isWrongChoice
                              ? "#fef2f2"
                              : chosen
                              ? "#f5f3ff"
                              : "#ffffff",
                            cursor: locked ? "default" : "pointer",
                            fontSize: 17,
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 16, color: "#64748b" }}>
                {submittedResult?.submitted
                  ? `Final score: ${submittedResult.score}/10. This quiz is now locked.`
                  : "Choose one answer for each question, then submit once."}
              </div>
              <button
                onClick={submitQuiz}
                disabled={submittedResult?.submitted}
                style={{
                  padding: "14px 20px",
                  borderRadius: 14,
                  border: "none",
                  background: submittedResult?.submitted
                    ? "#cbd5e1"
                    : "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                  color: "white",
                  fontWeight: 800,
                  cursor: submittedResult?.submitted ? "default" : "pointer",
                  fontSize: 17,
                }}
              >
                {submittedResult?.submitted ? "Quiz Submitted" : "Submit Quiz"}
              </button>
            </div>
          </div>

          <div
            style={{
              background: pastel.panelSoft,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <h3
              style={{
                fontSize: 34,
                marginTop: 0,
                marginBottom: 12,
                color: pastel.title,
              }}
            >
              Scratch Task
            </h3>
            <p style={{ fontSize: 20, lineHeight: 1.7, marginTop: 0 }}>
              {selectedLesson.scratchTask}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <a
                href={selectedLesson.scratchLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 20px",
                  background: pastel.navy,
                  color: "white",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Open Scratch in a new tab
              </a>
              <button
                onClick={markComplete}
                style={{
                  padding: "14px 20px",
                  background: pastel.green,
                  color: "white",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>

          <div
            style={{
              background: pastel.panelPeach,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 32,
                    marginTop: 0,
                    marginBottom: 8,
                    color: pastel.title,
                  }}
                >
                  Project Screenshot Upload
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0 }}>
                  Upload a screenshot of your Scratch work for this lesson.
                  This stays on this browser only.
                </p>
              </div>

              {selectedScreenshot && (
                <span
                  style={{
                    background: pastel.amberSoft,
                    color: "#92400e",
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 800,
                  }}
                >
                  Screenshot saved
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <label
                style={{
                  display: "inline-block",
                  padding: "14px 20px",
                  background: "white",
                  color: pastel.title,
                  borderRadius: 14,
                  border: `1px solid ${pastel.border}`,
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Choose Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleScreenshotUpload}
                  style={{ display: "none" }}
                />
              </label>

              {selectedScreenshot && (
                <button
                  onClick={clearScreenshot}
                  style={{
                    padding: "14px 20px",
                    background: "#fff1f2",
                    color: pastel.rose,
                    borderRadius: 14,
                    border: "1px solid #fecdd3",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  Remove Screenshot
                </button>
              )}
            </div>

            <div style={{ fontSize: 14, color: "#78716c", marginBottom: 18 }}>
              Accepted: PNG, JPG, WEBP • Maximum size: 2MB
            </div>

            {selectedScreenshot ? (
              <div
                style={{
                  background: "white",
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <img
                  src={selectedScreenshot}
                  alt={`Scratch project screenshot for ${selectedLesson.title}`}
                  style={{
                    width: "100%",
                    maxHeight: 500,
                    objectFit: "contain",
                    borderRadius: 14,
                    display: "block",
                    background: "#f8fafc",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed #fdba74",
                  borderRadius: 20,
                  padding: 28,
                  background: "rgba(255,255,255,0.7)",
                  color: "#9a3412",
                  fontSize: 17,
                }}
              >
                No screenshot uploaded yet for this lesson.
              </div>
            )}
          </div>

          <div
            style={{
              background: pastel.panelLilac,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 26,
              boxShadow: pastel.shadow,
            }}
          >
            <h3
              style={{
                fontSize: 30,
                marginTop: 0,
                marginBottom: 14,
                color: pastel.title,
              }}
            >
              Key Vocabulary
            </h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {selectedLesson.vocab.map((word) => (
                <span
                  key={word}
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: `1px solid ${pastel.border}`,
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontSize: 17,
                    fontWeight: 700,
                    color: pastel.title,
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
