"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import { apiFetch } from "../../../lib/api";
import {
  ArrowLeft, BookOpen, MessageSquare, ChevronRight,
  FileText, GraduationCap, Lock, Bell, ChevronDown,
  LogOut, User, Settings, CheckCheck, Clock,
  AlertCircle, Search, Mail,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Teacher {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  notebook_count: number;
}

interface Notebook {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: Difficulty;
  is_free: boolean;
  doc_count: number;
  updated_at: string;
}

interface Notification {
  id: string;
  type: "access_granted" | "new_notebook" | "system";
  message: string;
  time: string;
  read: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: "#f5f5f5", text: "#404040", border: "#e5e5e5" },
  Intermediate: { bg: "#f0f0f0", text: "#171717", border: "#d4d4d4" },
  Advanced:     { bg: "#0a0a0a", text: "#ffffff", border: "#0a0a0a" },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "access_granted", message: "Mr. Sharma granted you access to Advanced Physics", time: "2m ago", read: false },
  { id: "2", type: "new_notebook", message: "New notebook added: Calculus II — Week 4", time: "1h ago", read: false },
  { id: "3", type: "system", message: "Your access request to Ms. Patel was seen", time: "3h ago", read: true },
  { id: "4", type: "new_notebook", message: "History of Nepal notebook updated", time: "Yesterday", read: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "T";
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({
  notifications,
  onMarkAll,
  onClose,
}: {
  notifications: Notification[];
  onMarkAll: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || !(window as any).gsap) return;
    (window as any).gsap.fromTo(
      el,
      { opacity: 0, y: -8, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  const iconMap = {
    access_granted: <CheckCheck size={13} />,
    new_notebook: <BookOpen size={13} />,
    system: <AlertCircle size={13} />,
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-3 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
      style={{ background: "#ffffff", border: "1.5px solid #e5e5e5", transformOrigin: "top right" }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
        <span className="text-sm font-bold" style={{ color: "#0a0a0a" }}>Notifications</span>
        <button
          onClick={onMarkAll}
          className="text-xs font-medium transition-colors hover:text-black"
          style={{ color: "#737373" }}
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <Bell size={20} style={{ color: "#e5e5e5", margin: "0 auto 8px" }} />
            <p className="text-xs" style={{ color: "#a3a3a3" }}>All caught up</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer"
              style={{ borderBottom: "1px solid #f5f5f5", opacity: n.read ? 0.55 : 1 }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: n.read ? "#f5f5f5" : "#0a0a0a", color: n.read ? "#737373" : "#ffffff" }}
              >
                {iconMap[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug" style={{ color: "#0a0a0a" }}>{n.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={10} style={{ color: "#a3a3a3" }} />
                  <span className="text-xs" style={{ color: "#a3a3a3" }}>{n.time}</span>
                </div>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#0a0a0a" }} />
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3" style={{ borderTop: "1px solid #e5e5e5" }}>
        <button
          onClick={onClose}
          className="w-full text-xs font-semibold py-2 rounded-lg transition-colors hover:bg-black hover:text-white"
          style={{ color: "#0a0a0a", border: "1px solid #e5e5e5" }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

// ─── User Menu ─────────────────────────────────────────────────────────────────

function UserMenu({ session, onSignOut }: { session: any; onSignOut: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = menuRef.current;
    if (!el || !(window as any).gsap) return;
    (window as any).gsap.fromTo(
      el,
      { opacity: 0, y: -8, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-3 w-52 rounded-2xl shadow-2xl overflow-hidden z-50"
      style={{ background: "#ffffff", border: "1.5px solid #e5e5e5", transformOrigin: "top right" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
        <p className="text-xs font-bold truncate" style={{ color: "#0a0a0a" }}>
          {session?.user?.name || "Student"}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: "#a3a3a3" }}>
          {session?.user?.email || ""}
        </p>
      </div>
      {[
        { icon: <User size={13} />, label: "My Profile" },
        { icon: <Settings size={13} />, label: "Settings" },
      ].map((item) => (
        <button
          key={item.label}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-gray-50 text-left"
          style={{ color: "#0a0a0a" }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      <div style={{ borderTop: "1px solid #e5e5e5" }}>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-gray-50"
          style={{ color: "#dc2626" }}
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Notebook Card ─────────────────────────────────────────────────────────────

function NotebookCard({ notebook, teacherId, index }: { notebook: Notebook; teacherId: string; index: number }) {
  const diff = DIFFICULTY_STYLES[notebook.difficulty] ?? DIFFICULTY_STYLES.Beginner;
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic tilt
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !(window as any).gsap) return;
    const gsap = (window as any).gsap;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      gsap.to(el, { rotateX: y, rotateY: x, duration: 0.3, ease: "power2.out", transformPerspective: 800 });
    };
    const handleLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1,0.7)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <Link href={`/teachers/${teacherId}/chat?notebook=${notebook.id}`} className="block group">
      <div
        ref={cardRef}
        className="notebook-card relative rounded-2xl p-5 h-full flex flex-col"
        style={{
          background: "#ffffff",
          border: "1.5px solid #e5e5e5",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "box-shadow 0.3s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 20px 60px -12px rgba(0,0,0,0.1)";
          el.style.borderColor = "#0a0a0a";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "none";
          el.style.borderColor = "#e5e5e5";
        }}
      >
        {/* Index */}
        <div
          className="absolute top-4 left-4 w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: "#f5f5f5" }}
        >
          <span className="text-xs font-bold" style={{ color: "#a3a3a3", fontFamily: "'JetBrains Mono', monospace" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Lock / Free badge */}
        <div className="absolute top-4 right-4">
          {notebook.is_free ? (
            <span
              className="px-2 py-0.5 rounded-lg text-xs font-bold"
              style={{ background: "#0a0a0a", color: "#ffffff", fontFamily: "'JetBrains Mono', monospace" }}
            >
              FREE
            </span>
          ) : (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
            >
              <Lock size={13} style={{ color: "#a3a3a3" }} />
            </div>
          )}
        </div>

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mt-8 mb-3 pr-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
          >
            <FileText size={15} style={{ color: "#404040" }} />
          </div>
          <div className="min-w-0">
            <p
              className="font-bold text-sm leading-snug"
              style={{ color: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}
            >
              {notebook.title}
            </p>
            <p
              className="text-xs mt-1 leading-relaxed line-clamp-2"
              style={{ color: "#737373" }}
            >
              {notebook.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}
          >
            {notebook.difficulty}
          </span>
          {notebook.subject && (
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{ background: "#f5f5f5", color: "#737373", border: "1px solid #e5e5e5" }}
            >
              {notebook.subject}
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-4 pt-3 mt-auto"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-1.5">
            <BookOpen size={12} style={{ color: "#a3a3a3" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {notebook.doc_count}
            </span>
            <span className="text-xs" style={{ color: "#a3a3a3" }}>chapters</span>
          </div>
          <span className="text-xs ml-auto" style={{ color: "#a3a3a3" }}>
            {new Date(notebook.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Hover CTA */}
        <div
          className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "#0a0a0a" }}
        >
          {notebook.is_free ? "Open notebook" : "Request access"}
          <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="rounded-3xl p-8 mb-8 animate-pulse" style={{ background: "#f5f5f5", border: "1.5px solid #e5e5e5" }}>
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl flex-shrink-0" style={{ background: "#e5e5e5" }} />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-6 rounded" style={{ background: "#e5e5e5", width: "40%" }} />
          <div className="h-4 rounded" style={{ background: "#e5e5e5", width: "28%" }} />
          <div className="h-4 rounded mt-4" style={{ background: "#e5e5e5", width: "20%" }} />
        </div>
      </div>
    </div>
  );
}

function NotebookSkeleton() {
  return (
    <div className="rounded-2xl p-5 h-44 animate-pulse" style={{ background: "#f5f5f5", border: "1.5px solid #e5e5e5" }}>
      <div className="flex gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl" style={{ background: "#e5e5e5" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded" style={{ background: "#e5e5e5", width: "65%" }} />
          <div className="h-3 rounded" style={{ background: "#e5e5e5", width: "45%" }} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-20 rounded-md" style={{ background: "#e5e5e5" }} />
        <div className="h-5 w-16 rounded-md" style={{ background: "#e5e5e5" }} />
      </div>
      <div className="h-px" style={{ background: "#e5e5e5" }} />
      <div className="flex justify-between mt-3">
        <div className="h-3 w-20 rounded" style={{ background: "#e5e5e5" }} />
        <div className="h-3 w-16 rounded" style={{ background: "#e5e5e5" }} />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TeacherProfilePage() {
  const params = useParams<{ teacherId: string }>();
  const teacherId = params.teacherId;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { data: session } = useSession();

  const navRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const gsapLoaded = useRef(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load GSAP
  useEffect(() => {
    if (gsapLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => { gsapLoaded.current = true; runEntrance(); };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  function runEntrance() {
    const gsap = (window as any).gsap;
    if (!gsap) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (navRef.current) tl.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    if (heroRef.current) {
      tl.fromTo(heroRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.2");
    }
  }

  // Animate notebooks grid when data arrives
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const gsap = (window as any).gsap;
    if (!gsap) return;
    const cards = gridRef.current.querySelectorAll(".notebook-card");
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0, clipPath: "inset(100% 0 0 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.5, stagger: 0.07, ease: "power3.out" }
    );
  }, [loading, notebooks, activeSubject]);

  function shakeBell() {
    const gsap = (window as any).gsap;
    if (!gsap || !bellRef.current) return;
    gsap.fromTo(
      bellRef.current,
      { rotate: 0 },
      { rotate: 15, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => gsap.set(bellRef.current, { rotate: 0 }) }
    );
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const session = await getSession();
        const token = session?.backendAccessToken;
        const [teacherData, notebooksData] = await Promise.all([
          apiFetch<Teacher>(`/student/teachers/${teacherId}`, token),
          apiFetch<Notebook[]>(`/student/teachers/${teacherId}/notebooks`, token),
        ]);
        if (!mounted) return;
        setTeacher(teacherData);
        setNotebooks(notebooksData);
      } catch (error) {
        console.error("Failed to load teacher profile", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [teacherId]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const subjects = Array.from(new Set(notebooks.map((n) => n.subject).filter(Boolean)));
  const filtered = activeSubject === "All" ? notebooks : notebooks.filter((n) => n.subject === activeSubject);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#fafafa" }}>

        {/* ── Navigation ── */}
        <nav
          ref={navRef}
          className="sticky top-0 z-30 px-6"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between h-14 gap-4">
            {/* Back + Logo */}
            <div className="flex items-center gap-4">
              <Link
                href="/teachers"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-gray-100"
                style={{ color: "#0a0a0a", border: "1px solid #e5e5e5" }}
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">All Teachers</span>
              </Link>
              <div className="h-4 w-px" style={{ background: "#e5e5e5" }} />
              <Link href="/" className="flex items-center gap-2 group">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: "#0a0a0a" }}
                >
                  <GraduationCap size={14} color="#ffffff" />
                </div>
                <span className="font-bold text-sm hidden sm:block" style={{ color: "#0a0a0a" }}>
                  TeacherOS
                </span>
              </Link>
            </div>

            {/* Breadcrumb */}
            {teacher && (
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
                style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", color: "#737373" }}
              >
                <span>Teachers</span>
                <ChevronRight size={11} style={{ color: "#a3a3a3" }} />
                <span className="font-semibold" style={{ color: "#0a0a0a" }}>{teacher.name}</span>
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Bell */}
              <div data-dropdown className="relative">
                <button
                  ref={bellRef}
                  onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); if (!notifOpen) shakeBell(); }}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{ border: "1px solid #e5e5e5" }}
                >
                  <Bell size={15} style={{ color: "#0a0a0a" }} />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#0a0a0a", color: "#ffffff", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    onMarkAll={() => setNotifications((n) => n.map((x) => ({ ...x, read: true })))}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </div>

              {/* User */}
              <div data-dropdown className="relative">
                <button
                  onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors hover:bg-gray-100"
                  style={{ border: "1px solid #e5e5e5" }}
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="avatar"
                      className="w-6 h-6 rounded-lg object-cover"
                      style={{ filter: "grayscale(100%)" }}
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "#0a0a0a", color: "#ffffff" }}
                    >
                      {getInitials(session?.user?.name || "S")}
                    </div>
                  )}
                  <span className="text-xs font-semibold hidden sm:block" style={{ color: "#0a0a0a" }}>
                    {session?.user?.name?.split(" ")[0] || "Student"}
                  </span>
                  <ChevronDown
                    size={12}
                    style={{
                      color: "#a3a3a3",
                      transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                {userMenuOpen && (
                  <UserMenu session={session} onSignOut={() => signOut({ callbackUrl: "/" })} />
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* ── Profile Header ── */}
          {loading ? (
            <ProfileSkeleton />
          ) : teacher ? (
            <div
              ref={heroRef}
              className="rounded-3xl p-8 mb-8"
              style={{ background: "#ffffff", border: "1.5px solid #e5e5e5" }}
            >
              <div className="flex items-start gap-6 flex-wrap">
                {/* Avatar */}
                {teacher.picture ? (
                  <img
                    src={teacher.picture}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    style={{ filter: "grayscale(100%)" }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ background: "#0a0a0a", color: "#ffffff", fontFamily: "'DM Serif Display', serif" }}
                  >
                    {getInitials(teacher.name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className="font-mono text-xs tracking-widest uppercase mb-2"
                        style={{ color: "#a3a3a3", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}
                      >
                        Educator
                      </p>
                      <h1
                        className="font-bold text-3xl leading-tight mb-1"
                        style={{ color: "#0a0a0a", fontFamily: "'DM Serif Display', serif" }}
                      >
                        {teacher.name}
                      </h1>
                      <p className="text-sm" style={{ color: "#737373" }}>{teacher.email}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div
                    className="flex items-center gap-6 mt-5 pt-5 flex-wrap"
                    style={{ borderTop: "1px solid #f0f0f0" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
                      >
                        <BookOpen size={14} style={{ color: "#404040" }} />
                      </div>
                      <div>
                        <p
                          className="text-sm font-bold leading-tight"
                          style={{ color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {notebooks.length}
                        </p>
                        <p className="text-xs" style={{ color: "#a3a3a3" }}>notebooks</p>
                      </div>
                    </div>
                    {subjects.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
                        >
                          <FileText size={14} style={{ color: "#404040" }} />
                        </div>
                        <div>
                          <p
                            className="text-sm font-bold leading-tight"
                            style={{ color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {subjects.length}
                          </p>
                          <p className="text-xs" style={{ color: "#a3a3a3" }}>subjects</p>
                        </div>
                      </div>
                    )}
                    <div className="ml-auto">
                      <Link
                        href={`/teachers/${teacherId}/chat`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{ background: "#0a0a0a", color: "#ffffff" }}
                      >
                        <MessageSquare size={14} />
                        Chat with AI
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "#a3a3a3" }}>Teacher not found.</p>
            </div>
          )}

          {/* ── Notebooks ── */}
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2
                className="font-bold text-xl"
                style={{ color: "#0a0a0a", fontFamily: "'DM Serif Display', serif" }}
              >
                Notebooks
              </h2>

              {/* Subject filter tabs */}
              {subjects.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveSubject("All")}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      background: activeSubject === "All" ? "#0a0a0a" : "#f5f5f5",
                      color: activeSubject === "All" ? "#ffffff" : "#737373",
                      border: `1px solid ${activeSubject === "All" ? "#0a0a0a" : "#e5e5e5"}`,
                    }}
                  >
                    All
                    <span
                      className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                      style={{
                        background: activeSubject === "All" ? "rgba(255,255,255,0.2)" : "#e5e5e5",
                        color: activeSubject === "All" ? "#ffffff" : "#a3a3a3",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {notebooks.length}
                    </span>
                  </button>
                  {subjects.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSubject(s)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                      style={{
                        background: activeSubject === s ? "#0a0a0a" : "#f5f5f5",
                        color: activeSubject === s ? "#ffffff" : "#737373",
                        border: `1px solid ${activeSubject === s ? "#0a0a0a" : "#e5e5e5"}`,
                      }}
                    >
                      {s}
                      <span
                        className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                        style={{
                          background: activeSubject === s ? "rgba(255,255,255,0.2)" : "#e5e5e5",
                          color: activeSubject === s ? "#ffffff" : "#a3a3a3",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {notebooks.filter((n) => n.subject === s).length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <NotebookSkeleton key={i} />)}
              </div>
            ) : filtered.length > 0 ? (
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((nb, i) => (
                  <NotebookCard key={nb.id} notebook={nb} teacherId={teacherId} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
                >
                  <BookOpen size={24} style={{ color: "#a3a3a3" }} />
                </div>
                <p
                  className="font-bold text-xl mb-2"
                  style={{ color: "#0a0a0a", fontFamily: "'DM Serif Display', serif" }}
                >
                  No notebooks yet
                </p>
                <p className="text-sm" style={{ color: "#737373" }}>
                  This teacher hasn't published any notebooks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}