import { Activity, BookOpen, ChevronRight } from "lucide-react";
import ActivityBadge from "./ActivityBadge";


interface ActivityItem {
  id: string;
  type: "enrollment" | "rating" | "comment" | "quiz_submission" | "published";
  studentName?: string;
  studentInitials?: string;
  notebookTitle: string;
  timestamp: string;
  meta?: string;
}
const AVATAR_COLORS: [string, string][] = [
  ["#E1F5EE", "#0F6E56"], ["#EEEDFE", "#3C3489"], ["#FAEEDA", "#633806"],
  ["#FCEBEB", "#791F1F"], ["#E6F1FB", "#0C447C"], ["#EAF3DE", "#27500A"],
];
function avatarColor(initials: string): [string, string] {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-xl bg-white border border-black/[0.07] p-4">
      <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-1.5">
        <Activity size={14} className="text-black/40" /> Recent activity
      </h3>
      <div className="flex flex-col divide-y divide-black/[0.05]">
        {items.map((item) => {
          const initials = item.studentInitials ?? "—";
          const [bg, fg] = avatarColor(initials);
          return (
            <div key={item.id} className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0" style={{ background: bg, color: fg }}>
                {item.type === "published" ? <BookOpen size={14} style={{ color: fg }} /> : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-black truncate">
                  {item.type === "enrollment" && `${item.studentName} enrolled`}
                  {item.type === "rating" && `${item.studentName} rated ${item.meta}`}
                  {item.type === "comment" && `${item.studentName} left a comment`}
                  {item.type === "quiz_submission" && `${item.studentName} submitted a quiz`}
                  {item.type === "published" && `${item.notebookTitle} published`}
                </p>
                <p className="text-[11px] text-black/35 truncate">
                  {item.type !== "published" && `${item.notebookTitle} · `}{item.timestamp}
                </p>
              </div>
              <ActivityBadge type={item.type} meta={item.meta} />
            </div>
          );
        })}
      </div>
      <button className="mt-3 w-full text-xs text-black/40 hover:text-black/70 flex items-center justify-center gap-1 transition-colors">
        View all activity <ChevronRight size={12} />
      </button>
    </div>
  );
}
