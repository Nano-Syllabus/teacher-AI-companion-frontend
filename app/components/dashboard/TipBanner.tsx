import { Lightbulb, X } from "lucide-react";
import Link from "next/link";

export default function TipBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-3">
      <Lightbulb size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-blue-800 mb-0.5">Add a quiz to boost engagement</p>
        <p className="text-xs text-blue-600">Notebooks with at least one quiz get 2× more student completions on average.</p>
      </div>
      <Link href="/notebooks/new?quiz=true" className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors">Add quiz</Link>
      <button onClick={onDismiss} className="text-blue-300 hover:text-blue-500 transition-colors flex-shrink-0"><X size={14} /></button>
    </div>
  );
}