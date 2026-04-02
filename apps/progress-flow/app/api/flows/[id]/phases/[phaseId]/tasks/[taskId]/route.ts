import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; phaseId: string; taskId: string } }
) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: params.taskId, phaseId: params.phaseId },
      include: { phase: true },
    });

    if (!task || task.phase.flowId !== params.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const validated = updateTaskSchema.parse(body);

    const updateData: Record<string, unknown> = { ...validated };
    if (validated.dueDate) {
      updateData.dueDate = new Date(validated.dueDate);
    }
    if (validated.status === "Completed" && task.status !== "Completed") {
      updateData.completedAt = new Date();
    }
    if (validated.status && validated.status !== "Completed") {
      updateData.completedAt = null;
    }

    const updated = await prisma.task.update({
      where: { id: params.taskId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; phaseId: string; taskId: string } }
) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: params.taskId, phaseId: params.phaseId },
      include: { phase: true },
    });

    if (!task || task.phase.flowId !== params.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: params.taskId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
