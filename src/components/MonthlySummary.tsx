"use client";

import type { MonthlyInsight } from "@/lib/parser";

interface Props {
  insight: MonthlyInsight;
}

const icons: Record<string, string> = {
  positive: "🌟",
  neutral: "💡",
  watch: "🔔",
};

const borderColors: Record<string, string> = {
  positive: "border-l-emerald-400",
  neutral: "border-l-sky-400",
  watch: "border-l-amber-400",
};

const bgColors: Record<string, string> = {
  positive: "bg-emerald-50/50",
  neutral: "bg-sky-50/50",
  watch: "bg-amber-50/50",
};

function formatBody(body: string) {
  // ①②③ 등 번호 리스트 앞에 줄바꿈 삽입
  const withBreaks = body.replace(/\s*([①②③④⑤⑥⑦⑧⑨⑩])/g, "\n$1");
  // 문장 구분: ". " 뒤에서 줄바꿈 (단, 숫자.숫자는 제외)
  const withSentenceBreaks = withBreaks.replace(/(?<!\d)\.(\s+)(?=[가-힣A-Z])/g, ".\n");

  const lines = withSentenceBreaks.split("\n").filter((l) => l.trim());

  if (lines.length <= 1) return body;

  return lines.map((line, i) => (
    <span key={i} className={i > 0 ? "block mt-1.5" : ""}>
      {line.trim()}
    </span>
  ));
}

function formatDetailText(text: string) {
  const match = text.match(/^\[(.+?)\]\s*/);
  if (match) {
    const title = match[1];
    const body = text.slice(match[0].length);
    return (
      <>
        <span className="font-semibold text-gray-700 block mb-1.5">{title}</span>
        {formatBody(body)}
      </>
    );
  }
  return formatBody(text);
}

export default function MonthlySummary({ insight }: Props) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="summary-header">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">{insight.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{insight.summary}</p>
      </div>
      <div className="p-3.5 sm:p-6 space-y-2.5">
        {insight.details.map((d, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 pl-3 border-l-[3px] ${borderColors[d.type]} ${bgColors[d.type]} py-2.5 pr-3 rounded-r-lg`}
          >
            <span className="hidden sm:block shrink-0 text-sm mt-0.5">{icons[d.type]}</span>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{formatDetailText(d.text)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
