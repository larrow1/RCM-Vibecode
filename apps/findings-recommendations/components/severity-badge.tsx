const severityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-red-50 text-red-700 border-red-100",
  Medium: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Low: "bg-blue-50 text-blue-700 border-blue-100",
  Informational: "bg-gray-50 text-gray-600 border-gray-200",
};

export function SeverityBadge({ severity }: { severity: string }) {
  const colors = severityColors[severity] || severityColors.Informational;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
    >
      {severity}
    </span>
  );
}
