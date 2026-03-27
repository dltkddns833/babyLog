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

export default function DailySummaryChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5), // MM-DD
    "수유 횟수": d.feedingCount + d.formulaCount + d.pumpedCount,
    "수유 시간(분)": d.feedingTotalMinutes,
  }));

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 8) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">일별 수유 현황</h3>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} width={30} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} width={30} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="수유 횟수"
            fill="#818cf8"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="수유 시간(분)"
            fill="#c4b5fd"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
