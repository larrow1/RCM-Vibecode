const typeLabels: Record<string, string> = {
  CostReduction: "Cost Reduction",
  RevenueEnhancement: "Revenue Enhancement",
  RiskMitigation: "Risk Mitigation",
  OperationalImprovement: "Operational Improvement",
  StructuralChange: "Structural Change",
};

const typeColors: Record<string, string> = {
  CostReduction: "bg-green-50 text-green-700 border-green-200",
  RevenueEnhancement: "bg-blue-50 text-blue-700 border-blue-200",
  RiskMitigation: "bg-red-50 text-red-700 border-red-200",
  OperationalImprovement: "bg-orange-50 text-orange-700 border-orange-200",
  StructuralChange: "bg-purple-50 text-purple-700 border-purple-200",
};

export function TypeBadge({ type }: { type: string }) {
  const colors = typeColors[type] || "bg-gray-50 text-gray-600 border-gray-200";
  const label = typeLabels[type] || type;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
    >
      {label}
    </span>
  );
}
