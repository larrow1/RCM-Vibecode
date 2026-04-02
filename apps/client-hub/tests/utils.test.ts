import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatCurrency,
  cn,
  STATUS_COLORS,
  ENGAGEMENT_TYPE_LABELS,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2026-03-15"));
    expect(result).toContain("Mar");
    expect(result).toContain("2026");
  });

  it("formats a date string", () => {
    const result = formatDate("2026-06-01");
    expect(result).toContain("Jun");
    expect(result).toContain("2026");
  });

  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("\u2014");
  });

  it("returns dash for undefined", () => {
    expect(formatDate(undefined)).toBe("\u2014");
  });
});

describe("formatCurrency", () => {
  it("formats a number as USD", () => {
    const result = formatCurrency(250000);
    expect(result).toContain("250,000");
    expect(result).toContain("$");
  });

  it("returns dash for null", () => {
    expect(formatCurrency(null)).toBe("\u2014");
  });

  it("returns dash for undefined", () => {
    expect(formatCurrency(undefined)).toBe("\u2014");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("$0");
  });
});

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("returns empty string for no truthy values", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});

describe("constants", () => {
  it("has status colors for all client statuses", () => {
    expect(STATUS_COLORS.Prospect).toBeDefined();
    expect(STATUS_COLORS.Active).toBeDefined();
    expect(STATUS_COLORS.Inactive).toBeDefined();
  });

  it("has status colors for all engagement statuses", () => {
    expect(STATUS_COLORS.Lead).toBeDefined();
    expect(STATUS_COLORS.Proposal).toBeDefined();
    expect(STATUS_COLORS.Delivered).toBeDefined();
    expect(STATUS_COLORS.Closed).toBeDefined();
  });

  it("has type labels for all engagement types", () => {
    expect(ENGAGEMENT_TYPE_LABELS.TM).toBe("T&M");
    expect(ENGAGEMENT_TYPE_LABELS.FixedFee).toBe("Fixed Fee");
    expect(ENGAGEMENT_TYPE_LABELS.Retainer).toBe("Retainer");
    expect(ENGAGEMENT_TYPE_LABELS.ValueBased).toBe("Value-Based");
  });
});
