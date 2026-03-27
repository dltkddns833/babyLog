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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4">좌/우 수유 비율</h3>
        <p className="text-gray-400 text-center py-8">데이터 없음</p>
      </div>
    );
  }

  const total = totalLeft + totalRight;
  const leftPct = Math.round((totalLeft / total) * 100);
  const rightPct = 100 - leftPct;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold mb-4">좌/우 수유 비율</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}분`}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-gray-500 mt-2">
        왼쪽 {leftPct}% / 오른쪽 {rightPct}%
      </p>
    </div>
  );
}
