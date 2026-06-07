"use client";

import { Upload, FileText, BookOpen, FolderOpen, ChevronRight, Plus } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Multi-Subject Notebooks",
    description:
      "Create separate notebooks for each course you teach. Each notebook is a structured container for all your course's intellectual output.",
    accent: "amber",
  },
  {
    icon: Upload,
    title: "PDF & Document Upload",
    description:
      "Upload syllabi, research papers, reading lists and handouts. NanoSyllabus parses them intelligently so students can query every page.",
    accent: "moss",
  },
  {
    icon: FileText,
    title: "Rich Lecture Notes",
    description:
      "Write or paste lecture notes directly. Supports markdown, equations, code blocks, and rich media for comprehensive documentation.",
    accent: "slate",
  },
  {
    icon: FolderOpen,
    title: "Organised Resource Library",
    description:
      "Tag, categorise, and version all materials. Students always see what's assigned, what's optional, and what week it belongs to.",
    accent: "amber",
  },
];

export default function TeacherSection() {
  return (
    <section id="teachers" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: content */}
          <div>
            <p className="section-label">For Educators</p>
            <h2 className="heading-lg text-ink mb-6">
              Build the course notebook<br />
              <em>your students deserve.</em>
            </h2>
            <p className="body-lg mb-10">
              Upload your syllabus, lecture notes, and PDFs in minutes. NanoSyllabus
              transforms your materials into an interactive knowledge base —
              without any extra work on your end.
            </p>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="card p-5 group hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors duration-300">
                      <Icon size={17} className="text-ink/60 group-hover:text-amber-700 transition-colors duration-300" />
                    </div>
                    <h3 className="font-body font-semibold text-sm text-ink mb-1.5">{f.title}</h3>
                    <p className="font-body text-xs text-ink/55 leading-relaxed">{f.description}</p>
                  </div>
                );
              })}
            </div>

            <a href="#" className="btn-primary group">
              Create Your First Notebook
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right: Teacher dashboard mockup */}
          <div className="relative">
            {/* Decorative shape */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-100/80 blur-3xl pointer-events-none" />

            <div className="relative rounded-2xl border border-ink/10 shadow-xl overflow-hidden bg-white">
              {/* Header */}
              <div className="bg-ink px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-paper font-medium text-sm">My Notebooks</p>
                  <p className="font-mono text-paper/40 text-xs">Prof. Ananya Sharma</p>
                </div>
                <button className="flex items-center gap-1.5 bg-amber-400 text-ink px-3 py-1.5 rounded-full text-xs font-medium font-body hover:bg-amber-300 transition-colors">
                  <Plus size={11} />
                  New
                </button>
              </div>

              {/* Notebook list */}
              <div className="p-4 space-y-2 border-b border-ink/8">
                {[
                  { name: "Advanced Mathematics", docs: 12, notes: 8, color: "bg-amber-400" },
                  { name: "Physics Mechanics", docs: 7, notes: 14, color: "bg-slate" },
                  { name: "Linear Algebra", docs: 9, notes: 6, color: "bg-moss" },
                ].map((nb, i) => (
                  <div
                    key={nb.name}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                      i === 0 ? "bg-ink/5 border border-ink/8" : "hover:bg-ink/3"
                    }`}
                  >
                    <span className={`w-9 h-9 ${nb.color} rounded-lg flex items-center justify-center`}>
                      <BookOpen size={14} className="text-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-ink truncate">{nb.name}</p>
                      <p className="font-mono text-xs text-ink/40">{nb.docs} PDFs · {nb.notes} notes</p>
                    </div>
                    <ChevronRight size={14} className="text-ink/30 flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Upload area */}
              <div className="p-4">
                <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-3">Add Resources</p>
                <div className="border-2 border-dashed border-ink/15 rounded-xl p-6 text-center hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 cursor-pointer group">
                  <Upload size={22} className="mx-auto mb-2 text-ink/30 group-hover:text-amber-600 transition-colors" />
                  <p className="font-body text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">
                    Drop PDFs, notes, or syllabi
                  </p>
                  <p className="font-mono text-xs text-ink/30 mt-1">PDF, DOCX, MD — up to 50MB</p>
                </div>

                {/* Recent uploads */}
                <div className="mt-4 space-y-2">
                  {[
                    { name: "Week 3 — Derivatives.pdf", size: "1.2 MB", status: "Indexed" },
                    { name: "Problem Set 2.pdf", size: "340 KB", status: "Processing…" },
                  ].map((f) => (
                    <div key={f.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink/3">
                      <FileText size={13} className="text-ink/40 flex-shrink-0" />
                      <span className="flex-1 font-body text-xs text-ink/70 truncate">{f.name}</span>
                      <span className="font-mono text-xs text-ink/30">{f.size}</span>
                      <span className={`tag py-0.5 text-xs ${f.status === "Indexed" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}