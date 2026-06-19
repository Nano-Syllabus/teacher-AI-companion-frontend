"use client";
import { BookOpen, Pencil, Plus, QrCode, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Subject =
  | "Mathematics" | "Physics" | "Chemistry" | "Biology"
  | "Computer Science" | "Economics" | "History" | "Literature";

interface Notebook {
  id: string;
  title: string;
  subject: Subject;
  description: string;
  docCount: number;
  studentCount: number;
  views: number;
  rating: number;
  lastUpdated: string;
  published: boolean;
  free: boolean;
  qrCode: string | null;   // "data:image/png;base64,..." from backend
  qrUrl: string | null;    // the encoded student URL
}


export default function NotebookRow({
  notebook,
  onDelete,
  onShowQR,
}: {
  notebook: Notebook;
  onDelete: (id: string) => void;
  onShowQR: (notebook: Notebook) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${notebook.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      onDelete(notebook.id);
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  }
 
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.07] bg-white hover:bg-black/[0.015] transition-colors">
      <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
        <BookOpen size={15} className="text-black/40" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-sm font-semibold text-black truncate max-w-[200px]">{notebook.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-md bg-black/5 text-black/45 border border-black/[0.07] flex-shrink-0">{notebook.subject}</span>
          {!notebook.published && <span className="text-xs px-2 py-0.5 rounded-md bg-black/5 text-black/30 flex-shrink-0">Draft</span>}
          {notebook.free && notebook.published && <span className="text-xs px-2 py-0.5 rounded-md bg-black text-white flex-shrink-0">Free</span>}
        </div>
        <p className="text-xs text-black/35">{notebook.docCount} docs · Updated {notebook.lastUpdated}</p>
      </div>

      <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
        <div className="text-center">
          <p className="text-sm font-semibold text-black">{notebook.studentCount.toLocaleString()}</p>
          <p className="text-[11px] text-black/30">students</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-black">{notebook.views.toLocaleString()}</p>
          <p className="text-[11px] text-black/30">views</p>
        </div>
        <div className="flex items-center gap-1">
          <Star size={11} fill="black" className="text-black" />
          <p className="text-sm font-semibold text-black">{notebook.rating > 0 ? notebook.rating : "—"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* QR button — always visible, dimmed if not yet published */}
        <button
          onClick={() => onShowQR(notebook)}
          title={notebook.published ? "Download QR — students scan to get PDF" : "Publish to generate QR"}
          className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center transition-colors"
          style={{
            color: notebook.qrCode ? "#000" : "rgba(0,0,0,0.25)",
            background: notebook.qrCode ? "rgba(0,0,0,0.04)" : "transparent",
          }}
        >
          <QrCode size={14} />
        </button>

        <Link
          href={`/notebooks/${notebook.id}/upload`}
          className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-black/10 text-black/45 hover:bg-black/5 transition-colors"
        >
          <Plus size={12} /> Add docs
        </Link>
        <Link
          href={`/notebooks/${notebook.id}/edit`}
          className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-black/35 hover:bg-black/5 transition-colors"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-black/35 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-40"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}