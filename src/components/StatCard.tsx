interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  color?: string;
}

const iconMap: Record<string, string> = {
  indigo: "🍼",
  pink: "⏱",
  amber: "🧷",
  emerald: "😴",
  blue: "🌙",
  purple: "🧴",
};

export default function StatCard({
  title,
  value,
  sub,
  color = "indigo",
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${color} p-3.5 sm:p-5`}>
      <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
        <span className="text-sm">{iconMap[color] || "📊"}</span>
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide">{title}</p>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-1.5">{sub}</p>}
    </div>
  );
}
