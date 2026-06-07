"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Users,
  MessageSquare,
  ChevronRight,
  Clock,
  FileText,
  Sparkles,
  GraduationCap,
  Lock,
} from "lucide-react";

type Subject = "Mathematics" | "Physics" | "Computer Science";

interface Notebook {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  chapterCount: number;
  pageCount: number;
  lastUpdated: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  free: boolean;
}

const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string }> = {
  Mathematics: { bg: "#fef3c7", text: "#d97706", border: "#fcd34d" },
  Physics: { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
  "Computer Science": { bg: "#f0fdf4", text: "#16a34a", border: "#86efac" },
};

const DIFFICULTY_COLORS = {
  Beginner: { bg: "#f0fdf4", text: "#16a34a" },
  Intermediate: { bg: "#fef3c7", text: "#d97706" },
  Advanced: { bg: "#fee2e2", text: "#dc2626" },
};

const NOTEBOOKS: Notebook[] = [
  // Mathematics
  {
    id: "calc-1",
    title: "Calculus I — Limits & Derivatives",
    description: "Foundations of differential calculus with 120+ solved problems and visual explanations.",
    subject: "Mathematics",
    chapterCount: 8,
    pageCount: 94,
    lastUpdated: "2 days ago",
    difficulty: "Beginner",
    free: true,
  },
  {
    id: "calc-2",
    title: "Calculus II — Integration",
    description: "Definite and indefinite integrals, techniques of integration, and applications.",
    subject: "Mathematics",
    chapterCount: 10,
    pageCount: 118,
    lastUpdated: "1 week ago",
    difficulty: "Intermediate",
    free: false,
  },
  {
    id: "linalg",
    title: "Linear Algebra",
    description: "Vectors, matrices, eigenvalues, and transformations. Essential for ML and engineering.",
    subject: "Mathematics",
    chapterCount: 12,
    pageCount: 142,
    lastUpdated: "3 weeks ago",
    difficulty: "Intermediate",
    free: false,
  },
  {
    id: "stats",
    title: "Probability & Statistics",
    description: "From basic probability to hypothesis testing and regression analysis.",
    subject: "Mathematics",
    chapterCount: 9,
    pageCount: 105,
    lastUpdated: "1 month ago",
    difficulty: "Advanced",
    free: false,
  },
  // Physics
  {
    id: "mech",
    title: "Classical Mechanics",
    description: "Newton's laws, kinematics, dynamics, work-energy theorem with numerical examples.",
    subject: "Physics",
    chapterCount: 11,
    pageCount: 130,
    lastUpdated: "5 days ago",
    difficulty: "Beginner",
    free: true,
  },
  {
    id: "thermo",
    title: "Thermodynamics",
    description: "Laws of thermodynamics, heat engines, entropy — with real-world applications.",
    subject: "Physics",
    chapterCount: 7,
    pageCount: 88,
    lastUpdated: "2 weeks ago",
    difficulty: "Intermediate",
    free: false,
  },
  {
    id: "waves",
    title: "Waves & Optics",
    description: "Wave mechanics, superposition, interference, diffraction, and geometric optics.",
    subject: "Physics",
    chapterCount: 6,
    pageCount: 76,
    lastUpdated: "1 month ago",
    difficulty: "Intermediate",
    free: false,
  },
  // Computer Science
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Arrays, linked lists, trees, graphs, sorting, searching with Python/Java code.",
    subject: "Computer Science",
    chapterCount: 14,
    pageCount: 168,
    lastUpdated: "3 days ago",
    difficulty: "Intermediate",
    free: true,
  },
  {
    id: "discrete",
    title: "Discrete Mathematics",
    description: "Logic, sets, relations, graph theory, and combinatorics for CS students.",
    subject: "Computer Science",
    chapterCount: 10,
    pageCount: 122,
    lastUpdated: "2 weeks ago",
    difficulty: "Intermediate",
    free: false,
  },
];

function NotebookCard({ notebook, teacherId }: { notebook: Notebook; teacherId: string }) {
  const colors = SUBJECT_COLORS[notebook.subject];
  const diff = DIFFICULTY_COLORS[notebook.difficulty];

  return (
    <Link href={`/student/teachers/${teacherId}/chat?notebook=${notebook.id}`} className="block group">
    <div
      className="relative rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer group h-full"
      style={{
        background: notebook.free ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)",
        border: "1.5px solid rgba(10,10,15,0.1)",
      }}
    >
      {!notebook.free && (
        <div
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(10,10,15,0.06)" }}
        >
          <Lock size={13} style={{ color: "rgba(10,10,15,0.35)" }} />
        </div>
      )}

      {notebook.free && (
        <div
          className="absolute top-4 right-4 px-2 py-0.5 rounded-lg text-xs font-semibold"
          style={{ background: "#d97706", color: "#fff" }}
        >
          Free
        </div>
      )}

      {/* Title */}
      <div className="flex items-start gap-3 mb-3 pr-12">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: colors.bg }}
        >
          <FileText size={16} style={{ color: colors.text }} />
        </div>
        <div>
          <p className="font-bold text-sm leading-snug" style={{ color: "#0a0a0f" }}>
            {notebook.title}
          </p>
          <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "rgba(10,10,15,0.5)" }}>
            {notebook.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-md font-medium"
          style={{ background: diff.bg, color: diff.text }}
        >
          {notebook.difficulty}
        </span>
      </div>

      {/* Meta */}
      <div
        className="flex items-center gap-4 pt-3"
        style={{ borderTop: "1px solid rgba(10,10,15,0.07)" }}
      >
        <div className="flex items-center gap-1">
          <BookOpen size={12} style={{ color: "rgba(10,10,15,0.35)" }} />
          <span className="text-xs" style={{ color: "rgba(10,10,15,0.45)" }}>
            {notebook.chapterCount} chapters
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FileText size={12} style={{ color: "rgba(10,10,15,0.35)" }} />
          <span className="text-xs" style={{ color: "rgba(10,10,15,0.45)" }}>
            {notebook.pageCount} pages
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={12} style={{ color: "rgba(10,10,15,0.3)" }} />
          <span className="text-xs" style={{ color: "rgba(10,10,15,0.35)" }}>
            {notebook.lastUpdated}
          </span>
        </div>
      </div>

      {/* Hover CTA */}
      <div
        className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: "#d97706" }}
      >
        {notebook.free ? "Open notebook" : "Unlock notebook"}
        <ChevronRight size={13} />
      </div>
    </div>
    </Link>
  );
}

export default function TeacherProfilePage() {
  const [activeSubject, setActiveSubject] = useState<Subject | "All">("All");

  const subjects = Array.from(new Set(NOTEBOOKS.map((n) => n.subject))) as Subject[];

  const filtered = activeSubject === "All"
    ? NOTEBOOKS
    : NOTEBOOKS.filter((n) => n.subject === activeSubject);

  const groupedBySubject = subjects.reduce<Record<Subject, Notebook[]>>((acc, sub) => {
    acc[sub] = filtered.filter((n) => n.subject === sub);
    return acc;
  }, {} as Record<Subject, Notebook[]>);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>

      {/* Top nav */}
      <div
        className="sticky top-0 z-20 px-6 py-4"
        style={{
          background: "rgba(245,240,232,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(10,10,15,0.08)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/teachers"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: "rgba(10,10,15,0.6)" }}
          >
            <ArrowLeft size={16} />
            All Teachers
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} style={{ color: "#d97706" }} />
            <span className="font-bold text-sm" style={{ color: "#0a0a0f" }}>TeacherOS</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Profile header */}
        <div
          className="rounded-3xl p-8 mb-8"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1.5px solid rgba(10,10,15,0.1)",
          }}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: "#d97706", color: "#fff" }}
            >
              AS
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-bold text-2xl" style={{ color: "#0a0a0f" }}>
                      Dr. Anita Sharma
                    </h1>
                    <Sparkles size={16} style={{ color: "#d97706" }} />
                  </div>
                  <p className="text-sm mb-0.5" style={{ color: "rgba(10,10,15,0.55)" }}>
                    Professor of Mathematics
                  </p>
                  <p className="text-sm" style={{ color: "rgba(10,10,15,0.4)" }}>
                    Tribhuvan University, Kathmandu
                  </p>
                </div>

                {/* Chat CTA */}
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 flex-shrink-0"
                  style={{ background: "#0a0a0f", color: "#f5f0e8" }}
                >
                  <MessageSquare size={15} />
                  Chat with AI Clone
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star size={14} fill="#d97706" style={{ color: "#d97706" }} />
                  <span className="text-sm font-bold" style={{ color: "#0a0a0f" }}>4.9</span>
                  <span className="text-sm" style={{ color: "rgba(10,10,15,0.4)" }}>(128 reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} style={{ color: "rgba(10,10,15,0.4)" }} />
                  <span className="text-sm" style={{ color: "rgba(10,10,15,0.6)" }}>340 students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={14} style={{ color: "rgba(10,10,15,0.4)" }} />
                  <span className="text-sm" style={{ color: "rgba(10,10,15,0.6)" }}>{NOTEBOOKS.length} notebooks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} style={{ color: "rgba(10,10,15,0.4)" }} />
                  <span className="text-sm" style={{ color: "rgba(10,10,15,0.6)" }}>15 years teaching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div
            className="mt-6 pt-6"
            style={{ borderTop: "1px solid rgba(10,10,15,0.08)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "rgba(10,10,15,0.6)" }}>
              15 years of teaching calculus, linear algebra, probability, and applied mathematics at Tribhuvan University.
              Known for making complex concepts approachable through visual problem-solving and step-by-step breakdowns.
              Every notebook is built from years of classroom-tested material — the same notes that helped hundreds of students
              ace their board exams.
            </p>
          </div>

          {/* Subject tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {subjects.map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1.5 rounded-xl font-medium"
                style={{
                  background: SUBJECT_COLORS[s].bg,
                  color: SUBJECT_COLORS[s].text,
                  border: `1px solid ${SUBJECT_COLORS[s].border}`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Notebooks section */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-bold text-xl" style={{ color: "#0a0a0f" }}>
              Notebooks
            </h2>

            {/* Subject filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveSubject("All")}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeSubject === "All" ? "#0a0a0f" : "rgba(10,10,15,0.07)",
                  color: activeSubject === "All" ? "#f5f0e8" : "rgba(10,10,15,0.55)",
                }}
              >
                All ({NOTEBOOKS.length})
              </button>
              {subjects.map((s) => {
                const c = SUBJECT_COLORS[s];
                const count = NOTEBOOKS.filter((n) => n.subject === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: activeSubject === s ? c.text : c.bg,
                      color: activeSubject === s ? "#fff" : c.text,
                      border: `1.5px solid ${c.border}`,
                    }}
                  >
                    {s} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grouped by subject */}
          {activeSubject === "All" ? (
            <div className="space-y-10">
              {subjects.map((sub) => {
                const books = groupedBySubject[sub];
                if (!books || books.length === 0) return null;
                const c = SUBJECT_COLORS[sub];
                return (
                  <div key={sub}>
                    {/* Subject heading */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: c.bg }}
                      >
                        <BookOpen size={15} style={{ color: c.text }} />
                      </div>
                      <h3 className="font-bold text-base" style={{ color: "#0a0a0f" }}>
                        {sub}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-md font-medium ml-1"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {books.length} notebooks
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {books.map((nb) => (
                        <NotebookCard key={nb.id} notebook={nb} teacherId="prof-sharma" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((nb) => (
                <NotebookCard key={nb.id} notebook={nb} teacherId="prof-sharma" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}