import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEngagementSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientId");

  const where: any = {};
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;

  const engagements = await prisma.engagement.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { id: true, name: true } } },
  });

  return NextResponse.json(engagements);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createEngagementSchema.parse(body);

    const data: any = {
      clientId: validated.clientId,
      name: validated.name,
      description: validated.description || null,
      type: validated.type,
      status: validated.status,
    };

    if (validated.startDate) data.startDate = new Date(validated.startDate);
    if (validated.endDate) data.endDate = new Date(validated.endDate);
    if (validated.budget !== undefined && validated.budget !== "") {
      data.budget = typeof validated.budget === "string"
        ? parseFloat(validated.budget)
        : validated.budget;
    }

    const engagement = await prisma.engagement.create({
      data,
      include: { client: { select: { id: true, name: true } } },
    });

    return NextResponse.json(engagement, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
