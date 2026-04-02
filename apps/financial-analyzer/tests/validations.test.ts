import { describe, it, expect } from "vitest";
import {
  createEngagementSchema,
  createFindingSchema,
  confirmImportSchema,
  bulkUpdateLineItemsSchema,
  createEbitdaAdjustmentSchema,
} from "../lib/validations";

describe("createEngagementSchema", () => {
  it("validates a correct engagement", () => {
    const result = createEngagementSchema.safeParse({
      name: "Test Engagement",
      clientName: "Test Client",
      type: "DueDiligence",
      startDate: "2024-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createEngagementSchema.safeParse({
      name: "",
      clientName: "Test Client",
      type: "DueDiligence",
      startDate: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = createEngagementSchema.safeParse({
      name: "Test",
      clientName: "Client",
      type: "InvalidType",
      startDate: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields", () => {
    const result = createEngagementSchema.safeParse({
      name: "Test",
      clientName: "Client",
      type: "OrgAssessment",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      scopeDescription: "Full assessment",
    });
    expect(result.success).toBe(true);
  });
});

describe("createFindingSchema", () => {
  it("validates a correct finding", () => {
    const result = createFindingSchema.safeParse({
      engagementId: "abc123",
      category: "Risk",
      severity: "High",
      title: "Margin Decline",
      description: "Gross margin has been declining for 3 years.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid severity", () => {
    const result = createFindingSchema.safeParse({
      engagementId: "abc123",
      category: "Risk",
      severity: "Extreme",
      title: "Test",
      description: "Test desc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = createFindingSchema.safeParse({
      engagementId: "abc123",
      category: "Threat",
      severity: "High",
      title: "Test",
      description: "Test desc",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional evidence line item IDs", () => {
    const result = createFindingSchema.safeParse({
      engagementId: "abc123",
      category: "Anomaly",
      severity: "Medium",
      title: "Spike",
      description: "Revenue spike detected",
      evidenceLineItemIds: ["li1", "li2"],
      financialImpact: 500000,
      tags: "anomaly,revenue",
    });
    expect(result.success).toBe(true);
  });
});

describe("confirmImportSchema", () => {
  it("validates a correct import confirmation", () => {
    const result = confirmImportSchema.safeParse({
      engagementId: "eng1",
      entity: "Acme Corp",
      statementType: "ProfitAndLoss",
      periodType: "Monthly",
      accountNameColumn: "Account",
      periodAmountMappings: [
        { column: "Jan 2024", period: "2024-01" },
        { column: "Feb 2024", period: "2024-02" },
      ],
      rows: [
        { values: { Account: "Revenue", "Jan 2024": 100000, "Feb 2024": 110000 } },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid statement type", () => {
    const result = confirmImportSchema.safeParse({
      engagementId: "eng1",
      entity: "Acme",
      statementType: "IncomeStatement",
      periodType: "Monthly",
      accountNameColumn: "Account",
      periodAmountMappings: [],
      rows: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = confirmImportSchema.safeParse({
      engagementId: "eng1",
    });
    expect(result.success).toBe(false);
  });
});

describe("bulkUpdateLineItemsSchema", () => {
  it("validates correct bulk update", () => {
    const result = bulkUpdateLineItemsSchema.safeParse({
      updates: [
        { id: "li1", standardCategory: "Revenue" },
        { id: "li2", standardCategory: "COGS", subcategory: "Materials" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("allows null standardCategory", () => {
    const result = bulkUpdateLineItemsSchema.safeParse({
      updates: [{ id: "li1", standardCategory: null }],
    });
    expect(result.success).toBe(true);
  });
});

describe("createEbitdaAdjustmentSchema", () => {
  it("validates a correct adjustment", () => {
    const result = createEbitdaAdjustmentSchema.safeParse({
      engagementId: "eng1",
      description: "CEO bonus add-back",
      amount: 150000,
      classification: "OwnerRelated",
      notes: "One-time payment",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid classification", () => {
    const result = createEbitdaAdjustmentSchema.safeParse({
      engagementId: "eng1",
      description: "Test",
      amount: 100,
      classification: "Invalid",
    });
    expect(result.success).toBe(false);
  });

  it("allows negative amounts (for downward adjustments)", () => {
    const result = createEbitdaAdjustmentSchema.safeParse({
      engagementId: "eng1",
      description: "Remove non-recurring gain",
      amount: -50000,
      classification: "NonRecurring",
    });
    expect(result.success).toBe(true);
  });
});
