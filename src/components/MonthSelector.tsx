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
    <div className="flex gap-2 flex-wrap">
      {months.map((m) => (
        <button
          key={m.month}
          onClick={() => onSelect(m.month)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
