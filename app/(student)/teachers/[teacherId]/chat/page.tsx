"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  BookOpen,
  Sparkles,
  ChevronDown,
  FileText,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  GraduationCap,
  Bot,
} from "lucide-react";

// ── types ──────────────────────────────────────────────────────────────────
type Subject = "Mathematics" | "Physics" | "Computer Science";
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
  subject: Subject;
  chapterCount: number;
}

// ── mock data ──────────────────────────────────────────────────────────────
const SUBJECT_STYLES: Record<Subject, { bg: string; text: string; accent: string; light: string }> = {
  Mathematics:       { bg: "#fef3c7", text: "#d97706", accent: "#d97706", light: "#fffbeb" },
  Physics:           { bg: "#fee2e2", text: "#dc2626", accent: "#dc2626", light: "#fff5f5" },
  "Computer Science":{ bg: "#f0fdf4", text: "#16a34a", accent: "#16a34a", light: "#f7fff8" },
};

const NOTEBOOKS: Notebook[] = [
  { id: "calc-1",  title: "Calculus I — Limits & Derivatives", subject: "Mathematics",        chapterCount: 8  },
  { id: "calc-2",  title: "Calculus II — Integration",          subject: "Mathematics",        chapterCount: 10 },
  { id: "linalg",  title: "Linear Algebra",                     subject: "Mathematics",        chapterCount: 12 },
  { id: "mech",    title: "Classical Mechanics",                subject: "Physics",            chapterCount: 11 },
  { id: "thermo",  title: "Thermodynamics",                     subject: "Physics",            chapterCount: 7  },
  { id: "dsa",     title: "Data Structures & Algorithms",       subject: "Computer Science",   chapterCount: 14 },
  { id: "discrete",title: "Discrete Mathematics",              subject: "Computer Science",   chapterCount: 10 },
];

const SUGGESTED_QUESTIONS: Record<Subject, string[]> = {
  Mathematics: [
    "Explain the chain rule with an example",
    "What is the difference between definite and indefinite integrals?",
    "How do eigenvalues relate to linear transformations?",
    "Solve: ∫ x·eˣ dx using integration by parts",
  ],
  Physics: [
    "Explain Newton's second law with a real-world example",
    "What is the first law of thermodynamics?",
    "Derive the equation for kinetic energy",
    "What is the difference between heat and temperature?",
  ],
  "Computer Science": [
    "What is the time complexity of quicksort?",
    "Explain binary search trees vs hash tables",
    "What is dynamic programming? Give an example",
    "Difference between BFS and DFS?",
  ],
};

// ── mock streaming reply ───────────────────────────────────────────────────
const MOCK_REPLIES: Record<Subject, string[]> = {
  Mathematics: [
    "Great question! Let me walk you through this step by step.\n\nThe **chain rule** tells us how to differentiate composite functions. If y = f(g(x)), then:\n\n> dy/dx = f'(g(x)) · g'(x)\n\n**Example:** Find the derivative of y = sin(x²)\n\nHere f(u) = sin(u) and g(x) = x², so:\n- f'(u) = cos(u)\n- g'(x) = 2x\n\nTherefore: dy/dx = cos(x²) · 2x = **2x cos(x²)**\n\nA helpful way to remember it: *\"derivative of the outside, keep the inside, times derivative of the inside.\"*",
    "Excellent! This is a fundamental concept in calculus.\n\nAn **indefinite integral** ∫f(x)dx gives you a family of antiderivatives + C (the constant of integration). It represents the general form.\n\nA **definite integral** ∫ₐᵇ f(x)dx gives you a specific number — the net area under the curve between x=a and x=b.\n\nKey difference: definite integrals have bounds and produce a value; indefinite integrals produce a function.",
  ],
  Physics: [
    "Newton's second law states: **F = ma** (Force = mass × acceleration)\n\nThis means the net force on an object equals its mass times its acceleration.\n\n**Real-world example:** When you push a shopping cart:\n- A heavier cart (more mass) requires more force to achieve the same acceleration\n- Applying more force to the same cart produces greater acceleration\n\nThis is why a loaded truck needs a much more powerful engine than a bicycle to accelerate at the same rate.",
    "The **First Law of Thermodynamics** is essentially the law of energy conservation:\n\n> ΔU = Q − W\n\nWhere:\n- **ΔU** = change in internal energy of the system\n- **Q** = heat added to the system\n- **W** = work done by the system\n\nIn simple terms: *Energy cannot be created or destroyed, only converted from one form to another.*",
  ],
  "Computer Science": [
    "**Quicksort** has the following time complexities:\n\n| Case | Complexity |\n|------|------------|\n| Best | O(n log n) |\n| Average | O(n log n) |\n| Worst | O(n²) |\n\nThe worst case O(n²) occurs when the pivot is always the smallest or largest element (e.g., already sorted array with naive pivot selection).\n\nIn practice, quicksort is very fast due to excellent cache performance and small constants, which is why it's the default sort in many standard libraries.",
    "Great comparison to make! Here's the key difference:\n\n**Binary Search Trees (BST)**\n- Ordered structure: left child < parent < right child\n- Search, insert, delete: O(log n) average, O(n) worst\n- Good for range queries and ordered traversal\n\n**Hash Tables**\n- Key-value pairs with hash function\n- Search, insert, delete: O(1) average\n- No ordering — can't do range queries\n\nUse BSTs when you need ordering; use hash tables when you need raw lookup speed.",
  ],
};

function getReply(subject: Subject): string {
  const replies = MOCK_REPLIES[subject];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ── sub-components ─────────────────────────────────────────────────────────
function MessageBubble({ msg, teacherName, accentColor }: { msg: Message; teacherName: string; accentColor: string }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Very naive markdown-ish renderer
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={i}
            className="border-l-2 pl-3 my-2 italic"
            style={{ borderColor: accentColor, color: "rgba(10,10,15,0.6)" }}
          >
            {line.slice(2)}
          </blockquote>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold my-1">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("| ")) {
        return (
          <p key={i} className="font-mono text-xs my-0.5" style={{ color: "rgba(10,10,15,0.7)" }}>
            {line}
          </p>
        );
      }
      if (line === "") return <div key={i} className="h-2" />;
      // inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="leading-relaxed">
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j}>{p.slice(2, -2)}</strong>
              : p
          )}
        </p>
      );
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div
          className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm"
          style={{ background: "#0a0a0f", color: "#f5f0e8" }}
        >
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6 group">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
        style={{ background: accentColor, color: "#fff" }}
      >
        AI
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-1.5" style={{ color: "rgba(10,10,15,0.4)" }}>
          {teacherName}'s AI Clone
        </p>
        <div
          className="rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1.5px solid rgba(10,10,15,0.08)",
            color: "#0a0a0f",
          }}
        >
          {renderContent(msg.content)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all duration-150 hover:scale-105"
            style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.45)" }}
          >
            <Copy size={11} />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="p-1.5 rounded-lg transition-all duration-150 hover:scale-105"
            style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.45)" }}
          >
            <ThumbsUp size={11} />
          </button>
          <button
            className="p-1.5 rounded-lg transition-all duration-150 hover:scale-105"
            style={{ background: "rgba(10,10,15,0.06)", color: "rgba(10,10,15,0.45)" }}
          >
            <ThumbsDown size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
export default function NotebookChatPage() {
  // In real app these come from params / props
  const teacherId = "prof-sharma";
  const teacherName = "Dr. Anita Sharma";
  const notebookId = "calc-1";

  const notebook = NOTEBOOKS.find((n) => n.id === notebookId) ?? NOTEBOOKS[0];
  const subject = notebook.subject;
  const style = SUBJECT_STYLES[subject];
  const suggestions = SUGGESTED_QUESTIONS[subject];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm Dr. Anita Sharma's AI clone, trained on her **${notebook.title}** notebook.\n\nAsk me anything from this notebook — definitions, solved problems, concept explanations, or practice questions. I'll answer exactly the way she teaches it.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [activeNotebook, setActiveNotebook] = useState<Notebook>(notebook);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Simulate streaming delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const reply: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getReply(activeNotebook.subject),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, reply]);
    setLoading(false);

    // TODO: replace mock with real API call:
    // const res = await fetch("/api/chat", {
    //   method: "POST",
    //   body: JSON.stringify({ messages: [...messages, userMsg], notebookId: activeNotebook.id, teacherId }),
    // });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I'm ${teacherName}'s AI clone, trained on her **${activeNotebook.title}** notebook.\n\nAsk me anything — I'll answer the way she teaches it.`,
        timestamp: new Date(),
      },
    ]);
  };

  const switchNotebook = (nb: Notebook) => {
    setActiveNotebook(nb);
    setNotebookOpen(false);
    setMessages([
      {
        id: "switch",
        role: "assistant",
        content: `Switched to **${nb.title}**.\n\nI'm now drawing from ${nb.chapterCount} chapters of ${teacherName}'s notes on ${nb.subject}. What would you like to explore?`,
        timestamp: new Date(),
      },
    ]);
  };

  const subjectStyle = SUBJECT_STYLES[activeNotebook.subject];

  return (
    <div className="flex flex-col h-screen" style={{ background: "#f5f0e8" }}>

      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 px-5 py-3 flex items-center gap-3"
        style={{
          background: "rgba(245,240,232,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(10,10,15,0.08)",
        }}
      >
        <Link
          href={`/teachers/${teacherId}`}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-60 flex-shrink-0"
          style={{ color: "rgba(10,10,15,0.5)" }}
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="w-px h-5 mx-1" style={{ background: "rgba(10,10,15,0.12)" }} />

        {/* Notebook switcher */}
        <div className="flex-1 relative">
          <button
            onClick={() => setNotebookOpen(!notebookOpen)}
            className="flex items-center gap-2.5 max-w-sm text-left"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: subjectStyle.bg }}
            >
              <FileText size={13} style={{ color: subjectStyle.text }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: "#0a0a0f", maxWidth: "220px" }}>
                {activeNotebook.title}
              </p>
              <p className="text-xs" style={{ color: "rgba(10,10,15,0.45)" }}>
                {activeNotebook.subject} · {activeNotebook.chapterCount} chapters
              </p>
            </div>
            <ChevronDown
              size={14}
              style={{
                color: "rgba(10,10,15,0.4)",
                transform: notebookOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                flexShrink: 0,
              }}
            />
          </button>

          {/* Dropdown */}
          {notebookOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-80 rounded-2xl overflow-hidden z-30"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(10,10,15,0.1)",
                boxShadow: "0 8px 32px rgba(10,10,15,0.1)",
              }}
            >
              <div className="p-3">
                <p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: "rgba(10,10,15,0.4)" }}>
                  SWITCH NOTEBOOK
                </p>
                {NOTEBOOKS.map((nb) => {
                  const s = SUBJECT_STYLES[nb.subject];
                  const active = nb.id === activeNotebook.id;
                  return (
                    <button
                      key={nb.id}
                      onClick={() => switchNotebook(nb)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                      style={{
                        background: active ? "#0a0a0f" : "transparent",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: active ? "rgba(255,255,255,0.15)" : s.bg }}
                      >
                        <BookOpen size={13} style={{ color: active ? "#fff" : s.text }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: active ? "#f5f0e8" : "#0a0a0f" }}
                        >
                          {nb.title}
                        </p>
                        <p className="text-xs" style={{ color: active ? "rgba(245,240,232,0.5)" : "rgba(10,10,15,0.4)" }}>
                          {nb.subject}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg transition-all duration-150 hover:scale-105"
            style={{ background: "rgba(10,10,15,0.07)", color: "rgba(10,10,15,0.5)" }}
            title="New conversation"
          >
            <RotateCcw size={14} />
          </button>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: subjectStyle.bg, color: subjectStyle.text }}
          >
            <Sparkles size={11} />
            AI Clone
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-0">
        <div className="max-w-2xl mx-auto">

          {/* Context banner */}
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-8"
            style={{
              background: subjectStyle.bg,
              border: `1px solid ${subjectStyle.text}25`,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: subjectStyle.text }}
            >
              <Bot size={14} color="#fff" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: subjectStyle.text }}>
                {teacherName} · AI Clone
              </p>
              <p className="text-xs" style={{ color: `${subjectStyle.text}99` }}>
                Answering from "{activeNotebook.title}" ({activeNotebook.chapterCount} chapters)
              </p>
            </div>
          </div>

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              teacherName={teacherName}
              accentColor={subjectStyle.accent}
            />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: subjectStyle.accent, color: "#fff" }}
              >
                AI
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(10,10,15,0.08)" }}
              >
                <Loader2 size={14} className="animate-spin" style={{ color: subjectStyle.accent }} />
                <span className="text-sm" style={{ color: "rgba(10,10,15,0.45)" }}>Thinking…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Suggestions ── */}
      {messages.length <= 1 && !loading && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs mb-2 ml-1" style={{ color: "rgba(10,10,15,0.4)" }}>
              Try asking…
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 text-xs px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 hover:scale-105 max-w-[220px]"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1.5px solid rgba(10,10,15,0.1)",
                    color: "rgba(10,10,15,0.65)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div
        className="flex-shrink-0 px-4 pb-5 pt-3"
        style={{ borderTop: "1px solid rgba(10,10,15,0.07)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
            style={{
              background: "#fff",
              border: `1.5px solid rgba(10,10,15,0.12)`,
            }}
          >
            <GraduationCap size={16} className="mb-0.5 flex-shrink-0" style={{ color: "rgba(10,10,15,0.3)" }} />

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${activeNotebook.subject}…`}
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
              style={{ color: "#0a0a0f", maxHeight: "120px" }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: input.trim() ? "#0a0a0f" : "rgba(10,10,15,0.1)",
                color: input.trim() ? "#f5f0e8" : "rgba(10,10,15,0.4)",
              }}
            >
              <Send size={15} />
            </button>
          </div>

          <p className="text-center text-xs mt-2" style={{ color: "rgba(10,10,15,0.3)" }}>
            Answers are based on {teacherName}'s notebooks · <kbd className="font-mono">Enter</kbd> to send, <kbd className="font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}