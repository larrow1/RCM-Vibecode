interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showCount?: boolean;
}

export function ProgressBar({ value, max, label, showCount = true }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  let barColor = "bg-blue-500";
  if (percentage >= 80) barColor = "bg-green-500";
  else if (percentage >= 50) barColor = "bg-yellow-500";
  else if (percentage >= 25) barColor = "bg-orange-500";
  else barColor = "bg-red-500";

  return (
    <div>
      {(label || showCount) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showCount && (
            <span className="text-sm font-medium text-gray-700">
              {value}/{max} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
