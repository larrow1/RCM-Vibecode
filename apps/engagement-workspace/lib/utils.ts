import { DATA_REQUEST_CATEGORIES, WORKSTREAMS } from "./schemas";

/**
 * Map data request categories to workstreams.
 * Financial -> Financial, Organizational -> Organizational, Contracts -> Contracts.
 * Other categories (Operational, Legal, IT) don't map to a specific workstream.
 */
export function categoryToWorkstream(
  category: string
): (typeof WORKSTREAMS)[number] | null {
  const mapping: Record<string, (typeof WORKSTREAMS)[number]> = {
    Financial: "Financial",
    Organizational: "Organizational",
    Contracts: "Contracts",
  };
  return mapping[category] ?? null;
}

/**
 * Compute workstream progress from data requests.
 * Returns { workstream, received, total, percentage } for each workstream.
 */
export function computeWorkstreamProgress(
  dataRequests: Array<{ category: string; status: string }>
) {
  const workstreams = WORKSTREAMS.map((ws) => {
    const categoryMap: Record<string, string[]> = {
      Financial: ["Financial"],
      Organizational: ["Organizational"],
      Contracts: ["Contracts"],
    };
    const relevantCategories = categoryMap[ws] || [];
    const items = dataRequests.filter((dr) =>
      relevantCategories.includes(dr.category)
    );
    const received = items.filter(
      (dr) => dr.status === "Received" || dr.status === "NotAvailable"
    ).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((received / total) * 100) : 0;
    return { workstream: ws, received, total, percentage };
  });
  return workstreams;
}

/**
 * Determine if a data request is overdue.
 * Overdue = past dueDate AND status is not Received or NotAvailable.
 */
export function isDataRequestOverdue(dataRequest: {
  status: string;
  dueDate: string | Date | null;
}): boolean {
  if (!dataRequest.dueDate) return false;
  if (
    dataRequest.status === "Received" ||
    dataRequest.status === "NotAvailable"
  )
    return false;
  const due = new Date(dataRequest.dueDate);
  const now = new Date();
  return due < now;
}

/**
 * Compute overall data request progress stats.
 */
export function computeDataRequestStats(
  dataRequests: Array<{ status: string; dueDate: string | Date | null }>
) {
  const total = dataRequests.length;
  const received = dataRequests.filter(
    (dr) => dr.status === "Received"
  ).length;
  const partiallyReceived = dataRequests.filter(
    (dr) => dr.status === "PartiallyReceived"
  ).length;
  const overdue = dataRequests.filter((dr) => isDataRequestOverdue(dr)).length;
  const notAvailable = dataRequests.filter(
    (dr) => dr.status === "NotAvailable"
  ).length;
  const outstanding = total - received - notAvailable;
  const percentage = total > 0 ? Math.round((received / total) * 100) : 0;

  return {
    total,
    received,
    partiallyReceived,
    overdue,
    notAvailable,
    outstanding,
    percentage,
  };
}

/**
 * Format a date for display.
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
}

/**
 * Get status color classes for engagement status.
 */
export function getEngagementStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Scoping: "bg-purple-100 text-purple-800",
    DataCollection: "bg-yellow-100 text-yellow-800",
    Analysis: "bg-blue-100 text-blue-800",
    Synthesis: "bg-indigo-100 text-indigo-800",
    Reporting: "bg-orange-100 text-orange-800",
    Complete: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Get status color classes for data request status.
 */
export function getDataRequestStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Requested: "bg-gray-100 text-gray-800",
    Received: "bg-green-100 text-green-800",
    PartiallyReceived: "bg-yellow-100 text-yellow-800",
    Overdue: "bg-red-100 text-red-800",
    NotAvailable: "bg-slate-100 text-slate-500",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Get priority color classes.
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    Critical: "bg-red-100 text-red-800",
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-gray-100 text-gray-600",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
}

/**
 * Valid engagement status transitions.
 */
export const ENGAGEMENT_STATUS_ORDER = [
  "Scoping",
  "DataCollection",
  "Analysis",
  "Synthesis",
  "Reporting",
  "Complete",
] as const;

export function getNextEngagementStatus(
  currentStatus: string
): string | null {
  const idx = ENGAGEMENT_STATUS_ORDER.indexOf(
    currentStatus as (typeof ENGAGEMENT_STATUS_ORDER)[number]
  );
  if (idx === -1 || idx === ENGAGEMENT_STATUS_ORDER.length - 1) return null;
  return ENGAGEMENT_STATUS_ORDER[idx + 1];
}

export function getPreviousEngagementStatus(
  currentStatus: string
): string | null {
  const idx = ENGAGEMENT_STATUS_ORDER.indexOf(
    currentStatus as (typeof ENGAGEMENT_STATUS_ORDER)[number]
  );
  if (idx <= 0) return null;
  return ENGAGEMENT_STATUS_ORDER[idx - 1];
}
