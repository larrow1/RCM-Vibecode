import { NextResponse } from "next/server";
import { impactCalculationSchema } from "@/lib/validations";
import { calculateImpact, getQuadrant, type ConfidenceLevel, type EffortLevel } from "@/lib/impact-calculator";

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

    const quadrant = getQuadrant(
      result.weightedImpact,
      validated.effort as EffortLevel,
      result.weightedImpact // single item, threshold = itself
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
