"use client";

import { useState } from "react";
import type { MonthlyData } from "@/lib/parser";
import MonthSelector from "./MonthSelector";
import StatCard from "./StatCard";
import DailySummaryChart from "./DailySummaryChart";
import SleepChart from "./SleepChart";
import DiaperChart from "./DiaperChart";
import FeedingBreakdown from "./FeedingBreakdown";

interface Props {
  allData: MonthlyData[];
}

export default function Dashboard({ allData }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(
    allData[allData.length - 1]?.month || ""
  );

  const current = allData.find((d) => d.month === selectedMonth);
  if (!current) return <p className="text-gray-500">데이터가 없습니다.</p>;

  const { dailySummaries } = current;
  const days = dailySummaries.length;

  const totalFeedings = dailySummaries.reduce(
    (s, d) => s + d.feedingCount + d.formulaCount + d.pumpedCount,
    0
  );
  const totalFeedingMin = dailySummaries.reduce(
    (s, d) => s + d.feedingTotalMinutes,
    0
  );
  const totalDiapers = dailySummaries.reduce((s, d) => s + d.diaperCount, 0);
  const totalNightSleep = dailySummaries.reduce(
    (s, d) => s + d.nightSleepMinutes,
    0
  );
  const totalNap = dailySummaries.reduce((s, d) => s + d.napMinutes, 0);
  const totalFormulaMl = dailySummaries.reduce((s, d) => s + d.formulaMl, 0);
  const totalPumpedMl = dailySummaries.reduce((s, d) => s + d.pumpedMl, 0);

  const avgFeedings = days > 0 ? (totalFeedings / days).toFixed(1) : "0";
  const avgFeedingMin = days > 0 ? Math.round(totalFeedingMin / days) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <MonthSelector
        months={allData.map((d) => ({ month: d.month, label: d.label }))}
        selected={selectedMonth}
        onSelect={setSelectedMonth}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          title="일평균 수유 횟수"
          value={avgFeedings}
          sub={`총 ${totalFeedings}회`}
          color="indigo"
        />
        <StatCard
          title="일평균 수유 시간"
          value={`${avgFeedingMin}분`}
          sub={`총 ${Math.round(totalFeedingMin / 60)}시간`}
          color="pink"
        />
        <StatCard
          title="기저귀 교체"
          value={`${totalDiapers}회`}
          sub={days > 0 ? `일평균 ${(totalDiapers / days).toFixed(1)}회` : ""}
          color="amber"
        />
        <StatCard
          title="밤잠 총합"
          value={`${Math.round(totalNightSleep / 60)}시간`}
          sub={
            days > 0
              ? `일평균 ${(totalNightSleep / 60 / days).toFixed(1)}시간`
              : ""
          }
          color="blue"
        />
        {totalNap > 0 && (
          <StatCard
            title="낮잠 총합"
            value={`${Math.round(totalNap / 60)}시간`}
            sub={
              days > 0
                ? `일평균 ${(totalNap / 60 / days).toFixed(1)}시간`
                : ""
            }
            color="emerald"
          />
        )}
        {totalFormulaMl > 0 && (
          <StatCard
            title="분유"
            value={`${totalFormulaMl}ml`}
            color="purple"
          />
        )}
        {totalPumpedMl > 0 && (
          <StatCard
            title="유축수유"
            value={`${totalPumpedMl}ml`}
            color="purple"
          />
        )}
      </div>

      {/* Charts */}
      <DailySummaryChart data={dailySummaries} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SleepChart data={dailySummaries} />
        <FeedingBreakdown data={dailySummaries} />
      </div>

      <DiaperChart data={dailySummaries} />
    </div>
  );
}
