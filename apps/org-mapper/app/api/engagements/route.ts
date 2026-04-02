import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { engagementSchema } from "@/lib/validations";

export async function GET() {
  const engagements = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orgUnits: true, findings: true } },
    },
  });
  return NextResponse.json(engagements);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = engagementSchema.parse(body);
    const engagement = await prisma.engagement.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
    return NextResponse.json(engagement, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create engagement" }, { status: 500 });
  }
}
