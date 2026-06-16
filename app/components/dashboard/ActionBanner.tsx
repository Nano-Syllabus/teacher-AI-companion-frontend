import { AlertCircle, Bell, CheckCircle, X } from "lucide-react";
import Link from "next/link";

export default function ActionBanner({ count, onDismiss }: { count: number; onDismiss: () => void }) {
  if (count === 0) return null;
  return (
    <div className="rounded-xl bg-white border border-black/[0.07] px-4 py-3 flex items-center gap-3 flex-wrap">
      <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black">{count} student{count > 1 ? "s" : ""} awaiting feedback</p>
        <p className="text-xs text-black/40">Pending quiz submissions from the last 48 hours</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDismiss} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-black/10 text-black/50 hover:bg-black/5 transition-colors">
          <Bell size={12} /> Remind later
        </button>
        <Link href="/reviews" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-black text-white font-medium hover:bg-black/80 transition-colors">
          <CheckCircle size={12} /> Review now
        </Link>
      </div>
      <button onClick={onDismiss} className="text-black/20 hover:text-black/40 transition-colors flex-shrink-0"><X size={14} /></button>
    </div>
  );
}