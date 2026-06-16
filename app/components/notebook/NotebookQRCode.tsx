"use client";

import { useState } from "react";
import {
  ArrowLeft, BookOpen, Upload, X, FileText, CheckCircle2,
  Plus, Loader2, ChevronDown, Sparkles, GripVertical, Bell,
  QrCode, Copy, Download, ExternalLink, Check,
} from "lucide-react";
interface PublishedNotebook {
  id: string;
  title: string;
  teacherId: string;
  qrCode: string | null;   // base64 PNG from backend: "data:image/png;base64,..."
  qrUrl: string | null;    // plain URL the QR encodes
}

export default function NotebookQRCode({ notebook }: { notebook: PublishedNotebook }) {
  const [copied, setCopied] = useState(false);

  // Use the QR image and URL that the backend generated and stored on publish.
  // qrCode is a base64 PNG data-URI; qrUrl is the plain student URL it encodes.
  const displayUrl = notebook.qrUrl
    ?? `${typeof window !== "undefined" ? window.location.origin : ""}/student/teachers/${notebook.teacherId}?notebook=${notebook.id}`;

  const handleDownload = () => {
    if (!notebook.qrCode) return;
    const link = document.createElement("a");
    link.download = `${notebook.title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.href = notebook.qrCode;
    link.click();
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!notebook.qrCode) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid rgba(10,10,15,0.1)",
        borderRadius: 20,
        padding: "1.5rem",
        marginBottom: "1.5rem",
        textAlign: "center",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: "1rem" }}>
        <QrCode size={16} style={{ color: "#0a0a0f" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0f" }}>Student access QR</span>
      </div>

      {/* QR image — rendered from the base64 PNG the backend stored on publish */}
      <div
        style={{
          display: "inline-block",
          padding: 12,
          borderRadius: 12,
          background: "#fff",
          border: "1px solid rgba(10,10,15,0.08)",
          marginBottom: "1rem",
        }}
      >
        <img
          src={notebook.qrCode!}
          alt={`QR code for ${notebook.title}`}
          style={{ width: 200, height: 200, display: "block", borderRadius: 6 }}
        />
      </div>

      {/* URL pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(10,10,15,0.04)",
          border: "1px solid rgba(10,10,15,0.1)",
          borderRadius: 10,
          padding: "8px 12px",
          marginBottom: "1rem",
          textAlign: "left",
        }}
      >
        <ExternalLink size={13} style={{ color: "rgba(10,10,15,0.35)", flexShrink: 0 }} />
        <span
          style={{
            fontSize: 11,
            color: "rgba(10,10,15,0.55)",
            fontFamily: "monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {displayUrl}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleCopyLink}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "9px 0",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            border: "1.5px solid rgba(10,10,15,0.15)",
            background: copied ? "#f0fdf4" : "#fff",
            color: copied ? "#16a34a" : "#0a0a0f",
            transition: "all 0.15s",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={handleDownload}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "9px 0",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            background: "#0a0a0f",
            color: "#f5f0e8",
            transition: "all 0.15s",
          }}
        >
          <Download size={13} />
          Download QR
        </button>
      </div>

      <p style={{ marginTop: "0.75rem", fontSize: 11, color: "rgba(10,10,15,0.35)" }}>
        Students scan this to open the notebook directly
      </p>
    </div>
  );
}