"use client";

import type { Insight } from "@/lib/insights";

interface Props {
  insights: Insight[];
}

const icons: Record<string, string> = {
  positive: "🌟",
  neutral: "💡",
  watch: "🔔",
};

const colors: Record<string, string> = {
  positive: "bg-emerald-50/80 text-emerald-700",
  neutral: "bg-sky-50/80 text-sky-700",
  watch: "bg-amber-50/80 text-amber-700",
};

export default function InsightBox({ insights }: Props) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-1.5 mt-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`insight-badge flex items-start gap-2 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${colors[insight.type]}`}
        >
          <span className="shrink-0 text-sm">{icons[insight.type]}</span>
          <span>{insight.text}</span>
        </div>
      ))}
    </div>
  );
}
