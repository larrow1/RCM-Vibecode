import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateEngagementSchema } from "@/lib/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const engagement = await prisma.engagement.findUnique({
      where: { id: params.id },
      include: {
        dataRequests: {
          include: {
            _count: { select: { documents: true } },
          },
          orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
        },
        documents: {
          include: {
            dataRequest: { select: { description: true } },
          },
          orderBy: { uploadedAt: "desc" },
        },
        teamMembers: {
          orderBy: { createdAt: "asc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        _count: {
          select: {
            dataRequests: true,
            documents: true,
            teamMembers: true,
          },
        },
      },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(engagement);
  } catch (error) {
    console.error("Failed to fetch engagement:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagement" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateEngagementSchema.parse(body);

    const existing = await prisma.engagement.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (validated.name !== undefined) data.name = validated.name;
    if (validated.clientName !== undefined) data.clientName = validated.clientName;
    if (validated.type !== undefined) data.type = validated.type;
    if (validated.status !== undefined) data.status = validated.status;
    if (validated.startDate !== undefined)
      data.startDate = new Date(validated.startDate);
    if (validated.endDate !== undefined)
      data.endDate = validated.endDate ? new Date(validated.endDate) : null;
    if (validated.scopeDescription !== undefined)
      data.scopeDescription = validated.scopeDescription;

    const engagement = await prisma.engagement.update({
      where: { id: params.id },
      data,
    });

    // Log status change
    if (validated.status && validated.status !== existing.status) {
      await prisma.activity.create({
        data: {
          engagementId: engagement.id,
          type: "status_changed",
          description: `Engagement status changed from ${existing.status} to ${validated.status}`,
        },
      });
    }

    return NextResponse.json(engagement);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to update engagement:", error);
    return NextResponse.json(
      { error: "Failed to update engagement" },
      { status: 500 }
    );
  }
}
