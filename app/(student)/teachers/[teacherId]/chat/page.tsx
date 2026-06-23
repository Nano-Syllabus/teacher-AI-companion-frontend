"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { apiFetch } from "../../../../lib/api";
import {
  ArrowLeft, Send, BookOpen, Sparkles, ChevronDown,
  FileText, Copy, ThumbsUp, ThumbsDown,
  Loader2, Home, BookMarked,
  Mail, LayoutGrid, Settings, Users, Paperclip,
} from "lucide-react";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface Notebook {
  id: string;
  title: string;
  subject: string;
  chapterCount: number;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface ChatResponse {
  answer: string;
  sources: Array<{
    document_id: string;
    chapter_title: string;
    text: string;
    score: number;
  }>;
}

// ── B&W monochrome palette — no hues, only luminance steps ──
const MONO = {
  bg:        "#0a0a0a",   // near-black canvas
  surface:   "#111111",   // card / sidebar surface
  elevated:  "#1a1a1a",   // dropdown, hover states
  border:    "#242424",   // subtle dividers
  borderMid: "#333333",   // mid-weight borders
  muted:     "#555555",   // disabled / placeholder
  secondary: "#888888",   // metadata text
  primary:   "#cccccc",   // body text
  bright:    "#ffffff",   // headings / icons
  accent:    "#ffffff",   // interactive accent (pure white)
  accentDim: "rgba(255,255,255,0.08)", // chip background
};

// All subjects share the same monochrome identity
function subjectStyle(_s: string) {
  return {
    accent:   MONO.accent,
    glow:     "rgba(255,255,255,0.035)",
    chipBg:   MONO.accentDim,
    chipText: MONO.bright,
  };
}

const DEFAULT_PROMPTS = [
  { label: "Key concepts",   sub: "Overview of this chapter" },
  { label: "Explain simply", sub: "Like I'm new to this" },
  { label: "Practice quiz",  sub: "Test my knowledge" },
];

const SUGGESTED_PROMPTS: Record<string, { label: string; sub: string }[]> = {
  Mathematics:        [{ label: "Solve a problem", sub: "Step-by-step" }, { label: "Explain a concept", sub: "Clear definition" }, { label: "Practice questions", sub: "Test my knowledge" }],
  Physics:            [{ label: "Derive a formula", sub: "Show the working" }, { label: "Real-world examples", sub: "Applied physics" }, { label: "Numericals", sub: "Practice problems" }],
  "Computer Science": [{ label: "Explain an algorithm", sub: "With complexity" }, { label: "Debug my logic", sub: "Find the error" }, { label: "Code examples", sub: "Show in code" }],
};
function getSuggestedPrompts(subject: string) { return SUGGESTED_PROMPTS[subject] ?? DEFAULT_PROMPTS; }

// ── global CSS ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  /* ── GSAP will drive most motion; these are fallback/utility classes ── */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }

  .ns-root {
    font-family: 'Inter', sans-serif;
    background: ${MONO.bg};
    color: ${MONO.primary};
    --accent: ${MONO.accent};
    --border: ${MONO.border};
  }

  /* scrollbar */
  .ns-scroll::-webkit-scrollbar { width: 4px; }
  .ns-scroll::-webkit-scrollbar-track { background: transparent; }
  .ns-scroll::-webkit-scrollbar-thumb { background: ${MONO.border}; border-radius: 2px; }

  /* noise grain overlay */
  .ns-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.18;
  }

  /* orb glow */
  .ns-orb {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 320px; border-radius: 50%;
    background: radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.055) 0%, transparent 68%);
    filter: blur(48px); pointer-events: none; z-index: 0;
  }

  /* sidebar icon hover ring */
  .ns-nav-btn {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: ${MONO.muted}; background: transparent;
    transition: background 0.15s, color 0.15s; cursor: pointer;
    text-decoration: none;
  }
  .ns-nav-btn:hover, .ns-nav-btn.active {
    background: ${MONO.elevated}; color: ${MONO.bright};
  }

  /* thinking dots */
  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.65); }
    40%           { opacity: 1;   transform: scale(1); }
  }
  .dot-pulse span {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: ${MONO.secondary}; margin: 0 2.5px;
    animation: dotPulse 1.4s infinite ease-in-out;
  }
  .dot-pulse span:nth-child(2) { animation-delay: 0.18s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.36s; }

  /* streaming cursor */
  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  .stream-cursor::after {
    content: '▋'; display: inline; margin-left: 1px;
    animation: cursorBlink 0.65s step-end infinite;
    font-size: 0.8em; vertical-align: text-bottom; opacity: 0.5;
  }

  /* hover action reveal */
  .bubble-group .hover-actions { opacity: 0; transition: opacity 0.18s; }
  .bubble-group:hover .hover-actions { opacity: 1; }

  /* input focus ring */
  .ns-input-box:focus-within {
    border-color: ${MONO.borderMid} !important;
    box-shadow: 0 0 0 1px ${MONO.borderMid};
  }

  /* chip hover */
  .ns-chip {
    background: transparent; border: 1px solid ${MONO.border};
    transition: background 0.15s, border-color 0.15s;
    cursor: pointer; text-align: left;
  }
  .ns-chip:hover {
    background: ${MONO.elevated}; border-color: ${MONO.borderMid};
  }

  /* send button */
  .ns-send {
    transition: opacity 0.18s, transform 0.12s;
  }
  .ns-send:hover:not(:disabled) { transform: scale(1.06); }
  .ns-send:active:not(:disabled) { transform: scale(0.94); }

  /* monospace in response */
  .md-code {
    font-family: 'JetBrains Mono', monospace;
    background: ${MONO.elevated}; border: 1px solid ${MONO.border};
    border-radius: 4px; padding: 0 5px; font-size: 0.82em; color: ${MONO.bright};
  }

  /* divider line with text */
  .ns-divider {
    display: flex; align-items: center; gap: 10px;
    color: ${MONO.muted}; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
    margin: 24px 0 16px;
  }
  .ns-divider::before, .ns-divider::after {
    content: ''; flex: 1; height: 1px; background: ${MONO.border};
  }
`;

function InjectCSS() {
  useEffect(() => {
    if (document.getElementById("ns-chat-css")) return;
    const el = document.createElement("style");
    el.id = "ns-chat-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);

    // Inject GSAP from CDN
    if (!document.getElementById("gsap-cdn")) {
      const s = document.createElement("script");
      s.id = "gsap-cdn";
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

// ── GSAP helpers ───────────────────────────────────────────────────────────
function gsapFadeUp(el: Element | null, delay = 0) {
  if (!el) return;
  const g = (window as any).gsap;
  if (!g) return;
  g.fromTo(el,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.42, delay, ease: "power3.out" }
  );
}
function gsapSlideRight(el: Element | null, delay = 0) {
  if (!el) return;
  const g = (window as any).gsap;
  if (!g) return;
  g.fromTo(el,
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.32, delay, ease: "power2.out" }
  );
}
function gsapStagger(els: NodeListOf<Element> | null, fromVars: object, toVars: object, stagger = 0.07) {
  if (!els || !els.length) return;
  const g = (window as any).gsap;
  if (!g) return;
  g.fromTo(els, fromVars, { ...toVars, stagger });
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ teacherId }: { teacherId: string }) {
  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const g = (window as any).gsap;
      if (!g || !sideRef.current) return;
      const items = sideRef.current.querySelectorAll(".ns-nav-btn");
      g.fromTo(items,
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.38, stagger: 0.07, ease: "power2.out" }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={sideRef}
      style={{
        width: 58, background: MONO.surface,
        borderRight: `1px solid ${MONO.border}`,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 16, paddingBottom: 16, flexShrink: 0, zIndex: 10,
      }}
    >
      {/* Logo mark */}
      <div style={{
        width: 32, height: 32, borderRadius: 10, marginBottom: 28,
        background: MONO.bright, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ArrowLeft size={13} color={MONO.bg} style={{ transform: "rotate(135deg)" }} />
      </div>

      {/* Nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {[
          { icon: Home,       href: `/teachers/${teacherId}`, label: "Home" },
          { icon: BookMarked, href: "#", label: "Notebooks", active: true },
          { icon: Mail,       href: "#", label: "Messages" },
          { icon: LayoutGrid, href: "#", label: "Overview" },
        ].map(({ icon: Icon, href, label, active }) => (
          <Link key={label} href={href} title={label}
            className={`ns-nav-btn${active ? " active" : ""}`}
          >
            <Icon size={16} />
          </Link>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[{ icon: Settings, label: "Settings" }, { icon: Users, label: "Students" }].map(({ icon: Icon, label }) => (
          <Link key={label} href="#" title={label} className="ns-nav-btn">
            <Icon size={16} />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Markdown renderer ──────────────────────────────────────────────────────
function MdContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        if (line.startsWith("> "))
          return (
            <blockquote key={i} style={{
              paddingLeft: 12, margin: "8px 0", fontStyle: "italic",
              color: MONO.secondary, fontSize: 14,
              borderLeft: `2px solid ${MONO.borderMid}`,
            }}>
              {line.slice(2)}
            </blockquote>
          );
        if (line === "") return <div key={i} style={{ height: 8 }} />;

        // Inline code backtick
        const codeRe = /`([^`]+)`/g;
        const boldRe = /\*\*([^*]+)\*\*/g;
        let processed = line.replace(codeRe, '<code class="md-code">$1</code>');

        const parts = processed.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} style={{ lineHeight: 1.7, margin: 0 }}
            className={streaming && isLast ? "stream-cursor" : ""}
          >
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={j} style={{ fontWeight: 600, color: MONO.bright }}>{p.slice(2, -2)}</strong>
                : <span key={j} dangerouslySetInnerHTML={{ __html: p }} />
            )}
          </p>
        );
      })}
    </>
  );
}

// ── Thinking bubble ────────────────────────────────────────────────────────
function ThinkingBubble({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { gsapFadeUp(ref.current); }, []);
  return (
    <div ref={ref} style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-start" }}>
      <AiAvatar />
      <div>
        <p style={{ fontSize: 11, color: MONO.muted, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {name}&apos;s AI Clone
        </p>
        <div style={{ paddingTop: 4 }}>
          <span className="dot-pulse"><span /><span /><span /></span>
        </div>
      </div>
    </div>
  );
}

function AiAvatar() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      background: MONO.elevated, border: `1px solid ${MONO.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color: MONO.bright,
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em",
    }}>
      AI
    </div>
  );
}

// ── User bubble ────────────────────────────────────────────────────────────
function UserBubble({ content, animate }: { content: string; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (animate) gsapSlideRight(ref.current); }, [animate]);
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
      <div style={{
        maxWidth: "72%", background: MONO.elevated,
        border: `1px solid ${MONO.borderMid}`,
        color: MONO.bright,
        borderRadius: "18px 18px 4px 18px",
        padding: "10px 16px", fontSize: 15, lineHeight: 1.65,
      }}>
        {content}
      </div>
    </div>
  );
}

// ── Assistant bubble ───────────────────────────────────────────────────────
function AssistantBubble({ content, name, animate, streaming }: {
  content: string; name: string; animate: boolean; streaming?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (animate && !streaming) gsapFadeUp(ref.current); }, [animate, streaming]);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div ref={ref} className="bubble-group" style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-start" }}>
      <AiAvatar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: MONO.muted, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {name}&apos;s AI Clone
        </p>
        <div style={{ paddingTop: 4, paddingBottom: 12, fontSize: 15, lineHeight: 1.75, color: MONO.primary }}>
          <MdContent text={content || " "} streaming={streaming} />
        </div>
        {!streaming && (
          <div className="hover-actions" style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <button onClick={copy} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 12, padding: "4px 8px", borderRadius: 6,
              background: "transparent", color: MONO.muted,
              border: `1px solid ${MONO.border}`, cursor: "pointer",
              transition: "color 0.15s, background 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = MONO.bright; (e.currentTarget as HTMLElement).style.background = MONO.elevated; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MONO.muted; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Copy size={11} /> {copied ? "Copied!" : "Copy"}
            </button>
            {[ThumbsUp, ThumbsDown].map((Icon, i) => (
              <button key={i} style={{
                padding: 6, borderRadius: 6, background: "transparent",
                color: MONO.muted, border: `1px solid ${MONO.border}`, cursor: "pointer",
                transition: "color 0.15s, background 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = MONO.bright; (e.currentTarget as HTMLElement).style.background = MONO.elevated; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MONO.muted; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Icon size={11} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Token stream hook ──────────────────────────────────────────────────────
function useTokenStream(fullText: string | null, onDone: () => void) {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    if (fullText === null) { setDisplayed(""); idxRef.current = 0; return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed(""); idxRef.current = 0;
    const len = fullText.length;
    const base = len > 800 ? 5 : len > 300 ? 9 : 14;
    function tick() {
      idxRef.current++;
      setDisplayed(fullText!.slice(0, idxRef.current));
      if (idxRef.current < fullText!.length) {
        const ch = fullText![idxRef.current - 1];
        timerRef.current = setTimeout(tick, /[.!?,\n]/.test(ch) ? base * 5 : base);
      } else { onDone(); }
    }
    timerRef.current = setTimeout(tick, 60);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fullText]); // eslint-disable-line

  return displayed;
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function NotebookChatPage() {
  const params = useParams<{ teacherId: string }>();
  const searchParams = useSearchParams();
  const teacherId = params.teacherId;
  const initialNotebookId = searchParams.get("notebook");

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamText, setStreamText] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const nid = () => `m${++idRef.current}`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking, streamText]);

  // Page entrance animation
  useEffect(() => {
    if (pageLoading) return;
    const timer = setTimeout(() => {
      const g = (window as any).gsap;
      if (!g) return;
      if (topBarRef.current) {
        g.fromTo(topBarRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
      if (welcomeRef.current) {
        const chips = welcomeRef.current.querySelectorAll(".ns-chip");
        g.fromTo(welcomeRef.current.querySelector(".ns-welcome-heading"),
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
        g.fromTo(chips,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.2 }
        );
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [pageLoading]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await getSession();
        const tok = (session as any)?.backendAccessToken;
        const [td, nd] = await Promise.all([
          apiFetch<Teacher>(`/student/teachers/${teacherId}`, tok),
          apiFetch<Array<{ id: string; title: string; subject: string; doc_count: number }>>(`/student/teachers/${teacherId}/notebooks`, tok),
        ]);
        if (!mounted) return;
        const mapped = nd.map(n => ({ id: n.id, title: n.title, subject: n.subject, chapterCount: n.doc_count }));
        setTeacher(td); setNotebooks(mapped);
        const init = mapped.find(n => n.id === initialNotebookId) ?? mapped[0] ?? null;
        setActiveNotebook(init);
        if (init) setMessages([welcome(td.name, init)]);
      } catch (e) { console.error(e); }
      finally { if (mounted) setPageLoading(false); }
    })();
    return () => { mounted = false; };
  }, [teacherId, initialNotebookId]);

  function welcome(name: string, nb: Notebook): Message {
    return { id: nid(), role: "assistant", content: `Hi! I'm ${name}'s AI clone, trained on **${nb.title}**.\n\nAsk me anything — definitions, solved problems, concept explanations, or practice questions.`, timestamp: new Date() };
  }

  const handleStreamDone = useCallback(() => {
    if (streamText === null) return;
    setMessages(p => [...p, { id: nid(), role: "assistant", content: streamText, timestamp: new Date() }]);
    setStreamText(null);
  }, [streamText]);

  const streamDisplayed = useTokenStream(streamText, handleStreamDone);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || thinking || streamText !== null || !activeNotebook || content.length < 3) return;
    setInput(""); setHasInteracted(true);
    setMessages(p => [...p, { id: nid(), role: "user", content, timestamp: new Date() }]);
    setThinking(true);
    try {
      const session = await getSession();
      const res = await apiFetch<ChatResponse>(
        `/student/notebooks/${activeNotebook.id}/chat`,
        (session as any)?.backendAccessToken,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: content, top_k: 5 }) }
      );
      setThinking(false); setStreamText(res.answer);
    } catch {
      setThinking(false);
      setMessages(p => [...p, { id: nid(), role: "assistant", content: "Sorry, something went wrong. Please try again.", timestamp: new Date() }]);
    }
  };

  const switchNotebook = (nb: Notebook) => {
    setActiveNotebook(nb); setNotebookOpen(false); setHasInteracted(false); setStreamText(null);
    setMessages([{ id: nid(), role: "assistant", content: `Switched to **${nb.title}**.\n\nNow drawing from ${nb.chapterCount} documents on ${nb.subject}. What would you like to explore?`, timestamp: new Date() }]);
  };

  if (pageLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: MONO.bg }}>
      <Loader2 size={18} style={{ color: MONO.muted, animation: "spin 1s linear infinite" }} />
    </div>
  );

  const teacherName = teacher?.name ?? "Teacher";
  const firstName = teacherName.split(" ")[0];
  const isWelcome = !hasInteracted && messages.length <= 1;
  const chips = activeNotebook ? getSuggestedPrompts(activeNotebook.subject) : DEFAULT_PROMPTS;
  const isBusy = thinking || streamText !== null;
  const displayedMsgs = isWelcome ? messages.slice(1) : messages;

  return (
    <>
      <InjectCSS />
      <div className="ns-root" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar teacherId={teacherId} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

          {/* ── Top bar ── */}
          <div ref={topBarRef} style={{
            flexShrink: 0, padding: "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${MONO.border}`, background: MONO.surface, zIndex: 10,
          }}>
            {/* Notebook switcher */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotebookOpen(!notebookOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 10px", borderRadius: 12,
                  background: "transparent", border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = MONO.elevated)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: MONO.elevated, border: `1px solid ${MONO.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText size={12} color={MONO.secondary} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: MONO.bright, margin: 0, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeNotebook?.title ?? "Select a notebook"}
                  </p>
                  <p style={{ fontSize: 11, color: MONO.muted, margin: 0 }}>
                    {activeNotebook ? `${activeNotebook.subject} · ${activeNotebook.chapterCount} docs` : "—"}
                  </p>
                </div>
                <ChevronDown size={12} color={MONO.muted}
                  style={{ marginLeft: 4, transition: "transform 0.2s", transform: notebookOpen ? "rotate(180deg)" : "none" }}
                />
              </button>

              {/* Dropdown */}
              {notebookOpen && notebooks.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  width: 300, borderRadius: 16,
                  background: MONO.surface, border: `1px solid ${MONO.borderMid}`,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.6)", zIndex: 30, padding: 8,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: MONO.muted, padding: "4px 8px 8px", margin: 0 }}>
                    Switch Notebook
                  </p>
                  {notebooks.map(nb => {
                    const active = nb.id === activeNotebook?.id;
                    return (
                      <button key={nb.id} onClick={() => switchNotebook(nb)} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: 10, borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                        background: active ? MONO.elevated : "transparent",
                        transition: "background 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = MONO.elevated)}
                        onMouseLeave={e => (e.currentTarget.style.background = active ? MONO.elevated : "transparent")}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: MONO.elevated, border: `1px solid ${MONO.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <BookOpen size={12} color={MONO.secondary} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: MONO.bright, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nb.title}</p>
                          <p style={{ fontSize: 11, color: MONO.muted, margin: 0 }}>{nb.subject} · {nb.chapterCount} docs</p>
                        </div>
                        {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: MONO.bright, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Teacher chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: MONO.elevated, border: `1px solid ${MONO.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: MONO.bright,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {firstName[0]}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: MONO.secondary }}>{firstName}</span>
              <ChevronDown size={12} color={MONO.muted} />
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="ns-scroll" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {isWelcome && <div className="ns-orb" />}
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 24px", position: "relative", zIndex: 1 }}>

              {/* Welcome */}
              {isWelcome && (
                <div ref={welcomeRef} style={{ marginBottom: 48 }}>
                  <div className="ns-welcome-heading">
                    <h1 style={{ fontSize: 34, fontWeight: 300, color: MONO.bright, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                      Hey there.
                    </h1>
                    <h2 style={{ fontSize: 34, fontWeight: 300, color: MONO.muted, margin: "0 0 32px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                      What can I help with?
                    </h2>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {chips.map((p) => (
                      <button
                        key={p.label}
                        className="ns-chip"
                        onClick={() => { setInput(p.label); inputRef.current?.focus(); }}
                        style={{
                          display: "flex", flexDirection: "column", gap: 4,
                          padding: "12px 16px", borderRadius: 14, minWidth: 140,
                        }}
                      >
                        <span style={{
                          fontSize: 13, fontWeight: 600, color: MONO.bright,
                          background: MONO.elevated, padding: "2px 8px", borderRadius: 6,
                          display: "inline-block", marginBottom: 2,
                          border: `1px solid ${MONO.border}`,
                        }}>
                          {p.label}
                        </span>
                        <span style={{ fontSize: 12, color: MONO.muted }}>{p.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {displayedMsgs.map((msg, i) => {
                const isLatest = i === displayedMsgs.length - 1;
                return msg.role === "user"
                  ? <UserBubble key={msg.id} content={msg.content} animate={isLatest} />
                  : <AssistantBubble key={msg.id} content={msg.content} name={teacherName} animate={isLatest} />;
              })}

              {thinking && <ThinkingBubble name={teacherName} />}

              {streamText !== null && (
                <AssistantBubble content={streamDisplayed} name={teacherName} animate={false} streaming />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── Input bar ── */}
          <div style={{ flexShrink: 0, padding: "16px 24px 20px", background: MONO.surface, borderTop: `1px solid ${MONO.border}` }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div className="ns-input-box" style={{
                borderRadius: 18, background: MONO.bg,
                border: `1px solid ${MONO.border}`,
                padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10,
                transition: "border-color 0.18s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Sparkles size={15} color={MONO.muted} style={{ marginTop: 2, flexShrink: 0 }} />
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={activeNotebook ? `Ask me anything about ${activeNotebook.subject}…` : "Select a notebook to start…"}
                    disabled={!activeNotebook || isBusy}
                    rows={1}
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      resize: "none", fontSize: 15, lineHeight: 1.65,
                      color: MONO.bright, fontFamily: "'Inter', sans-serif",
                      maxHeight: 120,
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                    padding: "6px 10px", borderRadius: 8,
                    background: "transparent", border: `1px solid ${MONO.border}`,
                    color: MONO.muted, cursor: "pointer", transition: "color 0.15s, background 0.15s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = MONO.bright; (e.currentTarget as HTMLElement).style.background = MONO.elevated; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MONO.muted; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <Paperclip size={11} /> Attach file
                  </button>

                  <button
                    className="ns-send"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isBusy || !activeNotebook}
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "none", cursor: input.trim() && !isBusy ? "pointer" : "not-allowed",
                      background: input.trim() && !isBusy ? MONO.bright : MONO.elevated,
                      opacity: input.trim() && !isBusy ? 1 : 0.4,
                    }}
                  >
                    <Send size={13} color={input.trim() && !isBusy ? MONO.bg : MONO.muted} />
                  </button>
                </div>
              </div>

              <p style={{ textAlign: "center", fontSize: 11, marginTop: 8, color: MONO.muted }}>
                Answers are based on {teacherName}&apos;s notebooks ·{" "}
                <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>Enter</kbd> to send,{" "}
                <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>Shift+Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}