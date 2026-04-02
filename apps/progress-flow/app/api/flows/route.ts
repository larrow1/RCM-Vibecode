import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFlowSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const engagementId = searchParams.get("engagementId");

    const where: Record<string, unknown> = {};
    if (engagementId) where.engagementId = engagementId;

    const flows = await prisma.flow.findMany({
      where,
      include: {
        engagement: true,
        phases: {
          include: { tasks: { select: { status: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(flows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch flows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createFlowSchema.parse(body);

    const flow = await prisma.flow.create({
      data: validated,
      include: {
        engagement: true,
        phases: { include: { tasks: true } },
      },
    });
    return NextResponse.json(flow, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create flow" }, { status: 500 });
  }
}
