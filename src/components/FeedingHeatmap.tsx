"use client";

import type { DailySummary } from "@/lib/parser";
import type { Insight } from "@/lib/insights";
import InsightBox from "./InsightBox";

interface Props {
  data: DailySummary[];
  insights?: Insight[];
}

export default function FeedingHeatmap({ data, insights }: Props) {
  const hourCounts = new Array(24).fill(0);
  for (const d of data) {
    for (const h of d.feedingHours) {
      hourCounts[h]++;
    }
  }

  const maxCount = Math.max(...hourCounts, 1);

  const timeSlots = [
    { label: "새벽", range: "0~5시", hours: [0, 1, 2, 3, 4, 5], color: "bg-indigo-500" },
    { label: "오전", range: "6~11시", hours: [6, 7, 8, 9, 10, 11], color: "bg-amber-400" },
    { label: "오후", range: "12~17시", hours: [12, 13, 14, 15, 16, 17], color: "bg-emerald-400" },
    { label: "저녁", range: "18~23시", hours: [18, 19, 20, 21, 22, 23], color: "bg-purple-400" },
  ];

  const slotTotals = timeSlots.map((slot) => ({
    ...slot,
    count: slot.hours.reduce((s, h) => s + hourCounts[h], 0),
    peak: slot.hours.reduce((best, h) => (hourCounts[h] > hourCounts[best] ? h : best), slot.hours[0]),
  }));

  const totalAll = slotTotals.reduce((s, t) => s + t.count, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">시간대별 수유 빈도</h3>
      <p className="text-xs text-gray-400 mb-3">총 {totalAll}회</p>

      <div className="space-y-3">
        {slotTotals.map((slot) => {
          const pct = totalAll > 0 ? Math.round((slot.count / totalAll) * 100) : 0;
          return (
            <div key={slot.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium">
                  {slot.label} <span className="text-gray-400 font-normal">{slot.range}</span>
                </span>
                <span className="text-xs text-gray-500">{slot.count}회 ({pct}%)</span>
              </div>
              <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${slot.color} rounded-full transition-all`}
                  style={{ width: `${maxCount > 0 ? (slot.count / slotTotals.reduce((a, b) => Math.max(a, b.count), 1)) * 100 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                피크: {slot.peak}시 ({hourCounts[slot.peak]}회)
              </p>
            </div>
          );
        })}
      </div>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
