import { AlertCircle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3">
      <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
      <p className="flex-1 text-xs text-red-700">{message}</p>
      <button onClick={onDismiss} className="text-red-300 hover:text-red-500 transition-colors"><X size={14} /></button>
    </div>
  );
}