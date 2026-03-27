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

interface Props {
  data: DailySummary[];
}

export default function DayNightChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    "낮 (6~22시)": d.dayFeedingCount,
    "밤 (22~6시)": d.nightFeedingCount,
  }));

  const totalDay = data.reduce((s, d) => s + d.dayFeedingCount, 0);
  const totalNight = data.reduce((s, d) => s + d.nightFeedingCount, 0);
  const total = totalDay + totalNight;
  const interval = chartData.length > 15 ? Math.floor(chartData.length / 7) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">낮/밤 수유 비율</h3>
      <p className="text-xs text-gray-400 mb-3">
        낮 {total > 0 ? Math.round((totalDay / total) * 100) : 0}% / 밤{" "}
        {total > 0 ? Math.round((totalNight / total) * 100) : 0}%
      </p>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis tick={{ fontSize: 10 }} width={35} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="낮 (6~22시)" fill="#fbbf24" stackId="dn" radius={[0, 0, 0, 0]} />
          <Bar dataKey="밤 (22~6시)" fill="#6366f1" stackId="dn" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
