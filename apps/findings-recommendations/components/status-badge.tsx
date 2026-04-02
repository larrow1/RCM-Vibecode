const statusColors: Record<string, string> = {
  Draft: "bg-gray-50 text-gray-600 border-gray-200",
  Confirmed: "bg-green-50 text-green-700 border-green-200",
  Disputed: "bg-orange-50 text-orange-700 border-orange-200",
  Resolved: "bg-blue-50 text-blue-700 border-blue-200",
  Reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Presented: "bg-purple-50 text-purple-700 border-purple-200",
};

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] || statusColors.Draft;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
    >
      {status}
    </span>
  );
}
