import { NextResponse } from "next/server";
import { impactCalculationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import {
  calculateImpact,
  getQuadrant,
  computeImpactThreshold,
  CONFIDENCE_MULTIPLIERS,
  type ConfidenceLevel,
  type EffortLevel,
} from "@/lib/impact-calculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = impactCalculationSchema.parse(body);

    const result = calculateImpact({
      impactBase: validated.impactBase,
      impactAdjPct: validated.impactAdjPct,
      impactConfidence: validated.impactConfidence as ConfidenceLevel,
      effort: validated.effort as EffortLevel,
    });

    // Compute threshold from all existing recommendations' weighted impacts
    const allRecs = await prisma.recommendation.findMany({
      where: {
        impactBase: { not: null },
        impactAdjPct: { not: null },
        impactConfidence: { not: null },
      },
      select: { impactBase: true, impactAdjPct: true, impactConfidence: true },
    });

    const allWeightedImpacts = allRecs
      .map((r) => {
        const base = r.impactBase ?? 0;
        const adj = r.impactAdjPct ?? 0;
        const conf = CONFIDENCE_MULTIPLIERS[(r.impactConfidence as ConfidenceLevel) ?? "Medium"];
        return base * (adj / 100) * conf;
      });

    // Include the current item's weighted impact in the set for threshold computation
    const impactThreshold = computeImpactThreshold([...allWeightedImpacts, result.weightedImpact]);

    const quadrant = getQuadrant(
      result.weightedImpact,
      validated.effort as EffortLevel,
      impactThreshold
    );

    return NextResponse.json({
      ...result,
      quadrant,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
