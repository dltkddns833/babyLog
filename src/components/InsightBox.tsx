"use client";

import type { Insight } from "@/lib/insights";

interface Props {
  insights: Insight[];
}

const icons: Record<string, string> = {
  positive: "✅",
  neutral: "💡",
  watch: "⚠️",
};

const colors: Record<string, string> = {
  positive: "bg-emerald-50 border-emerald-200 text-emerald-800",
  neutral: "bg-blue-50 border-blue-200 text-blue-800",
  watch: "bg-amber-50 border-amber-200 text-amber-800",
};

export default function InsightBox({ insights }: Props) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-1.5 mt-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm ${colors[insight.type]}`}
        >
          <span className="shrink-0 text-sm">{icons[insight.type]}</span>
          <span>{insight.text}</span>
        </div>
      ))}
    </div>
  );
}
