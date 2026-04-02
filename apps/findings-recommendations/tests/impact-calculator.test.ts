import { describe, it, expect } from "vitest";
import {
  calculateImpact,
  getQuadrant,
  computeImpactThreshold,
  CONFIDENCE_MULTIPLIERS,
  EFFORT_DIVISORS,
} from "../lib/impact-calculator";

describe("calculateImpact", () => {
  it("calculates impact with high confidence and low effort", () => {
    const result = calculateImpact({
      impactBase: 1000000,
      impactAdjPct: 10,
      impactConfidence: "High",
      effort: "Low",
    });
    expect(result.calculatedImpact).toBe(100000); // 1M * 10%
    expect(result.confidenceMultiplier).toBe(1.0);
    expect(result.weightedImpact).toBe(100000);
    expect(result.effortDivisor).toBe(1);
    expect(result.priorityScore).toBe(100000);
  });

  it("applies medium confidence multiplier", () => {
    const result = calculateImpact({
      impactBase: 500000,
      impactAdjPct: 20,
      impactConfidence: "Medium",
      effort: "Low",
    });
    expect(result.calculatedImpact).toBe(100000);
    expect(result.weightedImpact).toBe(70000); // 100k * 0.7
  });

  it("applies low confidence multiplier", () => {
    const result = calculateImpact({
      impactBase: 200000,
      impactAdjPct: 50,
      impactConfidence: "Low",
      effort: "Low",
    });
    expect(result.calculatedImpact).toBe(100000);
    expect(result.weightedImpact).toBe(40000); // 100k * 0.4
  });

  it("divides by effort for priority score", () => {
    const result = calculateImpact({
      impactBase: 300000,
      impactAdjPct: 100,
      impactConfidence: "High",
      effort: "High",
    });
    expect(result.weightedImpact).toBe(300000);
    expect(result.effortDivisor).toBe(3);
    expect(result.priorityScore).toBe(100000);
  });

  it("handles medium effort", () => {
    const result = calculateImpact({
      impactBase: 200000,
      impactAdjPct: 100,
      impactConfidence: "High",
      effort: "Medium",
    });
    expect(result.priorityScore).toBe(100000); // 200k / 2
  });
});

describe("getQuadrant", () => {
  it("returns Quick Win for high impact, low effort", () => {
    expect(getQuadrant(150000, "Low", 100000)).toBe("Quick Win");
  });

  it("returns Strategic Initiative for high impact, high effort", () => {
    expect(getQuadrant(150000, "High", 100000)).toBe("Strategic Initiative");
  });

  it("returns Fill-in for low impact, low effort", () => {
    expect(getQuadrant(50000, "Low", 100000)).toBe("Fill-in");
  });

  it("returns Deprioritize for low impact, high effort", () => {
    expect(getQuadrant(50000, "High", 100000)).toBe("Deprioritize");
  });

  it("treats Medium effort as high effort", () => {
    expect(getQuadrant(150000, "Medium", 100000)).toBe("Strategic Initiative");
  });

  it("uses exact threshold as high impact", () => {
    expect(getQuadrant(100000, "Low", 100000)).toBe("Quick Win");
  });

  it("uses just below threshold as low impact", () => {
    expect(getQuadrant(99999, "Low", 100000)).toBe("Fill-in");
  });
});

describe("computeImpactThreshold", () => {
  it("returns median of odd-length array", () => {
    expect(computeImpactThreshold([10, 20, 30])).toBe(20);
  });

  it("returns average of middle two for even-length array", () => {
    expect(computeImpactThreshold([10, 20, 30, 40])).toBe(25);
  });

  it("returns 0 for empty array", () => {
    expect(computeImpactThreshold([])).toBe(0);
  });

  it("returns the single value for single-element array", () => {
    expect(computeImpactThreshold([42])).toBe(42);
  });

  it("sorts before computing median", () => {
    expect(computeImpactThreshold([30, 10, 20])).toBe(20);
  });
});

describe("constants", () => {
  it("has correct confidence multipliers", () => {
    expect(CONFIDENCE_MULTIPLIERS.High).toBe(1.0);
    expect(CONFIDENCE_MULTIPLIERS.Medium).toBe(0.7);
    expect(CONFIDENCE_MULTIPLIERS.Low).toBe(0.4);
  });

  it("has correct effort divisors", () => {
    expect(EFFORT_DIVISORS.Low).toBe(1);
    expect(EFFORT_DIVISORS.Medium).toBe(2);
    expect(EFFORT_DIVISORS.High).toBe(3);
  });
});
