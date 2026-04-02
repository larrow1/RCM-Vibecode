import { describe, it, expect } from "vitest";
import {
  categoryToWorkstream,
  computeWorkstreamProgress,
  isDataRequestOverdue,
  computeDataRequestStats,
  formatDate,
  getEngagementStatusColor,
  getDataRequestStatusColor,
  getNextEngagementStatus,
  getPreviousEngagementStatus,
} from "../lib/utils";

describe("categoryToWorkstream", () => {
  it("maps Financial to Financial", () => {
    expect(categoryToWorkstream("Financial")).toBe("Financial");
  });
  it("maps Organizational to Organizational", () => {
    expect(categoryToWorkstream("Organizational")).toBe("Organizational");
  });
  it("maps Contracts to Contracts", () => {
    expect(categoryToWorkstream("Contracts")).toBe("Contracts");
  });
  it("returns null for unmapped categories", () => {
    expect(categoryToWorkstream("Operational")).toBeNull();
    expect(categoryToWorkstream("Legal")).toBeNull();
    expect(categoryToWorkstream("IT")).toBeNull();
  });
});

describe("computeWorkstreamProgress", () => {
  it("calculates progress for each workstream", () => {
    const dataRequests = [
      { category: "Financial", status: "Received" },
      { category: "Financial", status: "Requested" },
      { category: "Financial", status: "Received" },
      { category: "Organizational", status: "Received" },
      { category: "Organizational", status: "Requested" },
      { category: "Contracts", status: "NotAvailable" },
    ];
    const result = computeWorkstreamProgress(dataRequests);
    expect(result).toHaveLength(3);

    const financial = result.find((r) => r.workstream === "Financial")!;
    expect(financial.received).toBe(2);
    expect(financial.total).toBe(3);
    expect(financial.percentage).toBe(67);

    const org = result.find((r) => r.workstream === "Organizational")!;
    expect(org.received).toBe(1);
    expect(org.total).toBe(2);
    expect(org.percentage).toBe(50);

    const contracts = result.find((r) => r.workstream === "Contracts")!;
    expect(contracts.received).toBe(1); // NotAvailable counts as resolved
    expect(contracts.total).toBe(1);
    expect(contracts.percentage).toBe(100);
  });

  it("returns 0% for empty workstreams", () => {
    const result = computeWorkstreamProgress([]);
    expect(result.every((r) => r.percentage === 0)).toBe(true);
    expect(result.every((r) => r.total === 0)).toBe(true);
  });
});

describe("isDataRequestOverdue", () => {
  it("returns false when no dueDate", () => {
    expect(isDataRequestOverdue({ status: "Requested", dueDate: null })).toBe(false);
  });
  it("returns false when status is Received", () => {
    expect(isDataRequestOverdue({ status: "Received", dueDate: "2020-01-01" })).toBe(false);
  });
  it("returns false when status is NotAvailable", () => {
    expect(isDataRequestOverdue({ status: "NotAvailable", dueDate: "2020-01-01" })).toBe(false);
  });
  it("returns true when past due and still Requested", () => {
    expect(isDataRequestOverdue({ status: "Requested", dueDate: "2020-01-01" })).toBe(true);
  });
  it("returns false when due date is in the future", () => {
    const futureDate = new Date(Date.now() + 86400000 * 30).toISOString();
    expect(isDataRequestOverdue({ status: "Requested", dueDate: futureDate })).toBe(false);
  });
});

describe("computeDataRequestStats", () => {
  it("computes all stats correctly", () => {
    const dataRequests = [
      { status: "Received", dueDate: null },
      { status: "Received", dueDate: null },
      { status: "Requested", dueDate: "2020-01-01" }, // overdue
      { status: "PartiallyReceived", dueDate: null },
      { status: "NotAvailable", dueDate: null },
    ];
    const stats = computeDataRequestStats(dataRequests);
    expect(stats.total).toBe(5);
    expect(stats.received).toBe(2);
    expect(stats.partiallyReceived).toBe(1);
    expect(stats.overdue).toBe(1);
    expect(stats.notAvailable).toBe(1);
    expect(stats.outstanding).toBe(2); // total - received - notAvailable
    expect(stats.percentage).toBe(40); // 2/5
  });

  it("handles empty array", () => {
    const stats = computeDataRequestStats([]);
    expect(stats.total).toBe(0);
    expect(stats.percentage).toBe(0);
  });
});

describe("formatDate", () => {
  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("—");
  });
  it("formats a date string", () => {
    const result = formatDate("2026-03-15");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

describe("status color helpers", () => {
  it("returns color for known engagement status", () => {
    expect(getEngagementStatusColor("Analysis")).toContain("blue");
    expect(getEngagementStatusColor("Complete")).toContain("green");
  });
  it("returns gray for unknown status", () => {
    expect(getEngagementStatusColor("Unknown")).toContain("gray");
  });
  it("returns color for known data request status", () => {
    expect(getDataRequestStatusColor("Received")).toContain("green");
    expect(getDataRequestStatusColor("Overdue")).toContain("red");
  });
});

describe("engagement status transitions", () => {
  it("gets next status", () => {
    expect(getNextEngagementStatus("Scoping")).toBe("DataCollection");
    expect(getNextEngagementStatus("Analysis")).toBe("Synthesis");
  });
  it("returns null at end", () => {
    expect(getNextEngagementStatus("Complete")).toBeNull();
  });
  it("gets previous status", () => {
    expect(getPreviousEngagementStatus("DataCollection")).toBe("Scoping");
    expect(getPreviousEngagementStatus("Synthesis")).toBe("Analysis");
  });
  it("returns null at start", () => {
    expect(getPreviousEngagementStatus("Scoping")).toBeNull();
  });
  it("returns null for unknown status", () => {
    expect(getNextEngagementStatus("Bogus")).toBeNull();
    expect(getPreviousEngagementStatus("Bogus")).toBeNull();
  });
});

describe("schema validation", async () => {
  const { createEngagementSchema, createDataRequestSchema, createDocumentSchema, createTeamMemberSchema, bulkUpdateDataRequestSchema } = await import("../lib/schemas");

  it("validates a good engagement", () => {
    const result = createEngagementSchema.safeParse({
      name: "Acme Assessment",
      clientName: "Acme Corp",
      type: "DueDiligence",
      startDate: "2026-04-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects engagement with missing name", () => {
    const result = createEngagementSchema.safeParse({
      name: "",
      clientName: "Acme",
      type: "DueDiligence",
      startDate: "2026-04-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects engagement with invalid type", () => {
    const result = createEngagementSchema.safeParse({
      name: "Test",
      clientName: "Acme",
      type: "InvalidType",
      startDate: "2026-04-01",
    });
    expect(result.success).toBe(false);
  });

  it("validates a good data request", () => {
    const result = createDataRequestSchema.safeParse({
      category: "Financial",
      description: "P&L for FY2024",
    });
    expect(result.success).toBe(true);
  });

  it("validates bulk update schema", () => {
    const result = bulkUpdateDataRequestSchema.safeParse({
      ids: ["id1", "id2"],
      status: "Received",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bulk update with empty ids", () => {
    const result = bulkUpdateDataRequestSchema.safeParse({
      ids: [],
      status: "Received",
    });
    expect(result.success).toBe(false);
  });

  it("validates a good document", () => {
    const result = createDocumentSchema.safeParse({
      fileName: "acme-pl-2024.xlsx",
      fileType: "Excel",
      category: "FinancialStatement",
    });
    expect(result.success).toBe(true);
  });

  it("validates a good team member", () => {
    const result = createTeamMemberSchema.safeParse({
      name: "Rachel Chen",
      role: "Financial Analyst",
      email: "rachel@firm.com",
    });
    expect(result.success).toBe(true);
  });
});
