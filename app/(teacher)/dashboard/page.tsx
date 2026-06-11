"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { apiFetch } from "../../lib/api";
import {
  BookOpen, Plus, Users, Star, Eye, Pencil, Trash2,
  MoreVertical, FileText, TrendingUp, MessageSquare,
  GraduationCap, Settings, LogOut, ChevronRight, Sparkles,
} from "lucide-react";

type Subject = "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Computer Science" | "Economics" | "History" | "Literature";

interface Notebook {
  id: string;
  title: string;
  subject: Subject;
  description: string;
  docCount: number;
  studentCount: number;
  views: number;
  rating: number;
  lastUpdated: string;
  published: boolean;
  free: boolean;
}

const SUBJECT_STYLES: Record<Subject, { bg: string; text: string; border: string }> = {
  Mathematics:        { bg: "#fef3c7", text: "#d97706", border: "#fcd34d" },
  Physics:            { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
  Chemistry:          { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  Biology:            { bg: "#f0fdf4", text: "#16a34a", border: "#86efac" },
  "Computer Science": { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  Economics:          { bg: "#f0f9ff", text: "#0891b2", border: "#bae6fd" },
  History:            { bg: "#fdf2f8", text: "#db2777", border: "#fbcfe8" },
  Literature:         { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" },
};

const MOCK_NOTEBOOKS: Notebook[] = [
  {
    id: "calc-1",
    title: "Calculus I — Limits & Derivatives",
    subject: "Mathematics",
    description: "Foundations of differential calculus with 120+ solved problems.",
    docCount: 7,
    studentCount: 142,
    views: 890,
    rating: 4.9,
    lastUpdated: "2 days ago",
    published: true,
    free: true,
  },
  {
    id: "calc-2",
    title: "Calculus II — Integration",
    subject: "Mathematics",
    description: "Definite and indefinite integrals, techniques and applications.",
    docCount: 5,
    studentCount: 98,
    views: 612,
    rating: 4.7,
    lastUpdated: "1 week ago",
    published: true,
    free: false,
  },
  {
    id: "linalg",
    title: "Linear Algebra",
    subject: "Mathematics",
    description: "Vectors, matrices, eigenvalues and transformations.",
    docCount: 9,
    studentCount: 74,
    views: 430,
    rating: 4.8,
    lastUpdated: "2 weeks ago",
    published: true,
    free: false,
  },
  {
    id: "mech",
    title: "Classical Mechanics",
    subject: "Physics",
    description: "Newton's laws, kinematics, dynamics — fully solved.",
    docCount: 6,
    studentCount: 56,
    views: 310,
    rating: 4.6,
    lastUpdated: "3 weeks ago",
    published: false,
    free: false,
  },
];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(10,10,15,0.08)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium" style={{ color: "rgba(10,10,15,0.45)" }}>{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: "#0a0a0f" }}>{value}</p>
    </div>
  );
}

function NotebookRow({ notebook, onDelete }: { notebook: Notebook; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = SUBJECT_STYLES[notebook.subject];

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.005] group"
      style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(10,10,15,0.08)" }}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
        <BookOpen size={18} style={{ color: s.text }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-bold text-sm truncate" style={{ color: "#0a0a0f" }}>{notebook.title}</p>
          <span
            className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0"
            style={{ background: s.bg, color: s.text }}
          >
            {notebook.subject}
          </span>
          {!notebook.published && (
            <span className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0"
              style={{ background: "rgba(10,10,15,0.07)", color: "rgba(10,10,15,0.45)" }}>
              Draft
            </span>
          )}
          {notebook.free && notebook.published && (
            <span className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0"
              style={{ background: "#d97706", color: "#fff" }}>
              Free
            </span>
          )}
        </div>
        <p className="text-xs truncate" style={{ color: "rgba(10,10,15,0.45)" }}>
          {notebook.docCount} documents · Updated {notebook.lastUpdated}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: "#0a0a0f" }}>{notebook.studentCount}</p>
          <p className="text-xs" style={{ color: "rgba(10,10,15,0.4)" }}>students</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: "#0a0a0f" }}>{notebook.views}</p>
          <p className="text-xs" style={{ color: "rgba(10,10,15,0.4)" }}>views</p>
        </div>
        <div className="flex items-center gap-1">
          <Star size={13} fill="#d97706" style={{ color: "#d97706" }} />
          <p className="text-sm font-bold" style={{ color: "#0a0a0f" }}>{notebook.rating}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/notebooks/${notebook.id}/upload`}
          className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-150 hover:scale-105"
          style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.6)" }}
        >
          <Plus size={13} />
          Add Docs
        </Link>
        <Link
          href={`/notebooks/${notebook.id}/edit`}
          className="p-2 rounded-xl transition-all duration-150 hover:scale-105"
          style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.5)" }}
        >
          <Pencil size={14} />
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl transition-all duration-150 hover:scale-105"
            style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.5)" }}
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 rounded-xl overflow-hidden z-20"
              style={{ background: "#fff", border: "1.5px solid rgba(10,10,15,0.1)", boxShadow: "0 8px 24px rgba(10,10,15,0.1)" }}
            >
              <Link
                href={`/notebooks/${notebook.id}`}
                className="flex items-center gap-2.5 px-4 py-3 text-xs font-medium transition-colors hover:bg-gray-50"
                style={{ color: "#0a0a0f" }}
              >
                <Eye size={13} /> Preview
              </Link>
              <button
                onClick={() => { onDelete(notebook.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-medium transition-colors hover:bg-red-50"
                style={{ color: "#dc2626" }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(MOCK_NOTEBOOKS);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    let mounted = true;

    async function loadNotebooks() {
      try {
        const session = await getSession();
        const data = await apiFetch<Array<{
          id: string;
          title: string;
          subject: Subject;
          description: string;
          doc_count: number;
          student_count: number;
          views: number;
          rating: number;
          updated_at: string;
          published: boolean;
          is_free: boolean;
        }>>("/notebooks/", session?.backendAccessToken);

        if (!mounted || data.length === 0) return;

        setNotebooks(data.map((notebook) => ({
          id: notebook.id,
          title: notebook.title,
          subject: notebook.subject,
          description: notebook.description,
          docCount: notebook.doc_count,
          studentCount: notebook.student_count,
          views: notebook.views,
          rating: notebook.rating,
          lastUpdated: new Date(notebook.updated_at).toLocaleDateString(),
          published: notebook.published,
          free: notebook.is_free,
        })));
      } catch (error) {
        console.error("Failed to load notebooks", error);
      }
    }

    loadNotebooks();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = notebooks.filter(n =>
    filter === "all" ? true : filter === "published" ? n.published : !n.published
  );

  const totalStudents = notebooks.reduce((s, n) => s + n.studentCount, 0);
  const totalViews    = notebooks.reduce((s, n) => s + n.views, 0);
  const avgRating     = (notebooks.reduce((s, n) => s + n.rating, 0) / notebooks.length).toFixed(1);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>

      {/* Sidebar (desktop) */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col px-5 py-8 z-20"
        style={{ background: "#0a0a0f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#d97706" }}>
            <BookOpen size={15} color="#fff" />
          </div>
          <span className="font-bold text-base" style={{ color: "#f5f0e8" }}>TeacherOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {[
            { icon: TrendingUp,    label: "Dashboard",   href: "/dashboard", active: true },
            { icon: BookOpen,      label: "Notebooks",   href: "/notebooks" },
            { icon: Users,         label: "Students",    href: "/students" },
            { icon: MessageSquare, label: "AI Messages", href: "/messages" },
            { icon: GraduationCap, label: "My Profile",  href: "/profile" },
            { icon: Settings,      label: "Settings",    href: "/settings" },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(217,119,6,0.15)" : "transparent",
                color: active ? "#d97706" : "rgba(245,240,232,0.5)",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Profile snippet */}
        <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#d97706", color: "#fff" }}>AS</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#f5f0e8" }}>Dr. Anita Sharma</p>
              <p className="text-xs truncate" style={{ color: "rgba(245,240,232,0.4)" }}>anita@tu.edu.np</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ color: "rgba(245,240,232,0.4)" }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 px-6 py-8 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#d97706" }}>Teacher Dashboard</p>
            <h1 className="font-bold text-3xl" style={{ color: "#0a0a0f" }}>Good morning, Anita 👋</h1>
          </div>
          <Link
            href="/notebooks/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ background: "#0a0a0f", color: "#f5f0e8" }}
          >
            <Plus size={16} />
            New Notebook
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Notebooks" value={String(notebooks.length)} icon={BookOpen}      color="#d97706" />
          <StatCard label="Total Students"  value={String(totalStudents)}    icon={Users}         color="#0891b2" />
          <StatCard label="Total Views"     value={String(totalViews)}       icon={TrendingUp}    color="#16a34a" />
          <StatCard label="Avg Rating"      value={avgRating}                icon={Star}          color="#dc2626" />
        </div>

        {/* Notebooks list */}
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="font-bold text-lg" style={{ color: "#0a0a0f" }}>Your Notebooks</h2>
            <div className="flex items-center gap-2">
              {(["all", "published", "draft"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150"
                  style={{
                    background: filter === f ? "#0a0a0f" : "rgba(10,10,15,0.07)",
                    color: filter === f ? "#f5f0e8" : "rgba(10,10,15,0.55)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((nb) => (
              <NotebookRow
                key={nb.id}
                notebook={nb}
                onDelete={(id) => setNotebooks((prev) => prev.filter((n) => n.id !== id))}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 rounded-2xl" style={{ border: "2px dashed rgba(10,10,15,0.12)" }}>
                <p className="text-3xl mb-3">📚</p>
                <p className="font-bold text-base mb-1" style={{ color: "#0a0a0f" }}>No notebooks yet</p>
                <p className="text-sm mb-4" style={{ color: "rgba(10,10,15,0.45)" }}>Create your first notebook to get started</p>
                <Link href="/notebooks/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "#0a0a0f", color: "#f5f0e8" }}>
                  <Plus size={14} /> New Notebook
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
