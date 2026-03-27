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

interface Props {
  data: DailySummary[];
}

export default function FeedingIntervalChart({ data }: Props) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">수유 간격 추이</h3>
      <p className="text-xs text-gray-400 mb-3">평균 {Math.floor(avg / 60)}시간 {avg % 60}분 간격</p>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis tick={{ fontSize: 10 }} width={35} />
          <Tooltip
            formatter={(value: number) => [
              `${Math.floor(value / 60)}시간 ${value % 60}분`,
              "수유 간격",
            ]}
          />
          <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "평균", fontSize: 10, fill: "#94a3b8" }} />
          <Line
            type="monotone"
            dataKey="수유 간격(분)"
            stroke="#f472b6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
