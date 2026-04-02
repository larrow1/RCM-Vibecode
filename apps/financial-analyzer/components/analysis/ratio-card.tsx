import { Card } from "@/components/shared/card";
import { formatPercent } from "@/lib/financial-utils";

export function RatioCard({
  label,
  value,
  rating,
  benchmark,
}: {
  label: string;
  value: number | null;
  rating: "green" | "yellow" | "red" | "neutral";
  benchmark?: string;
}) {
  const ratingColors = {
    green: "text-green-600 bg-green-50 border-green-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
    red: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-gray-600 bg-gray-50 border-gray-200",
  };

  return (
    <Card className={`border-2 ${ratingColors[rating]}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{formatPercent(value)}</p>
      {benchmark && (
        <p className="mt-1 text-xs text-gray-400">
          Benchmark: {benchmark}
        </p>
      )}
    </Card>
  );
}
