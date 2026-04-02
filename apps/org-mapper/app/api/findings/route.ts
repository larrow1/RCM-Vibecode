import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findingSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const engagementId = request.nextUrl.searchParams.get("engagementId");
  if (!engagementId) {
    return NextResponse.json({ error: "engagementId is required" }, { status: 400 });
  }

  const findings = await prisma.finding.findMany({
    where: { engagementId },
    include: { orgUnit: { select: { name: true, department: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(findings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = findingSchema.parse(body);
    const finding = await prisma.finding.create({
      data: {
        ...data,
        orgUnitId: data.orgUnitId || undefined,
      },
      include: { orgUnit: { select: { name: true, department: true } } },
    });
    return NextResponse.json(finding, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create finding" }, { status: 500 });
  }
}
