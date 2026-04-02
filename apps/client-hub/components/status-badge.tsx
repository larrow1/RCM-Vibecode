import { STATUS_COLORS, ENGAGEMENT_TYPE_LABELS } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {status}
    </span>
  );
}

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const label = ENGAGEMENT_TYPE_LABELS[type] || type;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ${className}`}>
      {label}
    </span>
  );
}
