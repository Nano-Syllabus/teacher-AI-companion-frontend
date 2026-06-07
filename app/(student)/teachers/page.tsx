"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, Star, Users, SlidersHorizontal, X, GraduationCap, Sparkles } from "lucide-react";

type Subject = "Mathematics" | "Physics" | "Chemistry" | "Biology" | "History" | "Literature" | "Computer Science" | "Economics";

interface Teacher {
  id: string;
  name: string;
  title: string;
  institution: string;
  subjects: Subject[];
  notebookCount: number;
  studentCount: number;
  rating: number;
  bio: string;
  avatar: string; // initials
  avatarColor: string;
  featured?: boolean;
}

const TEACHERS: Teacher[] = [
  {
    id: "prof-sharma",
    name: "Dr. Anita Sharma",
    title: "Professor of Mathematics",
    institution: "Tribhuvan University",
    subjects: ["Mathematics", "Physics"],
    notebookCount: 12,
    studentCount: 340,
    rating: 4.9,
    bio: "15 years of teaching calculus, linear algebra, and applied mathematics. Known for making complex concepts approachable.",
    avatar: "AS",
    avatarColor: "#d97706",
    featured: true,
  },
  {
    id: "prof-thapa",
    name: "Rajesh Thapa",
    title: "Senior Lecturer",
    institution: "Kathmandu University",
    subjects: ["Computer Science", "Mathematics"],
    notebookCount: 8,
    studentCount: 210,
    rating: 4.7,
    bio: "Full-stack educator focusing on data structures, algorithms, and discrete mathematics for engineering students.",
    avatar: "RT",
    avatarColor: "#0a0a0f",
  },
  {
    id: "prof-adhikari",
    name: "Dr. Priya Adhikari",
    title: "Associate Professor",
    institution: "Pokhara University",
    subjects: ["Biology", "Chemistry"],
    notebookCount: 15,
    studentCount: 480,
    rating: 4.8,
    bio: "Specialises in molecular biology and organic chemistry. Creates deeply visual and interactive notebooks.",
    avatar: "PA",
    avatarColor: "#059669",
    featured: true,
  },
  {
    id: "prof-koirala",
    name: "Suman Koirala",
    title: "History & Literature Faculty",
    institution: "Prime College",
    subjects: ["History", "Literature"],
    notebookCount: 6,
    studentCount: 120,
    rating: 4.5,
    bio: "Passionate storyteller and historian. Brings Nepali and world history to life through narrative notebooks.",
    avatar: "SK",
    avatarColor: "#7c3aed",
  },
  {
    id: "prof-rai",
    name: "Dr. Bikash Rai",
    title: "Professor of Physics",
    institution: "Tribhuvan University",
    subjects: ["Physics", "Mathematics"],
    notebookCount: 10,
    studentCount: 290,
    rating: 4.6,
    bio: "Quantum mechanics and thermodynamics specialist. Every notebook includes solved problems and conceptual breakdowns.",
    avatar: "BR",
    avatarColor: "#dc2626",
  },
  {
    id: "prof-joshi",
    name: "Meena Joshi",
    title: "Economics Lecturer",
    institution: "Kathmandu University",
    subjects: ["Economics"],
    notebookCount: 5,
    studentCount: 95,
    rating: 4.4,
    bio: "Macro and microeconomics with a focus on South Asian markets. Practical, data-driven teaching approach.",
    avatar: "MJ",
    avatarColor: "#0891b2",
  },
];

const ALL_SUBJECTS: Subject[] = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Economics"];

const SUBJECT_COLORS: Record<Subject, string> = {
  Mathematics: "#d97706",
  Physics: "#dc2626",
  Chemistry: "#059669",
  Biology: "#16a34a",
  History: "#7c3aed",
  Literature: "#db2777",
  "Computer Science": "#0a0a0f",
  Economics: "#0891b2",
};

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link href={`/teachers/${teacher.id}`} className="block group">
      <div
        className="relative rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 cursor-pointer h-full"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: teacher.featured ? "1.5px solid rgba(217,119,6,0.4)" : "1.5px solid rgba(10,10,15,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        {teacher.featured && (
          <div
            className="absolute -top-3 left-5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "#d97706", color: "#fff" }}
          >
            <Sparkles size={10} />
            Featured
          </div>
        )}

        {/* Avatar + info */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: teacher.avatarColor, color: "#fff" }}
          >
            {teacher.avatar}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base leading-tight truncate" style={{ color: "#0a0a0f" }}>
              {teacher.name}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(10,10,15,0.5)" }}>
              {teacher.title}
            </p>
            <p className="text-xs truncate" style={{ color: "rgba(10,10,15,0.4)" }}>
              {teacher.institution}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "rgba(10,10,15,0.6)" }}>
          {teacher.bio}
        </p>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {teacher.subjects.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{
                background: `${SUBJECT_COLORS[s]}15`,
                color: SUBJECT_COLORS[s],
                border: `1px solid ${SUBJECT_COLORS[s]}30`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-4 pt-4"
          style={{ borderTop: "1px solid rgba(10,10,15,0.08)" }}
        >
          <div className="flex items-center gap-1.5">
            <BookOpen size={13} style={{ color: "rgba(10,10,15,0.4)" }} />
            <span className="text-xs font-medium" style={{ color: "rgba(10,10,15,0.6)" }}>
              {teacher.notebookCount} notebooks
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} style={{ color: "rgba(10,10,15,0.4)" }} />
            <span className="text-xs font-medium" style={{ color: "rgba(10,10,15,0.6)" }}>
              {teacher.studentCount} students
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Star size={13} fill="#d97706" style={{ color: "#d97706" }} />
            <span className="text-xs font-bold" style={{ color: "#0a0a0f" }}>
              {teacher.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StudentDiscoverPage() {
  const [query, setQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "students" | "notebooks">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const toggleSubject = (s: Subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const filtered = useMemo(() => {
    let list = TEACHERS;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.institution.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q)) ||
          t.bio.toLowerCase().includes(q)
      );
    }

    if (selectedSubjects.length > 0) {
      list = list.filter((t) =>
        selectedSubjects.every((s) => t.subjects.includes(s))
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "students") return b.studentCount - a.studentCount;
      return b.notebookCount - a.notebookCount;
    });
  }, [query, selectedSubjects, sortBy]);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      {/* Top nav */}
      <div
        className="sticky top-0 z-20 px-6 py-4"
        style={{ background: "rgba(245,240,232,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(10,10,15,0.08)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} style={{ color: "#d97706" }} />
            <span className="font-bold text-base" style={{ color: "#0a0a0f" }}>TeacherOS</span>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.5)" }}>
            Student Portal
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#d97706" }}>
            Discover
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-2" style={{ color: "#0a0a0f" }}>
            Find your <em style={{ color: "#d97706" }}>teacher.</em>
          </h1>
          <p className="text-sm" style={{ color: "rgba(10,10,15,0.5)" }}>
            Browse {TEACHERS.length} teachers across {ALL_SUBJECTS.length} subjects
          </p>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-4 transition-all duration-200"
          style={{
            background: "#fff",
            border: "1.5px solid rgba(10,10,15,0.12)",
          }}
        >
          <Search size={18} style={{ color: "rgba(10,10,15,0.35)", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, subject, or institution…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#0a0a0f" }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={15} style={{ color: "rgba(10,10,15,0.35)" }} />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: showFilters ? "#0a0a0f" : "rgba(10,10,15,0.07)",
              color: showFilters ? "#f5f0e8" : "rgba(10,10,15,0.6)",
              border: "1.5px solid transparent",
            }}
          >
            <SlidersHorizontal size={13} />
            Filters {selectedSubjects.length > 0 && `(${selectedSubjects.length})`}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: "rgba(10,10,15,0.4)" }}>Sort:</span>
            {(["rating", "students", "notebooks"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                style={{
                  background: sortBy === opt ? "#0a0a0f" : "rgba(10,10,15,0.07)",
                  color: sortBy === opt ? "#f5f0e8" : "rgba(10,10,15,0.55)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Subject filter panel */}
        {showFilters && (
          <div
            className="rounded-2xl p-5 mb-8"
            style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(10,10,15,0.1)" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "rgba(10,10,15,0.5)" }}>
              FILTER BY SUBJECT
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{
                    background: selectedSubjects.includes(s) ? SUBJECT_COLORS[s] : `${SUBJECT_COLORS[s]}12`,
                    color: selectedSubjects.includes(s) ? "#fff" : SUBJECT_COLORS[s],
                    border: `1.5px solid ${SUBJECT_COLORS[s]}40`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <button
                onClick={() => setSelectedSubjects([])}
                className="mt-3 text-xs underline underline-offset-2"
                style={{ color: "rgba(10,10,15,0.4)" }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs mb-5" style={{ color: "rgba(10,10,15,0.4)" }}>
          {filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => (
              <TeacherCard key={t.id} teacher={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-bold text-lg mb-2" style={{ color: "#0a0a0f" }}>No teachers found</p>
            <p className="text-sm" style={{ color: "rgba(10,10,15,0.45)" }}>
              Try a different search or clear your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}