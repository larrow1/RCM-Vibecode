import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: { id: string; phaseId: string } }
) {
  try {
    const phase = await prisma.phase.findFirst({
      where: { id: params.phaseId, flowId: params.id },
    });

    if (!phase) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 });
    }

    const body = await request.json();
    const validated = createTaskSchema.parse(body);

    const maxOrder = await prisma.task.aggregate({
      where: { phaseId: params.phaseId },
      _max: { sortOrder: true },
    });

    const task = await prisma.task.create({
      data: {
        phaseId: params.phaseId,
        title: validated.title,
        description: validated.description,
        priority: validated.priority || "Medium",
        assignee: validated.assignee,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
