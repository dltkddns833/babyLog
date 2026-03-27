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
  return (
    <div className="flex gap-2 flex-wrap overflow-x-auto pb-1 -mx-1 px-1">
      {months.map((m) => (
        <button
          key={m.month}
          onClick={() => onSelect(m.month)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selected === m.month
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
