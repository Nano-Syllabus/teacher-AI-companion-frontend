"use client"; 
import { Check, Copy, Download, ExternalLink, QrCode, X, } from "lucide-react"; 
import { useState, useEffect } from "react"; 

type Subject = | "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Computer Science" | "Economics" | "History" | "Literature"; 

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
    qrCode: string | null; 
    qrUrl: string | null; 
} 


export default function QRModal({ notebook, onClose, }: { notebook: Notebook; onClose: () => void; }) {
    const [copied, setCopied] = useState(false); 
    useEffect(() => { 
        const handler = (e: KeyboardEvent) => { 
            if (e.key === "Escape") 
                onClose(); 
            }; 
            window.addEventListener("keydown", handler); 
        const originalOverflow = document.body.style.overflow; 
        document.body.style.overflow = "hidden"; 
        return () => { 
            window.removeEventListener("keydown", handler); 
            document.body.style.overflow = originalOverflow; 
        }; 
    }, [onClose]); 
    const handleCopy = async () => { 
        if (!notebook.qrUrl) return; 
        await navigator.clipboard.writeText(notebook.qrUrl); 
        setCopied(true); setTimeout(() => { setCopied(false); 

        }, 2000); 
    }; 
    
    const handleOpen = () => { 
        if (!notebook.qrUrl) return; window.open(notebook.qrUrl, "_blank", "noopener,noreferrer"); 
    }; 
    
    const handleDownload = () => { 
        if (!notebook.qrCode) return; 
        const link = document.createElement("a"); 
        link.href = notebook.qrCode; 
        link.download = `${notebook.title.replace(/\s+/g, "-").toLowerCase()}-qr.png`; 
        link.rel = "noopener"; 
        link.click(); 
    }; 
    return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", }} > 
    <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 380, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden", }} > 
        {/* Header */} 
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", }} > 
            <div style={{ display: "flex", alignItems: "center", gap: 8, }} > 
                <QrCode size={16} /> 
                <span style={{ fontSize: 13, fontWeight: 600, }} > Student QR Code </span> 
            </div> 
            <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "rgba(0,0,0,0.45)", display: "flex", }} > 
                <X size={16} /> 
            </button>
        </div> 
        {/* Body */} 
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 14, }} > 
            <div style={{ textAlign: "center", }} > 
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000", }} > {notebook.title} </p> 
            <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, background: notebook.published ? "#ecfdf3" : "#f4f4f5", color: notebook.published ? "#16a34a" : "#52525b", fontSize: 11, fontWeight: 600, }} > 
                {notebook.published ? "Published" : "Draft"} 
                </div> 
            </div> {notebook.qrCode ? (
                <div style={{ display: "flex", justifyContent: "center", }} > 
                    <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", }} > 
                        <img src={notebook.qrCode} alt={`QR code for ${notebook.title}`} style={{ width: "100%", maxWidth: 220, aspectRatio: "1", display: "block", borderRadius: 6, }} /> 
                    </div> 
                </div>
                ) : (
                    <div style={{ height: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, borderRadius: 12, background: "rgba(0,0,0,0.03)", }} > 
                        <QrCode size={34} style={{ color: "rgba(0,0,0,0.15)", }} /> <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.4)", }} > QR code available after publishing </p> 
                    </div>
                    )} {notebook.qrUrl && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "8px 10px", }} > 
                        <ExternalLink size={12} style={{ color: "rgba(0,0,0,0.4)", flexShrink: 0, }} /> 
                            <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(0,0,0,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, }} > {notebook.qrUrl} </span> 
                        </div>
                    )} 
                    
                    {/* Actions */} 
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, }} > 
                        <button onClick={handleCopy} disabled={!notebook.qrUrl} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", background: copied ? "#f0fdf4" : "#fff", color: copied ? "#16a34a" : "#000", cursor: "pointer", opacity: notebook.qrUrl ? 1 : 0.4, fontSize: 12, fontWeight: 600, }} > 
                            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"} 
                        </button> 
                        
                        <button onClick={handleOpen} disabled={!notebook.qrUrl} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", background: "#fff", cursor: "pointer", opacity: notebook.qrUrl ? 1 : 0.4, fontSize: 12, fontWeight: 600, }} >
                             <ExternalLink size={13} /> Open </button> 
                        <button onClick={handleDownload} disabled={!notebook.qrCode} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, border: "none", background: "#000", color: "#fff", cursor: "pointer", opacity: notebook.qrCode ? 1 : 0.4, fontSize: 12, fontWeight: 600, }} > 
                            <Download size={13} /> Save </button> 
                        </div> 
                        <p style={{ margin: 0, textAlign: "center", fontSize: 11, color: "rgba(0,0,0,0.35)", }} > Students can scan this QR code to access the notebook instantly. </p> 
                    </div> 
                </div> 
            </div>); 
        }