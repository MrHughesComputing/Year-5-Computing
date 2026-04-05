"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  ExternalLink,
  GraduationCap,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Monitor,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import { lessons, teacherResources, type Lesson } from "@/lib/lessons";

type QuizResultMap = Record<string, { score: number; total: number; passed: boolean; completedAt: string }>;
type StringMap = Record<string, string>;
type BoolMap = Record<string, boolean>;

type DemoAnalyticsUser = {
  name: string;
  role: "pupil" | "teacher";
  completionRate: number;
  averageScore: number;
};

const APP_VERSION = "2.0.0";
const teacherCode = process.env.NEXT_PUBLIC_TEACHER_CODE || "APSR-Y5";
const enableMicrosoftLogin = process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_LOGIN === "true";
const schoolDomain = process.env.NEXT_PUBLIC_SCHOOL_DOMAIN || "school.local";

const demoClass: DemoAnalyticsUser[] = [
  { name: "Aisha", role: "pupil", completionRate: 92, averageScore: 88 },
  { name: "Omar", role: "pupil", completionRate: 83, averageScore: 79 },
  { name: "Layla", role: "pupil", completionRate: 100, averageScore: 95 },
  { name: "Yusuf", role: "pupil", completionRate: 67, averageScore: 71 },
  { name: "Miss Patel", role: "teacher", completionRate: 100, averageScore: 100 },
];

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      setValue(defaultValue);
    }
  }, [defaultValue, key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function DemoLoginCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"pupil" | "teacher">("pupil");

  const handleDemoLogin = async () => {
    await signIn("credentials", {
      name: name || (role === "teacher" ? "Teacher User" : "Pupil User"),
      email: email || (role === "teacher" ? `teacher@${schoolDomain}` : `pupil@${schoolDomain}`),
      role,
      redirect: false,
    });
  };

  return (
    <div className="grid gap-3 rounded-3xl border bg-white p-5 shadow-sm">
      <div>
        <div className="text-lg font-semibold">Sign in</div>
        <div className="mt-1 text-sm text-slate-600">Use demo access now, and optionally enable real Microsoft 365 login in Vercel later.</div>
      </div>
      {enableMicrosoftLogin ? (
        <button
          onClick={() => signIn("azure-ad")}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium hover:bg-slate-100"
        >
          Continue with Microsoft 365
        </button>
      ) : (
        <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
          Microsoft 365 login is scaffolded in this version. Enable it by adding the Azure/Entra environment variables listed in the README and set <span className="font-semibold">NEXT_PUBLIC_ENABLE_MICROSOFT_LOGIN=true</span>.
        </div>
      )}
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-2xl border px-3 py-3" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`Email (e.g. pupil@${schoolDomain})`} className="rounded-2xl border px-3 py-3" />
      <select value={role} onChange={(e) => setRole(e.target.value as "pupil" | "teacher")} className="rounded-2xl border px-3 py-3">
        <option value="pupil">Pupil demo login</option>
        <option value="teacher">Teacher demo login</option>
      </select>
      <button onClick={handleDemoLogin} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">
        Continue with demo access
      </button>
      <div className="text-xs text-slate-500">Teacher code fallback for protected teacher tools: {teacherCode}</div>
    </div>
  );
}

function LessonQuiz({ lessonId, questions, quizResults, setQuizResults }: { lessonId: string; questions: Lesson["questions"]; quizResults: QuizResultMap; setQuizResults: (value: QuizResultMap) => void; }) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.reduce((total, q, index) => total + (selected[index] === q.answer ? 1 : 0), 0);

  const submitQuiz = () => {
    setSubmitted(true);
    setQuizResults({
      ...quizResults,
      [lessonId]: { score, total: questions.length, passed: score === questions.length, completedAt: new Date().toISOString() },
    });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={index} className="rounded-2xl border p-4">
          <div className="font-medium">Question {index + 1}</div>
          <div className="mt-1 text-sm text-slate-600">{q.prompt}</div>
          <div className="mt-3 grid gap-2">
            {q.options.map((option, optionIndex) => {
              const picked = selected[index] === optionIndex;
              const isCorrect = submitted && q.answer === optionIndex;
              const isWrong = submitted && picked && q.answer !== optionIndex;
              return (
                <button
                  key={optionIndex}
                  onClick={() => setSelected({ ...selected, [index]: optionIndex })}
                  className={`rounded-xl border p-3 text-left text-sm ${isCorrect ? "border-emerald-500 bg-emerald-50" : isWrong ? "border-rose-500 bg-rose-50" : picked ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <button onClick={submitQuiz} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">Check my answers</button>
        {submitted && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">Score: {score}/{questions.length}</div>}
      </div>
    </div>
  );
}

function LessonView({
  lesson,
  selectedTerm,
  termProgress,
  notes,
  setNotes,
  completedLessons,
  setCompletedLessons,
  quizResults,
  setQuizResults,
}: {
  lesson: Lesson;
  selectedTerm: string;
  termProgress: { done: number; total: number; percent: number };
  notes: StringMap;
  setNotes: (value: StringMap) => void;
  completedLessons: BoolMap;
  setCompletedLessons: (value: BoolMap) => void;
  quizResults: QuizResultMap;
  setQuizResults: (value: QuizResultMap) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.term}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">Week {lesson.week}</span>
          {quizResults[lesson.id]?.passed && <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Knowledge check passed</span>}
        </div>
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <p className="mt-2 text-slate-600">{lesson.focus}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Learning outcome" value={lesson.outcome} />
          <InfoCard title="Starter" value={lesson.starter} />
          <InfoCard title="Scratch hint" value={lesson.scratchHint} />
          <InfoCard title="Exit ticket" value={lesson.exitTicket} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <Panel title="Lesson flow" icon={<BookOpen className="h-5 w-5" />}>
              <LessonStep label="Teacher model" text={lesson.model} />
              <LessonStep label="Guided practice" text={lesson.guided} />
              <LessonStep label="Challenge" text={lesson.challenge} />
            </Panel>

            <Panel title="Scratch projects" icon={<Monitor className="h-5 w-5" />}>
              <div className="grid gap-3 md:grid-cols-2">
                <a href={lesson.scratchEditorUrl} target="_blank" rel="noreferrer" className="rounded-2xl border p-4 hover:bg-slate-50">
                  <div className="font-medium">Open Scratch editor</div>
                  <div className="mt-1 text-sm text-slate-600">Launch straight into Scratch for this lesson.</div>
                </a>
                <a href={lesson.scratchStarterUrl} target="_blank" rel="noreferrer" className="rounded-2xl border p-4 hover:bg-slate-50">
                  <div className="font-medium">Starter project / studio</div>
                  <div className="mt-1 text-sm text-slate-600">Replace this placeholder with your own studio or starter project link.</div>
                </a>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border bg-slate-50">
                <iframe src={lesson.scratchEmbedUrl} title={`${lesson.title} Scratch embed`} className="h-[320px] w-full" allowFullScreen />
              </div>
              <div className="mt-2 text-xs text-slate-500">The embedded Scratch example is a placeholder. Update lesson URLs with your own school project links when ready.</div>
            </Panel>

            <Panel title="Knowledge check" icon={<Brain className="h-5 w-5" />}>
              <LessonQuiz lessonId={lesson.id} questions={lesson.questions} quizResults={quizResults} setQuizResults={setQuizResults} />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Vocabulary">
              <div className="flex flex-wrap gap-2">
                {lesson.vocab.map((word) => (
                  <span key={word} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{word}</span>
                ))}
              </div>
            </Panel>
            <Panel title="My notes">
              <textarea
                value={notes[lesson.id] || ""}
                onChange={(e) => setNotes({ ...notes, [lesson.id]: e.target.value })}
                placeholder="Write your ideas here..."
                className="min-h-[180px] w-full rounded-2xl border p-3"
              />
              <button
                onClick={() => setCompletedLessons({ ...completedLessons, [lesson.id]: !completedLessons[lesson.id] })}
                className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                {completedLessons[lesson.id] ? "Mark lesson not complete" : "Mark lesson complete"}
              </button>
            </Panel>
            <Panel title="Current term progress">
              <div className="flex items-center justify-between text-sm">
                <span>{selectedTerm}</span>
                <span>{termProgress.done}/{termProgress.total}</span>
              </div>
              <ProgressBar value={termProgress.percent} />
            </Panel>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TeacherAnalytics({ completedLessons, quizResults }: { completedLessons: BoolMap; quizResults: QuizResultMap }) {
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const quizEntries = Object.values(quizResults);
  const averageScore = quizEntries.length
    ? Math.round((quizEntries.reduce((sum, item) => sum + (item.score / item.total) * 100, 0) / quizEntries.length))
    : 0;

  const lessonBars = lessons.map((lesson) => {
    const result = quizResults[lesson.id];
    return {
      name: `W${lesson.week}`,
      title: lesson.title,
      value: result ? Math.round((result.score / result.total) * 100) : completedLessons[lesson.id] ? 100 : 0,
    };
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-6">
        <Panel title="Teacher analytics dashboard" icon={<BarChart3 className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Completed lessons" value={`${completedCount}/${lessons.length}`} />
            <MetricCard label="Average quiz score" value={`${averageScore}%`} />
            <MetricCard label="Demo class completion" value="86%" />
          </div>
          <div className="mt-6 space-y-3">
            {lessonBars.map((bar) => (
              <div key={bar.title}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{bar.name} · {bar.title}</span>
                  <span>{bar.value}%</span>
                </div>
                <ProgressBar value={bar.value} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Demo class overview" icon={<Users className="h-5 w-5" />}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Completion</th>
                  <th className="py-2">Average score</th>
                </tr>
              </thead>
              <tbody>
                {demoClass.map((person) => (
                  <tr key={person.name} className="border-b last:border-0">
                    <td className="py-2 pr-4">{person.name}</td>
                    <td className="py-2 pr-4 capitalize">{person.role}</td>
                    <td className="py-2 pr-4">{person.completionRate}%</td>
                    <td className="py-2">{person.averageScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-500">This analytics panel is live for the current browser and includes demo class data to show the dashboard layout. Connect a database later for real whole-class analytics.</div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Teacher delivery resources" icon={<UserCog className="h-5 w-5" />}>
          <div className="space-y-3">
            {teacherResources.map((resource) => (
              <div key={resource.title} className="rounded-2xl border p-4">
                <div className="font-medium">{resource.title}</div>
                <div className="mt-1 text-sm text-slate-600">{resource.summary}</div>
                <div className="mt-2 text-sm text-slate-500">{resource.detail}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Microsoft 365 rollout notes" icon={<Lock className="h-5 w-5" />}>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Create an Entra ID app registration.</li>
            <li>• Add callback URL: <span className="font-mono text-xs">https://your-domain/api/auth/callback/azure-ad</span></li>
            <li>• Add Vercel environment variables from the updated README.</li>
            <li>• Set teacher emails in <span className="font-mono text-xs">TEACHER_EMAILS</span> to auto-grant teacher analytics access.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function AppShell() {
  const { data: session, status } = useSession();
  const [page, setPage] = useState<"home" | "pupil" | "teacher">("home");
  const [selectedTerm, setSelectedTerm] = useState("Summer Term 1");
  const [selectedLessonId, setSelectedLessonId] = useState("st1w1");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useLocalStorage<StringMap>("y5-v2-notes", {});
  const [completedLessons, setCompletedLessons] = useLocalStorage<BoolMap>("y5-v2-completed", {});
  const [quizResults, setQuizResults] = useLocalStorage<QuizResultMap>("y5-v2-quiz-results", {});
  const [teacherUnlocked, setTeacherUnlocked] = useLocalStorage<boolean>("y5-v2-teacher-unlocked", false);
  const [enteredCode, setEnteredCode] = useState("");

  const filteredLessons = useMemo(() => lessons.filter((lesson) => lesson.term === selectedTerm && (!search || `${lesson.title} ${lesson.focus} ${lesson.vocab.join(" ")}`.toLowerCase().includes(search.toLowerCase()))), [search, selectedTerm]);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  useEffect(() => {
    if (!filteredLessons.some((lesson) => lesson.id === selectedLessonId) && filteredLessons[0]) {
      setSelectedLessonId(filteredLessons[0].id);
    }
  }, [filteredLessons, selectedLessonId]);

  const overallProgress = Math.round((Object.values(completedLessons).filter(Boolean).length / lessons.length) * 100) || 0;
  const termProgress = (() => {
    const termLessons = lessons.filter((l) => l.term === selectedTerm);
    const done = termLessons.filter((l) => completedLessons[l.id]).length;
    return { done, total: termLessons.length, percent: Math.round((done / termLessons.length) * 100) || 0 };
  })();

  const isTeacher = Boolean((session?.user as any)?.role === "teacher") || teacherUnlocked;

  const resetAll = () => {
    setNotes({});
    setCompletedLessons({});
    setQuizResults({});
    setTeacherUnlocked(false);
  };

  if (status === "loading") {
    return <div className="mx-auto max-w-7xl p-6">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl p-6">
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white shadow-xl">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-200"><School className="h-4 w-4" /> APSR Computing Platform</div>
            <h1 className="text-4xl font-bold">Year 5 Selection in Scratch</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">Now upgraded with Microsoft-ready login scaffolding, a teacher analytics dashboard, and Scratch project integration inside every lesson.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <FeatureCard title="Pupil dashboard" icon={<GraduationCap className="h-5 w-5" />} text="Students can sign in, track lesson progress, open Scratch, and complete knowledge checks." />
              <FeatureCard title="Teacher analytics" icon={<BarChart3 className="h-5 w-5" />} text="Teachers get a dashboard for completion, scores, and rollout planning." />
              <FeatureCard title="Scratch links" icon={<ExternalLink className="h-5 w-5" />} text="Every lesson includes Scratch launch links and an embeddable project panel." />
            </div>
            <DemoLoginCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><Sparkles className="h-5 w-5" /></div>
            <div>
              <div className="text-sm text-slate-500">Version {APP_VERSION}</div>
              <div className="text-xl font-bold">APSR Year 5 Computing App</div>
              <div className="text-sm text-slate-500">Signed in as {session.user?.name || session.user?.email}</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavButton active={page === "home"} onClick={() => setPage("home")} icon={<Home className="h-4 w-4" />} label="Home" />
            <NavButton active={page === "pupil"} onClick={() => setPage("pupil")} icon={<LayoutDashboard className="h-4 w-4" />} label="Pupil dashboard" />
            <NavButton active={page === "teacher"} onClick={() => setPage("teacher")} icon={<Users className="h-4 w-4" />} label="Teacher area" />
            <NavButton active={false} onClick={() => signOut({ redirect: false })} icon={<LogOut className="h-4 w-4" />} label="Sign out" />
          </nav>
        </header>

        {page === "home" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
              <div className="text-sm text-slate-200">Browser-based computing platform</div>
              <h1 className="mt-2 text-4xl font-bold">Year 5 Selection in Scratch</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">This upgraded version includes Microsoft-ready sign-in scaffolding, a teacher analytics dashboard, and Scratch project integration in every lesson.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <StatCard label="Overall progress" value={`${overallProgress}%`} />
                <StatCard label="Completed lessons" value={`${Object.values(completedLessons).filter(Boolean).length}/${lessons.length}`} />
                <StatCard label="Teacher access" value={isTeacher ? "Enabled" : "Locked"} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard title="Pupil experience" icon={<GraduationCap className="h-5 w-5" />} text="Lesson navigation, vocabulary, notes, Scratch launch links, and knowledge checks." />
              <FeatureCard title="Teacher oversight" icon={<UserCog className="h-5 w-5" />} text="Analytics, rollout notes, and delivery resources for the scheme of work." />
              <FeatureCard title="Deployment ready" icon={<Monitor className="h-5 w-5" />} text="Prepared for Vercel deployment, Azure/Entra integration, and future database upgrades." />
            </div>
          </div>
        )}

        {page === "pupil" && (
          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <div className="space-y-4">
              <Panel title="Lesson navigation" icon={<BookOpen className="h-5 w-5" />}>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedTerm("Summer Term 1")} className={`flex-1 rounded-2xl px-3 py-2 text-sm ${selectedTerm === "Summer Term 1" ? "bg-slate-900 text-white" : "border bg-white"}`}>Term 1</button>
                  <button onClick={() => setSelectedTerm("Summer Term 2")} className={`flex-1 rounded-2xl px-3 py-2 text-sm ${selectedTerm === "Summer Term 2" ? "bg-slate-900 text-white" : "border bg-white"}`}>Term 2</button>
                </div>
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons or vocabulary" className="w-full rounded-2xl border py-3 pl-9 pr-3" />
                </div>
                <div className="mt-3 space-y-2">
                  {filteredLessons.map((lesson) => (
                    <button key={lesson.id} onClick={() => setSelectedLessonId(lesson.id)} className={`w-full rounded-2xl border p-4 text-left ${selectedLessonId === lesson.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs uppercase opacity-70">Week {lesson.week}</div>
                          <div className="font-medium">{lesson.title}</div>
                        </div>
                        {completedLessons[lesson.id] ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 opacity-50" />}
                      </div>
                      <div className={`text-sm ${selectedLessonId === lesson.id ? "text-slate-200" : "text-slate-500"}`}>{lesson.shortTitle}</div>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Safe use" icon={<ShieldCheck className="h-5 w-5" />}>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Do not share personal information in your project.</li>
                  <li>• Be respectful when testing and reviewing work.</li>
                  <li>• Check your code before sharing it.</li>
                </ul>
              </Panel>
            </div>
            <LessonView lesson={selectedLesson} selectedTerm={selectedTerm} termProgress={termProgress} notes={notes} setNotes={setNotes} completedLessons={completedLessons} setCompletedLessons={setCompletedLessons} quizResults={quizResults} setQuizResults={setQuizResults} />
          </div>
        )}

        {page === "teacher" && (
          <div className="space-y-6">
            {!isTeacher ? (
              <div className="mx-auto max-w-xl rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-xl font-semibold">Teacher access</div>
                <div className="mt-2 text-sm text-slate-600">If you are not recognised as a teacher through Microsoft or demo login, use the fallback teacher code.</div>
                <input value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} type="password" placeholder="Enter teacher code" className="mt-4 w-full rounded-2xl border px-3 py-3" />
                <button onClick={() => enteredCode === teacherCode && setTeacherUnlocked(true)} className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">Unlock teacher area</button>
              </div>
            ) : (
              <TeacherAnalytics completedLessons={completedLessons} quizResults={quizResults} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <AppShell />;
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-lg font-semibold">{icon}{title}</div>
      <div>{children}</div>
    </div>
  );
}

function FeatureCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-lg font-semibold">{icon}{title}</div>
      <div className="text-sm text-slate-600">{text}</div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{value}</div>
    </div>
  );
}

function LessonStep({ label, text }: { label: string; text: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><span className="font-semibold">{label}:</span> {text}</div>;
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${active ? "bg-slate-900 text-white" : "border bg-white hover:bg-slate-50"}`}>{icon}{label}</button>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div className="text-sm text-slate-200">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-2 h-3 w-full rounded-full bg-slate-200">
      <div className="h-3 rounded-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
