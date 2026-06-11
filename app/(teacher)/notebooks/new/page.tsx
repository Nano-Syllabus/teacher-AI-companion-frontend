"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { API_BASE_URL, apiFetch, getStoredBackendToken } from "../../../lib/api";
import {
  ArrowLeft, BookOpen, Upload, X, FileText, CheckCircle2,
  Plus, Loader2, ChevronDown, Sparkles, GripVertical,
} from "lucide-react";

type Subject = "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Computer Science" | "Economics" | "History" | "Literature";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
  chapterTitle: string;
}

const SUBJECTS: Subject[] = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "History", "Literature"];

const SUBJECT_STYLES: Record<Subject, { bg: string; text: string }> = {
  Mathematics:        { bg: "#fef3c7", text: "#d97706" },
  Physics:            { bg: "#fee2e2", text: "#dc2626" },
  Chemistry:          { bg: "#fdf4ff", text: "#9333ea" },
  Biology:            { bg: "#f0fdf4", text: "#16a34a" },
  "Computer Science": { bg: "#eff6ff", text: "#2563eb" },
  Economics:          { bg: "#f0f9ff", text: "#0891b2" },
  History:            { bg: "#fdf2f8", text: "#db2777" },
  Literature:         { bg: "#f5f3ff", text: "#7c3aed" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function CreateNotebookPage() {
  // Notebook meta
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject | "">("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner");
  const [isFree, setIsFree] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);

  // Files
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const simulateUpload = (file: File): UploadedFile => ({
    id: Math.random().toString(36).slice(2),
    file,
    name: file.name,
    size: file.size,
    status: "uploading",
    progress: 0,
    chapterTitle: file.name.replace(/\.[^/.]+$/, ""),
  });

  const processFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter((f) =>
      ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
       "text/plain", "application/msword"].includes(f.type)
    );

    const newFiles = arr.map(simulateUpload);
    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress per file
    newFiles.forEach((nf) => {
      let progress = 0;
      const iv = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(iv);
          setFiles((prev) =>
            prev.map((f) => f.id === nf.id ? { ...f, progress: 100, status: "done" } : f)
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => f.id === nf.id ? { ...f, progress } : f)
          );
        }
      }, 200);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const updateChapterTitle = (id: string, val: string) =>
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, chapterTitle: val } : f));

  const handlePublish = async () => {
    setSaving(true);
    try {
      const session = await getSession();
      const notebook = await apiFetch<{ id: string }>(
        "/notebooks/",
        session?.backendAccessToken,
        {
          method: "POST",
          body: JSON.stringify({
            title,
            subject,
            description,
            difficulty,
            is_free: isFree,
          }),
        },
      );

      const token = getStoredBackendToken(session?.backendAccessToken);
      for (const uploaded of files) {
        const formData = new FormData();
        formData.append("file", uploaded.file);
        formData.append("chapter_title", uploaded.chapterTitle);

        const response = await fetch(`${API_BASE_URL}/notebooks/${notebook.id}/documents`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
      }

      await apiFetch(`/notebooks/${notebook.id}/publish`, session?.backendAccessToken, {
        method: "PATCH",
      });

      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const canProceed = title.trim() && subject && description.trim();
  const canPublish = files.length > 0 && files.every((f) => f.status === "done");

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f0e8" }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "#0a0a0f" }}>
            <CheckCircle2 size={36} color="#d97706" />
          </div>
          <h1 className="font-bold text-3xl mb-3" style={{ color: "#0a0a0f" }}>Notebook published!</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(10,10,15,0.5)" }}>
            Your AI clone is now training on <strong>{title}</strong>. Students can start chatting with it shortly.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard"
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "rgba(10,10,15,0.08)", color: "#0a0a0f" }}>
              Back to Dashboard
            </Link>
            <button onClick={() => { setSaved(false); setStep(1); setTitle(""); setSubject(""); setDescription(""); setFiles([]); }}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "#0a0a0f", color: "#f5f0e8" }}>
              <Plus size={14} className="inline mr-1.5" />
              New Notebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-20 px-6 py-4"
        style={{ background: "rgba(245,240,232,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(10,10,15,0.08)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: "rgba(10,10,15,0.55)" }}>
            <ArrowLeft size={15} /> Dashboard
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{
                    background: step === s ? "#0a0a0f" : step > s ? "#d97706" : "rgba(10,10,15,0.1)",
                    color: step >= s ? "#f5f0e8" : "rgba(10,10,15,0.35)",
                  }}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 2 && <div className="w-8 h-px" style={{ background: step > s ? "#d97706" : "rgba(10,10,15,0.15)" }} />}
              </div>
            ))}
            <span className="text-xs ml-2 font-medium" style={{ color: "rgba(10,10,15,0.45)" }}>
              {step === 1 ? "Notebook details" : "Upload documents"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color: "#d97706" }} />
            <span className="font-bold text-sm" style={{ color: "#0a0a0f" }}>TeacherOS</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* ── STEP 1: Notebook Details ── */}
        {step === 1 && (
          <>
            <div className="mb-8">
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#d97706" }}>Step 1 of 2</p>
              <h1 className="font-bold text-3xl mb-2" style={{ color: "#0a0a0f" }}>Create a notebook</h1>
              <p className="text-sm" style={{ color: "rgba(10,10,15,0.5)" }}>
                Set up the details — then upload your teaching documents in the next step.
              </p>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(10,10,15,0.55)" }}>
                  NOTEBOOK TITLE *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Calculus I — Limits & Derivatives"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#fff",
                    border: title ? "1.5px solid #0a0a0f" : "1.5px solid rgba(10,10,15,0.14)",
                    color: "#0a0a0f",
                  }}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(10,10,15,0.55)" }}>
                  SUBJECT *
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSubjectOpen(!subjectOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-200 text-left"
                    style={{
                      background: "#fff",
                      border: subject ? "1.5px solid #0a0a0f" : "1.5px solid rgba(10,10,15,0.14)",
                      color: subject ? "#0a0a0f" : "rgba(10,10,15,0.35)",
                    }}
                  >
                    {subject ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md" style={{ background: SUBJECT_STYLES[subject as Subject].bg }} />
                        {subject}
                      </span>
                    ) : "Select a subject"}
                    <ChevronDown size={15} style={{ transform: subjectOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {subjectOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                      style={{ background: "#fff", border: "1.5px solid rgba(10,10,15,0.1)", boxShadow: "0 8px 24px rgba(10,10,15,0.1)" }}>
                      {SUBJECTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSubject(s); setSubjectOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                          style={{ color: "#0a0a0f" }}
                        >
                          <span className="w-4 h-4 rounded-md flex-shrink-0" style={{ background: SUBJECT_STYLES[s].bg, border: `1px solid ${SUBJECT_STYLES[s].text}30` }} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(10,10,15,0.55)" }}>
                  DESCRIPTION *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn from this notebook? What topics does it cover?"
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: "#fff",
                    border: description ? "1.5px solid #0a0a0f" : "1.5px solid rgba(10,10,15,0.14)",
                    color: "#0a0a0f",
                  }}
                />
              </div>

              {/* Difficulty + Free row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(10,10,15,0.55)" }}>DIFFICULTY</label>
                  <div className="flex gap-2">
                    {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                        style={{
                          background: difficulty === d ? "#0a0a0f" : "rgba(10,10,15,0.06)",
                          color: difficulty === d ? "#f5f0e8" : "rgba(10,10,15,0.5)",
                        }}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(10,10,15,0.55)" }}>ACCESS</label>
                  <button
                    onClick={() => setIsFree(!isFree)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2"
                    style={{
                      background: isFree ? "#d97706" : "rgba(10,10,15,0.06)",
                      color: isFree ? "#fff" : "rgba(10,10,15,0.5)",
                      border: isFree ? "none" : "1.5px solid rgba(10,10,15,0.1)",
                    }}
                  >
                    {isFree ? "✓ Free for all" : "🔒 Locked"}
                  </button>
                </div>
              </div>

              {/* AI training note */}
              <div className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)" }}>
                <Sparkles size={15} style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: "rgba(10,10,15,0.6)" }}>
                  Your documents will train an AI clone that answers exactly like you teach.
                  The more detailed your notes, the better your AI performs.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canProceed}
                className="w-full py-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "#0a0a0f", color: "#f5f0e8" }}
              >
                Continue to Upload →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Upload Documents ── */}
        {step === 2 && (
          <>
            <div className="mb-8">
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#d97706" }}>Step 2 of 2</p>
              <h1 className="font-bold text-3xl mb-1" style={{ color: "#0a0a0f" }}>Upload documents</h1>
              <p className="text-sm mb-1" style={{ color: "rgba(10,10,15,0.5)" }}>
                For notebook: <strong style={{ color: "#0a0a0f" }}>{title}</strong>
              </p>
              <p className="text-xs" style={{ color: "rgba(10,10,15,0.4)" }}>PDF, DOCX, or TXT files. Each file becomes a chapter.</p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-2xl cursor-pointer transition-all duration-300 mb-6"
              style={{
                border: dragging ? "2px dashed #d97706" : "2px dashed rgba(10,10,15,0.2)",
                background: dragging ? "rgba(217,119,6,0.04)" : "rgba(255,255,255,0.5)",
                padding: "48px 32px",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
              />
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300"
                  style={{ background: dragging ? "#d97706" : "rgba(10,10,15,0.08)" }}
                >
                  <Upload size={24} style={{ color: dragging ? "#fff" : "rgba(10,10,15,0.4)" }} />
                </div>
                <p className="font-bold text-base mb-1" style={{ color: "#0a0a0f" }}>
                  {dragging ? "Drop your files here" : "Drag & drop your documents"}
                </p>
                <p className="text-sm" style={{ color: "rgba(10,10,15,0.45)" }}>
                  or <span style={{ color: "#d97706", fontWeight: 600 }}>browse files</span> from your computer
                </p>
                <p className="text-xs mt-2" style={{ color: "rgba(10,10,15,0.3)" }}>PDF · DOCX · TXT — up to 50MB each</p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold" style={{ color: "rgba(10,10,15,0.45)" }}>
                  {files.length} DOCUMENT{files.length > 1 ? "S" : ""} — each becomes a chapter
                </p>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-2xl p-4 transition-all duration-200"
                    style={{ background: "#fff", border: "1.5px solid rgba(10,10,15,0.08)" }}
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical size={16} className="mt-1 flex-shrink-0" style={{ color: "rgba(10,10,15,0.2)" }} />
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(10,10,15,0.06)" }}
                      >
                        <FileText size={16} style={{ color: "rgba(10,10,15,0.45)" }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Editable chapter title */}
                        <input
                          type="text"
                          value={file.chapterTitle}
                          onChange={(e) => updateChapterTitle(file.id, e.target.value)}
                          className="w-full text-sm font-semibold bg-transparent outline-none border-b transition-all duration-150 pb-0.5 mb-1"
                          style={{
                            color: "#0a0a0f",
                            borderColor: "transparent",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#d97706"}
                          onBlur={(e) => e.target.style.borderColor = "transparent"}
                        />
                        <p className="text-xs" style={{ color: "rgba(10,10,15,0.4)" }}>
                          {file.name} · {formatBytes(file.size)}
                        </p>

                        {/* Progress bar */}
                        {file.status === "uploading" && (
                          <div className="mt-2">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(10,10,15,0.08)" }}>
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%`, background: "#d97706" }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.status === "uploading" && (
                          <Loader2 size={15} className="animate-spin" style={{ color: "#d97706" }} />
                        )}
                        {file.status === "done" && (
                          <CheckCircle2 size={15} style={{ color: "#16a34a" }} />
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: "rgba(10,10,15,0.35)" }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 hover:scale-[1.01]"
                  style={{ background: "rgba(10,10,15,0.05)", color: "rgba(10,10,15,0.5)", border: "1.5px dashed rgba(10,10,15,0.15)" }}
                >
                  <Plus size={15} /> Add more documents
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "rgba(10,10,15,0.07)", color: "rgba(10,10,15,0.6)" }}
              >
                ← Back
              </button>
              <button
                onClick={handlePublish}
                disabled={!canPublish || saving}
                className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "#0a0a0f", color: "#f5f0e8" }}
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Publishing & training AI…
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Publish Notebook & Train AI
                  </>
                )}
              </button>
            </div>

            {!canPublish && files.length === 0 && (
              <p className="text-xs text-center mt-3" style={{ color: "rgba(10,10,15,0.35)" }}>
                Upload at least one document to publish
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
