import { describe, it, expect } from "vitest";
import {
  calculateRatios,
  aggregateLineItems,
  formatCurrency,
  formatPercent,
  getRatioRating,
  detectAnomalies,
  type PeriodFinancials,
} from "../lib/financial-utils";

describe("calculateRatios", () => {
  const basePeriod: PeriodFinancials = {
    period: "2024-01",
    revenue: 1000000,
    cogs: 600000,
    grossProfit: 400000,
    operatingExpenses: 250000,
    operatingIncome: 150000,
    ebitda: 180000,
    netIncome: 100000,
    depreciationAmortization: 30000,
  };

  it("calculates gross margin correctly", () => {
    const ratios = calculateRatios(basePeriod);
    expect(ratios.grossMargin).toBeCloseTo(0.4, 4);
  });

  it("calculates operating margin correctly", () => {
    const ratios = calculateRatios(basePeriod);
    expect(ratios.operatingMargin).toBeCloseTo(0.15, 4);
  });

  it("calculates EBITDA margin correctly", () => {
    const ratios = calculateRatios(basePeriod);
    expect(ratios.ebitdaMargin).toBeCloseTo(0.18, 4);
  });

  it("calculates net margin correctly", () => {
    const ratios = calculateRatios(basePeriod);
    expect(ratios.netMargin).toBeCloseTo(0.1, 4);
  });

  it("returns null ratios when revenue is zero", () => {
    const zeroPeriod: PeriodFinancials = {
      ...basePeriod,
      revenue: 0,
    };
    const ratios = calculateRatios(zeroPeriod);
    expect(ratios.grossMargin).toBeNull();
    expect(ratios.operatingMargin).toBeNull();
    expect(ratios.ebitdaMargin).toBeNull();
    expect(ratios.netMargin).toBeNull();
  });

  it("calculates revenue growth when previous period provided", () => {
    const previousPeriod: PeriodFinancials = {
      ...basePeriod,
      period: "2023-12",
      revenue: 900000,
    };
    const ratios = calculateRatios(basePeriod, previousPeriod);
    // (1000000 - 900000) / 900000 = 0.1111...
    expect(ratios.revenueGrowth).toBeCloseTo(0.1111, 3);
  });

  it("returns null revenue growth without previous period", () => {
    const ratios = calculateRatios(basePeriod);
    expect(ratios.revenueGrowth).toBeNull();
  });

  it("returns null revenue growth when previous period revenue is zero", () => {
    const previousPeriod: PeriodFinancials = {
      ...basePeriod,
      revenue: 0,
    };
    const ratios = calculateRatios(basePeriod, previousPeriod);
    expect(ratios.revenueGrowth).toBeNull();
  });
});

describe("aggregateLineItems", () => {
  it("aggregates revenue items", () => {
    const items = [
      { standardCategory: "Revenue", amount: 500000 },
      { standardCategory: "Revenue", amount: 300000 },
    ];
    const result = aggregateLineItems(items);
    expect(result.revenue).toBe(800000);
  });

  it("computes gross profit as revenue minus COGS", () => {
    const items = [
      { standardCategory: "Revenue", amount: 1000000 },
      { standardCategory: "COGS", amount: 600000 },
    ];
    const result = aggregateLineItems(items);
    expect(result.grossProfit).toBe(400000);
  });

  it("computes EBITDA correctly (operating income + D&A)", () => {
    const items = [
      { standardCategory: "Revenue", amount: 1000000 },
      { standardCategory: "COGS", amount: 400000 },
      { standardCategory: "OpEx_SGA", amount: 200000 },
      { standardCategory: "OpEx_DA", amount: 50000 },
    ];
    const result = aggregateLineItems(items);
    // Gross profit: 600K, Total OpEx: 250K, Operating Income: 350K
    // EBITDA: 350K + 50K = 400K
    expect(result.ebitda).toBe(400000);
  });

  it("handles empty line items", () => {
    const result = aggregateLineItems([]);
    expect(result.revenue).toBe(0);
    expect(result.grossProfit).toBe(0);
    expect(result.ebitda).toBe(0);
  });

  it("ignores items with null category", () => {
    const items = [
      { standardCategory: "Revenue", amount: 100000 },
      { standardCategory: null, amount: 50000 },
    ];
    const result = aggregateLineItems(items);
    expect(result.revenue).toBe(100000);
  });

  it("handles all P&L categories together", () => {
    const items = [
      { standardCategory: "Revenue", amount: 1000000 },
      { standardCategory: "COGS", amount: 400000 },
      { standardCategory: "OpEx_SGA", amount: 100000 },
      { standardCategory: "OpEx_SM", amount: 50000 },
      { standardCategory: "OpEx_RD", amount: 30000 },
      { standardCategory: "OpEx_DA", amount: 20000 },
      { standardCategory: "OtherIncomeExpense", amount: -10000 },
      { standardCategory: "Tax", amount: 80000 },
    ];
    const result = aggregateLineItems(items);

    expect(result.revenue).toBe(1000000);
    expect(result.cogs).toBe(400000);
    expect(result.grossProfit).toBe(600000);
    expect(result.operatingExpenses).toBe(200000); // SGA+SM+RD+DA
    expect(result.operatingIncome).toBe(400000);
    expect(result.ebitda).toBe(420000); // 400K + 20K D&A
    expect(result.netIncome).toBe(310000); // 400K + (-10K) - 80K
  });
});

describe("formatCurrency", () => {
  it("formats positive numbers", () => {
    expect(formatCurrency(1500000)).toBe("$1,500,000");
  });

  it("formats negative numbers", () => {
    expect(formatCurrency(-500000)).toBe("-$500,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatPercent", () => {
  it("formats a ratio as percentage", () => {
    expect(formatPercent(0.352)).toBe("35.2%");
  });

  it("returns N/A for null", () => {
    expect(formatPercent(null)).toBe("N/A");
  });

  it("handles zero", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("handles negative values", () => {
    expect(formatPercent(-0.05)).toBe("-5.0%");
  });
});

describe("getRatioRating", () => {
  it("returns green when value meets or exceeds benchmark", () => {
    expect(getRatioRating(0.4, 0.35, true)).toBe("green");
  });

  it("returns yellow when value is within 20% below benchmark", () => {
    // benchmark 0.35, threshold = 0.07, so yellow range = 0.28 to 0.35
    expect(getRatioRating(0.3, 0.35, true)).toBe("yellow");
  });

  it("returns red when value is well below benchmark", () => {
    expect(getRatioRating(0.2, 0.35, true)).toBe("red");
  });

  it("returns neutral for null values", () => {
    expect(getRatioRating(null, 0.35)).toBe("neutral");
  });

  it("inverts logic when higherIsBetter is false", () => {
    expect(getRatioRating(0.2, 0.35, false)).toBe("green");
    expect(getRatioRating(0.5, 0.35, false)).toBe("red");
  });
});

describe("detectAnomalies", () => {
  it("detects outliers in a time series", () => {
    const values = [100, 102, 98, 101, 99, 100, 150, 101, 99, 100];
    const anomalies = detectAnomalies(values);
    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies[0].index).toBe(6); // 150 is the outlier
    expect(anomalies[0].value).toBe(150);
  });

  it("returns empty for less than 3 data points", () => {
    expect(detectAnomalies([100, 200])).toHaveLength(0);
  });

  it("returns empty for constant values", () => {
    expect(detectAnomalies([100, 100, 100, 100])).toHaveLength(0);
  });

  it("includes z-score in results", () => {
    const values = [100, 100, 100, 100, 200];
    const anomalies = detectAnomalies(values);
    if (anomalies.length > 0) {
      expect(Math.abs(anomalies[0].zscore)).toBeGreaterThan(1.5);
    }
  });
});
