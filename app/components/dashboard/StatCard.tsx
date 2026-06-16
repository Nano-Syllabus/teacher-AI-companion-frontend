import { TrendingDown, TrendingUp } from "lucide-react";

interface StatTrend {
  label: string;
  value: string;
  delta: string;
  positive: boolean | null;
}

export default function StatCard({ label, value, delta, positive }: StatTrend) {
  return (
    <div className="rounded-xl p-4 bg-white border border-black/[0.07]">
      <p className="text-xs text-black/40 mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-black mb-2">{value}</p>
      {delta && (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
          positive === true ? "bg-green-50 text-green-700"
          : positive === false ? "bg-amber-50 text-amber-700"
          : "bg-black/5 text-black/40"
        }`}>
          {positive === true ? <TrendingUp size={11} /> : positive === false ? <TrendingDown size={11} /> : null}
          {delta}
        </span>
      )}
    </div>
  );
}