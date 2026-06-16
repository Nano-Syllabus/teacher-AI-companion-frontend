"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { apiFetch } from "../../lib/api";
import {
  BookOpen, Plus, Star, MessageSquare, Pencil, Trash2, LogOut,
  Settings, LayoutDashboard, Users, TrendingUp, TrendingDown,
  Activity, BarChart2, CheckCircle, Bell, Lightbulb, HelpCircle,
  AlertCircle, ChevronRight, X, QrCode, Download, Copy, Check,
  ExternalLink,
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
  qrCode: string | null;   // "data:image/png;base64,..." from backend
  qrUrl: string | null;    // the encoded student URL
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

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "";

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
          qrCode: n.qr_code,   // ← mapped from backend
          qrUrl: n.qr_url,     // ← mapped from backend
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

  const filtered = notebooks.filter((n) =>
    filter === "all" ? true : filter === "published" ? n.published : !n.published
  );

  const totalStudents = notebooks.reduce((s, n) => s + n.studentCount, 0);
  const totalViews    = notebooks.reduce((s, n) => s + n.views, 0);
  const avgRating     = notebooks.length
    ? (notebooks.reduce((s, n) => s + n.rating, 0) / notebooks.length).toFixed(1)
    : "—";

  const stats: StatTrend[] = [
    { label: "Total notebooks", value: String(notebooks.length),      delta: "+2 this month",     positive: true },
    { label: "Total students",  value: totalStudents.toLocaleString(), delta: "+48 this week",     positive: true },
    { label: "Total views",     value: totalViews.toLocaleString(),    delta: "-3% vs last month", positive: false },
    { label: "Avg rating",      value: avgRating,                      delta: "Top 5% of teachers",positive: null },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F6]">

      {/* QR modal */}
      {qrNotebook && <QRModal notebook={qrNotebook} onClose={() => setQrNotebook(null)} />}

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-black/[0.07] px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
            <BookOpen size={13} color="white" />
          </div>
          <span className="font-semibold text-sm text-black">TeacherOS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-black/[0.02]">
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <span className="hidden sm:block text-xs text-black/55 max-w-[120px] truncate">{user?.name ?? user?.email ?? "—"}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 text-xs text-black/45 hover:bg-black/5 transition-colors"
          >
            <LogOut size={13} /><span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 sm:px-6 py-8 pb-24 sm:pb-12 max-w-6xl mx-auto">

        {/* Greeting */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-black/30 mb-1">Teacher Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">{getGreeting()}{firstName ? `, ${firstName}` : ""} 👋</h1>
          </div>
          <Link href="/notebooks/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/80 transition-colors">
            <Plus size={15} /> New notebook
          </Link>
        </div>

        {error && <div className="mb-6"><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

        {!bannerDismissed && pendingReviews.length > 0 && (
          <div className="mb-6"><ActionBanner count={pendingReviews.length} onDismiss={() => setBannerDismissed(true)} /></div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {!tipDismissed && notebooks.length > 0 && (
          <div className="mb-8"><TipBanner onDismiss={() => setTipDismissed(true)} /></div>
        )}

        {!loading && notebooks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <ActivityFeed items={activity} />
            <div className="flex flex-col gap-4">
              <TopNotebooks notebooks={notebooks} />
              <PendingReviews reviews={pendingReviews} />
            </div>
          </div>
        )}

        {/* Notebooks list */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base font-semibold text-black">Your notebooks</h2>
            <div className="flex items-center gap-2">
              {(["all", "published", "draft"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    filter === f ? "bg-black text-white" : "bg-black/5 text-black/45 hover:bg-black/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[1,2,3].map((i) => <div key={i} className="h-[68px] rounded-xl bg-white border border-black/[0.07] animate-pulse" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((nb) => (
                <NotebookRow
                  key={nb.id}
                  notebook={nb}
                  onDelete={(id) => setNotebooks((prev) => prev.filter((n) => n.id !== id))}
                  onShowQR={setQrNotebook}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16 rounded-2xl border-2 border-dashed border-black/10 bg-white">
                  <p className="text-3xl mb-3">📚</p>
                  <p className="font-bold text-base text-black mb-1">No notebooks yet</p>
                  <p className="text-sm text-black/40 mb-4">Create your first notebook to get started</p>
                  <Link href="/notebooks/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-black text-white hover:bg-black/80 transition-colors">
                    <Plus size={14} /> New notebook
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/[0.07] flex items-center justify-around px-2 py-2 z-20">
        {[
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
          { icon: BookOpen,        label: "Notebooks", href: "/notebooks" },
          { icon: Users,           label: "Students",  href: "/students" },
          { icon: MessageSquare,   label: "Messages",  href: "/messages" },
          { icon: Settings,        label: "Settings",  href: "/settings" },
        ].map(({ icon: Icon, label, href, active }) => (
          <Link key={label} href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              active ? "text-black" : "text-black/30 hover:text-black/55"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}