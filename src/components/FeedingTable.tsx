"use client";

import { useState } from "react";
import type { DailySummary, Activity } from "@/lib/parser";

interface Props {
  data: DailySummary[];
  activities: Activity[];
}

const BIRTH_DATE = new Date("2026-01-27");

function getDaysOld(dateStr: string): number {
  const date = new Date(dateStr);
  const diff = date.getTime() - BIRTH_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function formatInterval(minutes: number): string {
  if (minutes === 0) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `~${h}.${Math.round((m / 60) * 10)}h` : `~${h}.0h`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m} ${ampm}`;
}

function getActivityLabel(type: string): string {
  const map: Record<string, string> = {
    breast_both: "모유(양쪽)",
    breast_left: "모유(왼쪽)",
    breast_right: "모유(오른쪽)",
    breast_unknown: "모유",
    formula: "분유",
    pumped: "유축수유",
    diaper: "기저귀",
    night_sleep: "밤잠",
    nap: "낮잠",
  };
  return map[type] || type;
}

function getActivityColor(type: string): string {
  if (type.startsWith("breast")) return "text-purple-600";
  if (type === "formula") return "text-amber-600";
  if (type === "pumped") return "text-sky-600";
  if (type === "diaper") return "text-yellow-600";
  if (type === "night_sleep" || type === "nap") return "text-indigo-500";
  return "text-gray-600";
}

function getActivityDetail(a: Activity): string {
  if (
    a.type === "breast_both" ||
    a.type === "breast_left" ||
    a.type === "breast_right" ||
    a.type === "breast_unknown"
  ) {
    const parts: string[] = [];
    if (a.durationMinutes) parts.push(`${a.durationMinutes}분`);
    if (a.leftMinutes) parts.push(`좌 ${a.leftMinutes}분`);
    if (a.rightMinutes) parts.push(`우 ${a.rightMinutes}분`);
    return parts.join(" · ");
  }
  if (a.type === "formula") return `${a.amountMl}ml`;
  if (a.type === "pumped") return `${a.amountMl}ml`;
  if (a.type === "diaper") return a.stoolType;
  if (a.durationMinutes) {
    const h = Math.floor(a.durationMinutes / 60);
    const m = a.durationMinutes % 60;
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  }
  return "";
}

export default function FeedingTable({ data, activities }: Props) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const activitiesByDate = new Map<string, Activity[]>();
  for (const a of activities) {
    const date = a.startTime.substring(0, 10);
    if (!activitiesByDate.has(date)) activitiesByDate.set(date, []);
    activitiesByDate.get(date)!.push(a);
  }

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">📅</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">일별 수유 요약</h3>
      </div>
      <div className="-mx-1">
        {/* 헤더 */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] border-b border-purple-100 text-gray-400 text-[11px] sm:text-xs px-1 py-2">
          <span className="font-medium">날짜</span>
          <span className="font-medium hidden sm:block text-center">생후</span>
          <span className="font-medium text-center">횟수</span>
          <span className="font-medium text-center">직수</span>
          <span className="font-medium text-center">유축</span>
          <span className="font-medium hidden sm:block text-center">간격</span>
        </div>

        {/* 행 */}
        {data.map((d) => {
          const totalCount = d.feedingCount + d.formulaCount + d.pumpedCount;
          const isExpanded = expandedDate === d.date;
          const dayActivities = activitiesByDate.get(d.date) || [];

          return (
            <div key={d.date}>
              <div
                className={`grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] px-1 py-2 text-[11px] sm:text-xs cursor-pointer border-b border-gray-100/80 ${
                  isExpanded ? "bg-purple-50/60" : "table-row-hover"
                }`}
                onClick={() => setExpandedDate(isExpanded ? null : d.date)}
              >
                <span className="text-gray-700 font-medium">
                  <span className={`inline-block w-4 text-xs transition-transform ${isExpanded ? "text-purple-400" : "text-gray-300"}`}>
                    {isExpanded ? "▾" : "▸"}
                  </span>
                  {d.date.substring(5)}
                </span>
                <span className="hidden sm:block text-center text-gray-400">{getDaysOld(d.date)}일</span>
                <span className="text-center font-semibold text-purple-600">{totalCount}회</span>
                <span className="text-center text-gray-500">{d.feedingTotalMinutes}분</span>
                <span className="text-center text-gray-400">{d.bottleSummary}</span>
                <span className="hidden sm:block text-center text-gray-400">{formatInterval(d.avgFeedingInterval)}</span>
              </div>

              {isExpanded && (
                <div className="animate-expand bg-gradient-to-r from-purple-50/40 to-pink-50/40 border-b border-purple-100/60 py-2.5 overflow-x-auto">
                  <div className="px-3 min-w-[340px] space-y-1">
                    {dayActivities.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] sm:text-xs py-0.5 whitespace-nowrap"
                      >
                        <span className="text-gray-400 w-16 shrink-0 font-medium">
                          {formatTime(a.startTime)}
                        </span>
                        <span className={`font-semibold shrink-0 ${getActivityColor(a.type)}`}>
                          {getActivityLabel(a.type)}
                        </span>
                        <span className="text-gray-500 shrink-0">{getActivityDetail(a)}</span>
                        {a.memo && (
                          <span className="memo-badge inline-block px-1.5 py-0.5 text-[10px] sm:text-[11px] shrink-0">
                            {a.memo}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
