"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

type Role = "teacher" | "student";

export default function RoleSelectPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    // TODO: persist role to DB / session
    await new Promise((r) => setTimeout(r, 800));
    router.push(selected === "teacher" ? "/dashboard" : "/teachers");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full max-w-md">

        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4 text-center"
          style={{ color: "#d97706" }}
        >
          One last step
        </p>

        {/* Heading */}
        <h1
          className="font-display text-4xl font-bold leading-tight mb-3 text-center"
          style={{ color: "#0a0a0f" }}
        >
          How will you use<br />
          <em style={{ color: "#d97706" }}>TeacherOS?</em>
        </h1>

        <p
          className="text-sm text-center mb-10 leading-relaxed"
          style={{ color: "rgba(10,10,15,0.5)", fontFamily: "inherit" }}
        >
          Choose your role — you can always switch later from settings.
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Teacher card */}
          <button
            onClick={() => setSelected("teacher")}
            className="relative text-left w-full rounded-2xl p-6 transition-all duration-300 group"
            style={{
              background: selected === "teacher" ? "#0a0a0f" : "rgba(255,255,255,0.75)",
              border: selected === "teacher"
                ? "2px solid #0a0a0f"
                : "1.5px solid rgba(10,10,15,0.12)",
              transform: selected === "teacher" ? "scale(1.01)" : "scale(1)",
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
              style={{
                background: selected === "teacher" ? "rgba(217,119,6,0.2)" : "rgba(10,10,15,0.06)",
              }}
            >
              <BookOpen
                size={22}
                style={{ color: selected === "teacher" ? "#d97706" : "rgba(10,10,15,0.5)" }}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="font-bold text-lg mb-1"
                  style={{
                    color: selected === "teacher" ? "#f5f0e8" : "#0a0a0f",
                    fontFamily: "inherit",
                  }}
                >
                  I'm a Teacher
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: selected === "teacher" ? "rgba(245,240,232,0.6)" : "rgba(10,10,15,0.5)",
                  }}
                >
                  Create AI clones of yourself, upload notebooks, and let students learn from your teaching style 24/7.
                </p>
              </div>

              {/* Check circle */}
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
                style={{
                  borderColor: selected === "teacher" ? "#d97706" : "rgba(10,10,15,0.2)",
                  background: selected === "teacher" ? "#d97706" : "transparent",
                }}
              >
                {selected === "teacher" && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            {/* Perks */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["AI Clone", "PDF Upload", "Analytics", "Student Mgmt"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    background: selected === "teacher" ? "rgba(245,240,232,0.1)" : "rgba(10,10,15,0.06)",
                    color: selected === "teacher" ? "rgba(245,240,232,0.7)" : "rgba(10,10,15,0.5)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Student card */}
          <button
            onClick={() => setSelected("student")}
            className="relative text-left w-full rounded-2xl p-6 transition-all duration-300"
            style={{
              background: selected === "student" ? "#0a0a0f" : "rgba(255,255,255,0.75)",
              border: selected === "student"
                ? "2px solid #0a0a0f"
                : "1.5px solid rgba(10,10,15,0.12)",
              transform: selected === "student" ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
              style={{
                background: selected === "student" ? "rgba(217,119,6,0.2)" : "rgba(10,10,15,0.06)",
              }}
            >
              <GraduationCap
                size={22}
                style={{ color: selected === "student" ? "#d97706" : "rgba(10,10,15,0.5)" }}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="font-bold text-lg mb-1"
                  style={{
                    color: selected === "student" ? "#f5f0e8" : "#0a0a0f",
                    fontFamily: "inherit",
                  }}
                >
                  I'm a Student
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: selected === "student" ? "rgba(245,240,232,0.6)" : "rgba(10,10,15,0.5)",
                  }}
                >
                  Chat with your teacher's AI clone, get instant answers from their notebooks, and study smarter.
                </p>
              </div>

              <div
                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
                style={{
                  borderColor: selected === "student" ? "#d97706" : "rgba(10,10,15,0.2)",
                  background: selected === "student" ? "#d97706" : "transparent",
                }}
              >
                {selected === "student" && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {["AI Tutor", "Instant Answers", "24/7 Access", "Smart Study"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    background: selected === "student" ? "rgba(245,240,232,0.1)" : "rgba(10,10,15,0.06)",
                    color: selected === "student" ? "rgba(245,240,232,0.7)" : "rgba(10,10,15,0.5)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300"
          style={{
            background: !selected ? "rgba(10,10,15,0.15)" : loading ? "rgba(10,10,15,0.6)" : "#0a0a0f",
            color: !selected ? "rgba(10,10,15,0.35)" : "#f5f0e8",
            cursor: !selected ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "#f5f0e8" }}
              />
              Setting up your space…
            </>
          ) : (
            <>
              <Sparkles size={15} />
              {selected
                ? `Continue as ${selected === "teacher" ? "Teacher" : "Student"}`
                : "Select a role to continue"}
              {selected && <ArrowRight size={15} />}
            </>
          )}
        </button>

        <p
          className="text-xs text-center mt-5"
          style={{ color: "rgba(10,10,15,0.35)" }}
        >
          Your role determines what features you'll see after sign in.
        </p>
      </div>
    </div>
  );
}