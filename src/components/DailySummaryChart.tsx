"use client";

import {
  LineChart,
  Line,
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

export default function DailySummaryChart({ data, insights }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    "수유 횟수": d.feedingCount + d.formulaCount + d.pumpedCount,
  }));

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 7) : 0;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">📊</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">일별 수유 횟수</h3>
      </div>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <defs>
            <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={interval} axisLine={{ stroke: "rgba(0,0,0,0.06)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={35} allowDecimals={false} domain={["dataMin - 1", "dataMax + 1"]} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
          <Line
            type="monotone"
            dataKey="수유 횟수"
            stroke="url(#lineGradient1)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
