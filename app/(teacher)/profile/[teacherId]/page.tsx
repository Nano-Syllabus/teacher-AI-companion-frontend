"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Users,
  MessageSquare,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── Types mirrored from backend schemas ───────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  notebook_count: number;
}

interface NotebookSummary {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: Difficulty;
  is_free: boolean;
  published: boolean;
  student_count: number;
  views: number;
  rating: number | null;
  doc_count: number;
  updated_at: string;
  qr_code: string; 
  qr_url: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001//api/v1/";

function getAuthHeader(): Record<string, string> {
  // Token stored in localStorage as "access_token" from login response
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Time formatter ─────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Initials avatar ────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Difficulty badge ───────────────────────────────────────────────────────

const DIFFICULTY_STYLE: Record<Difficulty, React.CSSProperties> = {
  Beginner: {
    background: "#fff",
    color: "#000",
    border: "1px solid #000",
  },
  Intermediate: {
    background: "#000",
    color: "#fff",
    border: "1px solid #000",
  },
  Advanced: {
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid #1a1a1a",
  },
};

// ── Skeleton component ─────────────────────────────────────────────────────

function Skeleton({ width, height, style }: { width?: string; height?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: width ?? "100%",
        height: height ?? "1em",
        borderRadius: 4,
        background: "rgba(0,0,0,0.08)",
        animation: "pulse 1.4s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

// ── NotebookCard ───────────────────────────────────────────────────────────

function NotebookCard({
  notebook,
  teacherId,
}: {
  notebook: NotebookSummary;
  teacherId: string;
}) {
  return (
    <Link
      href={`/student/teachers/${teacherId}/chat?notebook=${notebook.id}`}
      className="block group"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          padding: "1.1rem 1.25rem",
          border: "1px solid",
          borderColor: notebook.is_free ? "#000" : "rgba(0,0,0,0.18)",
          background: notebook.is_free ? "#000" : "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          height: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        {/* Lock / Free badge */}
        <div style={{ position: "absolute", top: "0.9rem", right: "1rem" }}>
          {notebook.is_free ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "#fff",
                color: "#000",
                padding: "2px 7px",
                borderRadius: 4,
              }}
            >
              Free
            </span>
          ) : (
            <Lock size={13} style={{ color: "rgba(0,0,0,0.3)" }} />
          )}
        </div>

        {/* Icon + title */}
        <div style={{ display: "flex", gap: 12, paddingRight: 32 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: notebook.is_free ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.05)",
            }}
          >
            <FileText
              size={15}
              style={{ color: notebook.is_free ? "#fff" : "#000" }}
            />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.35,
                color: notebook.is_free ? "#fff" : "#000",
              }}
            >
              {notebook.title}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                color: notebook.is_free ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {notebook.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: 4,
              ...DIFFICULTY_STYLE[notebook.difficulty],
              ...(notebook.is_free && notebook.difficulty === "Beginner"
                ? { background: "#fff", color: "#000" }
                : notebook.is_free
                ? { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }
                : {}),
            }}
          >
            {notebook.difficulty}
          </span>
          {notebook.subject && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                padding: "2px 8px",
                borderRadius: 4,
                background: notebook.is_free ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                color: notebook.is_free ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
              }}
            >
              {notebook.subject}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: "0.6rem",
            borderTop: `1px solid ${notebook.is_free ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)"}`,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: notebook.is_free ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
            }}
          >
            <BookOpen size={11} />
            {notebook.doc_count} docs
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: notebook.is_free ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
            }}
          >
            <Users size={11} />
            {notebook.student_count}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: notebook.is_free ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
              marginLeft: "auto",
            }}
          >
            <Clock size={11} />
            {timeAgo(notebook.updated_at)}
          </span>
        </div>

        {/* Hover CTA */}
        <div
          className="notebook-cta"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 600,
            color: notebook.is_free ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)",
            opacity: 0,
            transition: "opacity 0.15s ease",
          }}
        >
          {notebook.is_free ? "Open notebook" : "Unlock notebook"}
          <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}

// ── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 12,
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <AlertCircle size={32} style={{ color: "rgba(0,0,0,0.25)" }} />
      <p style={{ margin: 0, fontSize: 14, color: "rgba(0,0,0,0.5)" }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: 8,
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 500,
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function TeacherProfilePage() {
  const params = useParams<{ teacherId: string }>();
  const teacherId = params?.teacherId ?? "";

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [notebooks, setNotebooks] = useState<NotebookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<string>("All");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prof, nbs] = await Promise.all([
        apiFetch<TeacherProfile>(`/student/teachers/${teacherId}`),
        apiFetch<NotebookSummary[]>(`/student/teachers/${teacherId}/notebooks`),
      ]);
      setTeacher(prof);
      setNotebooks(nbs);
    } catch (e) {
      setError((e as Error).message ?? "Failed to load teacher profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) load();
  }, [teacherId]);

  // Derived
  const subjects = Array.from(new Set(notebooks.map((n) => n.subject))).sort();
  const filtered =
    activeSubject === "All"
      ? notebooks
      : notebooks.filter((n) => n.subject === activeSubject);

  const groupedBySubject = subjects.reduce<Record<string, NotebookSummary[]>>(
    (acc, sub) => {
      acc[sub] = filtered.filter((n) => n.subject === sub);
      return acc;
    },
    {}
  );

  const totalStudents = notebooks.reduce((s, n) => s + n.student_count, 0);
  const avgRating =
    notebooks.filter((n) => n.rating !== null).length > 0
      ? notebooks
          .filter((n) => n.rating !== null)
          .reduce((s, n) => s + (n.rating ?? 0), 0) /
        notebooks.filter((n) => n.rating !== null).length
      : null;

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .notebook-card:hover .notebook-cta { opacity: 1 !important; }
        a { text-decoration: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f7f5" }}>

        {/* ── Sticky nav ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: "0.85rem 1.5rem",
            background: "rgba(247,247,245,0.88)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/student/teachers"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(0,0,0,0.5)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} />
              All Teachers
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <GraduationCap size={16} style={{ color: "#000" }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: "#000" }}>
                NanoSyllabus
              </span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

          {/* ── Profile header ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            {loading ? (
              <div style={{ display: "flex", gap: 20 }}>
                <Skeleton width="72px" height="72px" style={{ borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skeleton width="180px" height="22px" />
                  <Skeleton width="140px" height="14px" />
                  <Skeleton width="100px" height="14px" />
                </div>
              </div>
            ) : teacher ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                  {/* Avatar */}
                  {teacher.picture ? (
                    <img
                      src={teacher.picture}
                      alt={teacher.name}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        background: "#000",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        fontWeight: 700,
                        flexShrink: 0,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {initials(teacher.name)}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h1
                          style={{
                            margin: 0,
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#000",
                            letterSpacing: "-0.4px",
                          }}
                        >
                          {teacher.name}
                        </h1>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
                          {teacher.email}
                        </p>
                      </div>

                      {/* Chat CTA */}
                      <Link
                        href={`/student/teachers/${teacherId}/chat`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "9px 18px",
                          background: "#000",
                          color: "#fff",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: "none",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <MessageSquare size={14} />
                        Chat with AI
                      </Link>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginTop: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      {avgRating !== null && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 13,
                            color: "#000",
                          }}
                        >
                          <Star size={13} fill="#000" />
                          <strong>{avgRating.toFixed(1)}</strong>
                          <span style={{ color: "rgba(0,0,0,0.4)" }}>avg rating</span>
                        </span>
                      )}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 13,
                          color: "rgba(0,0,0,0.55)",
                        }}
                      >
                        <Users size={13} />
                        {totalStudents.toLocaleString()} students
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 13,
                          color: "rgba(0,0,0,0.55)",
                        }}
                      >
                        <BookOpen size={13} />
                        {teacher.notebook_count} notebooks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject tags */}
                {subjects.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: "1.5rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid rgba(0,0,0,0.07)",
                    }}
                  >
                    {subjects.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "4px 12px",
                          borderRadius: 20,
                          background: "rgba(0,0,0,0.05)",
                          color: "rgba(0,0,0,0.6)",
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* ── Notebooks section ── */}
          <div>
            {/* Header + filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#000",
                  letterSpacing: "-0.3px",
                }}
              >
                Notebooks
                {!loading && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(0,0,0,0.35)",
                    }}
                  >
                    {filtered.length}
                  </span>
                )}
              </h2>

              {/* Subject filter pills */}
              {!loading && subjects.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {["All", ...subjects].map((s) => {
                    const active = activeSubject === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setActiveSubject(s)}
                        style={{
                          padding: "5px 14px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: active ? "#000" : "rgba(0,0,0,0.15)",
                          background: active ? "#000" : "#fff",
                          color: active ? "#fff" : "rgba(0,0,0,0.55)",
                          transition: "all 0.12s ease",
                        }}
                      >
                        {s}
                        {s !== "All" && (
                          <span
                            style={{
                              marginLeft: 5,
                              opacity: 0.5,
                            }}
                          >
                            {notebooks.filter((n) => n.subject === s).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.08)",
                      padding: "1.1rem 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12 }}>
                      <Skeleton width="34px" height="34px" style={{ borderRadius: 8 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                        <Skeleton height="14px" />
                        <Skeleton height="12px" width="80%" />
                      </div>
                    </div>
                    <Skeleton height="12px" width="50%" />
                    <Skeleton height="12px" width="70%" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                }}
              >
                <BookOpen size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
                <p style={{ margin: 0 }}>No published notebooks yet.</p>
              </div>
            )}

            {/* Grouped by subject (All view) */}
            {!loading && filtered.length > 0 && activeSubject === "All" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {subjects.map((sub) => {
                  const books = groupedBySubject[sub];
                  if (!books || books.length === 0) return null;
                  return (
                    <div key={sub}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(0,0,0,0.35)",
                          }}
                        >
                          {sub}
                        </span>
                        <div
                          style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }}
                        />
                        <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)" }}>
                          {books.length}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                          gap: 14,
                        }}
                      >
                        {books.map((nb) => (
                          <NotebookCard key={nb.id} notebook={nb} teacherId={teacherId} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Flat grid (filtered view) */}
            {!loading && filtered.length > 0 && activeSubject !== "All" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 14,
                }}
              >
                {filtered.map((nb) => (
                  <NotebookCard key={nb.id} notebook={nb} teacherId={teacherId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}