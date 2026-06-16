import { HelpCircle } from "lucide-react";
import Link from "next/link";

interface PendingReview {
  id: string;
  studentName: string;
  studentInitials: string;
  quizTitle: string;
  score: number;
  submittedAt: string;
}
export default function PendingReviews({ reviews }: { reviews: PendingReview[] }) {
   const AVATAR_COLORS: [string, string][] = [
  ["#E1F5EE", "#0F6E56"], ["#EEEDFE", "#3C3489"], ["#FAEEDA", "#633806"],
  ["#FCEBEB", "#791F1F"], ["#E6F1FB", "#0C447C"], ["#EAF3DE", "#27500A"],
];
function avatarColor(initials: string): [string, string] {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
} 
  if (reviews.length === 0) return null;
  return (
    <div className="rounded-xl bg-white border border-black/[0.07] p-4">
      <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-1.5">
        <HelpCircle size={14} className="text-black/40" /> Pending quiz reviews
        <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">{reviews.length} waiting</span>
      </h3>
      <div className="flex flex-col divide-y divide-black/[0.05]">
        {reviews.map((r) => {
          const [bg, fg] = avatarColor(r.studentInitials);
          return (
            <div key={r.id} className="flex items-center gap-3 py-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0" style={{ background: bg, color: fg }}>
                {r.studentInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-black truncate">{r.studentName} — {r.quizTitle}</p>
                <p className="text-[11px] text-black/35">{r.submittedAt}</p>
              </div>
              <span className={`text-[11px] font-semibold flex-shrink-0 ${r.score >= 80 ? "text-green-600" : r.score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                {r.score}%
              </span>
              <Link href={`/reviews/${r.id}`} className="text-[11px] px-2.5 py-1 rounded-lg border border-black/10 text-black/50 hover:bg-black/5 transition-colors flex-shrink-0">
                Review
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
