import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFindingSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const engagementId = searchParams.get("engagementId");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (engagementId) where.engagementId = engagementId;
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const findings = await prisma.finding.findMany({
      where,
      include: {
        evidence: {
          include: { lineItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(findings);
  } catch (error) {
    console.error("Failed to fetch findings:", error);
    return NextResponse.json({ error: "Failed to fetch findings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { evidenceLineItemIds, ...validated } = createFindingSchema.parse(body);

    const finding = await prisma.finding.create({
      data: {
        ...validated,
        evidence: evidenceLineItemIds
          ? {
              create: evidenceLineItemIds.map((lineItemId) => ({
                lineItemId,
              })),
            }
          : undefined,
      },
      include: { evidence: true },
    });

    return NextResponse.json(finding, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
