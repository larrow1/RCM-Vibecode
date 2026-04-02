import { describe, it, expect } from "vitest";
import {
  createFindingSchema,
  updateFindingSchema,
  createFindingLinkSchema,
  createRecommendationSchema,
  updateRecommendationSchema,
  createThemeSchema,
  impactCalculationSchema,
  evidenceSchema,
} from "../lib/validations";

describe("evidenceSchema", () => {
  it("validates valid evidence", () => {
    const result = evidenceSchema.safeParse({
      description: "Revenue declined 15% in Q3",
      sourceType: "FinancialStatement",
      sourceRef: "stmt-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty description", () => {
    const result = evidenceSchema.safeParse({ description: "" });
    expect(result.success).toBe(false);
  });

  it("allows optional sourceType and sourceRef", () => {
    const result = evidenceSchema.safeParse({ description: "Some observation" });
    expect(result.success).toBe(true);
  });
});

describe("createFindingSchema", () => {
  const validFinding = {
    engagementId: "eng-1",
    workstream: "Financial" as const,
    category: "Risk" as const,
    severity: "High" as const,
    title: "Revenue concentration risk",
    description: "Top 3 customers account for 80% of revenue",
  };

  it("validates a valid finding", () => {
    expect(createFindingSchema.safeParse(validFinding).success).toBe(true);
  });

  it("rejects missing title", () => {
    expect(createFindingSchema.safeParse({ ...validFinding, title: "" }).success).toBe(false);
  });

  it("rejects invalid workstream", () => {
    expect(createFindingSchema.safeParse({ ...validFinding, workstream: "Invalid" }).success).toBe(false);
  });

  it("rejects invalid severity", () => {
    expect(createFindingSchema.safeParse({ ...validFinding, severity: "Super" }).success).toBe(false);
  });

  it("accepts evidence array", () => {
    const result = createFindingSchema.safeParse({
      ...validFinding,
      evidence: [{ description: "P&L line item", sourceType: "FinancialStatement" }],
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to Draft", () => {
    const result = createFindingSchema.safeParse(validFinding);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("Draft");
  });

  it("accepts optional financialImpact", () => {
    const result = createFindingSchema.safeParse({ ...validFinding, financialImpact: 500000 });
    expect(result.success).toBe(true);
  });
});

describe("updateFindingSchema", () => {
  it("allows partial updates", () => {
    expect(updateFindingSchema.safeParse({ title: "Updated title" }).success).toBe(true);
    expect(updateFindingSchema.safeParse({ severity: "Critical" }).success).toBe(true);
  });
});

describe("createFindingLinkSchema", () => {
  it("validates valid link", () => {
    const result = createFindingLinkSchema.safeParse({
      toFindingId: "finding-2",
      description: "Related cost issue",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing toFindingId", () => {
    expect(createFindingLinkSchema.safeParse({ toFindingId: "" }).success).toBe(false);
  });
});

describe("createRecommendationSchema", () => {
  const validRec = {
    engagementId: "eng-1",
    title: "Consolidate IT vendors",
    description: "Merge 5 IT support contracts into single MSA",
    type: "CostReduction" as const,
    findingIds: ["finding-1", "finding-2"],
  };

  it("validates a valid recommendation", () => {
    expect(createRecommendationSchema.safeParse(validRec).success).toBe(true);
  });

  it("requires at least one findingId", () => {
    expect(createRecommendationSchema.safeParse({ ...validRec, findingIds: [] }).success).toBe(false);
  });

  it("rejects invalid type", () => {
    expect(createRecommendationSchema.safeParse({ ...validRec, type: "Bogus" }).success).toBe(false);
  });

  it("accepts full impact fields", () => {
    const result = createRecommendationSchema.safeParse({
      ...validRec,
      impactBase: 1000000,
      impactAdjPct: 15,
      impactConfidence: "High",
      effort: "Medium",
      timeframe: "ShortTerm",
    });
    expect(result.success).toBe(true);
  });

  it("rejects impactAdjPct over 100", () => {
    const result = createRecommendationSchema.safeParse({
      ...validRec,
      impactAdjPct: 150,
    });
    expect(result.success).toBe(false);
  });
});

describe("createThemeSchema", () => {
  it("validates valid theme", () => {
    const result = createThemeSchema.safeParse({
      engagementId: "eng-1",
      name: "Cost Structure Issues",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createThemeSchema.safeParse({
      engagementId: "eng-1",
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("defaults color", () => {
    const result = createThemeSchema.safeParse({
      engagementId: "eng-1",
      name: "Test Theme",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.color).toBe("#3B82F6");
  });
});

describe("impactCalculationSchema", () => {
  it("validates valid input", () => {
    const result = impactCalculationSchema.safeParse({
      impactBase: 500000,
      impactAdjPct: 20,
      impactConfidence: "Medium",
      effort: "Low",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative impactBase", () => {
    const result = impactCalculationSchema.safeParse({
      impactBase: -100,
      impactAdjPct: 10,
      impactConfidence: "High",
      effort: "Low",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence", () => {
    const result = impactCalculationSchema.safeParse({
      impactBase: 100,
      impactAdjPct: 10,
      impactConfidence: "VeryHigh",
      effort: "Low",
    });
    expect(result.success).toBe(false);
  });
});
