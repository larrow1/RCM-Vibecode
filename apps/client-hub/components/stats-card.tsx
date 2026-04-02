interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatsCard({ title, value, subtitle, color = "blue" }: StatsCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    yellow: "border-yellow-200 bg-yellow-50",
    gray: "border-gray-200 bg-gray-50",
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color] || colorClasses.blue}`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
