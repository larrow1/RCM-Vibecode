import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEngagementSchema } from "@/lib/validations";

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
      include: {
        _count: {
          select: {
            financialStatements: true,
            findings: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(engagements);
  } catch (error) {
    console.error("Failed to fetch engagements:", error);
    return NextResponse.json({ error: "Failed to fetch engagements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createEngagementSchema.parse(body);

    const engagement = await prisma.engagement.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
      },
    });

    return NextResponse.json(engagement, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
