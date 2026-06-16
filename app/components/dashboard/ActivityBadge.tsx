interface ActivityItem {
  id: string;
  type: "enrollment" | "rating" | "comment" | "quiz_submission" | "published";
  studentName?: string;
  studentInitials?: string;
  notebookTitle: string;
  timestamp: string;
  meta?: string;
}

export default function ActivityBadge({ type, meta }: { type: ActivityItem["type"]; meta?: string }) {
  const cfg: Record<ActivityItem["type"], { label: string; cls: string }> = {
    enrollment:      { label: "New",       cls: "bg-blue-50 text-blue-700" },
    rating:          { label: meta ?? "Rated", cls: "bg-green-50 text-green-700" },
    comment:         { label: "Comment",   cls: "bg-black/5 text-black/50" },
    quiz_submission: { label: "Pending",   cls: "bg-amber-50 text-amber-700" },
    published:       { label: "Published", cls: "bg-green-50 text-green-700" },
  };
  const { label, cls } = cfg[type];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cls}`}>{label}</span>;
}