import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFindingSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workstream = searchParams.get("workstream");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const engagementId = searchParams.get("engagementId");

  const where: Record<string, string> = {};
  if (workstream) where.workstream = workstream;
  if (severity) where.severity = severity;
  if (status) where.status = status;
  if (engagementId) where.engagementId = engagementId;

  const findings = await prisma.finding.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { evidence: true, linksFrom: true, linksTo: true },
      },
    },
  });

  return NextResponse.json(findings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createFindingSchema.parse(body);

    const { evidence, ...findingData } = validated;

    const finding = await prisma.finding.create({
      data: {
        ...findingData,
        evidence: {
          create: evidence.map((e) => ({
            description: e.description,
            sourceType: e.sourceType || null,
            sourceRef: e.sourceRef || null,
          })),
        },
      },
      include: {
        evidence: true,
        _count: {
          select: { evidence: true, linksFrom: true, linksTo: true },
        },
      },
    });

    return NextResponse.json(finding, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create finding" }, { status: 500 });
  }
}
