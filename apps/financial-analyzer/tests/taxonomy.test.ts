import { describe, it, expect } from "vitest";
import {
  suggestCategory,
  getCategoryLabel,
  STANDARD_TAXONOMY,
  CATEGORY_KEYS,
} from "../lib/taxonomy";

describe("suggestCategory", () => {
  it("matches revenue keywords", () => {
    expect(suggestCategory("Product Revenue")).toBe("Revenue");
    expect(suggestCategory("Net Sales")).toBe("Revenue");
    expect(suggestCategory("Service Revenue")).toBe("Revenue");
    expect(suggestCategory("Subscription Revenue")).toBe("Revenue");
  });

  it("matches COGS keywords", () => {
    expect(suggestCategory("Cost of Goods Sold")).toBe("COGS");
    expect(suggestCategory("Cost of Revenue")).toBe("COGS");
    expect(suggestCategory("Direct Materials")).toBe("COGS");
  });

  it("matches SG&A keywords", () => {
    expect(suggestCategory("Salaries & Wages")).toBe("OpEx_SGA");
    expect(suggestCategory("Employee Benefits")).toBe("OpEx_SGA");
    expect(suggestCategory("Rent & Facilities")).toBe("OpEx_SGA");
    expect(suggestCategory("Professional Fees")).toBe("OpEx_SGA");
    expect(suggestCategory("Insurance Expense")).toBe("OpEx_SGA");
  });

  it("matches Sales & Marketing keywords", () => {
    expect(suggestCategory("Advertising Expense")).toBe("OpEx_SM");
    expect(suggestCategory("Sales Commissions")).toBe("OpEx_SM");
    expect(suggestCategory("Marketing Programs")).toBe("OpEx_SM");
  });

  it("matches R&D keywords", () => {
    expect(suggestCategory("Research & Development")).toBe("OpEx_RD");
    expect(suggestCategory("Product Development Costs")).toBe("OpEx_RD");
  });

  it("matches D&A keywords", () => {
    expect(suggestCategory("Depreciation Expense")).toBe("OpEx_DA");
    expect(suggestCategory("Amortization of Intangibles")).toBe("OpEx_DA");
  });

  it("matches other income/expense keywords", () => {
    expect(suggestCategory("Interest Income")).toBe("OtherIncomeExpense");
    expect(suggestCategory("Interest Expense")).toBe("OtherIncomeExpense");
  });

  it("matches tax keywords", () => {
    expect(suggestCategory("Income Tax Expense")).toBe("Tax");
    expect(suggestCategory("Tax Provision")).toBe("Tax");
  });

  it("returns null for unrecognized accounts", () => {
    expect(suggestCategory("Miscellaneous Item XYZ")).toBeNull();
    expect(suggestCategory("")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(suggestCategory("PRODUCT REVENUE")).toBe("Revenue");
    expect(suggestCategory("cost of goods sold")).toBe("COGS");
  });

  it("prefers longer (more specific) keyword matches", () => {
    // "interest income" is longer than "income" or "interest"
    expect(suggestCategory("Interest Income")).toBe("OtherIncomeExpense");
  });
});

describe("getCategoryLabel", () => {
  it("returns label for valid key", () => {
    expect(getCategoryLabel("Revenue")).toBe("Revenue");
    expect(getCategoryLabel("COGS")).toBe("Cost of Goods Sold");
    expect(getCategoryLabel("OpEx_SGA")).toBe("SG&A Expenses");
    expect(getCategoryLabel("OpEx_SM")).toBe("Sales & Marketing");
    expect(getCategoryLabel("OpEx_RD")).toBe("Research & Development");
  });

  it("returns the key itself for unknown categories", () => {
    expect(getCategoryLabel("Unknown")).toBe("Unknown");
  });
});

describe("STANDARD_TAXONOMY", () => {
  it("has all expected categories", () => {
    const keys = STANDARD_TAXONOMY.map((c) => c.key);
    expect(keys).toContain("Revenue");
    expect(keys).toContain("COGS");
    expect(keys).toContain("OpEx_SGA");
    expect(keys).toContain("OpEx_SM");
    expect(keys).toContain("OpEx_RD");
    expect(keys).toContain("OpEx_DA");
    expect(keys).toContain("OtherIncomeExpense");
    expect(keys).toContain("Tax");
    expect(keys).toContain("NetIncome");
  });

  it("exports CATEGORY_KEYS matching taxonomy", () => {
    expect(CATEGORY_KEYS.length).toBe(STANDARD_TAXONOMY.length);
  });

  it("each category has keywords array", () => {
    for (const cat of STANDARD_TAXONOMY) {
      expect(Array.isArray(cat.keywords)).toBe(true);
      expect(cat.keywords.length).toBeGreaterThan(0);
    }
  });
});
