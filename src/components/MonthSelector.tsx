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
  const current = months.find((m) => m.month === selected);
  const currentIdx = months.findIndex((m) => m.month === selected);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < months.length - 1;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => hasPrev && onSelect(months[currentIdx - 1].month)}
        disabled={!hasPrev}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm sm:text-base font-medium text-center appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
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
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
