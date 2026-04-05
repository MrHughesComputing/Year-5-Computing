"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Code2,
  GraduationCap,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Monitor,
  RefreshCcw,
  School,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCog,
  Users,
} from "lucide-react";

type Question = {
  prompt: string;
  options: string[];
  answer: number;
};

type Lesson = {
  id: string;
  term: string;
  week: number;
  title: string;
  shortTitle: string;
  focus: string;
  outcome: string;
  vocab: string[];
  starter: string;
  model: string;
  guided: string;
  challenge: string;
  exitTicket: string;
  scratchHint: string;
  teacherNote: string;
  questions: Question[];
};

type QuizResultMap = Record<string, { score: number; total: number; passed: boolean; completedAt: string }>;

type StringMap = Record<string, string>;

type BoolMap = Record<string, boolean>;

const APP_VERSION = "1.0.0";
const TEACHER_CODE = process.env.NEXT_PUBLIC_TEACHER_CODE || "APSR-Y5";

const lessons: Lesson[] = [
  {
    id: "st1w1",
    term: "Summer Term 1",
    week: 1,
    title: "Conditions",
    shortTitle: "Intro to Conditions",
    focus: "Understanding conditions in Scratch",
    outcome: "I can explain that a condition can be true or false.",
    vocab: ["condition", "true", "false", "decision"],
    starter: "Think about real life decisions: If it rains, what happens next?",
    model: "Look at Scratch condition blocks and test when something is true or false.",
    guided: "Try simple true/false checks with a partner.",
    challenge: "Change the condition so the action happens in a different situation.",
    exitTicket: "A condition in code can only be true or false.",
    scratchHint: "Create a sprite action that only happens when one rule is true.",
    teacherNote: "Keep the language concrete. Use physical examples before moving into Scratch.",
    questions: [
      { prompt: "A condition is...", options: ["A picture", "A decision check", "A type of sprite"], answer: 1 },
      { prompt: "True or false: A condition helps code decide what to do.", options: ["True", "False"], answer: 0 },
    ],
  },
  {
    id: "st1w2",
    term: "Summer Term 1",
    week: 2,
    title: "If... Then...",
    shortTitle: "Single Outcome Selection",
    focus: "Using if... then... in Scratch",
    outcome: "I can use an if... then... block to make a simple decision.",
    vocab: ["if", "then", "selection", "action"],
    starter: "What should happen if the sprite touches the edge?",
    model: "Build a short script where one condition triggers one action.",
    guided: "Copy a basic if... then... program and test it.",
    challenge: "Swap the condition or action and predict the result.",
    exitTicket: "An if... then... block only runs the code when the condition is true.",
    scratchHint: "Try making a sprite speak only when it touches a colour or edge.",
    teacherNote: "Model the difference between code that always runs and code that only runs when a condition is met.",
    questions: [
      { prompt: "What happens if the condition is false in an if... then... block?", options: ["The action runs", "Nothing inside the block runs", "Scratch crashes"], answer: 1 },
      { prompt: "Which word means making a decision in code?", options: ["Loop", "Selection", "Variable"], answer: 1 },
    ],
  },
  {
    id: "st1w3",
    term: "Summer Term 1",
    week: 3,
    title: "If... Then... Else...",
    shortTitle: "Branching",
    focus: "Using two outcomes in Scratch",
    outcome: "I can create code with two different outcomes.",
    vocab: ["branch", "outcome", "else", "selection"],
    starter: "If the answer is right, what should happen? If it is wrong, what should happen?",
    model: "Demonstrate one path for true and another path for false.",
    guided: "Build a simple quiz question with correct and incorrect responses.",
    challenge: "Improve the feedback so each outcome is clearer.",
    exitTicket: "If... then... else... lets a program choose between two outcomes.",
    scratchHint: "Use different sounds or messages for correct and incorrect answers.",
    teacherNote: "Keep returning to the phrase: one condition, two possible outcomes.",
    questions: [
      { prompt: "Why is else useful?", options: ["It gives a second outcome", "It makes sprites bigger", "It repeats code"], answer: 0 },
      { prompt: "A program that gives one message for correct and another for incorrect is using...", options: ["branching", "drawing", "timers"], answer: 0 },
    ],
  },
  {
    id: "st1w4",
    term: "Summer Term 1",
    week: 4,
    title: "Selection + Loops",
    shortTitle: "Continuous Checking",
    focus: "Using selection inside repetition",
    outcome: "I can explain how a program keeps checking for an event.",
    vocab: ["loop", "repeat", "forever", "check"],
    starter: "How does a game keep noticing a key press?",
    model: "Show a forever loop that repeatedly checks a condition.",
    guided: "Create a script that responds while the program is running.",
    challenge: "Add a second response inside the loop.",
    exitTicket: "A loop can keep checking a condition again and again.",
    scratchHint: "Make a sprite keep checking for a key press, collision, or colour touch.",
    teacherNote: "Pupils often think one check is enough. Emphasise live checking during the whole program.",
    questions: [
      { prompt: "Why put a condition inside a forever loop?", options: ["To keep checking it", "To delete the sprite", "To slow the computer"], answer: 0 },
      { prompt: "Which block is best for continuous checking?", options: ["Forever", "Say", "Go to x:y"], answer: 0 },
    ],
  },
  {
    id: "st1w5",
    term: "Summer Term 1",
    week: 5,
    title: "Asking Questions",
    shortTitle: "Input + Decisions",
    focus: "Using ask/answer with conditions",
    outcome: "I can use a player's answer inside a condition.",
    vocab: ["input", "answer", "question", "response"],
    starter: "How can a computer ask a user a question?",
    model: "Use ask and answer, then compare the answer in an if statement.",
    guided: "Make one interactive question in Scratch.",
    challenge: "Accept more than one correct answer or improve the feedback.",
    exitTicket: "The answer block stores what the user typed.",
    scratchHint: "Use a single question first, then compare the answer to the correct response.",
    teacherNote: "Model exact matching clearly and discuss what happens if the user types something unexpected.",
    questions: [
      { prompt: "What does the answer block contain?", options: ["The last thing the user typed", "A random number", "The sprite name"], answer: 0 },
      { prompt: "The ask block is useful because it makes a program...", options: ["interactive", "invisible", "quieter"], answer: 0 },
    ],
  },
  {
    id: "st1w6",
    term: "Summer Term 1",
    week: 6,
    title: "Designing a Quiz",
    shortTitle: "Planning Logic",
    focus: "Planning a Scratch quiz before coding",
    outcome: "I can plan the steps and decisions for a quiz program.",
    vocab: ["algorithm", "plan", "flowchart", "sequence"],
    starter: "Why is planning useful before coding?",
    model: "Map one question, one answer, and one decision using a simple flowchart.",
    guided: "Plan a short quiz with at least two questions.",
    challenge: "Plan a score system or better user journey.",
    exitTicket: "A flowchart helps show the logic of a program before coding.",
    scratchHint: "Plan every question before opening Scratch.",
    teacherNote: "Insist on planning first. This lesson should reduce weaker code structure in the project phase.",
    questions: [
      { prompt: "A flowchart helps you...", options: ["plan the logic", "draw better sprites", "record sound"], answer: 0 },
      { prompt: "An algorithm is...", options: ["a step-by-step set of instructions", "a game character", "a background"], answer: 0 },
    ],
  },
  {
    id: "st1w7",
    term: "Summer Term 1",
    week: 7,
    title: "Debugging",
    shortTitle: "Fixing Logic",
    focus: "Finding and fixing errors in selection code",
    outcome: "I can test a program and fix logic mistakes.",
    vocab: ["debug", "error", "test", "fix"],
    starter: "What should you do if your quiz gives the wrong message?",
    model: "Show a broken condition, test it, then fix it.",
    guided: "Use a checklist to test and improve a script.",
    challenge: "Find two different bugs and explain what went wrong.",
    exitTicket: "Debugging means finding and fixing mistakes in code.",
    scratchHint: "Test every path: correct answer, wrong answer, and unusual answer.",
    teacherNote: "Reward careful testing language, not just correct final answers.",
    questions: [
      { prompt: "Debugging means...", options: ["adding a sprite", "finding and fixing mistakes", "making a background"], answer: 1 },
      { prompt: "What should you do first when something is wrong?", options: ["Test it carefully", "Delete everything", "Ignore it"], answer: 0 },
    ],
  },
  {
    id: "st2w1",
    term: "Summer Term 2",
    week: 1,
    title: "Build a Quiz",
    shortTitle: "First Working Question",
    focus: "Creating the first question in a quiz",
    outcome: "I can build a working quiz question using input and selection.",
    vocab: ["quiz", "input", "condition", "feedback"],
    starter: "What makes a quiz feel interactive?",
    model: "Build one full question from ask to outcome.",
    guided: "Create one question with correct and incorrect feedback.",
    challenge: "Add sound, score, or better wording.",
    exitTicket: "A working quiz question needs a question, an answer, and a decision.",
    scratchHint: "Start with one excellent question before expanding the project.",
    teacherNote: "Do not let pupils rush to multiple questions before one question works cleanly.",
    questions: [
      { prompt: "Which parts are needed for a quiz question?", options: ["Question, answer, decision", "Only a sprite", "Only a backdrop"], answer: 0 },
      { prompt: "Feedback in a quiz helps the user...", options: ["understand the result", "change the computer", "close Scratch"], answer: 0 },
    ],
  },
  {
    id: "st2w2",
    term: "Summer Term 2",
    week: 2,
    title: "Expand the Quiz",
    shortTitle: "Multiple Questions",
    focus: "Adding more questions and structure",
    outcome: "I can extend my quiz to include multiple questions.",
    vocab: ["extend", "structure", "score", "sequence"],
    starter: "How can you make a quiz feel more complete?",
    model: "Show how to repeat the question-answer-feedback pattern.",
    guided: "Add at least one more question to the quiz.",
    challenge: "Add a score or a final message.",
    exitTicket: "A longer quiz repeats the same logic structure clearly.",
    scratchHint: "Copy only what is needed. Keep the code organised.",
    teacherNote: "Focus on structure and readability, not just adding more content.",
    questions: [
      { prompt: "What helps when adding more questions?", options: ["Keeping a clear structure", "Changing everything each time", "Removing feedback"], answer: 0 },
      { prompt: "A score can help users...", options: ["see how well they did", "rename sprites", "move the stage"], answer: 0 },
    ],
  },
  {
    id: "st2w3",
    term: "Summer Term 2",
    week: 3,
    title: "Testing and Improving",
    shortTitle: "Refining Accuracy",
    focus: "Checking quiz logic and improving reliability",
    outcome: "I can test my project and improve weak areas.",
    vocab: ["test", "improve", "logic", "edge case"],
    starter: "What if someone types the answer differently?",
    model: "Test several answers and spot where the logic breaks.",
    guided: "Use a testing table to check each question.",
    challenge: "Improve the quiz so it handles tricky answers better.",
    exitTicket: "Testing helps make a project more reliable.",
    scratchHint: "Ask a partner to try to break your quiz.",
    teacherNote: "This lesson should feel like quality assurance rather than extra decoration.",
    questions: [
      { prompt: "Why test more than once?", options: ["To check different situations", "To make the screen brighter", "To add more sprites"], answer: 0 },
      { prompt: "An edge case is...", options: ["a tricky or unusual situation", "the edge of the stage", "a drawing tool"], answer: 0 },
    ],
  },
  {
    id: "st2w4",
    term: "Summer Term 2",
    week: 4,
    title: "Enhancing the Program",
    shortTitle: "Better User Experience",
    focus: "Improving the design and feedback of the quiz",
    outcome: "I can improve my project to make it clearer and more enjoyable.",
    vocab: ["enhance", "design", "user experience", "feedback"],
    starter: "What makes an app easy and enjoyable to use?",
    model: "Add better feedback, cleaner screens, and a stronger ending.",
    guided: "Improve text, sounds, layout, and responses.",
    challenge: "Add polished features without breaking the logic.",
    exitTicket: "Good design helps users understand and enjoy a program.",
    scratchHint: "Make the instructions and final result screen very clear.",
    teacherNote: "Push clarity, simplicity, and audience awareness.",
    questions: [
      { prompt: "User experience means...", options: ["how the app feels to use", "how long the code is", "how big the sprite is"], answer: 0 },
      { prompt: "A stronger ending in a quiz can...", options: ["make it feel complete", "remove the score", "hide the questions"], answer: 0 },
    ],
  },
  {
    id: "st2w5",
    term: "Summer Term 2",
    week: 5,
    title: "Consolidation",
    shortTitle: "Final Project Review",
    focus: "Finishing, reviewing, and evaluating the quiz",
    outcome: "I can complete my quiz and reflect on what I learned.",
    vocab: ["evaluate", "review", "complete", "reflect"],
    starter: "What are you most proud of in your project?",
    model: "Review a completed example and discuss what makes it successful.",
    guided: "Finish the project and use a checklist for review.",
    challenge: "Write a short evaluation with one strength and one next step.",
    exitTicket: "Evaluation helps us recognise strengths and improve next time.",
    scratchHint: "Use your checklist before saying your project is finished.",
    teacherNote: "Build in time for pupil reflection and self-evaluation.",
    questions: [
      { prompt: "Evaluation means...", options: ["thinking about how well something worked", "starting again", "copying code"], answer: 0 },
      { prompt: "A useful reflection includes...", options: ["a strength and a next step", "only colours", "a new sprite name"], answer: 0 },
    ],
  },
];

const teacherResources = [
  {
    title: "Delivery Model",
    summary: "Predict → Model → Copy → Modify → Explain",
    detail:
      "Use direct modelling, limited cognitive load, and rapid retrieval. Keep the coding visible and narrate why decisions are being made.",
  },
  {
    title: "Assessment Focus",
    summary: "Do pupils understand selection, not just copy blocks?",
    detail:
      "Look for explanation, accurate testing, and whether pupils can describe why code follows one path and not another.",
  },
  {
    title: "Differentiation",
    summary: "Support, core, and stretch already built in",
    detail:
      "Support with pre-built conditions and flowcharts. Stretch with score systems, nested logic, and stronger UX.",
  },
  {
    title: "Project Outcome",
    summary: "A debugged multi-question Scratch quiz",
    detail:
      "The end product should show input, selection, accurate feedback, and signs of testing and refinement.",
  },
];

const deploymentChecklist = [
  "Host on Vercel for the simplest no-code deployment route",
  "Use an optional custom domain such as computing.apsr.school later",
  "Replace the demo teacher code with real secure authentication before full rollout",
  "Connect pupil and class data to Supabase or Firebase if you want central tracking",
  "Add school logo, colours, and policy links",
  "Add Scratch project links or embedded exemplar projects",
  "Test on student devices and classroom browsers before launch",
];

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      setValue(saved ? (JSON.parse(saved) as T) : defaultValue);
    } catch {
      setValue(defaultValue);
    } finally {
      setIsReady(true);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage failures
    }
  }, [isReady, key, value]);

  return [value, setValue] as const;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pb-3 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-semibold tracking-tight text-slate-900 ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-1 text-sm text-slate-500 ${className}`}>{children}</p>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

function Button({
  children,
  onClick,
  variant = "default",
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  const styles = {
    default: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
    outline: "bg-white text-slate-900 hover:bg-slate-50 border-slate-300",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ${className}`}>{children}</span>;
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-slate-900 ${props.className || ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 ${props.className || ""}`} />;
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-900"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function LessonQuiz({ lessonId, questions, quizResults, setQuizResults }: {
  lessonId: string;
  questions: Question[];
  quizResults: QuizResultMap;
  setQuizResults: (value: QuizResultMap) => void;
}) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, q, index) => total + (selected[index] === q.answer ? 1 : 0), 0);

  const submitQuiz = () => {
    setSubmitted(true);
    setQuizResults({
      ...quizResults,
      [lessonId]: {
        score,
        total: questions.length,
        passed: score === questions.length,
        completedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <Card key={index} className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Question {index + 1}</CardTitle>
            <CardDescription>{q.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {q.options.map((option, optionIndex) => {
              const picked = selected[index] === optionIndex;
              const isCorrect = submitted && q.answer === optionIndex;
              const isWrong = submitted && picked && q.answer !== optionIndex;

              return (
                <button
                  key={optionIndex}
                  onClick={() => setSelected({ ...selected, [index]: optionIndex })}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : isWrong
                      ? "border-rose-500 bg-rose-50"
                      : picked
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={submitQuiz}>Check my answers</Button>
        {submitted && <Badge>Score: {score}/{questions.length}</Badge>}
      </div>
    </div>
  );
}

function HomePage({ onEnterStudent, onEnterTeacher }: { onEnterStudent: () => void; onEnterTeacher: () => void }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-xl">
          <CardContent className="p-8 md:p-10">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-200">
              <School className="h-4 w-4" /> APSR Computing Platform
            </div>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">Year 5 Selection in Scratch</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              A deployable browser-based app for school use. Pupils can learn, revisit key vocabulary, complete checks, and track progress. Teachers can use the delivery area, planning notes, and deployment guidance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onEnterStudent} className="bg-white text-slate-900 hover:bg-slate-100 border-white">
                <GraduationCap className="mr-2 h-4 w-4" /> Pupil dashboard
              </Button>
              <Button onClick={onEnterTeacher} variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <UserCog className="mr-2 h-4 w-4" /> Teacher area
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard icon={<LayoutDashboard className="h-5 w-5" />} title="Pupil Experience" text="Lesson navigation, notes, vocabulary support, and built-in knowledge checks." />
        <FeatureCard icon={<ClipboardCheck className="h-5 w-5" />} title="Teacher Oversight" text="Lesson notes, teaching framework, and demo class controls." />
        <FeatureCard icon={<Monitor className="h-5 w-5" />} title="Deployment Ready" text="Prepared for no-code Vercel deployment and later school expansion." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">{icon}{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">{text}</CardContent>
    </Card>
  );
}

function PupilDashboard({
  selectedTerm,
  setSelectedTerm,
  selectedLessonId,
  setSelectedLessonId,
  search,
  setSearch,
  filteredLessons,
  selectedLesson,
  completedLessons,
  toggleComplete,
  notes,
  setNotes,
  quizResults,
  setQuizResults,
  progressValue,
  currentTermStats,
}: {
  selectedTerm: string;
  setSelectedTerm: (value: string) => void;
  selectedLessonId: string;
  setSelectedLessonId: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  filteredLessons: Lesson[];
  selectedLesson: Lesson;
  completedLessons: BoolMap;
  toggleComplete: (id: string) => void;
  notes: StringMap;
  setNotes: (value: StringMap) => void;
  quizResults: QuizResultMap;
  setQuizResults: (value: QuizResultMap) => void;
  progressValue: number;
  currentTermStats: { done: number; total: number; percent: number };
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="h-5 w-5" /> Lesson Navigation</CardTitle>
            <CardDescription>Select a term, search, and open a lesson.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              {['Summer Term 1', 'Summer Term 2'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${selectedTerm === term ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                >
                  {term === 'Summer Term 1' ? 'Term 1' : 'Term 2'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons or vocabulary" className="pl-9" />
            </div>
            <div className="space-y-2">
              {filteredLessons.map((lesson) => {
                const complete = completedLessons[lesson.id];
                const active = selectedLessonId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide opacity-70">Week {lesson.week}</div>
                        <div className="font-semibold">{lesson.title}</div>
                      </div>
                      {complete ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="h-5 w-5 shrink-0 opacity-50" />}
                    </div>
                    <div className={`text-sm ${active ? 'text-slate-200' : 'text-slate-500'}`}>{lesson.shortTitle}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="h-5 w-5" /> Safe Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Do not share personal information in your project.</p>
            <p>Be respectful when testing and reviewing work.</p>
            <p>Check your code carefully before sharing it.</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-200">Pupil dashboard</div>
                <h2 className="mt-1 text-2xl font-bold text-white">Track your Year 5 computing journey</h2>
              </div>
              <div className="min-w-[220px]">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                  <span>Overall progress</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} />
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={selectedLesson.id}>
          <Card>
            <CardHeader>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge>{selectedLesson.term}</Badge>
                <Badge>Week {selectedLesson.week}</Badge>
                {quizResults[selectedLesson.id]?.passed && <Badge>Knowledge check passed</Badge>}
              </div>
              <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
              <CardDescription className="text-base">{selectedLesson.focus}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard title="Learning Outcome" value={selectedLesson.outcome} />
                <InfoCard title="Starter" value={selectedLesson.starter} />
                <InfoCard title="Scratch Hint" value={selectedLesson.scratchHint} />
                <InfoCard title="Exit Ticket" value={selectedLesson.exitTicket} />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
                <div className="space-y-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Code2 className="h-5 w-5" /> Lesson Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm text-slate-700">
                      <LessonStep label="Start" text={selectedLesson.starter} />
                      <LessonStep label="Teacher Model" text={selectedLesson.model} />
                      <LessonStep label="Guided Practice" text={selectedLesson.guided} />
                      <LessonStep label="Challenge" text={selectedLesson.challenge} />
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5" /> Knowledge Check</CardTitle>
                      <CardDescription>Complete the short quiz to check your understanding.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LessonQuiz lessonId={selectedLesson.id} questions={selectedLesson.questions} quizResults={quizResults} setQuizResults={setQuizResults} />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Key Vocabulary</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {selectedLesson.vocab.map((word) => (
                        <Badge key={word}>{word}</Badge>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">My Notes</CardTitle>
                      <CardDescription>Record ideas, code plans, or reflections here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        value={notes[selectedLesson.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [selectedLesson.id]: e.target.value })}
                        placeholder="Write your ideas here..."
                        className="min-h-[180px]"
                      />
                      <Button variant={completedLessons[selectedLesson.id] ? "secondary" : "default"} onClick={() => toggleComplete(selectedLesson.id)} className="w-full">
                        {completedLessons[selectedLesson.id] ? "Mark as not complete" : "Mark lesson complete"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl bg-slate-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Current Term Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{selectedTerm}</span>
                        <span>{currentTermStats.done}/{currentTermStats.total}</span>
                      </div>
                      <Progress value={currentTermStats.percent} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function TeacherArea({ teacherUnlocked, setTeacherUnlocked, selectedLesson, theme, setTheme }: {
  teacherUnlocked: boolean;
  setTeacherUnlocked: (value: boolean) => void;
  selectedLesson: Lesson;
  theme: string;
  setTheme: (value: string) => void;
}) {
  const [teacherCodeInput, setTeacherCodeInput] = useState("");
  const [message, setMessage] = useState("");
  const [demoTracking, setDemoTracking] = useLocalStorage("y5-demo-class-settings", {
    allowNotes: true,
    allowQuizRetakes: true,
    showScratchHints: true,
    className: "Year 5A",
  });

  const unlockTeacher = () => {
    if (teacherCodeInput === TEACHER_CODE) {
      setTeacherUnlocked(true);
      setMessage("Teacher area unlocked.");
    } else {
      setMessage("Incorrect teacher access code.");
    }
  };

  const toggle = (key: "allowNotes" | "allowQuizRetakes" | "showScratchHints") => {
    setDemoTracking({ ...demoTracking, [key]: !demoTracking[key] });
  };

  return (
    <div className="space-y-6">
      {!teacherUnlocked ? (
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Lock className="h-5 w-5" /> Teacher access</CardTitle>
            <CardDescription>This uses a simple demo access code. Replace it with secure authentication before full rollout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Teacher code</label>
              <Input type="password" value={teacherCodeInput} onChange={(e) => setTeacherCodeInput(e.target.value)} placeholder="Enter access code" />
            </div>
            <Button onClick={unlockTeacher} className="w-full">Open teacher area</Button>
            {message && <p className="text-sm text-slate-600">{message}</p>}
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
              Demo access code for this prototype: <span className="font-semibold">{TEACHER_CODE}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-0 bg-gradient-to-r from-indigo-900 to-slate-800 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-indigo-100">Teacher area</div>
                  <h2 className="mt-1 text-2xl font-bold text-white">Curriculum delivery and rollout controls</h2>
                </div>
                <Button variant="outline" onClick={() => setTeacherUnlocked(false)} className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <LogOut className="mr-2 h-4 w-4" /> Lock teacher area
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Selected lesson teacher brief</CardTitle>
                  <CardDescription>{selectedLesson.term} • Week {selectedLesson.week}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700">
                  <TeacherField label="Lesson" value={selectedLesson.title} />
                  <TeacherField label="Focus" value={selectedLesson.focus} />
                  <TeacherField label="Teacher note" value={selectedLesson.teacherNote} />
                  <TeacherField label="Challenge direction" value={selectedLesson.challenge} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Teaching framework</CardTitle>
                  <CardDescription>Ready for specialist or non-specialist delivery.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {teacherResources.map((resource) => (
                    <div key={resource.title} className="rounded-2xl border border-slate-200 p-4">
                      <div className="font-semibold text-slate-900">{resource.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{resource.summary}</div>
                      <div className="mt-2 text-sm text-slate-500">{resource.detail}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Deployment setup</CardTitle>
                  <CardDescription>Production handover checklist for school rollout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deploymentChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl"><Settings className="h-5 w-5" /> Demo class settings</CardTitle>
                  <CardDescription>Prototype controls for a future admin system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Class name</label>
                    <Input value={demoTracking.className} onChange={(e) => setDemoTracking({ ...demoTracking, className: e.target.value })} />
                  </div>
                  <ToggleRow label="Allow pupil notes" checked={demoTracking.allowNotes} onChange={() => toggle("allowNotes")} />
                  <ToggleRow label="Allow quiz retakes" checked={demoTracking.allowQuizRetakes} onChange={() => toggle("allowQuizRetakes")} />
                  <ToggleRow label="Show Scratch hints" checked={demoTracking.showScratchHints} onChange={() => toggle("showScratchHints")} />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Visual theme</label>
                    <Select value={theme} onChange={setTheme} options={["slate", "indigo", "emerald"]} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recommended production stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <StackRow label="Frontend" value="Next.js + Tailwind" />
                  <StackRow label="Hosting" value="Vercel" />
                  <StackRow label="Authentication" value="Microsoft Entra ID, Clerk, or Auth.js" />
                  <StackRow label="Database" value="Supabase or Firebase" />
                  <StackRow label="File storage" value="Supabase Storage, OneDrive, or SharePoint" />
                  <StackRow label="Analytics" value="Plausible, PostHog, or Microsoft Clarity" />
                  <StackRow label="School integrations" value="Microsoft 365 and SharePoint-ready" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Release notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold">Version {APP_VERSION}</div>
                    <div className="mt-1 text-slate-600">Deployable Next.js project with home page, pupil dashboard, teacher area, and no-code deployment path.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TeacherField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-semibold text-slate-900">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="rounded-2xl bg-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">{value}</CardContent>
    </Card>
  );
}

function LessonStep({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
      <span className="font-semibold">{label}:</span> {text}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <span className={`inline-flex h-6 w-12 items-center rounded-full p-1 transition ${checked ? 'bg-slate-900' : 'bg-slate-300'}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </span>
    </button>
  );
}

function StackRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
      <span className="font-medium text-slate-900">{label}</span>
      <span className="text-right text-slate-600">{value}</span>
    </div>
  );
}

export default function Page() {
  const [page, setPage] = useState<"home" | "pupil" | "teacher">("home");
  const [selectedTerm, setSelectedTerm] = useState("Summer Term 1");
  const [selectedLessonId, setSelectedLessonId] = useState("st1w1");
  const [search, setSearch] = useState("");
  const [teacherUnlocked, setTeacherUnlocked] = useLocalStorage<boolean>("y5-teacher-unlocked", false);
  const [completedLessons, setCompletedLessons] = useLocalStorage<BoolMap>("y5-selection-completed", {});
  const [quizResults, setQuizResults] = useLocalStorage<QuizResultMap>("y5-selection-quiz-results", {});
  const [notes, setNotes] = useLocalStorage<StringMap>("y5-selection-notes", {});
  const [theme, setTheme] = useLocalStorage<string>("y5-app-theme", "slate");

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const inTerm = lesson.term === selectedTerm;
      const query = search.toLowerCase().trim();
      const matches = !query || lesson.title.toLowerCase().includes(query) || lesson.focus.toLowerCase().includes(query) || lesson.vocab.some((v) => v.toLowerCase().includes(query));
      return inTerm && matches;
    });
  }, [selectedTerm, search]);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  useEffect(() => {
    const exists = filteredLessons.some((lesson) => lesson.id === selectedLessonId);
    if (!exists && filteredLessons[0]) setSelectedLessonId(filteredLessons[0].id);
  }, [filteredLessons, selectedLessonId]);

  const totalLessons = lessons.length;
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressValue = Math.round((completedCount / totalLessons) * 100);

  const currentTermStats = useMemo(() => {
    const termLessons = lessons.filter((lesson) => lesson.term === selectedTerm);
    const done = termLessons.filter((lesson) => completedLessons[lesson.id]).length;
    return { total: termLessons.length, done, percent: Math.round((done / termLessons.length) * 100) };
  }, [completedLessons, selectedTerm]);

  const toggleComplete = (id: string) => {
    setCompletedLessons({ ...completedLessons, [id]: !completedLessons[id] });
  };

  const resetAllProgress = () => {
    setCompletedLessons({});
    setQuizResults({});
    setNotes({});
  };

  const themeClasses: Record<string, string> = {
    slate: "bg-slate-50 text-slate-900",
    indigo: "bg-indigo-50 text-slate-900",
    emerald: "bg-emerald-50 text-slate-900",
  };

  return (
    <main className={`min-h-screen ${themeClasses[theme] || themeClasses.slate}`}>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Deployable Next.js build</div>
              <div className="text-xl font-bold text-slate-900">APSR Year 5 Computing App</div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Button variant={page === "home" ? "default" : "outline"} onClick={() => setPage("home")}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button variant={page === "pupil" ? "default" : "outline"} onClick={() => setPage("pupil")}>
              <GraduationCap className="mr-2 h-4 w-4" /> Pupil dashboard
            </Button>
            <Button variant={page === "teacher" ? "default" : "outline"} onClick={() => setPage("teacher")}>
              <Users className="mr-2 h-4 w-4" /> Teacher area
            </Button>
            <Button variant="outline" onClick={resetAllProgress}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset demo data
            </Button>
          </nav>
        </header>

        {page === "home" && <HomePage onEnterStudent={() => setPage("pupil")} onEnterTeacher={() => setPage("teacher")} />}

        {page === "pupil" && (
          <PupilDashboard
            selectedTerm={selectedTerm}
            setSelectedTerm={setSelectedTerm}
            selectedLessonId={selectedLessonId}
            setSelectedLessonId={setSelectedLessonId}
            search={search}
            setSearch={setSearch}
            filteredLessons={filteredLessons}
            selectedLesson={selectedLesson}
            completedLessons={completedLessons}
            toggleComplete={toggleComplete}
            notes={notes}
            setNotes={setNotes}
            quizResults={quizResults}
            setQuizResults={setQuizResults}
            progressValue={progressValue}
            currentTermStats={currentTermStats}
          />
        )}

        {page === "teacher" && (
          <TeacherArea
            teacherUnlocked={teacherUnlocked}
            setTeacherUnlocked={setTeacherUnlocked}
            selectedLesson={selectedLesson}
            theme={theme}
            setTheme={setTheme}
          />
        )}

        <footer className="mt-8 text-center text-sm text-slate-500">
          Version {APP_VERSION} • Built for browser access in school
        </footer>
      </div>
    </main>
  );
}
