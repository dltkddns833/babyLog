interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  sub,
  color = "indigo",
}: StatCardProps) {
  const colorMap: Record<string, string> = {
    indigo: "border-indigo-200 bg-indigo-50",
    pink: "border-pink-200 bg-pink-50",
    amber: "border-amber-200 bg-amber-50",
    emerald: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    purple: "border-purple-200 bg-purple-50",
  };

  return (
    <div
      className={`rounded-xl border p-3 sm:p-5 ${colorMap[color] || colorMap.indigo}`}
    >
      <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">{title}</p>
      <p className="text-xl sm:text-2xl font-bold">{value}</p>
      {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{sub}</p>}
    </div>
  );
}
