"use client";

import { useState, useEffect } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
 useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "For Teachers", href: "#teachers" },
    { label: "For Students", href: "#students" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-ink/8 py-3"
          : "py-6"
      }`}
      style={{ background: scrolled ? "rgba(250,247,242,0.92)" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
            <BookOpen size={15} className="text-amber-300" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            Nano<span className="text-amber-600">Syllabus</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="underline-animate font-body text-sm text-ink/70 hover:text-ink transition-colors duration-200 pb-0.5"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
         <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <span className="font-body text-sm text-ink/60 truncate max-w-[140px]">
                {session.user?.name ?? session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-primary text-xs py-2.5 px-5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="font-body text-sm text-ink/60 hover:text-ink transition-colors">
                Sign in
              </a>
              <a href="/login" className="btn-primary text-xs py-2.5 px-5">
                Get Started Free
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-ink/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-paper/95 backdrop-blur-lg border-t border-ink/8 px-6 py-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-body text-base text-ink/80 hover:text-ink py-1"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <a href="#" className="font-body text-sm text-ink/60">Sign in</a>
            <a href="#" className="btn-primary justify-center">Get Started Free</a>
          </div>
        </div>
      )}
    </nav>
  );
}