import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateRecommendationSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const recommendation = await prisma.recommendation.findUnique({
    where: { id: params.id },
    include: {
      recommendationFindings: {
        include: { finding: true },
      },
    },
  });

  if (!recommendation) {
    return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
  }

  return NextResponse.json(recommendation);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateRecommendationSchema.parse(body);

    const { findingIds, ...recData } = validated;

    // If findingIds provided, replace them
    if (findingIds) {
      await prisma.recommendationFinding.deleteMany({
        where: { recommendationId: params.id },
      });
    }

    const recommendation = await prisma.recommendation.update({
      where: { id: params.id },
      data: {
        ...recData,
        ...(findingIds
          ? {
              recommendationFindings: {
                create: findingIds.map((findingId) => ({ findingId })),
              },
            }
          : {}),
      },
      include: {
        recommendationFindings: { include: { finding: true } },
        _count: { select: { recommendationFindings: true } },
      },
    });

    return NextResponse.json(recommendation);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update recommendation" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.recommendation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete recommendation" }, { status: 500 });
  }
}
