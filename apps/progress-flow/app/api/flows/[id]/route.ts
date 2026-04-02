import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateFlowSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const flow = await prisma.flow.findUnique({
      where: { id: params.id },
      include: {
        engagement: true,
        phases: {
          include: { tasks: { orderBy: { sortOrder: "asc" } } },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    return NextResponse.json(flow);
  } catch {
    return NextResponse.json({ error: "Failed to fetch flow" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateFlowSchema.parse(body);

    const flow = await prisma.flow.update({
      where: { id: params.id },
      data: validated,
      include: {
        engagement: true,
        phases: { include: { tasks: true } },
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update flow" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.flow.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete flow" }, { status: 500 });
  }
}
