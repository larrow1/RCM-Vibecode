import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateFindingSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const finding = await prisma.finding.findUnique({
    where: { id: params.id },
    include: {
      evidence: true,
      linksFrom: { include: { toFinding: true } },
      linksTo: { include: { fromFinding: true } },
      recommendationFindings: { include: { recommendation: true } },
      themeFindings: { include: { theme: true } },
    },
  });

  if (!finding) {
    return NextResponse.json({ error: "Finding not found" }, { status: 404 });
  }

  return NextResponse.json(finding);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateFindingSchema.parse(body);

    const { evidence, ...findingData } = validated;

    const finding = await prisma.finding.update({
      where: { id: params.id },
      data: findingData,
      include: {
        evidence: true,
        _count: { select: { evidence: true, linksFrom: true, linksTo: true } },
      },
    });

    return NextResponse.json(finding);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update finding" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.finding.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete finding" }, { status: 500 });
  }
}
