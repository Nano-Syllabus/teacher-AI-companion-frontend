"use client";

import { useState } from "react";
import { ArrowRight, Search, Star, MessageCircle, BookOpen } from "lucide-react";

const suggestedQuestions = [
  "What topics are covered in Week 4?",
  "Summarise the assignment requirements",
  "Explain Big O notation from the notes",
  "What's due this week?",
];

const teachers = [
  { name: "Prof. Rahman", subject: "Computer Science", notebooks: 4, rating: 4.9, initials: "R", color: "bg-amber-400" },
  { name: "Dr. Ananya Sharma", subject: "Mathematics", notebooks: 3, rating: 4.8, initials: "A", color: "bg-moss" },
  { name: "Prof. T. Mehta", subject: "Physics", notebooks: 5, rating: 4.7, initials: "T", color: "bg-slate" },
];

export default function StudentSection() {
  const [activeTeacher, setActiveTeacher] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm the AI for Prof. Rahman's Computer Science courses. I have access to all 4 notebooks — CS 101, Data Structures, Algorithms, and OS Fundamentals. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const q = text || input.trim();
    if (!q) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      {
        role: "assistant",
        text: "Great question! Based on the course materials uploaded by Prof. Rahman, here's what I found in the lecture notes and syllabus…",
      },
    ]);
    setInput("");
  };

  return (
    <section id="students" className="py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full bg-slate/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label">For Students</p>
          <h2 className="heading-lg text-ink mb-5">
            Your professor's knowledge,<br />
            <em>always available.</em>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Find your teacher's profile, open any of their course notebooks,
            and chat your way to understanding — powered by their actual materials.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Teacher directory */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 bg-white border border-ink/10 rounded-xl px-4 py-3 shadow-sm">
              <Search size={15} className="text-ink/30" />
              <input
                readOnly
                placeholder="Search teachers or subjects…"
                className="flex-1 font-body text-sm text-ink/60 placeholder-ink/30 bg-transparent outline-none"
              />
            </div>

            <p className="font-mono text-xs text-ink/40 uppercase tracking-widest px-1">Featured Educators</p>

            {teachers.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActiveTeacher(i)}
                className={`w-full text-left rounded-2xl border transition-all duration-300 p-4 ${
                  activeTeacher === i
                    ? "border-ink bg-ink text-paper shadow-lg"
                    : "border-ink/10 bg-white hover:border-ink/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 ${t.color} rounded-xl flex items-center justify-center font-display font-bold text-white text-lg flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body font-semibold text-sm ${activeTeacher === i ? "text-paper" : "text-ink"}`}>
                      {t.name}
                    </p>
                    <p className={`font-mono text-xs ${activeTeacher === i ? "text-paper/50" : "text-ink/40"}`}>
                      {t.subject}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={11} className={activeTeacher === i ? "text-amber-400" : "text-amber-500"} fill="currentColor" />
                      <span className={`font-mono text-xs ${activeTeacher === i ? "text-paper/70" : "text-ink/50"}`}>{t.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <BookOpen size={10} className={activeTeacher === i ? "text-paper/40" : "text-ink/30"} />
                      <span className={`font-mono text-xs ${activeTeacher === i ? "text-paper/40" : "text-ink/30"}`}>{t.notebooks} notebooks</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat interface */}
          <div className="lg:col-span-3 rounded-2xl border border-ink/10 shadow-xl overflow-hidden bg-white flex flex-col h-[540px]">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-ink/8 bg-paper/40">
              <div className={`w-10 h-10 ${teachers[activeTeacher].color} rounded-xl flex items-center justify-center font-display font-bold text-white flex-shrink-0`}>
                {teachers[activeTeacher].initials}
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-ink">{teachers[activeTeacher].name}</p>
                <p className="font-mono text-xs text-ink/40">{teachers[activeTeacher].subject} · {teachers[activeTeacher].notebooks} notebooks</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-mono text-xs text-green-700">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 chat-bubble ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className={`w-7 h-7 ${teachers[activeTeacher].color} rounded-full flex items-center justify-center text-white font-display text-xs font-bold flex-shrink-0`}>
                      {teachers[activeTeacher].initials}
                    </div>
                  )}
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-ink text-paper rounded-tr-sm"
                        : "bg-ink/5 text-ink rounded-tl-sm"
                    }`}
                  >
                    <p className="font-body text-sm leading-relaxed">{m.text}</p>
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      S
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Suggested questions */}
            {messages.length < 3 && (
              <div className="px-6 pb-3 flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="font-body text-xs px-3 py-1.5 rounded-full border border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink hover:bg-ink/3 transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-6 py-4 border-t border-ink/8">
              <div className="flex items-center gap-3 bg-ink/5 rounded-full px-5 py-3">
                <MessageCircle size={14} className="text-ink/30 flex-shrink-0" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about any lecture, assignment, or topic…"
                  className="flex-1 bg-transparent font-body text-sm text-ink placeholder-ink/30 outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="w-7 h-7 rounded-full bg-ink flex items-center justify-center flex-shrink-0 hover:bg-slate transition-colors"
                >
                  <ArrowRight size={13} className="text-paper" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}