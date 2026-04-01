"use client";

import type { HospitalRecord } from "@/lib/parser";

interface Props {
  records: HospitalRecord[];
}

export default function HospitalVisits({ records }: Props) {
  if (records.length === 0) return null;

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-base">🏥</span>
        <h3 className="section-title text-base sm:text-lg font-semibold text-gray-800">
          병원 방문
        </h3>
      </div>
      <div className="space-y-2.5">
        {records.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-sky-50/80 to-blue-50/60 border border-sky-100/60"
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sky-100 flex items-center justify-center text-sm">
              🩺
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-semibold text-gray-800">
                  {r.hospitalName}
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-sky-100/80 text-sky-700 font-medium">
                  {r.visitType}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                {r.reason}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                {r.date.substring(5).replace("-", "/")} {r.time}
              </p>
              {r.memo && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 italic">
                  {r.memo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
