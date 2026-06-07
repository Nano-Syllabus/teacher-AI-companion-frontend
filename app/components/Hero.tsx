"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm gradient orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-amber-200/30 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-moss/10 blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Badge */}
      <div className="relative mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300/60 bg-amber-50/80 backdrop-blur-sm">
        <Sparkles size={13} className="text-amber-600" />
        <span className="font-mono text-xs text-amber-700 tracking-wider uppercase">
          AI-Powered Course Notebooks
        </span>
      </div>

      {/* Headline */}
      <div className="relative text-center max-w-5xl mx-auto mb-8">
        <h1 className="heading-xl text-ink mb-2">
          Every lesson,
        </h1>
        <h1 className="heading-xl italic text-amber-600 mb-2">
          perfectly organised.
        </h1>
        <h1 className="heading-xl text-ink">
          Always within reach.
        </h1>
      </div>

      {/* Subheadline */}
      <p className="relative body-lg text-center max-w-2xl mx-auto mb-12">
        Teachers build rich course notebooks with syllabi, PDFs, and lecture notes.
        Students learn through a personal chat interface — like having the professor in their pocket.
      </p>

      {/* CTAs */}
      <div className="relative flex flex-col sm:flex-row items-center gap-4 mb-20">
        <a href="#teachers" className="btn-primary group">
          Start as a Teacher
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
        <a href="/teachers" className="btn-outline">
          Explore as a Student
        </a>
      </div>

      {/* Hero illustration — floating notebook UI mockup */}
      <div className="relative w-full max-w-5xl mx-auto notebook-float">
        <div className="relative rounded-2xl border border-ink/10 shadow-2xl overflow-hidden bg-white">
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-ink/5 border-b border-ink/8">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <div className="ml-4 flex-1 bg-white/60 border border-ink/10 rounded-full px-4 py-1">
              <span className="font-mono text-xs text-ink/40">nanosyllabus.app/prof-rahman/cs101</span>
            </div>
          </div>

          {/* App content */}
          <div className="flex h-[420px] md:h-[480px]">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-ink/8 bg-paper/50 p-4 gap-1">
              <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-3 px-2">Notebooks</p>
              {[
                { name: "CS 101 — Intro", color: "bg-amber-400", active: true },
                { name: "Data Structures", color: "bg-moss" },
                { name: "Algorithms", color: "bg-slate" },
                { name: "OS Fundamentals", color: "bg-rose-400" },
              ].map((nb) => (
                <div
                  key={nb.name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    nb.active ? "bg-ink text-paper" : "hover:bg-ink/5"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${nb.color}`} />
                  <span className="font-body text-sm truncate">{nb.name}</span>
                </div>
              ))}

              <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mt-5 mb-3 px-2">Resources</p>
              {["Syllabus.pdf", "Week 1 Notes", "Week 2 Notes", "Assignment 1"].map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-ink/5 cursor-pointer"
                >
                  <span className="font-mono text-xs text-ink/40">📄</span>
                  <span className="font-body text-xs text-ink/70 truncate">{r}</span>
                </div>
              ))}
            </aside>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-ink/8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-paper font-display text-xs font-bold">R</div>
                <div>
                  <p className="font-body font-medium text-sm text-ink">Prof. Rahman · CS 101</p>
                  <p className="font-body text-xs text-ink/40">Ask anything about the course</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center text-xs font-display font-bold flex-shrink-0">R</div>
                  <div className="bg-ink/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="font-body text-sm text-ink/80">
                      Hello! I'm the AI assistant for Prof. Rahman's CS 101. I have access to the full syllabus, all lecture notes, and course materials. What would you like to know?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-ink rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="font-body text-sm text-paper">
                      Can you summarise Week 2's lecture on memory management?
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">S</div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center text-xs font-display font-bold flex-shrink-0">R</div>
                  <div className="bg-ink/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                    <p className="font-body text-sm text-ink/80">
                      From the Week 2 notes: Memory management covers stack vs heap allocation, garbage collection strategies, and pointer arithmetic. Prof. Rahman emphasised that…
                    </p>
                    <span className="inline-block mt-2 tag">📄 Week 2 Notes.pdf</span>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-ink/8">
                <div className="flex items-center gap-3 bg-ink/5 rounded-full px-5 py-3">
                  <input
                    readOnly
                    placeholder="Ask about any course material…"
                    className="flex-1 bg-transparent font-body text-sm text-ink/60 placeholder-ink/30 outline-none"
                  />
                  <button className="w-7 h-7 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={13} className="text-paper" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute -top-5 -left-6 hidden lg:flex items-center gap-2 bg-white border border-ink/10 rounded-xl shadow-lg px-4 py-3">
          <span className="text-lg">📚</span>
          <div>
            <p className="font-body text-xs font-medium text-ink">24 Resources</p>
            <p className="font-mono text-xs text-ink/40">Uploaded this week</p>
          </div>
        </div>

        <div className="absolute -bottom-4 -right-6 hidden lg:flex items-center gap-2 bg-white border border-ink/10 rounded-xl shadow-lg px-4 py-3">
          <span className="text-lg">💬</span>
          <div>
            <p className="font-body text-xs font-medium text-ink">312 Questions</p>
            <p className="font-mono text-xs text-ink/40">Answered this semester</p>
          </div>
        </div>
      </div>
    </section>
  );
}