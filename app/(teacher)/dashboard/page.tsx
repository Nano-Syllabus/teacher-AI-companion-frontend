"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { apiFetch } from "../../lib/api";
import {
  BookOpen, Plus, Star, MessageSquare, Pencil, Trash2, LogOut,
  Settings, LayoutDashboard, Users, TrendingUp, TrendingDown,
  Activity, BarChart2, CheckCircle, Bell, Lightbulb, HelpCircle,
  AlertCircle, ChevronRight, X, QrCode, Download, Copy, Check,
  ExternalLink, Sparkles, Zap, Award, GraduationCap, TrendingUpIcon,
  MousePointer2, Eye, Heart, ArrowUpRight, Minus, Volume2, VolumeX
} from "lucide-react";
import QRModal from "@/app/components/dashboard/QRModal";
import StatCard from "@/app/components/dashboard/StatCard";
import ActivityBadge from "@/app/components/dashboard/ActivityBadge";
import ActivityFeed from "@/app/components/dashboard/ActivityFeed";
import TopNotebooks from "@/app/components/dashboard/TopNotebooks";
import PendingReviews from "@/app/components/dashboard/PendingReviews";
import ActionBanner from "@/app/components/dashboard/ActionBanner";
import TipBanner from "@/app/components/dashboard/TipBanner";
import ErrorBanner from "@/app/components/dashboard/ErrorBanner";
import NotebookRow from "@/app/components/dashboard/NotebookRow";

// ─── GSAP Imports ─────────────────────────────────────────────────────────────
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin);

// ─── Types ────────────────────────────────────────────────────────────────────

type Subject =
  | "Mathematics" | "Physics" | "Chemistry" | "Biology"
  | "Computer Science" | "Economics" | "History" | "Literature";

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
  qrCode: string | null;
  qrUrl: string | null;
}

interface ActivityItem {
  id: string;
  type: "enrollment" | "rating" | "comment" | "quiz_submission" | "published";
  studentName?: string;
  studentInitials?: string;
  notebookTitle: string;
  timestamp: string;
  meta?: string;
}

interface PendingReview {
  id: string;
  studentName: string;
  studentInitials: string;
  quizTitle: string;
  score: number;
  submittedAt: string;
}

interface StatTrend {
  label: string;
  value: string;
  delta: string;
  positive: boolean | null;
  sparklineData: number[];
}

// ─── Enhanced SVG Illustrations ───────────────────────────────────────────────

function FloatingShapes() {
  const shapesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!shapesRef.current) return;
    const shapes = shapesRef.current.querySelectorAll('.floating-shape');

    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: `random(-30, 30)`,
        x: `random(-20, 20)`,
        rotation: `random(-15, 15)`,
        duration: `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });
  }, { scope: shapesRef });

  return (
    <div ref={shapesRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="floating-shape absolute top-[10%] right-[15%] w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.3" />
      </svg>
      <svg className="floating-shape absolute top-[25%] left-[8%] w-20 h-20 opacity-[0.03]" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="55" r="8" fill="currentColor" opacity="0.2" />
      </svg>
      <svg className="floating-shape absolute bottom-[20%] right-[20%] w-24 h-24 opacity-[0.04]" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(15 50 50)" />
        <rect x="35" y="35" width="30" height="30" rx="8" fill="currentColor" opacity="0.15" transform="rotate(15 50 50)" />
      </svg>
      <svg className="floating-shape absolute top-[50%] left-[3%] w-16 h-16 opacity-[0.03]" viewBox="0 0 100 100">
        <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="55" r="6" fill="currentColor" opacity="0.2" />
      </svg>
      <svg className="floating-shape absolute bottom-[35%] left-[25%] w-14 h-14 opacity-[0.025]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    </div>
  );
}

function HeroIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.draw-path');

    gsap.from(paths, {
      drawSVG: 0,
      duration: 2,
      stagger: 0.1,
      ease: "power2.inOut",
      delay: 0.5,
    });

    // Floating elements animation
    const floating = svgRef.current.querySelectorAll('.float-element');
    floating.forEach((el, i) => {
      gsap.to(el, {
        y: -10,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 400 300" className="w-full max-w-[340px] h-auto opacity-90" aria-hidden="true">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.02" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Desk */}
      <rect className="draw-path" x="50" y="180" width="300" height="8" rx="4" fill="#1a1a1a" opacity="0.1" />
      <rect className="draw-path" x="70" y="188" width="8" height="60" rx="2" fill="#1a1a1a" opacity="0.06" />
      <rect className="draw-path" x="322" y="188" width="8" height="60" rx="2" fill="#1a1a1a" opacity="0.06" />
      {/* Laptop */}
      <rect className="draw-path" x="140" y="130" width="120" height="80" rx="8" fill="url(#grad1)" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.15" />
      <rect className="draw-path" x="150" y="140" width="100" height="60" rx="4" fill="white" opacity="0.8" />
      {/* Screen content lines with typing animation */}
      <rect className="draw-path" x="160" y="150" width="60" height="4" rx="2" fill="#1a1a1a" opacity="0.1" />
      <rect className="draw-path" x="160" y="160" width="40" height="4" rx="2" fill="#1a1a1a" opacity="0.08" />
      <rect className="draw-path" x="160" y="170" width="50" height="4" rx="2" fill="#1a1a1a" opacity="0.06" />
      {/* Coffee cup */}
      <rect className="draw-path" x="280" y="150" width="24" height="30" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="1" opacity="0.12" />
      <path className="draw-path" d="M304 158 Q312 158 312 166 Q312 174 304 174" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.12" />
      {/* Steam */}
      <path className="draw-path float-element" d="M286 145 Q290 135 286 125" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.08" strokeLinecap="round" />
      <path className="draw-path float-element" d="M296 148 Q300 138 296 128" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.06" strokeLinecap="round" />
      {/* Books stack */}
      <rect className="draw-path" x="80" y="155" width="40" height="8" rx="2" fill="#1a1a1a" opacity="0.1" />
      <rect className="draw-path" x="82" y="147" width="36" height="8" rx="2" fill="#1a1a1a" opacity="0.08" />
      <rect className="draw-path" x="84" y="139" width="32" height="8" rx="2" fill="#1a1a1a" opacity="0.06" />
      {/* Floating elements */}
      <circle className="draw-path float-element" cx="100" cy="100" r="12" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.08" />
      <circle className="draw-path float-element" cx="300" cy="90" r="8" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.06" />
      <rect className="draw-path float-element" x="200" y="70" width="16" height="16" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.07" transform="rotate(12 208 78)" />
      {/* Check marks with glow */}
      <circle className="draw-path" cx="340" cy="120" r="14" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.1" />
      <path className="draw-path" d="M334 120 L338 124 L346 116" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
    </svg>
  );
}

function EmptyStateIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;

    // Animate elements drawing in
    const paths = svgRef.current.querySelectorAll('rect, circle, path');
    gsap.from(paths, {
      scale: 0,
      opacity: 0,
      transformOrigin: "center",
      duration: 0.6,
      stagger: 0.08,
      ease: "back.out(1.7)",
      delay: 0.2,
    });

    // Continuous gentle float
    const floating = svgRef.current.querySelectorAll('.empty-float');
    floating.forEach((el, i) => {
      gsap.to(el, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 200 160" className="w-40 h-40 mx-auto mb-6 opacity-70" aria-hidden="true">
      <rect x="40" y="60" width="120" height="80" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <rect x="50" y="72" width="80" height="6" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="50" y="86" width="60" height="6" rx="3" fill="currentColor" opacity="0.07" />
      <rect x="50" y="100" width="70" height="6" rx="3" fill="currentColor" opacity="0.05" />
      <circle className="empty-float" cx="100" cy="35" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />
      <path className="empty-float" d="M90 35 L96 41 L110 27" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="empty-float" cx="155" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <path className="empty-float" d="M151 45 L154 48 L159 43" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" strokeLinejoin="round" />
      {/* Additional decorative elements */}
      <circle className="empty-float" cx="30" cy="50" r="4" fill="currentColor" opacity="0.08" />
      <circle className="empty-float" cx="170" cy="55" r="3" fill="currentColor" opacity="0.06" />
    </svg>
  );
}

function SparklineChart({ data, positive }: { data: number[]; positive: boolean | null }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((val - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  const color = positive === true ? '#10b981' : positive === false ? '#ef4444' : '#f59e0b';

  useGSAP(() => {
    if (!pathRef.current) return;

    gsap.from(pathRef.current, {
      attr: { d: `M0,20 L60,20` },
      duration: 1.2,
      ease: "power2.out",
      delay: 0.3,
    });
  }, { scope: svgRef, dependencies: [data] });

  return (
    <svg ref={svgRef} viewBox="0 0 60 24" className="w-16 h-6 opacity-60">
      <path
        ref={pathRef}
        d={`M${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Mock helpers ─────────────────────────────────────────────────────────────

function getMockActivity(): ActivityItem[] {
  return [
    { id: "1", type: "enrollment", studentName: "Aisha Sharma", studentInitials: "AS", notebookTitle: "Physics Vol. 2", timestamp: "5 min ago" },
    { id: "2", type: "rating", studentName: "Rohan K.", studentInitials: "RK", notebookTitle: "Calculus Basics", timestamp: "18 min ago", meta: "★ 5.0" },
    { id: "3", type: "comment", studentName: "Priya L.", studentInitials: "PL", notebookTitle: "Organic Chemistry", timestamp: "1 hr ago" },
    { id: "4", type: "quiz_submission", studentName: "Musa O.", studentInitials: "MO", notebookTitle: "History 101", timestamp: "3 hrs ago", meta: "Score: 78%" },
    { id: "5", type: "published", notebookTitle: "Calculus Basics", timestamp: "Yesterday" },
  ];
}

function getMockPendingReviews(): PendingReview[] {
  return [
    { id: "1", studentName: "Musa O.", studentInitials: "MO", quizTitle: "History Ch.4 Quiz", score: 78, submittedAt: "3 hrs ago" },
    { id: "2", studentName: "Priya L.", studentInitials: "PL", quizTitle: "Chem Midterm", score: 91, submittedAt: "5 hrs ago" },
    { id: "3", studentName: "Jin Park", studentInitials: "JP", quizTitle: "Physics Wave Optics", score: 65, submittedAt: "Yesterday" },
  ];
}

function generateSparklineData(base: number, variance: number): number[] {
  return Array.from({ length: 7 }, () => base + Math.random() * variance - variance / 2);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ─── Animated Components ──────────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!ref.current || value === "—") return;
    const num = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: num,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString();
        }
      }
    });
  }, { dependencies: [value] });

  return <span ref={ref}>{value === "—" ? "—" : "0"}</span>;
}

function PulseDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
    </span>
  );
}

function MagneticButton({ 
  children, 
  className, 
  onClick, 
  href 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  href?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = href ? linkRef.current : btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(el, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  
  const handleMouseLeave = () => {
    const el = href ? linkRef.current : btnRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
    setIsHovered(false);
  };

  const sharedProps = {
    className,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <Link 
        ref={linkRef}
        href={href}
        {...sharedProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      {...sharedProps}
    >
      {children}
    </button>
  );
}

function SkeletonLoader({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      x: -30,
      opacity: 0,
      duration: 0.5,
      delay: index * 0.1,
      ease: "power2.out",
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="h-[80px] rounded-2xl bg-white border border-black/[0.07] overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent animate-shimmer" 
           style={{ backgroundSize: "200% 100%" }} />
      <div className="absolute inset-0 flex items-center px-6 gap-4">
        <div className="w-10 h-10 rounded-xl bg-black/5 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="w-32 h-4 rounded bg-black/5 animate-pulse" />
          <div className="w-48 h-3 rounded bg-black/5 animate-pulse" />
        </div>
        <div className="w-20 h-8 rounded-lg bg-black/5 animate-pulse" />
      </div>
    </div>
  );
}

function ScrollReveal({ children, className, delay = 0 }: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(false);
  const [qrNotebook, setQrNotebook] = useState<Notebook | null>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "";

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // ─── Data Loading ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "authenticated") return;
    let mounted = true;
    setLoading(true);
    setError(null);

    async function loadAll() {
      try {
        const data = await apiFetch<Array<{
          id: string; title: string; subject: Subject; description: string;
          doc_count: number; student_count: number; views: number; rating: number;
          updated_at: string; published: boolean; is_free: boolean;
          qr_code: string | null; qr_url: string | null;
        }>>("/notebooks/", (session as any)?.backendAccessToken);

        if (!mounted) return;

        setNotebooks(data.map((n) => ({
          id: n.id,
          title: n.title,
          subject: n.subject,
          description: n.description,
          docCount: n.doc_count,
          studentCount: n.student_count,
          views: n.views,
          rating: n.rating,
          lastUpdated: new Date(n.updated_at).toLocaleDateString(),
          published: n.published,
          free: n.is_free,
          qrCode: n.qr_code,
          qrUrl: n.qr_url,
        })));

        setActivity(getMockActivity());
        setPendingReviews(getMockPendingReviews());
      } catch {
        if (mounted) setError("Failed to load your notebooks. Please refresh the page.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => { mounted = false; };
  }, [status, session]);

  // ─── GSAP Animations ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (reducedMotion) return;

    // Header slide down with blur
    gsap.from(headerRef.current, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Greeting text reveal with sophisticated stagger
    const greetingTl = gsap.timeline({ delay: 0.4 });
    greetingTl.from(".greeting-label", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
    .from(".greeting-title", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    }, "-=0.3")
    .from(".greeting-subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.5")
    .from(".hero-illustration", {
      scale: 0.7,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
    }, "-=0.8")
    .from(".action-buttons", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
    }, "-=0.4");

  }, { scope: containerRef, dependencies: [reducedMotion] });

  // Stats cards stagger with 3D tilt effect
  useGSAP(() => {
    if (reducedMotion || !statsRef.current) return;
    gsap.from(".stat-card", {
      y: 50,
      opacity: 0,
      rotateX: 15,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef, dependencies: [notebooks.length, reducedMotion] });

  // Content sections reveal
  useGSAP(() => {
    if (reducedMotion || !contentRef.current) return;
    gsap.from(".content-section", {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef, dependencies: [notebooks.length, loading, reducedMotion] });

  // Notebook rows stagger with slide
  useGSAP(() => {
    if (reducedMotion || !listRef.current || loading) return;
    gsap.from(".notebook-row-item", {
      x: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, { scope: containerRef, dependencies: [filter, loading, reducedMotion] });

  // Toast animation
  useGSAP(() => {
    if (!toast || !toastRef.current) return;
    const tl = gsap.timeline();
    tl.from(toastRef.current, {
      y: -20,
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "back.out(1.7)",
    })
    .to(toastRef.current, {
      y: -20,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      delay: 2.5,
      ease: "power2.in",
      onComplete: () => setToast(null),
    });
  }, { dependencies: [toast] });

  // ─── Filter change animation ────────────────────────────────────────────────
  const handleFilterChange = useCallback((f: "all" | "published" | "draft") => {
    if (reducedMotion) {
      setFilter(f);
      return;
    }
    if (listRef.current) {
      gsap.to(".notebook-row-item", {
        opacity: 0,
        x: -30,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.in",
        onComplete: () => setFilter(f),
      });
    } else {
      setFilter(f);
    }
  }, [reducedMotion]);

  // ─── 3D Tilt Effect for Stat Cards ──────────────────────────────────────────
  const handleStatMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (reducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });
    setHoveredStat(index);
  };

  const handleStatMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    setHoveredStat(null);
  };

  // ─── Toast Helper ───────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // ─── Computed Data ──────────────────────────────────────────────────────────
  const filtered = notebooks.filter((n) =>
    filter === "all" ? true : filter === "published" ? n.published : !n.published
  );

  const totalStudents = notebooks.reduce((s, n) => s + n.studentCount, 0);
  const totalViews = notebooks.reduce((s, n) => s + n.views, 0);
  const avgRating = notebooks.length
    ? (notebooks.reduce((s, n) => s + n.rating, 0) / notebooks.length).toFixed(1)
    : "—";

  const stats: StatTrend[] = [
    { 
      label: "Total notebooks", 
      value: String(notebooks.length), 
      delta: "+2 this month", 
      positive: true,
      sparklineData: generateSparklineData(12, 4),
    },
    { 
      label: "Total students", 
      value: totalStudents.toLocaleString(), 
      delta: "+48 this week", 
      positive: true,
      sparklineData: generateSparklineData(150, 30),
    },
    { 
      label: "Total views", 
      value: totalViews.toLocaleString(), 
      delta: "-3% vs last month", 
      positive: false,
      sparklineData: generateSparklineData(2500, 500),
    },
    { 
      label: "Avg rating", 
      value: avgRating, 
      delta: "Top 5% of teachers", 
      positive: null,
      sparklineData: generateSparklineData(4.5, 0.5),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="min-h-screen bg-[#F7F7F6] relative overflow-hidden">
      <FloatingShapes />

      {/* Toast Notification */}
      {toast && (
        <div 
          ref={toastRef}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-black text-white text-sm font-medium shadow-lg shadow-black/20 flex items-center gap-2"
        >
          {toast.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <Sparkles size={16} className="text-amber-400" />}
          {toast.message}
        </div>
      )}

      {/* QR modal */}
      {qrNotebook && <QRModal notebook={qrNotebook} onClose={() => setQrNotebook(null)} />}

      {/* Top bar */}
      <header ref={headerRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-black/[0.07] px-4 sm:px-6 h-14 flex items-center justify-between transition-all duration-300 hover:bg-white/95">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <BookOpen size={13} color="white" />
          </div>
          <span className="font-semibold text-sm text-black tracking-tight">TeacherOS</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setReducedMotion(!reducedMotion)}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-black/5 transition-all duration-300 text-black/30 hover:text-black/60"
            title={reducedMotion ? "Enable animations" : "Reduce motion"}
          >
            {reducedMotion ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button className="relative p-2 rounded-xl hover:bg-black/5 transition-all duration-300 hover:scale-105 active:scale-95">
            <Bell size={16} className="text-black/40" />
            {pendingReviews.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-black/[0.02] hover:bg-black/[0.04] transition-all duration-300 cursor-pointer hover:border-black/20">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 transition-transform duration-300 hover:scale-110">
              {getInitials(user?.name)}
            </div>
            <span className="hidden sm:block text-xs text-black/55 max-w-[120px] truncate">{user?.name ?? user?.email ?? "—"}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 text-xs text-black/45 hover:bg-black/5 hover:text-black/70 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <LogOut size={13} /><span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 sm:px-6 py-8 pb-24 sm:pb-12 max-w-6xl mx-auto relative z-10">

        {/* Greeting + Hero */}
        <div ref={greetingRef} className="flex items-start justify-between gap-6 mb-12 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <p className="greeting-label text-xs font-medium tracking-widest uppercase text-black/30 mb-2 flex items-center gap-2">
              <Sparkles size={12} className="opacity-50" />
              Teacher Dashboard
            </p>
            <h1 className="greeting-title text-2xl sm:text-4xl font-bold text-black leading-tight">
              {getGreeting()}{firstName ? `, ${firstName}` : ""} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="greeting-subtitle mt-3 text-sm text-black/40 max-w-md leading-relaxed">
              Welcome back! You have <span className="font-semibold text-black/60">{pendingReviews.length} pending reviews</span> and <span className="font-semibold text-black/60">{notebooks.filter(n => !n.published).length} drafts</span> waiting to be published.
            </p>
            <div className="action-buttons mt-6 flex items-center gap-3 flex-wrap">
              <MagneticButton 
                href="/notebooks/new"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus size={15} className="transition-transform duration-300 group-hover:rotate-90" /> 
                New notebook
              </MagneticButton>
              <MagneticButton 
                href="/students"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition-all duration-300 hover:border-black/20"
              >
                <GraduationCap size={15} />
                View students
              </MagneticButton>
              <MagneticButton 
                onClick={() => showToast('Quick action menu coming soon!', 'info')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition-all duration-300 hover:border-black/20"
              >
                <Zap size={15} />
                Quick actions
              </MagneticButton>
            </div>
          </div>
          <div className="hero-illustration hidden lg:block flex-shrink-0">
            <HeroIllustration />
          </div>
        </div>

        {error && (
          <div className="mb-6 error-banner">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {!bannerDismissed && pendingReviews.length > 0 && (
          <div className="mb-6 action-banner">
            <ActionBanner count={pendingReviews.length} onDismiss={() => {
              if (reducedMotion) {
                setBannerDismissed(true);
                return;
              }
              gsap.to(".action-banner", {
                height: 0,
                opacity: 0,
                marginBottom: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => setBannerDismissed(true),
              });
            }} />
          </div>
        )}

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div 
              key={s.label} 
              className="stat-card group relative bg-white rounded-2xl border border-black/[0.07] p-5 hover:shadow-xl hover:shadow-black/5 hover:border-black/10 transition-all duration-500 cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => handleStatMouseMove(e, i)}
              onMouseLeave={handleStatMouseLeave}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-black/35 uppercase tracking-wider">{s.label}</span>
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  hoveredStat === i ? "bg-black text-white scale-110" : "bg-black/5 text-black/30"
                }`}>
                  {i === 0 && <BookOpen size={13} />}
                  {i === 1 && <Users size={13} />}
                  {i === 2 && <BarChart2 size={13} />}
                  {i === 3 && <Star size={13} />}
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-black tabular-nums">
                  <AnimatedCounter value={s.value} />
                </div>
                <SparklineChart data={s.sparklineData} positive={s.positive} />
              </div>
              <div className="flex items-center gap-1">
                {s.positive === true && <TrendingUp size={12} className="text-emerald-500" />}
                {s.positive === false && <TrendingDown size={12} className="text-red-400" />}
                {s.positive === null && <Award size={12} className="text-amber-500" />}
                <span className={`text-[11px] font-medium ${
                  s.positive === true ? "text-emerald-600" : 
                  s.positive === false ? "text-red-500" : "text-amber-600"
                }`}>
                  {s.delta}
                </span>
              </div>
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-tr-2xl">
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-black/[0.02] rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {!tipDismissed && notebooks.length > 0 && (
          <div className="mb-8 tip-banner">
            <TipBanner onDismiss={() => {
              if (reducedMotion) {
                setTipDismissed(true);
                return;
              }
              gsap.to(".tip-banner", {
                height: 0,
                opacity: 0,
                marginBottom: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => setTipDismissed(true),
              });
            }} />
          </div>
        )}

        {!loading && notebooks.length > 0 && (
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
            <div className="content-section">
              <ActivityFeed items={activity} />
            </div>
            <div className="flex flex-col gap-5 content-section">
              <TopNotebooks notebooks={notebooks} />
              <PendingReviews reviews={pendingReviews} />
            </div>
          </div>
        )}

        {/* Notebooks list */}
        <div ref={listRef}>
          <ScrollReveal>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-black">Your notebooks</h2>
                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-semibold text-black/40">
                  {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-2 p-1 rounded-xl bg-black/[0.03]">
                {(["all", "published", "draft"] as const).map((f) => (
                  <button 
                    key={f} 
                    onClick={() => handleFilterChange(f)}
                    className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-300 ${
                      filter === f 
                        ? "bg-black text-white shadow-md shadow-black/10 scale-105" 
                        : "text-black/40 hover:text-black/60 hover:bg-black/5"
                    }`}
                  >
                    {f}
                    {f === "draft" && notebooks.filter(n => !n.published).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-bounce">
                        {notebooks.filter(n => !n.published).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => (
                <SkeletonLoader key={i} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((nb, index) => (
                <div 
                  key={nb.id} 
                  className="notebook-row-item"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NotebookRow
                    notebook={nb}
                    onDelete={(id) => {
                      showToast('Notebook deleted successfully', 'success');
                      if (reducedMotion) {
                        setNotebooks((prev) => prev.filter((n) => n.id !== id));
                        return;
                      }
                      gsap.to(`[data-notebook-id="${id}"]`, {
                        x: 100,
                        opacity: 0,
                        height: 0,
                        marginBottom: 0,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => setNotebooks((prev) => prev.filter((n) => n.id !== id)),
                      });
                    }}
                    onShowQR={(notebook) => {
                      setQrNotebook(notebook);
                      showToast('QR Code generated', 'info');
                    }}
                  />
                </div>
              ))}
              {filtered.length === 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="text-center py-20 rounded-3xl border-2 border-dashed border-black/10 bg-white/50 backdrop-blur-sm">
                    <EmptyStateIllustration />
                    <p className="font-bold text-lg text-black mb-2">No notebooks yet</p>
                    <p className="text-sm text-black/40 mb-6 max-w-xs mx-auto">Create your first notebook to start sharing knowledge with your students</p>
                    <MagneticButton 
                      href="/notebooks/new"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-black text-white hover:bg-black/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
                    >
                      <Plus size={14} /> New notebook
                    </MagneticButton>
                  </div>
                </ScrollReveal>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/[0.07] flex items-center justify-around px-2 py-2 z-20">
        {[
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
          { icon: BookOpen, label: "Notebooks", href: "/notebooks" },
          { icon: Users, label: "Students", href: "/students" },
          { icon: MessageSquare, label: "Messages", href: "/messages" },
          { icon: Settings, label: "Settings", href: "/settings" },
        ].map(({ icon: Icon, label, href, active }) => (
          <Link 
            key={label} 
            href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all duration-300 ${
              active 
                ? "text-black bg-black/5 scale-105" 
                : "text-black/30 hover:text-black/55 hover:bg-black/[0.02]"
            }`}
          >
            <Icon size={20} className={active ? "stroke-[2.5px]" : ""} />
            {label}
          </Link>
        ))}
      </nav>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(8deg); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-wave { animation: wave 2s ease-in-out infinite; transform-origin: 70% 70%; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

        /* Smooth scrolling */
        html { scroll-behavior: smooth; }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}