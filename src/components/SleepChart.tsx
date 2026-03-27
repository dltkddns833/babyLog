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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4">수면 패턴</h3>
        <p className="text-gray-400 text-center py-8">수면 기록이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold mb-4">수면 패턴</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Legend />
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
