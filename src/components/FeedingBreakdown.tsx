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
import type { Insight } from "@/lib/insights";
import InsightBox from "./InsightBox";

interface Props {
  data: DailySummary[];
  insights?: Insight[];
}

const COLORS = ["#a78bfa", "#f9a8d4"];

export default function FeedingBreakdown({ data, insights }: Props) {
  const totalLeft = data.reduce((s, d) => s + d.leftMinutes, 0);
  const totalRight = data.reduce((s, d) => s + d.rightMinutes, 0);

  const pieData = [
    { name: "왼쪽", value: totalLeft },
    { name: "오른쪽", value: totalRight },
  ];

  if (totalLeft === 0 && totalRight === 0) {
    return (
      <div className="card p-3.5 sm:p-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-base">⚖️</span>
          <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">좌/우 수유 비율</h3>
        </div>
        <p className="text-gray-400 text-center py-6 sm:py-8 text-sm">데이터 없음</p>
      </div>
    );
  }

  const total = totalLeft + totalRight;
  const leftPct = Math.round((totalLeft / total) * 100);
  const rightPct = 100 - leftPct;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">⚖️</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">좌/우 수유 비율</h3>
      </div>
      <ResponsiveContainer width="100%" height={260} className="sm:!h-[280px]">
        <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
          <Pie
            data={pieData}
            cx="50%"
            cy="48%"
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
          <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-1 sm:mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS[0] }} />
          <span className="text-xs sm:text-sm text-gray-500 font-medium">왼쪽 {leftPct}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS[1] }} />
          <span className="text-xs sm:text-sm text-gray-500 font-medium">오른쪽 {rightPct}%</span>
        </div>
      </div>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
