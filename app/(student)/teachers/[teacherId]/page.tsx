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
  AlertCircle,
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

// ─── Monochrome palette (matches NotebookChatPage) ────────────────────────────

const MONO = {
  bg:        "#0a0a0a",
  surface:   "#111111",
  elevated:  "#1a1a1a",
  border:    "#242424",
  borderMid: "#333333",
  muted:     "#555555",
  secondary: "#888888",
  primary:   "#cccccc",
  bright:    "#ffffff",
};

// ─── Difficulty badges — luminance only ───────────────────────────────────────

const DIFFICULTY_STYLES: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: MONO.elevated, text: MONO.secondary, border: MONO.border },
  Intermediate: { bg: MONO.elevated, text: MONO.primary,   border: MONO.borderMid },
  Advanced:     { bg: MONO.bright,   text: MONO.bg,        border: MONO.bright },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "access_granted", message: "Mr. Sharma granted you access to Advanced Physics", time: "2m ago", read: false },
  { id: "2", type: "new_notebook",   message: "New notebook added: Calculus II — Week 4",          time: "1h ago",     read: false },
  { id: "3", type: "system",         message: "Your access request to Ms. Patel was seen",          time: "3h ago",     read: true },
  { id: "4", type: "new_notebook",   message: "History of Nepal notebook updated",                  time: "Yesterday",  read: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "T";
}

// ─── Global styles ────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  .tp-root {
    min-height: 100vh;
    background: ${MONO.bg};
    color: ${MONO.primary};
  }

  /* noise grain */
  .tp-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.18;
  }

  .tp-nav {
    background: rgba(17,17,17,0.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid ${MONO.border};
  }

  .tp-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 10px; border: 1px solid ${MONO.border};
    background: transparent; color: ${MONO.primary}; cursor: pointer;
    font-size: 12px; font-weight: 600; text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .tp-btn:hover { background: ${MONO.elevated}; color: ${MONO.bright}; border-color: ${MONO.borderMid}; }

  .tp-icon-btn {
    width: 36px; height: 36px; border-radius: 10px; border: 1px solid ${MONO.border};
    display: flex; align-items: center; justify-content: center;
    background: transparent; color: ${MONO.secondary}; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .tp-icon-btn:hover { background: ${MONO.elevated}; color: ${MONO.bright}; }

  .tp-card {
    background: ${MONO.surface};
    border: 1px solid ${MONO.border};
    border-radius: 20px;
    transition: border-color 0.2s, box-shadow 0.3s;
  }
  .tp-card:hover {
    border-color: ${MONO.borderMid};
    box-shadow: 0 20px 60px -12px rgba(0,0,0,0.6);
  }

  .tp-notebook-card {
    background: ${MONO.surface};
    border: 1px solid ${MONO.border};
    border-radius: 16px;
    transition: border-color 0.2s, box-shadow 0.3s;
    will-change: transform;
  }
  .tp-notebook-card:hover {
    border-color: ${MONO.borderMid};
    box-shadow: 0 16px 48px -8px rgba(0,0,0,0.7);
  }

  .tp-filter-btn {
    padding: 6px 12px; border-radius: 10px; border: 1px solid ${MONO.border};
    font-size: 12px; font-weight: 600; cursor: pointer;
    background: transparent; color: ${MONO.muted};
    transition: all 0.15s ease;
  }
  .tp-filter-btn:hover { background: ${MONO.elevated}; color: ${MONO.primary}; }
  .tp-filter-btn.active { background: ${MONO.bright}; color: ${MONO.bg}; border-color: ${MONO.bright}; }

  .tp-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 12px; border: none;
    background: ${MONO.bright}; color: ${MONO.bg};
    font-size: 13px; font-weight: 700; cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s, transform 0.12s;
  }
  .tp-cta:hover { opacity: 0.9; transform: scale(1.03); }
  .tp-cta:active { transform: scale(0.96); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${MONO.border}; border-radius: 2px; }

  /* skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .tp-skeleton {
    background: linear-gradient(90deg, ${MONO.surface} 25%, ${MONO.elevated} 50%, ${MONO.surface} 75%);
    background-size: 600px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 6px;
  }

  /* dropdown */
  .tp-dropdown {
    background: ${MONO.surface};
    border: 1px solid ${MONO.borderMid};
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.8);
    overflow: hidden;
  }

  .tp-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 10px 16px;
    background: transparent; border: none;
    color: ${MONO.primary}; font-size: 12px; cursor: pointer;
    text-align: left; text-decoration: none;
    transition: background 0.12s, color 0.12s;
  }
  .tp-dropdown-item:hover { background: ${MONO.elevated}; color: ${MONO.bright}; }
  .tp-dropdown-item.danger { color: #ef4444; }
  .tp-dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }

  .font-mono-num { font-family: 'JetBrains Mono', monospace; }
  .font-display  { font-family: 'DM Serif Display', serif; }

  .tp-divider { height: 1px; background: ${MONO.border}; }

  .tp-badge {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 6px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  /* hover cta reveal */
  .nb-hover-cta { opacity: 0; transition: opacity 0.2s; }
  .tp-notebook-card:hover .nb-hover-cta { opacity: 1; }
`;

function InjectCSS() {
  useEffect(() => {
    if (document.getElementById("tp-css")) return;
    const el = document.createElement("style");
    el.id = "tp-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);
  return null;
}

// ─── GSAP helpers ─────────────────────────────────────────────────────────────

function gsapFrom(el: Element | null, from: object, to: object) {
  const g = (window as any).gsap;
  if (!g || !el) return;
  g.fromTo(el, from, to);
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({
  notifications, onMarkAll, onClose,
}: {
  notifications: Notification[]; onMarkAll: () => void; onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsapFrom(panelRef.current,
      { opacity: 0, y: -10, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  const iconMap = {
    access_granted: <CheckCheck size={12} />,
    new_notebook:   <BookOpen size={12} />,
    system:         <AlertCircle size={12} />,
  };

  return (
    <div ref={panelRef} className="tp-dropdown"
      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 300, zIndex: 50, transformOrigin: "top right" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${MONO.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: MONO.bright }}>Notifications</span>
        <button onClick={onMarkAll} style={{ fontSize: 11, color: MONO.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = MONO.bright)}
          onMouseLeave={e => (e.currentTarget.style.color = MONO.muted)}
        >
          Mark all read
        </button>
      </div>

      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center" }}>
            <Bell size={18} style={{ color: MONO.muted, margin: "0 auto 8px" }} />
            <p style={{ fontSize: 12, color: MONO.muted }}>All caught up</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px",
            borderBottom: `1px solid ${MONO.border}`, opacity: n.read ? 0.45 : 1,
            cursor: "pointer", transition: "background 0.12s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = MONO.elevated)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: n.read ? MONO.elevated : MONO.bright,
              color: n.read ? MONO.muted : MONO.bg,
              border: `1px solid ${MONO.border}`,
            }}>
              {iconMap[n.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: MONO.primary, lineHeight: 1.5, margin: 0 }}>{n.message}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Clock size={9} style={{ color: MONO.muted }} />
                <span style={{ fontSize: 11, color: MONO.muted }}>{n.time}</span>
              </div>
            </div>
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: MONO.bright, flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 16px", borderTop: `1px solid ${MONO.border}` }}>
        <button onClick={onClose} style={{
          width: "100%", padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
          color: MONO.primary, background: MONO.elevated, border: `1px solid ${MONO.border}`, cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
          onMouseEnter={e => { (e.currentTarget.style.background = MONO.bright); (e.currentTarget.style.color = MONO.bg); }}
          onMouseLeave={e => { (e.currentTarget.style.background = MONO.elevated); (e.currentTarget.style.color = MONO.primary); }}
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
    gsapFrom(menuRef.current,
      { opacity: 0, y: -10, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={menuRef} className="tp-dropdown"
      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 210, zIndex: 50, transformOrigin: "top right" }}
    >
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${MONO.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: MONO.bright, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {session?.user?.name || "Student"}
        </p>
        <p style={{ fontSize: 11, color: MONO.muted, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {session?.user?.email || ""}
        </p>
      </div>
      {[
        { icon: <User size={12} />, label: "My Profile" },
        { icon: <Settings size={12} />, label: "Settings" },
      ].map(item => (
        <button key={item.label} className="tp-dropdown-item">{item.icon}{item.label}</button>
      ))}
      <div style={{ borderTop: `1px solid ${MONO.border}` }}>
        <button onClick={onSignOut} className="tp-dropdown-item danger">
          <LogOut size={12} /> Sign out
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
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -7;
      gsap.to(el, { rotateX: y, rotateY: x, duration: 0.3, ease: "power2.out", transformPerspective: 900 });
    };
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1,0.7)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <Link href={`/teachers/${teacherId}/chat?notebook=${notebook.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div ref={cardRef} className="tp-notebook-card" style={{ padding: 20, display: "flex", flexDirection: "column", height: "100%", transformStyle: "preserve-3d", position: "relative" }}>

        {/* Index */}
        <div style={{
          position: "absolute", top: 14, left: 14, width: 24, height: 24, borderRadius: 7,
          background: MONO.elevated, border: `1px solid ${MONO.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span className="font-mono-num" style={{ fontSize: 10, fontWeight: 700, color: MONO.muted }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Lock / Free */}
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          {notebook.is_free ? (
            <span className="tp-badge" style={{ background: MONO.bright, color: MONO.bg }}>FREE</span>
          ) : (
            <div style={{
              width: 26, height: 26, borderRadius: 8,
              background: MONO.elevated, border: `1px solid ${MONO.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock size={12} style={{ color: MONO.muted }} />
            </div>
          )}
        </div>

        {/* Icon + Title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 38, marginBottom: 12, paddingRight: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: MONO.elevated, border: `1px solid ${MONO.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={14} style={{ color: MONO.secondary }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="font-display" style={{ fontWeight: 700, fontSize: 15, color: MONO.bright, margin: 0, lineHeight: 1.3 }}>
              {notebook.title}
            </p>
            <p style={{ fontSize: 12, color: MONO.muted, margin: "4px 0 0", lineHeight: 1.5,
              overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
              {notebook.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <span className="tp-badge" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
            {notebook.difficulty}
          </span>
          {notebook.subject && (
            <span className="tp-badge" style={{ background: MONO.elevated, color: MONO.secondary, border: `1px solid ${MONO.border}` }}>
              {notebook.subject}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, marginTop: "auto", borderTop: `1px solid ${MONO.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen size={11} style={{ color: MONO.muted }} />
            <span className="font-mono-num" style={{ fontSize: 12, fontWeight: 700, color: MONO.primary }}>
              {notebook.doc_count}
            </span>
            <span style={{ fontSize: 12, color: MONO.muted }}>chapters</span>
          </div>
          <span style={{ fontSize: 11, color: MONO.muted, marginLeft: "auto" }}>
            {new Date(notebook.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Hover CTA */}
        <div className="nb-hover-cta" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: MONO.bright }}>
          {notebook.is_free ? "Open notebook" : "Request access"}
          <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="tp-card" style={{ padding: 32, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        <div className="tp-skeleton" style={{ width: 80, height: 80, borderRadius: 16, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="tp-skeleton" style={{ height: 24, width: "40%", marginBottom: 10 }} />
          <div className="tp-skeleton" style={{ height: 14, width: "25%", marginBottom: 20 }} />
          <div className="tp-skeleton" style={{ height: 14, width: "20%" }} />
        </div>
      </div>
    </div>
  );
}

function NotebookSkeleton() {
  return (
    <div style={{ background: MONO.surface, border: `1px solid ${MONO.border}`, borderRadius: 16, padding: 20, height: 176 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div className="tp-skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="tp-skeleton" style={{ height: 14, width: "65%", marginBottom: 8 }} />
          <div className="tp-skeleton" style={{ height: 11, width: "45%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <div className="tp-skeleton" style={{ height: 20, width: 76, borderRadius: 6 }} />
        <div className="tp-skeleton" style={{ height: 20, width: 60, borderRadius: 6 }} />
      </div>
      <div className="tp-skeleton" style={{ height: 1, marginBottom: 12 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="tp-skeleton" style={{ height: 11, width: 80 }} />
        <div className="tp-skeleton" style={{ height: 11, width: 60 }} />
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

  const navRef   = useRef<HTMLDivElement>(null);
  const heroRef  = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const bellRef  = useRef<HTMLButtonElement>(null);
  const gsapLoaded = useRef(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load GSAP + entrance
  useEffect(() => {
    if (gsapLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => {
      gsapLoaded.current = true;
      const gsap = (window as any).gsap;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (navRef.current)  tl.fromTo(navRef.current,  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 });
      if (heroRef.current) tl.fromTo(heroRef.current, { y: 28, opacity: 0  }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2");
    };
    document.head.appendChild(script);
  }, []);

  // Animate grid cards when data arrives
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const g = (window as any).gsap;
    if (!g) return;
    const cards = gridRef.current.querySelectorAll(".tp-notebook-card");
    g.fromTo(cards,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out" }
    );
  }, [loading, notebooks, activeSubject]);

  function shakeBell() {
    const g = (window as any).gsap;
    if (!g || !bellRef.current) return;
    g.fromTo(bellRef.current, { rotate: 0 }, {
      rotate: 14, duration: 0.1, yoyo: true, repeat: 5,
      ease: "power1.inOut", onComplete: () => g.set(bellRef.current, { rotate: 0 }),
    });
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await getSession();
        const token = (session as any)?.backendAccessToken;
        const [td, nd] = await Promise.all([
          apiFetch<Teacher>(`/student/teachers/${teacherId}`, token),
          apiFetch<Notebook[]>(`/student/teachers/${teacherId}/notebooks`, token),
        ]);
        if (!mounted) return;
        setTeacher(td); setNotebooks(nd);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [teacherId]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-dropdown]")) {
        setNotifOpen(false); setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const subjects  = Array.from(new Set(notebooks.map(n => n.subject).filter(Boolean)));
  const filtered  = activeSubject === "All" ? notebooks : notebooks.filter(n => n.subject === activeSubject);

  return (
    <>
      <InjectCSS />
      <div className="tp-root">

        {/* ── Nav ── */}
        <nav ref={navRef} className="tp-nav" style={{ position: "sticky", top: 0, zIndex: 30, padding: "0 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, gap: 16 }}>

            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/teachers" className="tp-btn">
                <ArrowLeft size={13} />
                <span style={{ display: "none" }}>All Teachers</span>
                <span className="sm-show">All Teachers</span>
              </Link>
              <div style={{ width: 1, height: 16, background: MONO.border }} />
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 9, background: MONO.bright,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <GraduationCap size={14} color={MONO.bg} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: MONO.bright, fontFamily: "'Inter', sans-serif" }}>
                  TeacherOS
                </span>
              </Link>
            </div>

            {/* Breadcrumb */}
            {teacher && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 10,
                background: MONO.elevated, border: `1px solid ${MONO.border}`,
                fontSize: 11, color: MONO.muted,
              }}>
                <span>Teachers</span>
                <ChevronRight size={10} style={{ color: MONO.muted }} />
                <span style={{ fontWeight: 700, color: MONO.bright }}>{teacher.name}</span>
              </div>
            )}

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Bell */}
              <div data-dropdown style={{ position: "relative" }}>
                <button ref={bellRef} className="tp-icon-btn"
                  onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); if (!notifOpen) shakeBell(); }}
                  style={{ position: "relative" }}
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="font-mono-num" style={{
                      position: "absolute", top: 4, right: 4, width: 16, height: 16,
                      borderRadius: "50%", background: MONO.bright, color: MONO.bg,
                      fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    onMarkAll={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </div>

              {/* User */}
              <div data-dropdown style={{ position: "relative" }}>
                <button
                  onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 12px 5px 6px", borderRadius: 10,
                    background: "transparent", border: `1px solid ${MONO.border}`,
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = MONO.elevated)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="avatar"
                      style={{ width: 24, height: 24, borderRadius: 7, objectFit: "cover", filter: "grayscale(100%)" }}
                    />
                  ) : (
                    <div className="font-mono-num" style={{
                      width: 24, height: 24, borderRadius: 7, background: MONO.elevated,
                      border: `1px solid ${MONO.border}`, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 10, fontWeight: 700, color: MONO.bright,
                    }}>
                      {getInitials(session?.user?.name || "S")}
                    </div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: MONO.primary }}>
                    {session?.user?.name?.split(" ")[0] || "Student"}
                  </span>
                  <ChevronDown size={11} style={{
                    color: MONO.muted,
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }} />
                </button>
                {userMenuOpen && <UserMenu session={session} onSignOut={() => signOut({ callbackUrl: "/" })} />}
              </div>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* ── Profile Hero ── */}
          {loading ? <ProfileSkeleton /> : teacher ? (
            <div ref={heroRef} className="tp-card" style={{ padding: 32, marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
                {/* Avatar */}
                {teacher.picture ? (
                  <img src={teacher.picture} alt={teacher.name} style={{
                    width: 76, height: 76, borderRadius: 16, objectFit: "cover", flexShrink: 0,
                    filter: "grayscale(100%)", border: `1px solid ${MONO.border}`,
                  }} />
                ) : (
                  <div className="font-display" style={{
                    width: 76, height: 76, borderRadius: 16, flexShrink: 0,
                    background: MONO.elevated, border: `1px solid ${MONO.borderMid}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, fontWeight: 700, color: MONO.bright,
                  }}>
                    {getInitials(teacher.name)}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-mono-num" style={{ fontSize: 10, color: MONO.muted, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>
                    Educator
                  </p>
                  <h1 className="font-display" style={{ fontSize: 30, color: MONO.bright, margin: "0 0 4px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
                    {teacher.name}
                  </h1>
                  <p style={{ fontSize: 13, color: MONO.muted, margin: 0 }}>{teacher.email}</p>

                  {/* Stats row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${MONO.border}`, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9, background: MONO.elevated, border: `1px solid ${MONO.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <BookOpen size={13} style={{ color: MONO.secondary }} />
                      </div>
                      <div>
                        <p className="font-mono-num" style={{ fontSize: 14, fontWeight: 700, color: MONO.bright, margin: 0 }}>{notebooks.length}</p>
                        <p style={{ fontSize: 11, color: MONO.muted, margin: 0 }}>notebooks</p>
                      </div>
                    </div>
                    {subjects.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, background: MONO.elevated, border: `1px solid ${MONO.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <FileText size={13} style={{ color: MONO.secondary }} />
                        </div>
                        <div>
                          <p className="font-mono-num" style={{ fontSize: 14, fontWeight: 700, color: MONO.bright, margin: 0 }}>{subjects.length}</p>
                          <p style={{ fontSize: 11, color: MONO.muted, margin: 0 }}>subjects</p>
                        </div>
                      </div>
                    )}
                    <Link href={`/teachers/${teacherId}/chat`} className="tp-cta" style={{ marginLeft: "auto" }}>
                      <MessageSquare size={13} /> Chat with AI
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 13, color: MONO.muted }}>Teacher not found.</p>
            </div>
          )}

          {/* ── Notebooks ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 className="font-display" style={{ fontSize: 22, color: MONO.bright, margin: 0 }}>
                Notebooks
              </h2>

              {subjects.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    className={`tp-filter-btn${activeSubject === "All" ? " active" : ""}`}
                    onClick={() => setActiveSubject("All")}
                  >
                    All
                    <span className="font-mono-num" style={{
                      marginLeft: 6, padding: "1px 5px", borderRadius: 5, fontSize: 10,
                      background: activeSubject === "All" ? "rgba(0,0,0,0.2)" : MONO.elevated,
                      color: activeSubject === "All" ? MONO.bg : MONO.muted,
                    }}>
                      {notebooks.length}
                    </span>
                  </button>
                  {subjects.map(s => (
                    <button
                      key={s}
                      className={`tp-filter-btn${activeSubject === s ? " active" : ""}`}
                      onClick={() => setActiveSubject(s)}
                    >
                      {s}
                      <span className="font-mono-num" style={{
                        marginLeft: 6, padding: "1px 5px", borderRadius: 5, fontSize: 10,
                        background: activeSubject === s ? "rgba(0,0,0,0.2)" : MONO.elevated,
                        color: activeSubject === s ? MONO.bg : MONO.muted,
                      }}>
                        {notebooks.filter(n => n.subject === s).length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {Array.from({ length: 4 }).map((_, i) => <NotebookSkeleton key={i} />)}
              </div>
            ) : filtered.length > 0 ? (
              <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {filtered.map((nb, i) => (
                  <NotebookCard key={nb.id} notebook={nb} teacherId={teacherId} index={i} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px",
                  background: MONO.elevated, border: `1px solid ${MONO.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BookOpen size={22} style={{ color: MONO.muted }} />
                </div>
                <p className="font-display" style={{ fontSize: 20, color: MONO.bright, margin: "0 0 8px" }}>No notebooks yet</p>
                <p style={{ fontSize: 13, color: MONO.muted }}>This teacher hasn't published any notebooks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}