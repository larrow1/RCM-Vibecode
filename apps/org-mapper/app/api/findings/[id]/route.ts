import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findingUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = findingUpdateSchema.parse(body);
    const finding = await prisma.finding.update({
      where: { id: params.id },
      data,
      include: { orgUnit: { select: { name: true, department: true } } },
    });
    return NextResponse.json(finding);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update finding" }, { status: 500 });
  }
}
