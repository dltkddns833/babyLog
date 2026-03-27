"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DailySummary } from "@/lib/parser";
import type { Insight } from "@/lib/insights";
import InsightBox from "./InsightBox";

interface Props {
  data: DailySummary[];
  insights?: Insight[];
}

export default function SleepChart({ data, insights }: Props) {
  const chartData = data
    .filter((d) => d.napMinutes > 0 || d.nightSleepMinutes > 0)
    .map((d) => ({
      date: d.date.substring(5),
      "밤잠(시간)": Math.round((d.nightSleepMinutes / 60) * 10) / 10,
      "낮잠(시간)": Math.round((d.napMinutes / 60) * 10) / 10,
    }));

  if (chartData.length === 0) {
    return (
      <div className="card p-3.5 sm:p-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-base">😴</span>
          <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">수면 패턴</h3>
        </div>
        <p className="text-gray-400 text-center py-6 sm:py-8 text-sm">수면 기록이 없습니다</p>
      </div>
    );
  }

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 8) : 0;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">😴</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">수면 패턴</h3>
      </div>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={interval} axisLine={{ stroke: "rgba(0,0,0,0.06)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={35} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="밤잠(시간)"
            fill="#a78bfa"
            stackId="sleep"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="낮잠(시간)"
            fill="#fbbf24"
            stackId="sleep"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
