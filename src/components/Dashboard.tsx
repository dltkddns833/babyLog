"use client";

import { useState } from "react";
import type { MonthlyData } from "@/lib/parser";
import {
  analyzeOverall,
  analyzeFeedingCount,
  analyzeFeedingInterval,
  analyzeFeedingDuration,
  analyzeTimeDistribution,
  analyzeLeftRight,
  analyzeSleep,
  analyzeDiaper,
} from "@/lib/insights";
import MonthSelector from "./MonthSelector";
import StatCard from "./StatCard";
import InsightBox from "./InsightBox";
import DailySummaryChart from "./DailySummaryChart";
import FeedingIntervalChart from "./FeedingIntervalChart";
import AvgFeedingDurationChart from "./AvgFeedingDurationChart";
import FeedingHeatmap from "./FeedingHeatmap";
import FeedingBreakdown from "./FeedingBreakdown";
import SleepChart from "./SleepChart";
import DiaperChart from "./DiaperChart";
import FeedingTable from "./FeedingTable";
import MonthlySummary from "./MonthlySummary";

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

      {/* 0. 종합 인사이트 */}
      {current.insight && <MonthlySummary insight={current.insight} />}

      {/* 1. Stats */}
      <div>
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
        <InsightBox insights={analyzeOverall(dailySummaries)} />
      </div>

      {/* 2. 일별 수유 요약 테이블 */}
      <FeedingTable data={dailySummaries} activities={current.activities} />

      {/* 3~5. 수유 차트 */}
      <DailySummaryChart data={dailySummaries} insights={analyzeFeedingCount(dailySummaries)} />
      <FeedingIntervalChart data={dailySummaries} insights={analyzeFeedingInterval(dailySummaries)} />
      <AvgFeedingDurationChart data={dailySummaries} insights={analyzeFeedingDuration(dailySummaries)} />

      {/* 6. 시간대 수유 빈도 | 좌/우 비율 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FeedingHeatmap data={dailySummaries} insights={analyzeTimeDistribution(dailySummaries)} />
        <FeedingBreakdown data={dailySummaries} insights={analyzeLeftRight(dailySummaries)} />
      </div>

      {/* 7. 수면 패턴 */}
      <SleepChart data={dailySummaries} insights={analyzeSleep(dailySummaries)} />

      {/* 8. 기저귀 */}
      <DiaperChart data={dailySummaries} insights={analyzeDiaper(dailySummaries)} />
    </div>
  );
}
