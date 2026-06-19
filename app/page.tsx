"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  QrCode, Unlock, BookOpen, Check, Download, Copy,
  Atom, FlaskConical, Dna, Calculator,
  BookText, Languages, Monitor, BarChart2, TrendingUp,
  Sparkles, Brain, Zap, Shield,
} from "lucide-react";

/* ─── constants ─── */
const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Subjects",     href: "#subjects" },
  { label: "Teachers",     href: "#teachers" },
  { label: "AI Tutor",     href: "#ai" },
];

const STATS = [
  { label: "Resources",    num: 500, plus: true,  display: null },
  { label: "Teachers",     num: 120, plus: true,  display: null },
  { label: "NEB Subjects", num: 9,   plus: false, display: null },
  { label: "Curriculum",   num: null, plus: false, display: "Gr. 11–12" },
];

const STEPS = [
  { num: "01", Icon: QrCode,    title: "Scan or search",   body: "Find a teacher's profile or scan their QR code to access shared resources instantly — no app needed." },
  { num: "02", Icon: Unlock,    title: "Request access",   body: "Send a request to the teacher. Once approved you receive an email invite with direct, private access." },
  { num: "03", Icon: BookOpen,  title: "Start learning",   body: "Browse notebooks, download PDFs, watch videos — all organised by subject and grade." },
];

const SUBJECTS = [
  { name: "Physics",          Icon: Atom },
  { name: "Chemistry",        Icon: FlaskConical },
  { name: "Biology",          Icon: Dna },
  { name: "Mathematics",      Icon: Calculator },
  { name: "English",          Icon: BookText },
  { name: "Nepali",           Icon: Languages },
  { name: "Computer Science", Icon: Monitor },
  { name: "Accountancy",      Icon: BarChart2 },
  { name: "Economics",        Icon: TrendingUp },
];

const TEACHERS = [
  { initials: "RB", name: "Rajesh Bhandari", subjects: ["Physics", "Grade 12"],               stats: "24 resources · 180 students" },
  { initials: "SP", name: "Sunita Poudel",   subjects: ["Chemistry", "Grade 11"],              stats: "18 resources · 140 students" },
  { initials: "MK", name: "Manoj Karki",     subjects: ["Mathematics", "Grade 11", "Grade 12"], stats: "31 resources · 210 students" },
];

const AI_FEATURES = [
  { Icon: Brain,    title: "Explain any concept",      body: "Ask the AI to break down complex NEB topics — Newton's laws, organic chemistry, calculus — in plain, simple language tailored to your level." },
  { Icon: Zap,      title: "Instant answers",          body: "Get step-by-step solutions to past paper questions in seconds. The AI shows its working so you learn the method, not just the answer." },
  { Icon: Sparkles, title: "Smart summaries",          body: "Upload your teacher's notes or PDFs and let the AI generate a concise study summary, flashcards, or a revision checklist automatically." },
  { Icon: Shield,   title: "NEB-curriculum aligned",   body: "Every answer is grounded in the official NEB Grade 11 & 12 syllabus — no off-topic content, specific to your exams." },
];

const FLOAT_CARDS = [
  { label: "Wave Equation",   value: "v = fλ",                   style: { left: "-12%",  top: "10%" } },
  { label: "Derivative",      value: "dy/dx = nxⁿ⁻¹",           style: { right: "-10%", top: "20%" } },
  { label: "Ideal Gas",       value: "PV = nRT",                 style: { left: "-14%",  top: "58%" } },
  { label: "Photosynthesis",  value: "6CO₂ + 6H₂O → C₆H₁₂O₆",  style: { right: "-8%",  top: "70%" } },
];

const MARQUEE_ITEMS = ["Physics","Chemistry","Mathematics","Biology","Computer Science","Economics","Accountancy","Nepali","English"];

/* ─── Page ─── */
export default function Page() {
  const navRef          = useRef<HTMLElement>(null);
  const heroRightRef    = useRef<HTMLDivElement>(null);
  const orbRef          = useRef<HTMLDivElement>(null);
  const stepsRef        = useRef<HTMLDivElement>(null);
  const subjectsRef     = useRef<HTMLDivElement>(null);
  const teachersRef     = useRef<HTMLDivElement>(null);
  const aiRef           = useRef<HTMLDivElement>(null);
  const ctaRef          = useRef<HTMLDivElement>(null);
  const floatRefs       = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      /* ── Entry sequence ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(navRef.current,      { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".hero-eyebrow",      { opacity: 0, y: 14 },  { opacity: 1, y: 0, duration: 0.55 }, "-=0.1")
        .fromTo(".hero-headline",     { opacity: 0, y: 26 },  { opacity: 1, y: 0, duration: 0.7  }, "-=0.35")
        .fromTo(".hero-sub",          { opacity: 0, y: 18 },  { opacity: 1, y: 0, duration: 0.6  }, "-=0.45")
        .fromTo(".hero-ctas",         { opacity: 0, y: 14 },  { opacity: 1, y: 0, duration: 0.5  }, "-=0.35")
        .fromTo(".hero-trust",        { opacity: 0 },         { opacity: 1,        duration: 0.5  }, "-=0.2")
        .fromTo(".hero-marquee",      { opacity: 0 },         { opacity: 1,        duration: 0.6  }, "-=0.1");

      /* ── Hero right ── */
      gsap.fromTo(heroRightRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out", delay: 0.55 }
      );

      /* ── Float cards ── */
      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, scale: 0.84, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)", delay: 0.95 + i * 0.14 }
        );
        /* continuous float */
        gsap.to(el, {
          y: i % 2 === 0 ? -11 : 11,
          duration: 2.5 + i * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.45,
        });
      });

      /* ── Orb pulse ── */
      gsap.to(orbRef.current, {
        boxShadow: "0 0 72px rgba(255,255,255,0.14)",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ── Stat counters ── */
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseInt(el.dataset.count!);
        const plus   = el.dataset.plus === "true";
        const obj    = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(el.closest(".stat-col")!, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5 });
            gsap.to(obj, {
              v: target, duration: 1.2, ease: "power2.out",
              onUpdate: () => { el.textContent = Math.round(obj.v) + (plus ? "+" : ""); },
            });
          },
        });
      });
      document.querySelectorAll<HTMLElement>(".stat-static").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.fromTo(el.closest(".stat-col")!, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5 }),
        });
      });

      /* ── Steps ── */
      gsap.utils.toArray<HTMLElement>(".step-card").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.13, ease: "power3.out",
          scrollTrigger: { trigger: stepsRef.current, start: "top 78%" },
        });
      });

      /* ── Subjects ── */
      gsap.utils.toArray<HTMLElement>(".subject-card").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.55, delay: i * 0.055, ease: "power2.out",
          scrollTrigger: { trigger: subjectsRef.current, start: "top 80%" },
        });
      });

      /* ── Teachers ── */
      gsap.utils.toArray<HTMLElement>(".teacher-card").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 34 }, {
          opacity: 1, y: 0, duration: 0.65, delay: i * 0.14, ease: "power3.out",
          scrollTrigger: { trigger: teachersRef.current, start: "top 80%" },
        });
      });

      /* ── AI features ── */
      gsap.utils.toArray<HTMLElement>(".ai-feat").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: i % 2 === 0 ? -22 : 22 }, {
          opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: aiRef.current, start: "top 78%" },
        });
      });

      /* ── Hero grid parallax ── */
      gsap.to(".hero-grid-bg", {
        y: 80, ease: "none",
        scrollTrigger: { trigger: ".hero-sect", start: "top top", end: "bottom top", scrub: true },
      });

      /* ── CTA ── */
      [".cta-h", ".cta-p", ".cta-b"].forEach((sel, i) => {
        gsap.fromTo(sel, { opacity: 0, y: i === 0 ? 22 : 0 }, {
          opacity: 1, y: 0, duration: 0.65, delay: i * 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 78%" },
        });
      });

      /* ── Magnetic buttons ── */
      document.querySelectorAll<HTMLElement>(".mag").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const r  = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
          const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
          gsap.to(btn, { x: dx, y: dy, duration: 0.28, ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", () =>
          gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.4)" })
        );
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ── NAV ── */}
      <header
        ref={navRef}
        style={{ opacity: 0, position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e5e5" }}
      >
        <a href="#" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em", color: "#000", textDecoration: "none" }}>
          Tutor AI Companion
        </a>
        <nav style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{ fontSize: 14, color: "#737373", textDecoration: "none" }}
               onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
               onMouseLeave={(e) => (e.currentTarget.style.color = "#737373")}>{l.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#" className="mag" style={{ padding: "8px 20px", fontSize: 13, fontWeight: 500, color: "#000", border: "1px solid #e5e5e5", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>Sign in</a>
          <a href="#" className="mag" style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#000", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>Get access</a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero-sect" style={{ background: "#0a0a0a", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div className="hero-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none",
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "72px 72px" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1080, margin: "0 auto", padding: "0 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", minHeight: "100vh" }}>

          {/* Left */}
          <div>
            <div className="hero-eyebrow" style={{ opacity: 0, display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px",
              marginBottom: 36, fontSize: 11, fontWeight: 500, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulseD 2s ease-in-out infinite" }} />
              NEB Grade 11 &amp; 12 · Nepal
            </div>

            <h1 className="hero-headline" style={{ opacity: 0, fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(38px,4.8vw,66px)", fontWeight: 700, letterSpacing: "-0.035em",
              lineHeight: 1.02, color: "#fff", marginBottom: 22 }}>
              Your AI tutor<br />
              <span style={{ color: "#737373" }}>for every NEB</span><br />
              subject.
            </h1>

            <p className="hero-sub" style={{ opacity: 0, fontSize: 15, fontWeight: 300, color: "#a3a3a3", maxWidth: 420, lineHeight: 1.75, marginBottom: 36 }}>
              Ask anything. Get step-by-step explanations, smart summaries, and instant help — powered by AI, aligned to Nepal's NEB curriculum.
            </p>

            <div className="hero-ctas" style={{ opacity: 0, display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
              <button className="mag" style={{ padding: "13px 28px", fontSize: 14, fontWeight: 600, color: "#000", background: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
                Start learning free
              </button>
              <button className="mag" style={{ padding: "13px 28px", fontSize: 14, fontWeight: 500, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
                Join as teacher
              </button>
            </div>

            <div className="hero-trust" style={{ opacity: 0, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {[["✓ NEB-aligned content"], ["✦ AI-powered explanations"], ["◎ 5,000+ students"]].map(([t]) => (
                <span key={t} style={{ fontSize: 12, color: "#525252" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div ref={heroRightRef} style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0 }}>

            {/* Float cards */}
            {FLOAT_CARDS.map((c, i) => (
              <div key={i} ref={(el) => { floatRefs.current[i] = el; }}
                style={{ position: "absolute", ...c.style, opacity: 0,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.13)",
                  borderRadius: 12, padding: "10px 15px", display: "flex", alignItems: "center", gap: 10,
                  backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#000" }}>f(x)</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#525252", marginBottom: 2 }}>{c.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk',sans-serif" }}>{c.value}</span>
                </div>
              </div>
            ))}

            {/* Central orb */}
            <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Ring 1 */}
              <div style={{ position: "absolute", inset: -22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
              {/* Ring 2 */}
              <div style={{ position: "absolute", inset: -50, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              {/* Ring 3 */}
              <div style={{ position: "absolute", inset: -84, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.025)", pointerEvents: "none" }} />

              {/* Main orb */}
              <div ref={orbRef} style={{ width: "100%", height: "100%", borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Inner white circle */}
                <div style={{ width: 166, height: 166, borderRadius: "50%", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 50px rgba(255,255,255,0.08)" }}>
                  {/* AI Brain SVG */}
                  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AI tutor brain illustration">
                    {/* Outer brain shape */}
                    <path d="M45 13C35.5 13 27.5 19.5 26 28C21 29 17 33 17 38.5C17 41.5 18.5 44 21 45.5C19.2 47.5 18 50.2 18 53C18 58.5 22 63.2 27.5 64.5V69C27.5 71.2 29.3 73 31.5 73H58.5C60.7 73 62.5 71.2 62.5 69V64.5C68 63.2 72 58.5 72 53C72 50.2 70.8 47.5 69 45.5C71.5 44 73 41.5 73 38.5C73 33 69 29 64 28C62.5 19.5 54.5 13 45 13Z"
                      fill="#0a0a0a"/>
                    {/* Left hemisphere */}
                    <path d="M45 15C37 15 30.5 20.5 29 28.5C24.5 29.5 21 33 21 38C21 40.5 22.2 42.7 24.5 44C22.5 46 21.5 48.5 21.5 51C21.5 55.8 25 60 30 61.5V67H45V15Z"
                      fill="#141414"/>
                    {/* Right hemisphere */}
                    <path d="M45 15C53 15 59.5 20.5 61 28.5C65.5 29.5 69 33 69 38C69 40.5 67.8 42.7 65.5 44C67.5 46 68.5 48.5 68.5 51C68.5 55.8 65 60 60 61.5V67H45V15Z"
                      fill="#111111"/>
                    {/* Center divider */}
                    <line x1="45" y1="17" x2="45" y2="67" stroke="white" strokeWidth="0.6" strokeOpacity="0.15"/>
                    {/* Brain grooves - left */}
                    <path d="M31 33C31 33 28.5 37.5 31 41" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5"/>
                    <path d="M37 29C37 29 34.5 34.5 37 38.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.45"/>
                    <path d="M31 44C31 44 28.5 48 31 51" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
                    {/* Brain grooves - right */}
                    <path d="M59 33C59 33 61.5 37.5 59 41" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5"/>
                    <path d="M53 29C53 29 55.5 34.5 53 38.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.45"/>
                    <path d="M59 44C59 44 61.5 48 59 51" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
                    {/* Neural nodes */}
                    <circle cx="34" cy="39" r="3.2" fill="white" fillOpacity="0.92"/>
                    <circle cx="56" cy="39" r="3.2" fill="white" fillOpacity="0.92"/>
                    <circle cx="45" cy="34" r="2.8" fill="white" fillOpacity="0.85"/>
                    <circle cx="38" cy="51" r="2.6" fill="white" fillOpacity="0.78"/>
                    <circle cx="52" cy="51" r="2.6" fill="white" fillOpacity="0.78"/>
                    <circle cx="45" cy="60" r="2.2" fill="white" fillOpacity="0.65"/>
                    {/* Neural connections */}
                    <line x1="34" y1="39" x2="45" y2="34" stroke="white" strokeWidth="0.9" strokeOpacity="0.4"/>
                    <line x1="56" y1="39" x2="45" y2="34" stroke="white" strokeWidth="0.9" strokeOpacity="0.4"/>
                    <line x1="34" y1="39" x2="38" y2="51" stroke="white" strokeWidth="0.9" strokeOpacity="0.35"/>
                    <line x1="56" y1="39" x2="52" y2="51" stroke="white" strokeWidth="0.9" strokeOpacity="0.35"/>
                    <line x1="38" y1="51" x2="45" y2="60" stroke="white" strokeWidth="0.9" strokeOpacity="0.3"/>
                    <line x1="52" y1="51" x2="45" y2="60" stroke="white" strokeWidth="0.9" strokeOpacity="0.3"/>
                    <line x1="38" y1="51" x2="52" y2="51" stroke="white" strokeWidth="0.9" strokeOpacity="0.25"/>
                    <line x1="34" y1="39" x2="56" y2="39" stroke="white" strokeWidth="0.9" strokeOpacity="0.2"/>
                    {/* Top sparkle */}
                    <path d="M45 5L46.4 9.4L51 10.8L46.4 12.2L45 16.6L43.6 12.2L39 10.8L43.6 9.4Z" fill="#0a0a0a" fillOpacity="0.9"/>
                    {/* Side sparkles */}
                    <path d="M19 21L19.9 23.8L22.7 24.7L19.9 25.6L19 28.4L18.1 25.6L15.3 24.7L18.1 23.8Z" fill="#0a0a0a" fillOpacity="0.5"/>
                    <path d="M71 19L71.8 21.5L74.3 22.3L71.8 23.1L71 25.6L70.2 23.1L67.7 22.3L70.2 21.5Z" fill="#0a0a0a" fillOpacity="0.4"/>
                  </svg>
                </div>
              </div>

              {/* AI typing bubble */}
              <div style={{ position: "absolute", bottom: -50, left: "50%", transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100, padding: "6px 16px", display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 11, color: "#737373" }}>AI is thinking</span>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.45)", display: "inline-block",
                    animation: `typingDot 1.2s ${d}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>

            {/* Bottom symbol row */}
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10 }}>
              {["∫dx", "E=mc²", "DNA", "∑n"].map((s) => (
                <div key={s} style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
                  fontSize: 11, fontWeight: 700, color: "#525252", fontFamily: "'Space Grotesk',sans-serif" }}>{s}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="hero-marquee" style={{ width: "100%", overflow: "hidden", opacity: 0,
          borderTop: "1px solid rgba(255,255,255,0.08)", padding: "26px 0" }} aria-hidden="true">
          <div style={{ display: "flex", animation: "marquee 28s linear infinite", whiteSpace: "nowrap" }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24, padding: "0 36px",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                {s}<span style={{ color: "rgba(255,255,255,0.12)", fontSize: 18 }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e5e5" }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-col" style={{ flex: 1, padding: "36px 40px",
            borderRight: i < STATS.length - 1 ? "1px solid #e5e5e5" : "none", opacity: 0 }}>
            {s.num !== null ? (
              <span data-count={s.num} data-plus={s.plus}
                style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: 38, fontWeight: 700,
                  letterSpacing: "-0.04em", lineHeight: 1, color: "#000", marginBottom: 6 }}>0</span>
            ) : (
              <span className="stat-static" style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: 38, fontWeight: 700,
                letterSpacing: "-0.04em", lineHeight: 1, color: "#000", marginBottom: 6 }}>{s.display}</span>
            )}
            <span style={{ fontSize: 12, color: "#a3a3a3", letterSpacing: "0.04em" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 48px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a3a3a3", marginBottom: 20 }}>How it works</p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700,
            letterSpacing: "-0.03em", lineHeight: 1.05, color: "#000", marginBottom: 56 }}>
            Three steps to access<br />any resource.
          </h2>
          <div ref={stepsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid #e5e5e5", borderRadius: 16, overflow: "hidden" }}>
            {STEPS.map(({ num, Icon, title, body }, i) => (
              <div key={num} className="step-card" style={{ padding: "44px 36px", borderRight: i < 2 ? "1px solid #e5e5e5" : "none",
                opacity: 0, transform: "translateY(30px)", cursor: "default", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                <span style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: 88, fontWeight: 700,
                  color: "#e5e5e5", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 20 }}>{num}</span>
                <div style={{ width: 40, height: 40, background: "#000", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={18} strokeWidth={1.8} color="#fff" />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#000", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#737373", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TUTOR ── */}
      <section id="ai" style={{ background: "#0a0a0a" }}>
        <div ref={aiRef} style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 48px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>AI Tutor</p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700,
            letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
            Your personal AI companion<br /><span style={{ color: "#737373" }}>that understands NEB.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#737373", lineHeight: 1.7, maxWidth: 480, marginBottom: 56 }}>
            Unlike generic AI tools, Tutor AI Companion is trained on the NEB syllabus, past papers, and teacher notes — so every answer is specific to your exam.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 40 }}>
            {AI_FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="ai-feat" style={{ borderRadius: 16, padding: "32px", border: "1px solid rgba(255,255,255,0.08)", opacity: 0,
                transition: "background 0.2s", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 40, height: 40, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={18} strokeWidth={1.8} color="#000" />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#737373", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>

          {/* Chat mockup */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
              {["#3f3f3f","#3f3f3f","#3f3f3f"].map((c,i) => (
                <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ marginLeft: 10, fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Grotesk',sans-serif" }}>Tutor AI Companion</span>
            </div>
            <div style={{ background: "#0d0d0d", padding: "32px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "#fff", color: "#000", borderRadius: "16px 16px 4px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
                  Can you explain Newton's Second Law with an NEB example?
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Brain size={15} color="#000" />
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", color: "#d4d4d4", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.65, maxWidth: 380 }}>
                  Newton's Second Law states that <strong style={{ color: "#fff" }}>F&nbsp;=&nbsp;ma</strong> — force equals mass times acceleration.<br /><br />
                  <span style={{ color: "#a3a3a3" }}>A classic NEB example: a 5 kg block on a frictionless surface is pushed with 20 N of force. Its acceleration&nbsp;=&nbsp;20&nbsp;÷&nbsp;5&nbsp;=&nbsp;<strong style={{ color: "#fff" }}>4 m/s²</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section id="subjects" style={{ background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 0" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20, paddingTop: 80 }}>Subjects</p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700,
            letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", paddingBottom: 48 }}>
            Every NEB subject,<br />in one place.
          </h2>
        </div>
        <div ref={subjectsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.07)" }}>
          {SUBJECTS.map(({ name, Icon }) => <SubjectCard key={name} name={name} Icon={Icon} />)}
        </div>
        <div style={{ height: 80 }} />
      </section>

      {/* ── TEACHERS ── */}
      <section id="teachers" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 48px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a3a3a3", marginBottom: 20 }}>Teachers</p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700,
            letterSpacing: "-0.03em", lineHeight: 1.05, color: "#000", marginBottom: 52 }}>
            Learn from real teachers<br />across Nepal.
          </h2>
          <div ref={teachersRef} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {TEACHERS.map((t) => (
              <div key={t.name} className="teacher-card" style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: "30px", display: "flex",
                flexDirection: "column", gap: 18, opacity: 0, transform: "translateY(30px)", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: 54, height: 54, background: "#000", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{t.initials}</div>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#000" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>{t.stats}</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {t.subjects.map((s) => (
                    <span key={s} style={{ padding: "4px 11px", fontSize: 12, fontWeight: 500, color: "#737373", border: "1px solid #e5e5e5", borderRadius: 100 }}>{s}</span>
                  ))}
                </div>
                <button style={{ marginTop: "auto", padding: "11px", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                  color: "#000", background: "transparent", border: "1px solid #e5e5e5", borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background="#000"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#000"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor="#e5e5e5"; }}>
                  View notebooks →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR ── */}
      <section style={{ background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 48px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>QR Access</p>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: 40 }}>
              Share resources<br />with a single scan.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["Set expiry dates on QR links", "Control access: public, class-only, or email list", "No app needed — works with any camera"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 20, height: 20, background: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} strokeWidth={3} color="#000" />
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 176, height: 176, border: "1px solid #e5e5e5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <QrCode size={108} strokeWidth={0.85} color="#000" />
            </div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, textAlign: "center", color: "#000" }}>Class 12 Physics – Wave Optics</p>
            <span style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100 }}>Scan to access</span>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              {[[Download,"Download"],[Copy,"Copy link"]].map(([Ic, lbl]) => (
                <button key={lbl as string} style={{ flex: 1, padding: "9px", fontSize: 12, fontWeight: 500, fontFamily: "inherit", color: "#000",
                  background: "transparent", border: "1px solid #e5e5e5", borderRadius: 9, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Ic size={13} />{lbl as string}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#000", padding: "112px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(100px,18vw,200px)", fontWeight: 700, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.024)", whiteSpace: "nowrap" }}>LEARN</span>
        </div>
        <div ref={ctaRef} style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          <h2 className="cta-h" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", marginBottom: 18, opacity: 0 }}>
            Ready to start<br />learning?
          </h2>
          <p className="cta-p" style={{ fontSize: 16, color: "#525252", fontWeight: 300, lineHeight: 1.65, marginBottom: 40, opacity: 0 }}>
            Join thousands of students and teachers already using Tutor AI Companion across Nepal.
          </p>
          <div className="cta-b" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", opacity: 0 }}>
            <button className="mag" style={{ padding: "14px 36px", fontSize: 14, fontWeight: 600, color: "#000", background: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
              Join as student
            </button>
            <button className="mag" style={{ padding: "14px 36px", fontSize: 14, fontWeight: 500, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
              Join as teacher
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "60px 48px 28px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 56, paddingBottom: 44, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 10 }}>Tutor AI Companion</p>
            <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.65 }}>Nepal's AI-powered NEB learning platform — connecting students with Grade 11 &amp; 12 teachers.</p>
          </div>
          {[["Navigate",[["Home","#"],["How it works","#how"],["Subjects","#subjects"],["AI Tutor","#ai"]]],
            ["Account",[["Sign in","#"],["Get access","#"],["Join as teacher","#"]]]].map(([title, links]) => (
            <div key={title as string}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#525252", marginBottom: 18 }}>{title as string}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {(links as [string,string][]).map(([l,h]) => (
                  <li key={l}><a href={h} style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#525252" }}>© 2025 Tutor AI Companion · Nepal</p>
          <p style={{ fontSize: 12, color: "#525252" }}>Built for NEB students</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        @keyframes marquee   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes typingDot { 0%,60%,100% { opacity:0.2; transform:translateY(0); } 30% { opacity:0.8; transform:translateY(-3px); } }
        @keyframes pulseD    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.65); } }
        @media (max-width: 768px) {
          .hero-sect > div > div { grid-template-columns: 1fr !important; }
          .hero-right-div { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
      `}</style>
    </div>
  );
}

/* ─── SubjectCard ─── */
function SubjectCard({ name, Icon }: { name: string; Icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => {
    if (!ref.current) return;
    gsap.to(ref.current,                                  { backgroundColor: "#fff", duration: 0.2 });
    gsap.to(ref.current.querySelectorAll(".sc-name"),     { color: "#000", duration: 0.2 });
    gsap.to(ref.current.querySelectorAll(".sc-grade"),    { color: "#737373", duration: 0.2 });
    gsap.to(ref.current.querySelector(".sc-icon"),        { backgroundColor: "#0a0a0a", borderColor: "#0a0a0a", duration: 0.2 });
  };
  const leave = () => {
    if (!ref.current) return;
    gsap.to(ref.current,                                  { backgroundColor: "#0a0a0a", duration: 0.25 });
    gsap.to(ref.current.querySelectorAll(".sc-name"),     { color: "#fff", duration: 0.25 });
    gsap.to(ref.current.querySelectorAll(".sc-grade"),    { color: "rgba(255,255,255,0.3)", duration: 0.25 });
    gsap.to(ref.current.querySelector(".sc-icon"),        { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.15)", duration: 0.25 });
  };

  return (
    <div ref={ref} className="subject-card" style={{ background: "#0a0a0a", padding: "36px 32px", cursor: "pointer", opacity: 0 }}
      onMouseEnter={enter} onMouseLeave={leave}>
      <div className="sc-icon" style={{ width: 42, height: 42, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
        <Icon size={20} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
      </div>
      <p className="sc-name" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 5 }}>{name}</p>
      <p className="sc-grade" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.03em" }}>Grade 11 · Grade 12</p>
    </div>
  );
}