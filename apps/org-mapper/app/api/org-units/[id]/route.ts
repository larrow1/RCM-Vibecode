import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgUnitUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = orgUnitUpdateSchema.parse(body);
    const orgUnit = await prisma.orgUnit.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(orgUnit);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update org unit" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete children first (cascade)
    await prisma.orgUnit.deleteMany({ where: { parentId: params.id } });
    await prisma.orgUnit.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete org unit" }, { status: 500 });
  }
}
