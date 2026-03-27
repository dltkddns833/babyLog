"use client";

import type { DailySummary } from "@/lib/parser";

interface Props {
  data: DailySummary[];
}

export default function FeedingHeatmap({ data }: Props) {
  // 시간대별 수유 빈도 계산 (0~23시)
  const hourCounts = new Array(24).fill(0);
  for (const d of data) {
    for (const h of d.feedingHours) {
      hourCounts[h]++;
    }
  }

  const maxCount = Math.max(...hourCounts, 1);

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    const ratio = count / maxCount;
    if (ratio > 0.75) return "bg-indigo-600";
    if (ratio > 0.5) return "bg-indigo-400";
    if (ratio > 0.25) return "bg-indigo-300";
    return "bg-indigo-200";
  };

  const getTextColor = (count: number) => {
    const ratio = count / maxCount;
    return ratio > 0.5 ? "text-white" : "text-gray-600";
  };

  // 4시간 단위로 그룹핑하여 표시
  const rows = [
    { label: "새벽", hours: [0, 1, 2, 3, 4, 5] },
    { label: "오전", hours: [6, 7, 8, 9, 10, 11] },
    { label: "오후", hours: [12, 13, 14, 15, 16, 17] },
    { label: "저녁", hours: [18, 19, 20, 21, 22, 23] },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">시간대별 수유 빈도</h3>
      <p className="text-xs text-gray-400 mb-3">진할수록 수유가 잦은 시간대</p>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-1">
            <span className="text-[10px] sm:text-xs text-gray-500 w-8 shrink-0">{row.label}</span>
            <div className="flex gap-0.5 sm:gap-1 flex-1">
              {row.hours.map((h) => (
                <div
                  key={h}
                  className={`flex-1 aspect-square rounded-sm sm:rounded ${getColor(hourCounts[h])} flex items-center justify-center`}
                  title={`${h}시: ${hourCounts[h]}회`}
                >
                  <span className={`text-[8px] sm:text-[10px] font-medium ${getTextColor(hourCounts[h])}`}>
                    {hourCounts[h] > 0 ? hourCounts[h] : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1 mt-1">
          <span className="w-8 shrink-0" />
          <div className="flex gap-0.5 sm:gap-1 flex-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="flex-1 text-center text-[8px] sm:text-[10px] text-gray-400">
                {rows[0].hours[i]}시
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
