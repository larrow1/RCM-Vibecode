import { describe, it, expect } from "vitest";
import {
  getStatusLabel,
  getCategoryLabel,
  formatRelativeTime,
  parseTags,
  sortIdeas,
  computeIdeaStats,
} from "@/lib/idea-utils";

describe("getStatusLabel", () => {
  it("returns correct label for known statuses", () => {
    expect(getStatusLabel("submitted").label).toBe("Submitted");
    expect(getStatusLabel("under-review").label).toBe("Under Review");
    expect(getStatusLabel("shipped").label).toBe("Shipped");
    expect(getStatusLabel("declined").label).toBe("Declined");
    expect(getStatusLabel("researching").label).toBe("Researching");
    expect(getStatusLabel("in-development").label).toBe("In Development");
  });

  it("returns fallback for unknown status", () => {
    expect(getStatusLabel("unknown").label).toBe("unknown");
  });

  it("includes color classes", () => {
    const status = getStatusLabel("shipped");
    expect(status.color).toContain("bg-green");
  });
});

describe("getCategoryLabel", () => {
  it("returns correct label for known categories", () => {
    expect(getCategoryLabel("evidence-collection").name).toBe("Evidence Collection");
    expect(getCategoryLabel("pattern-recognition").name).toBe("Pattern Recognition");
    expect(getCategoryLabel("communication-delivery").name).toBe("Communication & Delivery");
  });

  it("returns slug for unknown category", () => {
    expect(getCategoryLabel("unknown-cat").name).toBe("unknown-cat");
  });

  it("includes description", () => {
    const cat = getCategoryLabel("cross-domain-synthesis");
    expect(cat.description).toContain("Connecting");
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for very recent dates", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("just now");
  });

  it("returns minutes for recent dates", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000);
    expect(formatRelativeTime(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours for same-day dates", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000);
    expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");
  });

  it("returns days for recent dates", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000);
    expect(formatRelativeTime(fiveDaysAgo)).toBe("5d ago");
  });

  it("handles string dates", () => {
    const recent = new Date(Date.now() - 60000).toISOString();
    expect(formatRelativeTime(recent)).toBe("1m ago");
  });
});

describe("parseTags", () => {
  it("splits comma-separated tags", () => {
    expect(parseTags("ai,financial,automation")).toEqual(["ai", "financial", "automation"]);
  });

  it("trims whitespace", () => {
    expect(parseTags(" ai , financial , automation ")).toEqual(["ai", "financial", "automation"]);
  });

  it("returns empty array for null/undefined", () => {
    expect(parseTags(null)).toEqual([]);
    expect(parseTags(undefined)).toEqual([]);
    expect(parseTags("")).toEqual([]);
  });

  it("filters empty strings", () => {
    expect(parseTags("ai,,financial")).toEqual(["ai", "financial"]);
  });
});

describe("sortIdeas", () => {
  const ideas = [
    { votes: 5, createdAt: "2026-01-01" },
    { votes: 15, createdAt: "2026-03-01" },
    { votes: 10, createdAt: "2026-02-01" },
  ];

  it("sorts by newest first", () => {
    const sorted = sortIdeas(ideas, "newest");
    expect(sorted[0].votes).toBe(15); // March
    expect(sorted[2].votes).toBe(5); // January
  });

  it("sorts by oldest first", () => {
    const sorted = sortIdeas(ideas, "oldest");
    expect(sorted[0].votes).toBe(5); // January
    expect(sorted[2].votes).toBe(15); // March
  });

  it("sorts by most voted", () => {
    const sorted = sortIdeas(ideas, "most-voted");
    expect(sorted[0].votes).toBe(15);
    expect(sorted[2].votes).toBe(5);
  });

  it("does not mutate original array", () => {
    const original = [...ideas];
    sortIdeas(ideas, "most-voted");
    expect(ideas).toEqual(original);
  });
});

describe("computeIdeaStats", () => {
  const ideas = [
    { status: "submitted", category: "pattern-recognition", votes: 10 },
    { status: "submitted", category: "pattern-recognition", votes: 5 },
    { status: "under-review", category: "evidence-collection", votes: 8 },
    { status: "shipped", category: "communication-delivery", votes: 20 },
  ];

  it("computes total count", () => {
    expect(computeIdeaStats(ideas).total).toBe(4);
  });

  it("computes total votes", () => {
    expect(computeIdeaStats(ideas).totalVotes).toBe(43);
  });

  it("groups by status", () => {
    const stats = computeIdeaStats(ideas);
    expect(stats.byStatus["submitted"]).toBe(2);
    expect(stats.byStatus["under-review"]).toBe(1);
    expect(stats.byStatus["shipped"]).toBe(1);
  });

  it("groups by category", () => {
    const stats = computeIdeaStats(ideas);
    expect(stats.byCategory["pattern-recognition"]).toBe(2);
    expect(stats.byCategory["evidence-collection"]).toBe(1);
  });

  it("handles empty array", () => {
    const stats = computeIdeaStats([]);
    expect(stats.total).toBe(0);
    expect(stats.totalVotes).toBe(0);
  });
});
