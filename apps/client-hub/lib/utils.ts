export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const CLIENT_STATUSES = ["Prospect", "Active", "Inactive"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const ENGAGEMENT_STATUSES = ["Lead", "Proposal", "Active", "Delivered", "Closed"] as const;
export type EngagementStatus = (typeof ENGAGEMENT_STATUSES)[number];

export const ENGAGEMENT_TYPES = ["TM", "FixedFee", "Retainer", "ValueBased"] as const;
export type EngagementType = (typeof ENGAGEMENT_TYPES)[number];

export const ENGAGEMENT_TYPE_LABELS: Record<string, string> = {
  TM: "T&M",
  FixedFee: "Fixed Fee",
  Retainer: "Retainer",
  ValueBased: "Value-Based",
};

export const STATUS_COLORS: Record<string, string> = {
  // Client statuses
  Prospect: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-600",
  // Engagement statuses
  Lead: "bg-purple-100 text-purple-800",
  Proposal: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-teal-100 text-teal-800",
  Closed: "bg-gray-100 text-gray-600",
};
