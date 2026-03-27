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

interface Props {
  data: DailySummary[];
}

export default function DailySummaryChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    "수유 횟수": d.feedingCount + d.formulaCount + d.pumpedCount,
  }));

  const interval = chartData.length > 15 ? Math.floor(chartData.length / 7) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">일별 수유 횟수</h3>
      <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={interval} />
          <YAxis tick={{ fontSize: 10 }} width={35} allowDecimals={false} domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="수유 횟수"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
