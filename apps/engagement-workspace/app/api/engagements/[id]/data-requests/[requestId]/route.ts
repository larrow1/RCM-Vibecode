import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDataRequestSchema } from "@/lib/schemas";

export async function PUT(
  request: Request,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const body = await request.json();
    const validated = updateDataRequestSchema.parse(body);

    const existing = await prisma.dataRequest.findUnique({
      where: { id: params.requestId },
    });
    if (!existing || existing.engagementId !== params.id) {
      return NextResponse.json(
        { error: "Data request not found" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (validated.category !== undefined) data.category = validated.category;
    if (validated.description !== undefined)
      data.description = validated.description;
    if (validated.priority !== undefined) data.priority = validated.priority;
    if (validated.status !== undefined) {
      data.status = validated.status;
      if (validated.status === "Received") {
        data.receivedDate = new Date();
      }
    }
    if (validated.dueDate !== undefined)
      data.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    if (validated.notes !== undefined) data.notes = validated.notes;

    const dataRequest = await prisma.dataRequest.update({
      where: { id: params.requestId },
      data,
    });

    if (validated.status && validated.status !== existing.status) {
      await prisma.activity.create({
        data: {
          engagementId: params.id,
          type: "data_request_updated",
          description: `Data request "${existing.description}" status changed to ${validated.status}`,
        },
      });
    }

    return NextResponse.json(dataRequest);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to update data request:", error);
    return NextResponse.json(
      { error: "Failed to update data request" },
      { status: 500 }
    );
  }
}
