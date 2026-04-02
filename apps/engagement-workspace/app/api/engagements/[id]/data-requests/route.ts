import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDataRequestSchema } from "@/lib/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: Record<string, unknown> = { engagementId: params.id };
    if (category) where.category = category;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const dataRequests = await prisma.dataRequest.findMany({
      where,
      include: {
        _count: { select: { documents: true } },
      },
      orderBy: [{ dueDate: "asc" }, { priority: "asc" }],
    });

    return NextResponse.json(dataRequests);
  } catch (error) {
    console.error("Failed to fetch data requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch data requests" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createDataRequestSchema.parse(body);

    const dataRequest = await prisma.dataRequest.create({
      data: {
        engagementId: params.id,
        category: validated.category,
        description: validated.description,
        priority: validated.priority,
        status: validated.status,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        notes: validated.notes,
      },
    });

    await prisma.activity.create({
      data: {
        engagementId: params.id,
        type: "data_request_added",
        description: `Data request added: ${validated.description}`,
      },
    });

    return NextResponse.json(dataRequest, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to create data request:", error);
    return NextResponse.json(
      { error: "Failed to create data request" },
      { status: 500 }
    );
  }
}
