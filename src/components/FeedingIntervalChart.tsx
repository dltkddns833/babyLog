"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { DailySummary } from "@/lib/parser";
import type { Insight } from "@/lib/insights";
import InsightBox from "./InsightBox";

interface Props {
  data: DailySummary[];
  insights?: Insight[];
}

export default function FeedingIntervalChart({ data, insights }: Props) {
  const chartData = data
    .filter((d) => d.avgFeedingInterval > 0)
    .map((d) => ({
      date: d.date.substring(5),
      "수유 간격(분)": d.avgFeedingInterval,
    }));

  if (chartData.length === 0) return null;

  const avg = Math.round(
    chartData.reduce((s, d) => s + d["수유 간격(분)"], 0) / chartData.length
  );
  const interval = chartData.length > 15 ? Math.floor(chartData.length / 7) : 0;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <span className="text-base">⏳</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">수유 간격 추이</h3>
      </div>
      <p className="text-xs text-gray-400 mb-3 ml-7">평균 {Math.floor(avg / 60)}시간 {avg % 60}분 간격</p>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <defs>
            <linearGradient id="lineGradient2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={interval} axisLine={{ stroke: "rgba(0,0,0,0.06)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={35} domain={["dataMin - 20", "dataMax + 20"]} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            formatter={(value: number) => [
              `${Math.floor(value / 60)}시간 ${value % 60}분`,
              "수유 간격",
            ]}
          />
          <ReferenceLine y={avg} stroke="#d8b4fe" strokeDasharray="6 4" label={{ value: "평균", fontSize: 10, fill: "#c084fc" }} />
          <Line
            type="monotone"
            dataKey="수유 간격(분)"
            stroke="url(#lineGradient2)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#f9a8d4", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
      {insights && <InsightBox insights={insights} />}
    </div>
  );
}
