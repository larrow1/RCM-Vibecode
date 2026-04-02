import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPhaseSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createPhaseSchema.parse(body);

    const maxOrder = await prisma.phase.aggregate({
      where: { flowId: params.id },
      _max: { sortOrder: true },
    });

    const phase = await prisma.phase.create({
      data: {
        flowId: params.id,
        name: validated.name,
        description: validated.description,
        sortOrder: validated.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
      },
      include: { tasks: true },
    });

    return NextResponse.json(phase, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create phase" }, { status: 500 });
  }
}
