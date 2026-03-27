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
import AnimatedSection from "./AnimatedSection";
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
    <div className="space-y-5 sm:space-y-7">
      <AnimatedSection>
        <MonthSelector
          months={allData.map((d) => ({ month: d.month, label: d.label }))}
          selected={selectedMonth}
          onSelect={setSelectedMonth}
        />
      </AnimatedSection>

      {/* 0. 종합 인사이트 */}
      {current.insight && (
        <AnimatedSection delay={0.1}>
          <MonthlySummary insight={current.insight} />
        </AnimatedSection>
      )}

      {/* 1. Stats */}
      <AnimatedSection delay={0.05}>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="animate-pop-in stagger-1">
              <StatCard
                title="일평균 수유 횟수"
                value={avgFeedings}
                sub={`총 ${totalFeedings}회`}
                color="indigo"
              />
            </div>
            <div className="animate-pop-in stagger-2">
              <StatCard
                title="일평균 수유 시간"
                value={`${avgFeedingMin}분`}
                sub={`총 ${Math.round(totalFeedingMin / 60)}시간`}
                color="pink"
              />
            </div>
            <div className="animate-pop-in stagger-3">
              <StatCard
                title="기저귀 교체"
                value={`${totalDiapers}회`}
                sub={days > 0 ? `일평균 ${(totalDiapers / days).toFixed(1)}회` : ""}
                color="amber"
              />
            </div>
            <div className="animate-pop-in stagger-4">
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
            </div>
            {totalNap > 0 && (
              <div className="animate-pop-in stagger-5">
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
              </div>
            )}
            {totalFormulaMl > 0 && (
              <div className="animate-pop-in stagger-6">
                <StatCard
                  title="분유"
                  value={`${totalFormulaMl}ml`}
                  color="purple"
                />
              </div>
            )}
            {totalPumpedMl > 0 && (
              <div className="animate-pop-in stagger-7">
                <StatCard
                  title="유축수유"
                  value={`${totalPumpedMl}ml`}
                  color="purple"
                />
              </div>
            )}
          </div>
          <InsightBox insights={analyzeOverall(dailySummaries)} />
        </div>
      </AnimatedSection>

      {/* 2. 일별 수유 요약 테이블 */}
      <AnimatedSection>
        <FeedingTable data={dailySummaries} activities={current.activities} />
      </AnimatedSection>

      {/* 3~5. 수유 차트 */}
      <AnimatedSection>
        <DailySummaryChart data={dailySummaries} insights={analyzeFeedingCount(dailySummaries)} />
      </AnimatedSection>
      <AnimatedSection>
        <FeedingIntervalChart data={dailySummaries} insights={analyzeFeedingInterval(dailySummaries)} />
      </AnimatedSection>
      <AnimatedSection>
        <AvgFeedingDurationChart data={dailySummaries} insights={analyzeFeedingDuration(dailySummaries)} />
      </AnimatedSection>

      {/* 6. 시간대 수유 빈도 | 좌/우 비율 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
        <AnimatedSection>
          <FeedingHeatmap data={dailySummaries} insights={analyzeTimeDistribution(dailySummaries)} />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <FeedingBreakdown data={dailySummaries} insights={analyzeLeftRight(dailySummaries)} />
        </AnimatedSection>
      </div>

      {/* 7. 수면 패턴 */}
      <AnimatedSection>
        <SleepChart data={dailySummaries} insights={analyzeSleep(dailySummaries)} />
      </AnimatedSection>

      {/* 8. 기저귀 */}
      <AnimatedSection>
        <DiaperChart data={dailySummaries} insights={analyzeDiaper(dailySummaries)} />
      </AnimatedSection>
    </div>
  );
}
