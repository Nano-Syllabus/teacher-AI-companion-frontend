"use client";

import { useState } from "react";
import {
  ArrowLeft, BookOpen, Upload, X, FileText, CheckCircle2,
  Plus, Loader2, ChevronDown, Sparkles, GripVertical, Bell,
  QrCode, Copy, Download, ExternalLink, Check,
  Link,
} from "lucide-react";
import NotebookQRCode from "./NotebookQRCode";
interface PublishedNotebook {
  id: string;
  title: string;
  teacherId: string;
  qrCode: string | null;   // base64 PNG from backend: "data:image/png;base64,..."
  qrUrl: string | null;    // plain URL the QR encodes
}


export default function SuccessScreen({
  title,
  notebook,
  onReset,
}: {
  title: string;
  notebook: PublishedNotebook;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 440, width: "100%" }}>

        {/* Icon + heading */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#0a0a0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <CheckCircle2 size={32} color="#d97706" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0a0a0f", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            Notebook published!
          </h1>
          <p style={{ fontSize: 13, color: "rgba(10,10,15,0.5)", margin: 0 }}>
            <strong style={{ color: "#0a0a0f" }}>{title}</strong> is live. Students can access it now.
          </p>
        </div>

        {/* QR code */}
        <NotebookQRCode notebook={notebook} />

        {/* Training notice */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: "1.5rem",
            background: "rgba(217,119,6,0.08)",
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          <Bell size={14} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(10,10,15,0.6)", margin: 0 }}>
            Your AI is training in the background — usually a few minutes.
            We'll email you when it's ready to answer student questions.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/dashboard"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(10,10,15,0.08)",
              color: "#0a0a0f",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
          <button
            onClick={onReset}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              background: "#0a0a0f",
              color: "#f5f0e8",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> New notebook
          </button>
        </div>
      </div>
    </div>
  );
}