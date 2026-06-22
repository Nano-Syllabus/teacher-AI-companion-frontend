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

// Subject accent colors (kept as CSS variables since Tailwind can't dynamic-generate these)
const SUBJECT_STYLES: Record<string, { accent: string; glow: string; chipBg: string; chipText: string }> = {
  Mathematics:        { accent: "#f59e0b", glow: "rgba(245,158,11,0.15)",  chipBg: "rgba(245,158,11,0.08)",  chipText: "#f59e0b" },
  Physics:            { accent: "#f87171", glow: "rgba(248,113,113,0.15)", chipBg: "rgba(248,113,113,0.08)", chipText: "#f87171" },
  Chemistry:          { accent: "#a855f7", glow: "rgba(168,85,247,0.15)",  chipBg: "rgba(168,85,247,0.08)",  chipText: "#a855f7" },
  Biology:            { accent: "#22c55e", glow: "rgba(34,197,94,0.15)",   chipBg: "rgba(34,197,94,0.08)",   chipText: "#22c55e" },
  "Computer Science": { accent: "#0ea5e9", glow: "rgba(14,165,233,0.15)",  chipBg: "rgba(14,165,233,0.08)",  chipText: "#0ea5e9" },
  Economics:          { accent: "#06b6d4", glow: "rgba(6,182,212,0.15)",   chipBg: "rgba(6,182,212,0.08)",   chipText: "#06b6d4" },
  History:            { accent: "#ec4899", glow: "rgba(236,72,153,0.15)",  chipBg: "rgba(236,72,153,0.08)",  chipText: "#ec4899" },
  Literature:         { accent: "#8b5cf6", glow: "rgba(139,92,246,0.15)",  chipBg: "rgba(139,92,246,0.08)",  chipText: "#8b5cf6" },
};
const DEFAULT_STYLE = { accent: "", glow: "", chipBg: "black", chipText: "" };
function subjectStyle(s: string) { return SUBJECT_STYLES[s] ?? DEFAULT_STYLE; }

const SUGGESTED_PROMPTS: Record<string, { label: string; sub: string }[]> = {
  Mathematics:        [{ label: "Solve a problem", sub: "Step-by-step solution" }, { label: "Explain a concept", sub: "Clear definition" }, { label: "Practice questions", sub: "Test my knowledge" }],
  Physics:            [{ label: "Derive a formula", sub: "Show the working" }, { label: "Real-world examples", sub: "Applied physics" }, { label: "Numericals", sub: "Practice problems" }],
  "Computer Science": [{ label: "Explain an algorithm", sub: "With complexity" }, { label: "Debug my logic", sub: "Find the error" }, { label: "Code examples", sub: "Show in code" }],
};
const DEFAULT_PROMPTS = [
  { label: "Key concepts",   sub: "Overview of this chapter" },
  { label: "Explain simply", sub: "Like I'm new to this" },
  { label: "Practice quiz",  sub: "Test my knowledge" },
];
function getSuggestedPrompts(subject: string) { return SUGGESTED_PROMPTS[subject] ?? DEFAULT_PROMPTS; }

// ── global CSS (only animations & pseudo-element effects not expressible in Tailwind) ──
const GLOBAL_CSS = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse3 {
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
  40%           { opacity: 1;   transform: scale(1); }
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.anim-slideUp    { animation: slideUp    0.34s cubic-bezier(0.22,1,0.36,1) both; }
.anim-slideRight { animation: slideRight 0.28s cubic-bezier(0.22,1,0.36,1) both; }
.anim-fadeIn     { animation: fadeIn     0.24s ease both; }
.hover-actions   { opacity: 0; transition: opacity 0.18s ease; }
.bubble-group:hover .hover-actions { opacity: 1; }
.dot-pulse span {
  display: inline-block;
  width: 5px; height: 5px; border-radius: 50%;
  background: currentColor; margin: 0 2px;
  animation: pulse3 1.3s infinite ease-in-out;
}
.dot-pulse span:nth-child(2) { animation-delay: 0.16s; }
.dot-pulse span:nth-child(3) { animation-delay: 0.32s; }
.stream-cursor::after {
  content: '▋';
  display: inline;
  margin-left: 1px;
  animation: cursorBlink 0.7s step-end infinite;
  font-size: 0.82em;
  vertical-align: text-bottom;
  opacity: 0.65;
}
`;

function InjectCSS() {
  useEffect(() => {
    if (document.getElementById("ns-chat-css")) return;
    const el = document.createElement("style");
    el.id = "ns-chat-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);
  return null;
}

// ── orb background ─────────────────────────────────────────────────────────
function OrbBg({ color }: { color: string }) {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[340px] rounded-full pointer-events-none z-0"
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${color} 0%, transparent 70%)`, filter: "blur(72px)", opacity: 0.5 }}
    />
  );
}

// ── sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ teacherId, accentColor }: { teacherId: string; accentColor: string }) {
  const nav = [
    { icon: Home,       href: `/teachers/${teacherId}`, label: "Home" },
    { icon: BookMarked, href: "#", label: "Notebooks", active: true },
    { icon: Mail,       href: "#", label: "Messages" },
    { icon: LayoutGrid, href: "#", label: "Overview" },
  ];
  return (
    <div className="w-[60px] bg-white border-r border-gray-100 flex flex-col items-center pt-4 pb-4 flex-shrink-0 z-10">
      {/* Logo mark */}
      <div
        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center mb-7"
        style={{ background: accentColor }}
      >
        <ArrowLeft size={14} color="#fff" className="rotate-[135deg]" />
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-1 flex-1">
        {nav.map(({ icon: Icon, href, label, active }) => (
          <Link
            key={label}
            href={href}
            title={label}
            className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-150
              ${active
                ? "bg-gray-100 text-gray-700"
                : "text-gray-300 hover:bg-gray-50 hover:text-gray-500"
              }`}
          >
            <Icon size={17} />
          </Link>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex flex-col gap-1">
        {[{ icon: Settings, label: "Settings" }, { icon: Users, label: "Students" }].map(({ icon: Icon, label }) => (
          <Link
            key={label}
            href="#"
            title={label}
            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-gray-300 hover:bg-gray-50 hover:text-gray-400 transition-colors"
          >
            <Icon size={17} />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── markdown renderer ──────────────────────────────────────────────────────
function MdContent({ text, accent, streaming }: { text: string; accent: string; streaming?: boolean }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        if (line.startsWith("> "))
          return (
            <blockquote
              key={i}
              className="pl-3 my-2 italic text-gray-400 text-sm"
              style={{ borderLeft: `2px solid ${accent}` }}
            >
              {line.slice(2)}
            </blockquote>
          );
        if (line === "") return <div key={i} className="h-2" />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={`leading-[1.65] m-0 ${streaming && isLast ? "stream-cursor" : ""}`}>
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={j} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>
                : p
            )}
          </p>
        );
      })}
    </>
  );
}

// ── thinking dots ──────────────────────────────────────────────────────────
function ThinkingBubble({ accent, name }: { accent: string; name: string }) {
  return (
    <div className="anim-slideUp flex items-start gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
        style={{ background: accent }}
      >
        AI
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-1.5 text-gray-400 tracking-wide">{name}&apos;s AI Clone</p>
        <div className="py-2 inline-flex items-center">
          <span className="dot-pulse" style={{ color: accent }}>
            <span /><span /><span />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── user bubble ────────────────────────────────────────────────────────────
function UserBubble({ content, animate }: { content: string; animate: boolean }) {
  return (
    <div className={`flex justify-end mb-4 ${animate ? "anim-slideRight" : ""}`}>
      <div className="max-w-[72%] bg-gray-100 text-gray-800 rounded-[18px_18px_4px_18px] px-4 py-3 text-[15px] leading-relaxed">
        {content}
      </div>
    </div>
  );
}

// ── assistant bubble ───────────────────────────────────────────────────────
function AssistantBubble({ content, accent, name, animate, streaming }: {
  content: string; accent: string; name: string; animate: boolean; streaming?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className={`bubble-group flex items-start gap-3 mb-6 ${animate && !streaming ? "anim-slideUp" : ""}`}>
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold text-white"
        style={{ background: accent }}
      >
        AI
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-1.5 text-gray-400 tracking-wide">{name}&apos;s AI Clone</p>
        <div className="pt-1 pb-3 text-[15px] leading-[1.75] text-gray-700">
          <MdContent text={content || " "} accent={accent} streaming={streaming} />
        </div>
        {!streaming && (
          <div className="hover-actions flex items-center gap-1.5 mt-2">
            <button
              onClick={copy}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none cursor-pointer transition-colors"
            >
              <Copy size={11} /> {copied ? "Copied!" : "Copy"}
            </button>
            {[ThumbsUp, ThumbsDown].map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded-md bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none cursor-pointer transition-colors"
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

// ── streaming hook ─────────────────────────────────────────────────────────
function useTokenStream(fullText: string | null, onDone: () => void) {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    if (fullText === null) { setDisplayed(""); idxRef.current = 0; return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed("");
    idxRef.current = 0;
    const len = fullText.length;
    const base = len > 800 ? 5 : len > 300 ? 9 : 14;

    function tick() {
      idxRef.current++;
      setDisplayed(fullText!.slice(0, idxRef.current));
      if (idxRef.current < fullText!.length) {
        const ch = fullText![idxRef.current - 1];
        timerRef.current = setTimeout(tick, /[.!?,\n]/.test(ch) ? base * 5 : base);
      } else {
        onDone();
      }
    }
    timerRef.current = setTimeout(tick, 60);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fullText]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

// ── main ───────────────────────────────────────────────────────────────────
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
  const idRef = useRef(0);
  const nid = () => `m${++idRef.current}`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking, streamText]);

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
    setInput("");
    setHasInteracted(true);
    setMessages(p => [...p, { id: nid(), role: "user", content, timestamp: new Date() }]);
    setThinking(true);
    try {
      const session = await getSession();
      const res = await apiFetch<ChatResponse>(
        `/student/notebooks/${activeNotebook.id}/chat`,
        (session as any)?.backendAccessToken,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: content, top_k: 5 }) }
      );
      setThinking(false);
      setStreamText(res.answer);
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
    <div className="flex items-center justify-center h-screen bg-white">
      <Loader2 size={18} className="animate-spin text-gray-300" />
    </div>
  );

  const sty = activeNotebook ? subjectStyle(activeNotebook.subject) : DEFAULT_STYLE;
  const teacherName = teacher?.name ?? "Teacher";
  const firstName = teacherName.split(" ")[0];
  const isWelcome = !hasInteracted && messages.length <= 1;
  const chips = activeNotebook ? getSuggestedPrompts(activeNotebook.subject) : DEFAULT_PROMPTS;
  const isBusy = thinking || streamText !== null;
  const displayedMsgs = isWelcome ? messages.slice(1) : messages;

  return (
    <>
      <InjectCSS />
      <div className="flex h-screen bg-white font-sans overflow-hidden">
        <Sidebar teacherId={teacherId} accentColor={sty.accent} />

        <div className="flex-1 flex flex-col overflow-hidden relative">

          {/* ── top bar ── */}
          <div className="flex-shrink-0 px-6 py-3 flex items-center justify-between border-b border-gray-100 bg-white z-10">
            {/* Notebook switcher */}
            <div className="relative">
              <button
                onClick={() => setNotebookOpen(!notebookOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: sty.chipBg }}
                >
                  <FileText size={13} style={{ color: sty.accent }} />
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-semibold text-gray-900 m-0 max-w-[200px] truncate">
                    {activeNotebook?.title ?? "Select a notebook"}
                  </p>
                  <p className="text-xs text-gray-400 m-0">
                    {activeNotebook ? `${activeNotebook.subject} · ${activeNotebook.chapterCount} docs` : "—"}
                  </p>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-gray-400 ml-1 transition-transform duration-200 ${notebookOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {notebookOpen && notebooks.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[300px] rounded-2xl bg-white border border-gray-200 shadow-xl z-30 p-2">
                  <p className="text-[11px] font-bold tracking-widest text-gray-400 px-2 pb-2 pt-1 m-0 uppercase">
                    Switch Notebook
                  </p>
                  {notebooks.map(nb => {
                    const s = subjectStyle(nb.subject);
                    const active = nb.id === activeNotebook?.id;
                    return (
                      <button
                        key={nb.id}
                        onClick={() => switchNotebook(nb)}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-[10px] border-none cursor-pointer text-left transition-colors
                          ${active ? "bg-gray-50" : "bg-transparent hover:bg-gray-50"}`}
                      >
                        <div
                          className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
                          style={{ background: s.chipBg }}
                        >
                          <BookOpen size={13} style={{ color: s.accent }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-gray-900 m-0 truncate">{nb.title}</p>
                          <p className="text-xs text-gray-400 m-0">{nb.subject} · {nb.chapterCount} docs</p>
                        </div>
                        {active && (
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: sty.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Teacher chip */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full">
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: sty.accent }}
              >
                {firstName[0]}
              </div>
              <span className="text-[15px] font-medium text-gray-600">{firstName}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
          </div>

          {/* ── messages ── */}
          <div className="flex-1 overflow-y-auto relative">
            {isWelcome && <OrbBg color={sty.glow} />}
            <div className="max-w-[720px] mx-auto px-6 pt-8 pb-6 relative z-10">

              {/* Welcome state */}
              {isWelcome && (
                <div className="anim-fadeIn mb-10">
                  <h1 className="text-[32px] font-light text-gray-900 m-0 tracking-tight leading-tight">
                    Hey! {firstName}
                  </h1>
                  <h2 className="text-[32px] font-light text-gray-400 mt-0 mb-8 tracking-tight leading-tight">
                    What can I help with?
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    {chips.map((p, i) => (
                      <button
                        key={p.label}
                        onClick={() => { setInput(p.label); inputRef.current?.focus(); }}
                        className="flex flex-col gap-1 p-3 px-4 rounded-[14px] bg-transparent border border-gray-200 cursor-pointer text-left min-w-[145px] hover:bg-gray-50 hover:border-gray-300 transition-all"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <span
                          className="text-[13px] font-semibold px-2 py-0.5 rounded-md inline-block mb-0.5"
                          style={{ color: sty.accent, background: sty.chipBg }}
                        >
                          {p.label}
                        </span>
                        <span className="text-xs text-gray-400">{p.sub}</span>
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
                  : <AssistantBubble key={msg.id} content={msg.content} accent={sty.accent} name={teacherName} animate={isLatest} />;
              })}

              {thinking && <ThinkingBubble accent={sty.accent} name={teacherName} />}

              {streamText !== null && (
                <AssistantBubble
                  content={streamDisplayed}
                  accent={sty.accent}
                  name={teacherName}
                  animate={false}
                  streaming
                />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── input bar ── */}
          <div className="flex-shrink-0 px-6 pb-5 pt-4 bg-white border-t border-gray-100">
            <div className="max-w-[720px] mx-auto">
              <div className="rounded-[18px] bg-gray-50 border border-gray-200 p-3.5 flex flex-col gap-2.5 focus-within:border-gray-300 transition-colors">
                <div className="flex items-start gap-2.5">
                  <Sparkles
                    size={16}
                    className="mt-0.5 flex-shrink-0 opacity-80"
                    style={{ color: sty.accent }}
                  />
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
                    className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-gray-800 placeholder:text-gray-400 max-h-[120px] font-sans disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-[13px] px-2.5 py-1.5 rounded-lg bg-transparent border-none text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                    <Paperclip size={12} /> Attach file
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isBusy || !activeNotebook}
                    className={`w-9 h-9 rounded-[10px] flex items-center justify-center border-none transition-all duration-200
                      ${input.trim() && !isBusy
                        ? "cursor-pointer hover:scale-105 active:scale-95"
                        : "cursor-not-allowed opacity-40"
                      }`}
                    style={{ background: input.trim() && !isBusy ? sty.accent : "#e5e7eb" }}
                  >
                    <Send size={14} color={input.trim() && !isBusy ? "#fff" : "#9ca3af"} />
                  </button>
                </div>
              </div>

              <p className="text-center text-xs mt-2 text-gray-300">
                Answers are based on {teacherName}&apos;s notebooks ·{" "}
                <kbd className="font-mono">Enter</kbd> to send,{" "}
                <kbd className="font-mono">Shift+Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}