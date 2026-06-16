import { BarChart2 } from "lucide-react";

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


export default function TopNotebooks({ notebooks }: { notebooks: Notebook[] }) {
  const sorted = [...notebooks].sort((a, b) => b.views - a.views).slice(0, 5);
  const max = sorted[0]?.views || 1;
  const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#EF9F27", "#378ADD"];
  return (
    <div className="rounded-xl bg-white border border-black/[0.07] p-4">
      <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-1.5">
        <BarChart2 size={14} className="text-black/40" /> Top notebooks this week
      </h3>
      {sorted.length === 0 ? (
        <p className="text-xs text-black/35 py-4 text-center">No notebooks yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((nb, i) => (
            <div key={nb.id}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-black truncate max-w-[60%]">{nb.title}</span>
                <span className="text-[11px] text-black/35">{nb.views.toLocaleString()} views</span>
              </div>
              <div className="h-1 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(nb.views / max) * 100}%`, background: COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}