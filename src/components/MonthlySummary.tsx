"use client";

import type { MonthlyInsight } from "@/lib/parser";

interface Props {
  insight: MonthlyInsight;
}

const icons: Record<string, string> = {
  positive: "✅",
  neutral: "💡",
  watch: "⚠️",
};

const colors: Record<string, string> = {
  positive: "border-l-emerald-400",
  neutral: "border-l-blue-400",
  watch: "border-l-amber-400",
};

export default function MonthlySummary({ insight }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold mb-1">{insight.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{insight.summary}</p>
      <div className="space-y-2.5">
        {insight.details.map((d, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 pl-3 border-l-[3px] ${colors[d.type]} py-1`}
          >
            <span className="shrink-0 text-sm mt-0.5">{icons[d.type]}</span>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{d.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
