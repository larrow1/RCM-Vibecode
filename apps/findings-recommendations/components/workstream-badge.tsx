const workstreamColors: Record<string, string> = {
  Financial: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Organizational: "bg-purple-50 text-purple-700 border-purple-200",
  Contracts: "bg-amber-50 text-amber-700 border-amber-200",
  CrossCutting: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export function WorkstreamBadge({ workstream }: { workstream: string }) {
  const colors = workstreamColors[workstream] || "bg-gray-50 text-gray-600 border-gray-200";
  const label = workstream === "CrossCutting" ? "Cross-Cutting" : workstream;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
    >
      {label}
    </span>
  );
}
