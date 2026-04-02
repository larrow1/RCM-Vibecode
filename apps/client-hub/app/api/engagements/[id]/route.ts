import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateEngagementSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: { client: true },
  });

  if (!engagement) {
    return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
  }

  return NextResponse.json(engagement);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateEngagementSchema.parse(body);

    const data: any = { ...validated };

    // Handle date fields
    if (validated.startDate !== undefined) {
      data.startDate = validated.startDate ? new Date(validated.startDate) : null;
    }
    if (validated.endDate !== undefined) {
      data.endDate = validated.endDate ? new Date(validated.endDate) : null;
    }
    if (validated.budget !== undefined) {
      data.budget = typeof validated.budget === "string"
        ? (validated.budget ? parseFloat(validated.budget as string) : null)
        : validated.budget;
    }

    const engagement = await prisma.engagement.update({
      where: { id: params.id },
      data,
      include: { client: { select: { id: true, name: true } } },
    });

    return NextResponse.json(engagement);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.engagement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
