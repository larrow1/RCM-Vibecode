export type ConfidenceLevel = "High" | "Medium" | "Low";
export type EffortLevel = "Low" | "Medium" | "High";

export const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  High: 1.0,
  Medium: 0.7,
  Low: 0.4,
};

export const EFFORT_DIVISORS: Record<EffortLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export interface ImpactInput {
  impactBase: number;
  impactAdjPct: number;
  impactConfidence: ConfidenceLevel;
  effort: EffortLevel;
}

export interface ImpactResult {
  calculatedImpact: number;
  confidenceMultiplier: number;
  weightedImpact: number;
  effortDivisor: number;
  priorityScore: number;
}

export function calculateImpact(input: ImpactInput): ImpactResult {
  const calculatedImpact = input.impactBase * (input.impactAdjPct / 100);
  const confidenceMultiplier = CONFIDENCE_MULTIPLIERS[input.impactConfidence];
  const weightedImpact = calculatedImpact * confidenceMultiplier;
  const effortDivisor = EFFORT_DIVISORS[input.effort];
  const priorityScore = weightedImpact / effortDivisor;

  return {
    calculatedImpact,
    confidenceMultiplier,
    weightedImpact,
    effortDivisor,
    priorityScore,
  };
}

export type Quadrant = "Quick Win" | "Strategic Initiative" | "Fill-in" | "Deprioritize";

export function getQuadrant(
  weightedImpact: number,
  effort: EffortLevel,
  impactThreshold: number
): Quadrant {
  const isHighImpact = weightedImpact >= impactThreshold;
  const isHighEffort = EFFORT_DIVISORS[effort] >= 2;

  if (isHighImpact && !isHighEffort) return "Quick Win";
  if (isHighImpact && isHighEffort) return "Strategic Initiative";
  if (!isHighImpact && !isHighEffort) return "Fill-in";
  return "Deprioritize";
}

export function computeImpactThreshold(weightedImpacts: number[]): number {
  if (weightedImpacts.length === 0) return 0;
  const sorted = [...weightedImpacts].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
