"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import {
  Search, BookOpen, X, GraduationCap, Mail,
  Bell, ChevronDown, LogOut, User, Settings,
  CheckCheck, Clock, AlertCircle, ArrowUpRight,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teacher {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  notebook_count: number;
}

interface Notification {
  id: string;
  type: "access_granted" | "new_notebook" | "system";
  message: string;
  time: string;
  read: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "access_granted", message: "Mr. Sharma granted you access to Advanced Physics", time: "2m ago", read: false },
  { id: "2", type: "new_notebook", message: "New notebook added: Calculus II — Week 4", time: "1h ago", read: false },
  { id: "3", type: "system", message: "Your access request to Ms. Patel was seen", time: "3h ago", read: true },
  { id: "4", type: "new_notebook", message: "History of Nepal notebook updated", time: "Yesterday", read: true },
];

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
    // GSAP entrance
    const el = panelRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && (window as any).gsap) {
      (window as any).gsap.fromTo(
        el,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
      );
    }
  }, []);

  const iconMap = {
    access_granted: <CheckCheck size={14} className="text-black" />,
    new_notebook: <BookOpen size={14} className="text-black" />,
    system: <AlertCircle size={14} style={{ color: "#737373" }} />,
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
                style={{ background: n.read ? "#f5f5f5" : "#0a0a0a" }}
              >
                <span style={{ filter: n.read ? "none" : "invert(1)" }}>
                  {iconMap[n.type]}
                </span>
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

function UserMenu({
  session,
  onSignOut,
}: {
  session: any;
  onSignOut: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && (window as any).gsap) {
      (window as any).gsap.fromTo(
        el,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
      );
    }
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

// ─── Teacher Card ─────────────────────────────────────────────────────────────

function TeacherCard({ teacher, index }: { teacher: Teacher; index: number }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic tilt on hover
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof window === "undefined" || !(window as any).gsap) return;
    const gsap = (window as any).gsap;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
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
      ref={cardRef}
      className="teacher-card relative rounded-2xl p-6 h-full flex flex-col cursor-default"
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e5e5",
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px -12px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#0a0a0a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
      }}
    >
      {/* Index badge */}
      <div
        className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center"
        style={{ background: "#f5f5f5" }}
      >
        <span className="text-xs font-mono font-bold" style={{ color: "#a3a3a3" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

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
            style={{ background: "#0a0a0a", color: "#ffffff", fontFamily: "'DM Serif Display', serif" }}
          >
            {getInitials(teacher.name)}
          </div>
        )}
        <div className="min-w-0 pr-6">
          <p
            className="font-bold text-base leading-tight truncate"
            style={{ color: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}
          >
            {teacher.name}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#737373" }}>
            {teacher.email}
          </p>
          <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs font-medium" style={{ color: "#0a0a0a" }}>View profile</span>
            <ArrowUpRight size={11} style={{ color: "#0a0a0a" }} />
          </div>
        </div>
      </Link>

      <div
        className="flex items-center gap-4 py-3 mt-auto"
        style={{ borderTop: "1px solid #f0f0f0" }}
      >
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} style={{ color: "#a3a3a3" }} />
          <span
            className="text-xs font-semibold"
            style={{ color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {teacher.notebook_count}
          </span>
          <span className="text-xs" style={{ color: "#a3a3a3" }}>
            notebook{teacher.notebook_count !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={handleRequestAccess}
          disabled={sending || sent}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: sent ? "#f5f5f5" : error ? "#fef2f2" : "#0a0a0a",
            color: sent ? "#737373" : error ? "#dc2626" : "#ffffff",
            border: `1px solid ${sent ? "#e5e5e5" : error ? "#fecaca" : "#0a0a0a"}`,
          }}
        >
          <Mail size={12} />
          {sending ? "Sending…" : sent ? "Sent ✓" : error ? "Retry" : "Request Access"}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-2xl p-6 h-36 animate-pulse" style={{ background: "#f5f5f5", border: "1.5px solid #e5e5e5" }}>
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl" style={{ background: "#e5e5e5" }} />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 rounded" style={{ background: "#e5e5e5", width: "60%" }} />
          <div className="h-3 rounded" style={{ background: "#e5e5e5", width: "40%" }} />
        </div>
      </div>
      <div className="h-px" style={{ background: "#e5e5e5" }} />
      <div className="flex justify-between mt-3">
        <div className="h-3 w-20 rounded" style={{ background: "#e5e5e5" }} />
        <div className="h-6 w-28 rounded-lg" style={{ background: "#e5e5e5" }} />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentDiscoverPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "notebooks">("notebooks");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { data: session } = useSession();
  const router = useRouter();

  const navRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const gsapLoaded = useRef(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load GSAP from CDN
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
      const els = heroRef.current.querySelectorAll(".anim-in");
      tl.fromTo(els, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 }, "-=0.2");
    }
    if (searchRef.current) tl.fromTo(searchRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.2");
  }

  // Animate grid cards when data arrives
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const gsap = (window as any).gsap;
    if (!gsap) return;
    const cards = gridRef.current.querySelectorAll(".teacher-card");
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0, clipPath: "inset(100% 0 0 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.55, stagger: 0.06, ease: "power3.out" }
    );
  }, [loading, teachers]);

  // Bell shake animation on new notification
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
    async function loadTeachers() {
      try {
        const session = await getSession();
        if (!session) { router.replace("/"); return; }
        const userData = await apiFetch<Teacher[]>("/student/teachers", session.backendAccessToken);
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
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'DM Serif Display', serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }
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
          <div className="max-w-5xl mx-auto flex items-center justify-between h-14 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: "#0a0a0a" }}
              >
                <GraduationCap size={16} color="#ffffff" />
              </div>
              <span className="font-bold text-sm tracking-tight" style={{ color: "#0a0a0a" }}>
                TeacherOS
              </span>
            </Link>

            {/* Centre pill */}
            <div
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "#f5f5f5", color: "#737373", border: "1px solid #e5e5e5" }}
            >
              <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: "#22c55e" }} />
              Student Portal
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div data-dropdown className="relative">
                <button
                  ref={bellRef}
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setUserMenuOpen(false);
                    if (!notifOpen) shakeBell();
                  }}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100 active:scale-95"
                  style={{ border: "1px solid #e5e5e5" }}
                >
                  <Bell size={16} style={{ color: "#0a0a0a" }} />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-mono-data"
                      style={{ background: "#0a0a0a", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace" }}
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

              {/* User avatar + menu */}
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
                    size={13}
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

        {/* ── Hero ── */}
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-8" ref={heroRef}>
          <p
            className="anim-in font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: "#a3a3a3", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.18em" }}
          >
            Discover
          </p>
          <h1
            className="anim-in font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4"
            style={{ color: "#0a0a0a", fontFamily: "'DM Serif Display', serif" }}
          >
            Find your <em>teacher.</em>
          </h1>
          <p className="anim-in text-sm" style={{ color: "#737373" }}>
            {loading
              ? "Loading teachers…"
              : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} on the platform`}
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-16" ref={searchRef}>
          {/* Search bar */}
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-4 transition-shadow duration-200 focus-within:shadow-lg"
            style={{ background: "#ffffff", border: "1.5px solid #e5e5e5" }}
          >
            <Search size={17} style={{ color: "#a3a3a3", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#0a0a0a" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="transition-transform hover:scale-110 active:scale-90"
              >
                <X size={15} style={{ color: "#a3a3a3" }} />
              </button>
            )}
          </div>

          {/* Sort + Count row */}
          <div className="flex items-center gap-3 mb-8">
            <p className="text-xs font-mono-data" style={{ color: "#a3a3a3", fontFamily: "'JetBrains Mono', monospace" }}>
              {filtered.length} found
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs" style={{ color: "#a3a3a3" }}>Sort by</span>
              {(["notebooks", "name"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: sortBy === opt ? "#0a0a0a" : "#f5f5f5",
                    color: sortBy === opt ? "#ffffff" : "#737373",
                    border: `1px solid ${sortBy === opt ? "#0a0a0a" : "#e5e5e5"}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => <TeacherCard key={t.id} teacher={t} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
              >
                <Search size={24} style={{ color: "#a3a3a3" }} />
              </div>
              <p className="font-bold text-lg mb-2" style={{ color: "#0a0a0a", fontFamily: "'DM Serif Display', serif" }}>
                No teachers found
              </p>
              <p className="text-sm mb-6" style={{ color: "#737373" }}>
                Try a different name or email
              </p>
              <button
                onClick={() => setQuery("")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "#0a0a0a", color: "#ffffff" }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}