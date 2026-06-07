"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

const quotes = [
  {
    text: "NanoSyllabus transformed how my students engage with course material. They ask better questions now.",
    author: "Dr. Meera Joshi",
    role: "Associate Professor, IIT Delhi",
    initials: "MJ",
    color: "bg-amber-400",
  },
  {
    text: "I uploaded a semester's worth of notes in one afternoon. The AI handles all the repetitive student questions.",
    author: "Prof. James O'Brien",
    role: "Lecturer, University of Edinburgh",
    initials: "JO",
    color: "bg-moss",
  },
  {
    text: "Studying at 2am before exams finally feels possible. I just chat and the notebook explains everything.",
    author: "Priya K.",
    role: "Final Year, Computer Science",
    initials: "PK",
    color: "bg-slate",
  },
];

const stats = [
  { value: "12,400+", label: "Teachers" },
  { value: "89K+", label: "Students" },
  { value: "2.1M+", label: "Questions answered" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "var(--ink)" }}
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(217,119,6,0.18) 0%, transparent 65%)" }}
        />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(245,240,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top: logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,240,232,0.08)" }}>
              <BookOpen size={17} style={{ color: "#fcd34d" }} />
            </div>
            <span className="font-display font-semibold text-xl" style={{ color: "#f5f0e8" }}>
              Nano<span style={{ color: "#f59e0b" }}>Syllabus</span>
            </span>
          </Link>
        </div>

        {/* Middle: notebook illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12">
          <div className="relative notebook-float">
            {/* Stacked notebook cards */}
            <div className="absolute -top-3 -left-3 w-64 h-80 rounded-2xl rotate-[-6deg]"
              style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.08)" }} />
            <div className="absolute -top-1.5 -left-1.5 w-64 h-80 rounded-2xl rotate-[-3deg]"
              style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.10)" }} />

            {/* Main notebook */}
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden"
              style={{ background: "rgba(245,240,232,0.09)", border: "1px solid rgba(245,240,232,0.15)" }}>
              {/* Notebook spine */}
              <div className="absolute left-0 top-0 bottom-0 w-6"
                style={{ background: "rgba(217,119,6,0.3)", borderRight: "1px solid rgba(217,119,6,0.2)" }} />

              <div className="pl-9 pr-5 py-6 h-full flex flex-col gap-3">
                {/* Title */}
                <div className="h-4 w-3/4 rounded-full" style={{ background: "rgba(245,240,232,0.2)" }} />
                <div className="h-2.5 w-1/2 rounded-full" style={{ background: "rgba(245,240,232,0.1)" }} />

                <div className="mt-2 space-y-2">
                  {[1, 0.7, 0.85, 0.6, 0.9, 0.5, 0.75].map((w, i) => (
                    <div key={i} className="h-2 rounded-full" style={{ width: `${w * 100}%`, background: "rgba(245,240,232,0.08)" }} />
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  {[0.8, 0.6, 0.7, 0.55].map((w, i) => (
                    <div key={i} className="h-2 rounded-full" style={{ width: `${w * 100}%`, background: "rgba(245,240,232,0.06)" }} />
                  ))}
                </div>

                {/* Tag */}
                <div className="mt-auto inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.25)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b" }} />
                  <span className="font-mono text-xs" style={{ color: "#fbbf24" }}>CS 101</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-10 top-8 flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-xl"
              style={{ background: "rgba(30,42,58,0.95)", border: "1px solid rgba(245,240,232,0.1)" }}>
              <span>📚</span>
              <div>
                <p className="font-body text-xs font-medium" style={{ color: "#f5f0e8" }}>24 resources</p>
                <p className="font-mono text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>indexed & ready</p>
              </div>
            </div>

            <div className="absolute -left-12 -bottom-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-xl"
              style={{ background: "rgba(30,42,58,0.95)", border: "1px solid rgba(245,240,232,0.1)" }}>
              <span>💬</span>
              <div>
                <p className="font-body text-xs font-medium" style={{ color: "#f5f0e8" }}>312 answers</p>
                <p className="font-mono text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>this semester</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: quote + stats */}
        <div className="relative z-10 space-y-8">
          {/* Testimonial */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.08)" }}>
            <p className="font-display italic text-lg leading-relaxed mb-5" style={{ color: "rgba(245,240,232,0.85)" }}>
              "{quote.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 ${quote.color} rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0`}>
                {quote.initials}
              </div>
              <div>
                <p className="font-body font-medium text-sm" style={{ color: "#f5f0e8" }}>{quote.author}</p>
                <p className="font-mono text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>{quote.role}</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-2xl" style={{ color: "#f5f0e8" }}>{s.value}</p>
                <p className="font-mono text-xs" style={{ color: "rgba(245,240,232,0.35)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ background: "#faf7f2" }}>
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(10,10,15,0.08)" }}>
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0a0a0f" }}>
              <BookOpen size={14} style={{ color: "#fcd34d" }} />
            </div>
            <span className="font-display font-semibold text-lg">
              Nano<span style={{ color: "#d97706" }}>Syllabus</span>
            </span>
          </Link>
          <Link href="/" className="font-body text-sm" style={{ color: "rgba(10,10,15,0.5)" }}>
            ← Back
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 text-center">
          <p className="font-mono text-xs" style={{ color: "rgba(10,10,15,0.25)" }}>
            © 2025 NanoSyllabus · <a href="#" className="hover:opacity-70 transition-opacity">Privacy</a> · <a href="#" className="hover:opacity-70 transition-opacity">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}