"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { signIn } from "next-auth/react";
type Role = "teacher" | "student";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleGoogleSignIn = async () => {
  await signIn("google", {
    callbackUrl: "/selectRole",
  });
    };

  return (
    <div>
      {/* Header */}
      <div className="mb-9">
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#d97706" }}>
          Welcome back
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight mb-3" style={{ color: "#0a0a0f" }}>
          Sign in to your<br />
          <em style={{ color: "#d97706" }}>classroom.</em>
        </h1>
        <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(10,10,15,0.55)" }}>
          Don't have an account?{" "}
          <Link href="/register" className="font-medium underline underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: "#0a0a0f" }}>
            Create one free
          </Link>
        </p>
      </div>

      {/* Role toggle */}
      <div className="relative flex rounded-xl p-1 mb-8" style={{ background: "rgba(10,10,15,0.06)" }}>
        <div
          className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out"
          style={{
            background: "#0a0a0f",
            left: role === "teacher" ? "4px" : "calc(50% + 2px)",
            width: "calc(50% - 6px)",
          }}
        />
        <button
          onClick={() => setRole("teacher")}
          className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors duration-200 z-10"
          style={{ color: role === "teacher" ? "#f5f0e8" : "rgba(10,10,15,0.5)" }}
        >
          <BookOpen size={15} />
          <span className="font-body font-medium text-sm">Teacher</span>
        </button>
        <button
          onClick={() => setRole("student")}
          className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors duration-200 z-10"
          style={{ color: role === "student" ? "#f5f0e8" : "rgba(10,10,15,0.5)" }}
        >
          <GraduationCap size={15} />
          <span className="font-body font-medium text-sm">Student</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block font-body font-medium text-xs mb-2" style={{ color: "rgba(10,10,15,0.6)" }}>
            Email address
          </label>
          <div
            className="relative rounded-xl transition-all duration-200"
            style={{
              border: focusedField === "email"
                ? "1.5px solid #0a0a0f"
                : "1.5px solid rgba(10,10,15,0.14)",
              background: focusedField === "email" ? "#ffffff" : "rgba(255,255,255,0.7)",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder={role === "teacher" ? "professor@university.edu" : "student@university.edu"}
              required
              className="w-full bg-transparent px-4 py-3.5 font-body text-sm outline-none rounded-xl"
              style={{ color: "#0a0a0f" }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-body font-medium text-xs" style={{ color: "rgba(10,10,15,0.6)" }}>
              Password
            </label>
            <Link href="/forgot-password" className="font-body text-xs hover:opacity-70 transition-opacity" style={{ color: "#d97706" }}>
              Forgot password?
            </Link>
          </div>
          <div
            className="relative rounded-xl transition-all duration-200"
            style={{
              border: focusedField === "password"
                ? "1.5px solid #0a0a0f"
                : "1.5px solid rgba(10,10,15,0.14)",
              background: focusedField === "password" ? "#ffffff" : "rgba(255,255,255,0.7)",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              required
              className="w-full bg-transparent px-4 py-3.5 font-body text-sm outline-none pr-12 rounded-xl"
              style={{ color: "#0a0a0f" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
              style={{ color: "rgba(10,10,15,0.4)" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="relative">
            <input type="checkbox" id="remember" className="sr-only peer" />
            <label
              htmlFor="remember"
              className="w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all duration-200 peer-checked:bg-ink"
              style={{
                border: "1.5px solid rgba(10,10,15,0.25)",
                display: "flex",
              }}
            />
          </div>
          <label htmlFor="remember" className="font-body text-sm cursor-pointer select-none" style={{ color: "rgba(10,10,15,0.6)" }}>
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-body font-semibold text-sm tracking-wide transition-all duration-300 mt-2"
          style={{
            background: loading ? "rgba(10,10,15,0.6)" : "#0a0a0f",
            color: "#f5f0e8",
            transform: loading ? "none" : undefined,
          }}
        >
          {loading ? (
            <>
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "#f5f0e8" }}
              />
              Signing in…
            </>
          ) : (
            <>
              Sign in as {role === "teacher" ? "Teacher" : "Student"}
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(10,10,15,0.1)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(10,10,15,0.35)" }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: "rgba(10,10,15,0.1)" }} />
      </div>

      {/* Social logins */}
      <div className="">
       <button
  type="button"
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-body font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
  style={{
    border: "1.5px solid rgba(10,10,15,0.12)",
    background: "rgba(255,255,255,0.8)",
    color: "#0a0a0f",
  }}
>
  <span className="font-bold text-base">G</span>
  Continue with Google
</button>
      </div>

      {/* Institution note */}
      {role === "student" && (
        <div
          className="mt-6 p-4 rounded-xl text-center"
          style={{ background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.15)" }}
        >
          <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(10,10,15,0.6)" }}>
            Your teacher will share a link or profile code to access their notebooks.
            <br />
            <a href="#" className="font-medium underline underline-offset-2 mt-0.5 inline-block" style={{ color: "#d97706" }}>
              Learn how to find your teacher →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}