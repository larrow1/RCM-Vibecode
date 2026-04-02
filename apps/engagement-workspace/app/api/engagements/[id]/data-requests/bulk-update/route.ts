import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bulkUpdateDataRequestSchema } from "@/lib/schemas";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = bulkUpdateDataRequestSchema.parse(body);

    const data: Record<string, unknown> = { status: validated.status };
    if (validated.status === "Received") {
      data.receivedDate = new Date();
    }

    const result = await prisma.dataRequest.updateMany({
      where: {
        id: { in: validated.ids },
        engagementId: params.id,
      },
      data,
    });

    await prisma.activity.create({
      data: {
        engagementId: params.id,
        type: "data_request_updated",
        description: `${result.count} data request(s) bulk updated to ${validated.status}`,
      },
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to bulk update data requests:", error);
    return NextResponse.json(
      { error: "Failed to bulk update" },
      { status: 500 }
    );
  }
}
