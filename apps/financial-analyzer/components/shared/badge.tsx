const severityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-blue-100 text-blue-800",
  Informational: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Confirmed: "bg-green-100 text-green-800",
  Disputed: "bg-red-100 text-red-800",
  Resolved: "bg-blue-100 text-blue-800",
  Scoping: "bg-purple-100 text-purple-800",
  DataCollection: "bg-yellow-100 text-yellow-800",
  Analysis: "bg-blue-100 text-blue-800",
  Synthesis: "bg-indigo-100 text-indigo-800",
  Reporting: "bg-green-100 text-green-800",
  Complete: "bg-gray-100 text-gray-800",
};

const categoryColors: Record<string, string> = {
  Risk: "bg-red-100 text-red-800",
  Opportunity: "bg-green-100 text-green-800",
  Observation: "bg-blue-100 text-blue-800",
  Anomaly: "bg-orange-100 text-orange-800",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "severity" | "status" | "category" | "default";
}) {
  const text = typeof children === "string" ? children : "";
  let colorClass = "bg-gray-100 text-gray-700";

  if (variant === "severity" && text in severityColors) {
    colorClass = severityColors[text];
  } else if (variant === "status" && text in statusColors) {
    colorClass = statusColors[text];
  } else if (variant === "category" && text in categoryColors) {
    colorClass = categoryColors[text];
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {children}
    </span>
  );
}
