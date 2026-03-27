"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { DailySummary } from "@/lib/parser";

interface Props {
  data: DailySummary[];
}

const COLORS = ["#818cf8", "#f472b6"];

export default function FeedingBreakdown({ data }: Props) {
  const totalLeft = data.reduce((s, d) => s + d.leftMinutes, 0);
  const totalRight = data.reduce((s, d) => s + d.rightMinutes, 0);

  const pieData = [
    { name: "왼쪽", value: totalLeft },
    { name: "오른쪽", value: totalRight },
  ];

  if (totalLeft === 0 && totalRight === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">좌/우 수유 비율</h3>
        <p className="text-gray-400 text-center py-6 sm:py-8 text-sm">데이터 없음</p>
      </div>
    );
  }

  const total = totalLeft + totalRight;
  const leftPct = Math.round((totalLeft / total) * 100);
  const rightPct = 100 - leftPct;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">좌/우 수유 비율</h3>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[250px]">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}분`}
            labelLine={{ strokeWidth: 1 }}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
        왼쪽 {leftPct}% / 오른쪽 {rightPct}%
      </p>
    </div>
  );
}
