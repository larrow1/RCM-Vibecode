import { Card } from "@/components/shared/card";

interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

function Metric({ label, value, change, changeType = "neutral" }: MetricProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
        ? "text-red-600"
        : "text-gray-500";

  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className={`mt-1 text-sm ${changeColor}`}>{change}</p>
      )}
    </Card>
  );
}

export function MetricsSummary({
  metrics,
}: {
  metrics: MetricProps[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, idx) => (
        <Metric key={idx} {...m} />
      ))}
    </div>
  );
}
