"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LearnerProfile = {
  className: string;
  studentName: string;
  storageKey: string;
};

type QuizResult = {
  submitted: boolean;
  score: number;
  answers: number[];
};

type ScreenshotMap = Record<number, string>;

type TeacherPupilRow = LearnerProfile & {
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  quizCompletedCount: number;
  screenshotCount: number;
  status: "good" | "partial" | "not-started";
  hasAnyActivity: boolean;
};

type SortMode = "name" | "progress";

const CLASS_OPTIONS = [
  "Year 5 Eucalyptus",
  "Year 5 Hawthorne",
  "Year 5 Sycamore",
  "Year 5 Willow",
];

const REGISTRY_KEY = "year5-pupil-registry";
const CURRENT_PROFILE_KEY = "year5-current-profile";
const TOTAL_LESSONS = 12;

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
  panelSky: "#f0f9ff",
  border: "#dbe4f0",
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
  navy: "#334155",
  green: "#10b981",
  greenSoft: "#d1fae5",
  amber: "#f59e0b",
  amberSoft: "#fef3c7",
  rose: "#f43f5e",
  roseSoft: "#fff1f2",
  blueSoft: "#dbeafe",
  shadow: "0 10px 30px rgba(148, 163, 184, 0.14)",
};

function getRegistry(): LearnerProfile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REGISTRY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LearnerProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRegistry(registry: LearnerProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

function removeProfileFromRegistry(profile: LearnerProfile) {
  const existing = getRegistry();
  const filtered = existing.filter(
    (item) => item.storageKey !== profile.storageKey
  );
  saveRegistry(filtered);
}

function safeParseArray(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseQuizMap(raw: string | null): Record<number, QuizResult> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeParseScreenshotMap(raw: string | null): ScreenshotMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function buildTeacherRow(profile: LearnerProfile): TeacherPupilRow {
  const progressRaw =
    typeof window !== "undefined"
      ? localStorage.getItem(`${profile.storageKey}-progress`)
      : null;
  const quizRaw =
    typeof window !== "undefined"
      ? localStorage.getItem(`${profile.storageKey}-quiz-results`)
      : null;
  const screenshotsRaw =
    typeof window !== "undefined"
      ? localStorage.getItem(`${profile.storageKey}-screenshots`)
      : null;

  const completed = safeParseArray(progressRaw);
  const quizMap = safeParseQuizMap(quizRaw);
  const screenshots = safeParseScreenshotMap(screenshotsRaw);

  const completedLessons = completed.length;
  const quizCompletedCount = Object.values(quizMap).filter(
    (item) => item?.submitted
  ).length;
  const screenshotCount = Object.keys(screenshots).length;
  const progressPercent = Math.round((completedLessons / TOTAL_LESSONS) * 100);

  const hasAnyActivity =
    completedLessons > 0 || quizCompletedCount > 0 || screenshotCount > 0;

  let status: TeacherPupilRow["status"] = "not-started";
  if (progressPercent >= 70) status = "good";
  else if (progressPercent > 0 || hasAnyActivity) status = "partial";

  return {
    ...profile,
    completedLessons,
    totalLessons: TOTAL_LESSONS,
    progressPercent,
    quizCompletedCount,
    screenshotCount,
    status,
    hasAnyActivity,
  };
}

function statusConfig(status: TeacherPupilRow["status"]) {
  if (status === "good") {
    return {
      label: "Good progress",
      emoji: "🟢",
      text: "#065f46",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      progressBar: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
    };
  }

  if (status === "partial") {
    return {
      label: "Partial",
      emoji: "🟡",
      text: "#92400e",
      bg: "#fffbeb",
      border: "#fcd34d",
      progressBar: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
    };
  }

  return {
    label: "Not started",
    emoji: "🔴",
    text: "#b91c1c",
    bg: "#fef2f2",
    border: "#fca5a5",
    progressBar: "linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)",
  };
}

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [registry, setRegistry] = useState<LearnerProfile[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>(CLASS_OPTIONS[0]);
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [currentProfileKey, setCurrentProfileKey] = useState<string>("");

  useEffect(() => {
    const loadedRegistry = getRegistry();
    setRegistry(loadedRegistry);

    const savedCurrentProfile = localStorage.getItem(CURRENT_PROFILE_KEY);
    if (savedCurrentProfile) {
      try {
        const parsed = JSON.parse(savedCurrentProfile) as LearnerProfile;
        setCurrentProfileKey(parsed.storageKey);

        if (parsed.className && CLASS_OPTIONS.includes(parsed.className)) {
          setSelectedClass(parsed.className);
        }
      } catch {
        localStorage.removeItem(CURRENT_PROFILE_KEY);
      }
    }
  }, []);

  const teacherRows = useMemo(() => {
    return registry.map(buildTeacherRow);
  }, [registry]);

  const classRows = useMemo(() => {
    const filtered = teacherRows.filter((row) => row.className === selectedClass);

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "progress") {
        if (b.progressPercent !== a.progressPercent) {
          return b.progressPercent - a.progressPercent;
        }
        return a.studentName.localeCompare(b.studentName);
      }

      return a.studentName.localeCompare(b.studentName);
    });

    return sorted;
  }, [teacherRows, selectedClass, sortMode]);

  const classSummary = useMemo(() => {
    const rows = teacherRows.filter((row) => row.className === selectedClass);
    const total = rows.length;
    const active = rows.filter((row) => row.hasAnyActivity).length;
    const notStarted = rows.filter((row) => row.status === "not-started").length;
    const totalCompletedLessons = rows.reduce(
      (sum, row) => sum + row.completedLessons,
      0
    );
    const averageProgress =
      total === 0
        ? 0
        : Math.round(
            rows.reduce((sum, row) => sum + row.progressPercent, 0) / total
          );

    return {
      total,
      active,
      notStarted,
      totalCompletedLessons,
      averageProgress,
    };
  }, [teacherRows, selectedClass]);

  const highestProgressValue = useMemo(() => {
    if (classRows.length === 0) return 0;
    return Math.max(...classRows.map((row) => row.progressPercent));
  }, [classRows]);

  const openPupil = (profile: LearnerProfile) => {
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));
    router.push("/");
  };

  const deletePupil = (profile: LearnerProfile) => {
    const confirmed = window.confirm(
      `Delete saved data for ${profile.studentName} in ${profile.className}? This will remove progress, quiz scores, and screenshots from this browser.`
    );

    if (!confirmed) return;

    localStorage.removeItem(`${profile.storageKey}-progress`);
    localStorage.removeItem(`${profile.storageKey}-quiz-results`);
    localStorage.removeItem(`${profile.storageKey}-screenshots`);

    removeProfileFromRegistry(profile);

    if (currentProfileKey === profile.storageKey) {
      localStorage.removeItem(CURRENT_PROFILE_KEY);
      setCurrentProfileKey("");
    }

    setRegistry(getRegistry());
  };

  return (
    <main
      style={{
        padding: 32,
        fontFamily: "Inter, Arial, sans-serif",
        maxWidth: 1480,
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
            gap: 20,
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
                marginBottom: 8,
              }}
            >
              APSR Computing Platform
            </div>

            <h1
              style={{
                fontSize: 46,
                lineHeight: 1.05,
                margin: "0 0 10px",
                color: pastel.title,
              }}
            >
              Teacher Dashboard
            </h1>

            <p style={{ fontSize: 20, margin: 0, maxWidth: 780 }}>
              View pupils saved on this device, filter by class, and open a pupil
              learning space in one click.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                border: `1px solid ${pastel.border}`,
                background: "#ffffff",
                color: pastel.title,
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Return to Pupil App
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
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
          <h2
            style={{
              fontSize: 30,
              marginTop: 0,
              marginBottom: 16,
              color: pastel.title,
            }}
          >
            Class View
          </h2>

          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {CLASS_OPTIONS.map((classOption) => {
              const isActive = selectedClass === classOption;

              return (
                <button
                  key={classOption}
                  onClick={() => setSelectedClass(classOption)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 16px",
                    borderRadius: 18,
                    border: isActive
                      ? "1px solid #c4b5fd"
                      : `1px solid ${pastel.border}`,
                    background: isActive
                      ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                      : "#ffffff",
                    color: pastel.title,
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  {classOption}
                </button>
              );
            })}
          </div>

          <div
            style={{
              background: pastel.panelBlue,
              border: `1px solid ${pastel.border}`,
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#7c3aed",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              Class Summary
            </div>

            <div style={{ display: "grid", gap: 10, fontSize: 15 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>Total pupils</span>
                <strong>{classSummary.total}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>Active pupils</span>
                <strong>{classSummary.active}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>Not started</span>
                <strong>{classSummary.notStarted}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>Average progress</span>
                <strong>{classSummary.averageProgress}%</strong>
              </div>
            </div>
          </div>

          <div
            style={{
              background: pastel.panelSoft,
              border: `1px solid ${pastel.border}`,
              borderRadius: 18,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#7c3aed",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              Sort Pupils
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setSortMode("name")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border:
                    sortMode === "name"
                      ? "1px solid #c4b5fd"
                      : `1px solid ${pastel.border}`,
                  background:
                    sortMode === "name" ? pastel.accentSoft : "#ffffff",
                  color: pastel.title,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Name
              </button>

              <button
                onClick={() => setSortMode("progress")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border:
                    sortMode === "progress"
                      ? "1px solid #c4b5fd"
                      : `1px solid ${pastel.border}`,
                  background:
                    sortMode === "progress" ? pastel.accentSoft : "#ffffff",
                  color: pastel.title,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Progress
              </button>
            </div>
          </div>
        </aside>

        <section style={{ display: "grid", gap: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 22,
                padding: 20,
                boxShadow: pastel.shadow,
              }}
            >
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                Selected Class
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  color: pastel.title,
                  lineHeight: 1.2,
                }}
              >
                {selectedClass}
              </div>
            </div>

            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 22,
                padding: 20,
                boxShadow: pastel.shadow,
              }}
            >
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                Pupils on Device
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 34,
                  color: pastel.title,
                }}
              >
                {classSummary.total}
              </div>
            </div>

            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 22,
                padding: 20,
                boxShadow: pastel.shadow,
              }}
            >
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                Average Progress
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 34,
                  color: pastel.title,
                }}
              >
                {classSummary.averageProgress}%
              </div>
            </div>

            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 22,
                padding: 20,
                boxShadow: pastel.shadow,
              }}
            >
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                No Activity
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 34,
                  color: pastel.title,
                }}
              >
                {classSummary.notStarted}
              </div>
            </div>
          </div>

          {classRows.length === 0 ? (
            <div
              style={{
                background: pastel.panel,
                border: `1px dashed ${pastel.border}`,
                borderRadius: 24,
                padding: 32,
                textAlign: "center",
                color: "#64748b",
                fontSize: 18,
                boxShadow: pastel.shadow,
              }}
            >
              No saved pupils found for {selectedClass} on this browser.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 18,
              }}
            >
              {classRows.map((row) => {
                const status = statusConfig(row.status);
                const isHighestProgress =
                  row.progressPercent === highestProgressValue &&
                  highestProgressValue > 0;
                const isCurrent = row.storageKey === currentProfileKey;

                return (
                  <div
                    key={row.storageKey}
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${pastel.border}`,
                      borderRadius: 24,
                      padding: 20,
                      boxShadow: pastel.shadow,
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "start",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 900,
                            color: pastel.title,
                            lineHeight: 1.2,
                            marginBottom: 6,
                          }}
                        >
                          {row.studentName}
                        </div>

                        <div style={{ fontSize: 14, color: "#64748b" }}>
                          {row.className}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {isCurrent && (
                          <span
                            style={{
                              background: pastel.panelBlue,
                              color: "#1d4ed8",
                              border: "1px solid #bfdbfe",
                              borderRadius: 999,
                              padding: "8px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                            }}
                          >
                            Current pupil
                          </span>
                        )}

                        {isHighestProgress && (
                          <span
                            style={{
                              background: pastel.panelPeach,
                              color: "#b45309",
                              border: "1px solid #fed7aa",
                              borderRadius: 999,
                              padding: "8px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                            }}
                          >
                            Highest progress
                          </span>
                        )}

                        {!row.hasAnyActivity && (
                          <span
                            style={{
                              background: pastel.roseSoft,
                              color: pastel.rose,
                              border: "1px solid #fecdd3",
                              borderRadius: 999,
                              padding: "8px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                            }}
                          >
                            No activity
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        alignSelf: "start",
                        background: status.bg,
                        color: status.text,
                        border: `1px solid ${status.border}`,
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      <span>{status.emoji}</span>
                      <span>{status.label}</span>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 8,
                          fontWeight: 800,
                          color: pastel.title,
                        }}
                      >
                        <span>Progress</span>
                        <span>{row.progressPercent}%</span>
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
                            width: `${row.progressPercent}%`,
                            height: "100%",
                            background: status.progressBar,
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          background: pastel.panelLilac,
                          border: `1px solid ${pastel.border}`,
                          borderRadius: 16,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                            marginBottom: 6,
                          }}
                        >
                          Lessons
                        </div>
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 22,
                            color: pastel.title,
                          }}
                        >
                          {row.completedLessons}/{row.totalLessons}
                        </div>
                      </div>

                      <div
                        style={{
                          background: pastel.panelMint,
                          border: `1px solid ${pastel.border}`,
                          borderRadius: 16,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                            marginBottom: 6,
                          }}
                        >
                          Quizzes
                        </div>
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 22,
                            color: pastel.title,
                          }}
                        >
                          {row.quizCompletedCount}/{TOTAL_LESSONS}
                        </div>
                      </div>

                      <div
                        style={{
                          background: pastel.panelPeach,
                          border: `1px solid ${pastel.border}`,
                          borderRadius: 16,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                            marginBottom: 6,
                          }}
                        >
                          Screenshots
                        </div>
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 22,
                            color: pastel.title,
                          }}
                        >
                          {row.screenshotCount}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        onClick={() => openPupil(row)}
                        style={{
                          flex: 1,
                          minWidth: 130,
                          padding: "14px 16px",
                          borderRadius: 14,
                          border: "none",
                          background:
                            "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                          color: "#ffffff",
                          fontWeight: 800,
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                      >
                        Open
                      </button>

                      <button
                        onClick={() => deletePupil(row)}
                        style={{
                          minWidth: 110,
                          padding: "14px 16px",
                          borderRadius: 14,
                          border: "1px solid #fecdd3",
                          background: pastel.roseSoft,
                          color: pastel.rose,
                          fontWeight: 800,
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
