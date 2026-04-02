import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRecommendationSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const engagementId = searchParams.get("engagementId");

  const where: Record<string, string> = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (engagementId) where.engagementId = engagementId;

  const recommendations = await prisma.recommendation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { recommendationFindings: true } },
    },
  });

  return NextResponse.json(recommendations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createRecommendationSchema.parse(body);

    const { findingIds, ...recData } = validated;

    const recommendation = await prisma.recommendation.create({
      data: {
        ...recData,
        recommendationFindings: {
          create: findingIds.map((findingId) => ({ findingId })),
        },
      },
      include: {
        recommendationFindings: { include: { finding: true } },
        _count: { select: { recommendationFindings: true } },
      },
    });

    return NextResponse.json(recommendation, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create recommendation" }, { status: 500 });
  }
}
