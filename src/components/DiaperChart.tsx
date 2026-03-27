"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailySummary } from "@/lib/parser";
import type { Insight } from "@/lib/insights";
import InsightBox from "./InsightBox";

interface Props {
  data: DailySummary[];
  insights?: Insight[];
}

export default function DiaperChart({ data, insights }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    "기저귀 횟수": d.diaperCount,
  }));

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 8) : 0;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">🧷</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">일별 기저귀 교체</h3>
      </div>
      <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px]">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={interval} axisLine={{ stroke: "rgba(0,0,0,0.06)" }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} width={35} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
          <Bar
            dataKey="기저귀 횟수"
            fill="#fbbf24"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
