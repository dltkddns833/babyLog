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

export default function SleepChart({ data }: Props) {
  const chartData = data
    .filter((d) => d.napMinutes > 0 || d.nightSleepMinutes > 0)
    .map((d) => ({
      date: d.date.substring(5),
      "밤잠(시간)": Math.round((d.nightSleepMinutes / 60) * 10) / 10,
      "낮잠(시간)": Math.round((d.napMinutes / 60) * 10) / 10,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">수면 패턴</h3>
        <p className="text-gray-400 text-center py-6 sm:py-8 text-sm">수면 기록이 없습니다</p>
      </div>
    );
  }

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 8) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">수면 패턴</h3>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis tick={{ fontSize: 10 }} width={30} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="밤잠(시간)"
            fill="#6366f1"
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
    </div>
  );
}
