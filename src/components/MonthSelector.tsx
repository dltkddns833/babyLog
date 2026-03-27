"use client";

interface MonthSelectorProps {
  months: { month: string; label: string }[];
  selected: string;
  onSelect: (month: string) => void;
}

export default function MonthSelector({
  months,
  selected,
  onSelect,
}: MonthSelectorProps) {
  const currentIdx = months.findIndex((m) => m.month === selected);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < months.length - 1;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => hasPrev && onSelect(months[currentIdx - 1].month)}
        disabled={!hasPrev}
        className="month-pill p-2.5 sm:p-3 disabled:opacity-30 disabled:cursor-not-allowed text-purple-400"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="month-pill flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-center text-gray-700 appearance-none cursor-pointer"
      >
        {months.map((m) => (
          <option key={m.month} value={m.month}>
            {m.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => hasNext && onSelect(months[currentIdx + 1].month)}
        disabled={!hasNext}
        className="month-pill p-2.5 sm:p-3 disabled:opacity-30 disabled:cursor-not-allowed text-purple-400"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
