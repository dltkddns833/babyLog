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

interface Props {
  data: DailySummary[];
}

export default function DiaperChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    "기저귀 횟수": d.diaperCount,
  }));

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 8) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">일별 기저귀 교체</h3>
      <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px]">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={35} />
          <Tooltip />
          <Bar
            dataKey="기저귀 횟수"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
