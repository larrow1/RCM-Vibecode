"use client";

export function PeriodSelector({
  periods,
  selected,
  onChange,
}: {
  periods: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const togglePeriod = (period: string) => {
    if (selected.includes(period)) {
      onChange(selected.filter((p) => p !== period));
    } else {
      onChange([...selected, period].sort());
    }
  };

  const selectAll = () => onChange([...periods]);
  const selectNone = () => onChange([]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={selectAll}
          className="text-xs text-blue-600 hover:underline"
        >
          Select all
        </button>
        <button
          onClick={selectNone}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => togglePeriod(period)}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              selected.includes(period)
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}
