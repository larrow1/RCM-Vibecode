import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEngagementSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
      include: {
        _count: {
          select: {
            dataRequests: true,
            documents: true,
            teamMembers: true,
          },
        },
        dataRequests: {
          select: { status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(engagements);
  } catch (error) {
    console.error("Failed to fetch engagements:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createEngagementSchema.parse(body);

    const engagement = await prisma.engagement.create({
      data: {
        name: validated.name,
        clientName: validated.clientName,
        type: validated.type,
        status: validated.status,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        scopeDescription: validated.scopeDescription,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        engagementId: engagement.id,
        type: "engagement_created",
        description: `Engagement created: ${engagement.name}`,
      },
    });

    return NextResponse.json(engagement, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to create engagement:", error);
    return NextResponse.json(
      { error: "Failed to create engagement" },
      { status: 500 }
    );
  }
}
