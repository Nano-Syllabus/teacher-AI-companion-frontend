"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function DownloadPage() {
  const { notebookId } = useParams<{ notebookId: string }>();
  const [status, setStatus] = useState<"loading" | "downloading" | "done" | "error">("loading");
  const [notebookTitle, setNotebookTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!notebookId) return;

    async function fetchAndDownload() {
      setStatus("loading");
      try {
        // 1. Fetch notebook metadata to show title
        const metaRes = await fetch(
          `${ "http://localhost:8001"}/api/v1/public/notebooks/${notebookId}/meta`
        );
        if (metaRes.ok) {
          const meta = await metaRes.json();
        setNotebookTitle(meta.title);
    
        }

        // 2. Trigger the PDF download
        setStatus("downloading");
        const dlRes = await fetch(
          `${"http://localhost:8001"}/api/v1/public/notebooks/${notebookId}/download`
        );

        if (!dlRes.ok) {
          throw new Error(dlRes.status === 404 ? "This notebook isn't available." : "Download failed.");
        }
        
        const blob = await dlRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${notebookTitle || notebookId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setStatus("done");
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
        setStatus("error");
      }
    }

    fetchAndDownload();
  }, [notebookId]);

  return (
    <div style={{
      minHeight: "100vh", background: "#F7F7F6",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "2.5rem 2rem",
        maxWidth: 360, width: "100%", textAlign: "center",
        border: "0.5px solid rgba(0,0,0,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}>
          <BookOpen size={22} color="white" />
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: 8 }}>
          TeacherOS
        </p>

        {status === "loading" && (
          <>
            <Loader2 size={28} style={{ color: "#000", margin: "0.5rem auto 1rem", display: "block", animation: "spin 1s linear infinite" }} />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 8 }}>Preparing your notebook…</h1>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)" }}>Fetching resources from your teacher</p>
          </>
        )}

        {status === "downloading" && (
          <>
            <Loader2 size={28} style={{ color: "#000", margin: "0.5rem auto 1rem", display: "block", animation: "spin 1s linear infinite" }} />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 8 }}>
              {notebookTitle || "Downloading…"}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)" }}>Your PDF is being generated and downloaded</p>
          </>
        )}

        {status === "done" && (
          <>
            <CheckCircle size={36} style={{ color: "#16a34a", margin: "0.25rem auto 1rem", display: "block" }} />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 8 }}>Download complete!</h1>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginBottom: "1.5rem" }}>
              {notebookTitle} has been saved to your device.
            </p>
            <button
              onClick={() => {
                setStatus("downloading");
                window.location.reload();
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 10, fontSize: 13,
                fontWeight: 600, background: "#000", color: "#fff",
                border: "none", cursor: "pointer",
              }}
            >
              <Download size={14} /> Download again
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle size={36} style={{ color: "#dc2626", margin: "0.25rem auto 1rem", display: "block" }} />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 8 }}>Couldn't download</h1>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginBottom: "1.5rem" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 10, fontSize: 13,
                fontWeight: 600, background: "#000", color: "#fff",
                border: "none", cursor: "pointer",
              }}
            >
              Try again
            </button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}