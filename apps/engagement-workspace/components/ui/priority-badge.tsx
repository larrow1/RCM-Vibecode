interface PriorityBadgeProps {
  priority: string;
}

const colors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-gray-100 text-gray-600 border-gray-200",
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const classes = colors[priority] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}
    >
      {priority}
    </span>
  );
}
