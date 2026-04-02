interface StatusBadgeProps {
  status: string;
  colorClass?: string;
}

const defaultColors: Record<string, string> = {
  // Engagement statuses
  Scoping: "bg-purple-100 text-purple-800",
  DataCollection: "bg-yellow-100 text-yellow-800",
  Analysis: "bg-blue-100 text-blue-800",
  Synthesis: "bg-indigo-100 text-indigo-800",
  Reporting: "bg-orange-100 text-orange-800",
  Complete: "bg-green-100 text-green-800",
  // Data request statuses
  Requested: "bg-gray-100 text-gray-800",
  Received: "bg-green-100 text-green-800",
  PartiallyReceived: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
  NotAvailable: "bg-slate-100 text-slate-500",
  // Document statuses
  Pending: "bg-gray-100 text-gray-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Extracted: "bg-green-100 text-green-800",
  Flagged: "bg-red-100 text-red-800",
};

function formatStatus(status: string): string {
  return status.replace(/([A-Z])/g, " $1").trim();
}

export function StatusBadge({ status, colorClass }: StatusBadgeProps) {
  const classes = colorClass || defaultColors[status] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {formatStatus(status)}
    </span>
  );
}
