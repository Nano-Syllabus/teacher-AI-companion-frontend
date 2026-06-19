"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { Search, BookOpen, X, GraduationCap, Mail } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Teacher {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  notebook_count: number;
}

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "T";
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  async function handleRequestAccess(e: React.MouseEvent) {
    e.stopPropagation();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/send-access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail: teacher.email,
          teacherName: teacher.name,
          notebookTitle: "your notebooks",
          accessType: "view",
          message: "",
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 h-full flex flex-col"
      style={{ background: "#ffffff", border: "1.5px solid #e5e5e5" }}
    >
      <Link href={`/teachers/${teacher.id}`} className="flex items-start gap-4 mb-4 group">
        {teacher.picture ? (
          <img
            src={teacher.picture}
            alt={teacher.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            style={{ filter: "grayscale(100%)" }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#0a0a0a", color: "#ffffff" }}
          >
            {getInitials(teacher.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-base leading-tight truncate group-hover:underline" style={{ color: "#0a0a0a" }}>
            {teacher.name}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#737373" }}>
            {teacher.email}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-4 py-3 mt-auto" style={{ borderTop: "1px solid #e5e5e5" }}>
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} style={{ color: "#a3a3a3" }} />
          <span className="text-xs font-medium" style={{ color: "#737373" }}>
            {teacher.notebook_count} notebook{teacher.notebook_count !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={handleRequestAccess}
          disabled={sending || sent}
          title={`Request resources from ${teacher.name}`}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          style={{
            background: sent ? "#f5f5f5" : error ? "#fef2f2" : "#0a0a0a",
            color: sent ? "#737373" : error ? "#dc2626" : "#ffffff",
            border: `1px solid ${sent ? "#e5e5e5" : error ? "#fecaca" : "#0a0a0a"}`,
          }}
        >
          <Mail size={12} />
          {sending ? "Sending…" : sent ? "Sent ✓" : error ? "Failed — retry" : "Request Access"}
        </button>
      </div>
    </div>
  );
}

export default function StudentDiscoverPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "notebooks">("notebooks");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function loadTeachers() {
      try {
        const session = await getSession();
        if (!session) {
          router.replace("/");
          return;
        }

        const userData = await apiFetch<Teacher[]>("/student/teachers", session.backendAccessToken);
// ← add this
if (mounted) setTeachers(userData);
        if (mounted) setTeachers(userData);
      } catch (error) {
        console.error("Failed to load teachers", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTeachers();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = teachers;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      sortBy === "notebooks" ? b.notebook_count - a.notebook_count : a.name.localeCompare(b.name)
    );
  }, [teachers, query, sortBy]);

  return (
    <div className="min-h-screen bg-white" >
      {/* Nav */}
      <div
        className="sticky top-0 z-20 px-6 py-4"
        style={{
          background: "rgba(245,245,245,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} style={{ color: "#0a0a0a" }} />
            <span className="font-bold text-base" style={{ color: "#0a0a0a" }}>TeacherOS</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: "#e5e5e5", color: "#737373" }}
            >
              Student Portal
            </div>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-gray-200"
                style={{ background: "#e5e5e5", color: "#737373" }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#a3a3a3" }}>
            Discover
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-2" style={{ color: "#0a0a0a" }}>
            Find your <em>teacher.</em>
          </h1>
          <p className="text-sm" style={{ color: "#737373" }}>
            {loading ? "Loading teachers…" : `Browse ${teachers.length} teacher${teachers.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-4"
          style={{ background: "#ffffff", border: "1.5px solid #e5e5e5" }}
        >
          <Search size={18} style={{ color: "#a3a3a3", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#0a0a0a" }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={15} style={{ color: "#a3a3a3" }} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: "#a3a3a3" }}>Sort:</span>
            {(["notebooks", "name"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                style={{
                  background: sortBy === opt ? "#0a0a0a" : "#e5e5e5",
                  color: sortBy === opt ? "#ffffff" : "#737373",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs mb-5" style={{ color: "#a3a3a3" }}>
          {filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#a3a3a3" }}>Loading…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => <TeacherCard key={t.id} teacher={t} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-bold text-lg mb-2" style={{ color: "#0a0a0a" }}>No teachers found</p>
            <p className="text-sm" style={{ color: "#737373" }}>Try a different search</p>
          </div>
        )}
      </div>
    </div>
  );
}