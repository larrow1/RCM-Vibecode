import { STATUS_LABELS, CATEGORY_LABELS } from "./validations";

export function getStatusLabel(status: string): { label: string; color: string } {
  return STATUS_LABELS[status] || { label: status, color: "bg-gray-100 text-gray-700" };
}

export function getCategoryLabel(slug: string): { name: string; description: string } {
  return CATEGORY_LABELS[slug] || { name: slug, description: "" };
}

export function formatRelativeTime(date: Date | string): string {
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
  return d.toLocaleDateString();
}

export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export type SortOption = "newest" | "most-voted" | "oldest";

export function sortIdeas<
  T extends { votes: number; createdAt: Date | string }
>(ideas: T[], sort: SortOption): T[] {
  const sorted = [...ideas];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "most-voted":
      return sorted.sort((a, b) => b.votes - a.votes);
    default:
      return sorted;
  }
}

export interface IdeaStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  totalVotes: number;
}

export function computeIdeaStats(
  ideas: { status: string; category: string; votes: number }[]
): IdeaStats {
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  let totalVotes = 0;

  for (const idea of ideas) {
    byStatus[idea.status] = (byStatus[idea.status] || 0) + 1;
    byCategory[idea.category] = (byCategory[idea.category] || 0) + 1;
    totalVotes += idea.votes;
  }

  return { total: ideas.length, byStatus, byCategory, totalVotes };
}
