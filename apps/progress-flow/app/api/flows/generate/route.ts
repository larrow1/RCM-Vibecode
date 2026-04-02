import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ASSESSMENT_TEMPLATES, generateFlowFromTemplate } from "@/lib/flow-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { engagementId, name, description, templateKey, scope } = body;

    if (!engagementId || !name) {
      return NextResponse.json(
        { error: "engagementId and name are required" },
        { status: 400 }
      );
    }

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
    });

    if (!engagement) {
      return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
    }

    const template = ASSESSMENT_TEMPLATES[templateKey || "full-assessment"];
    if (!template) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const { phases } = generateFlowFromTemplate(template, scope);

    const flow = await prisma.flow.create({
      data: {
        engagementId,
        name,
        description: description || template.description,
        status: "Not Started",
        templateId: templateKey || "full-assessment",
        phases: {
          create: phases.map((phase, phaseIndex) => ({
            name: phase.name,
            description: phase.description,
            sortOrder: phaseIndex,
            status: "Not Started",
            tasks: {
              create: phase.tasks.map((task, taskIndex) => ({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: "Pending",
                sortOrder: taskIndex,
                aiGenerated: true,
              })),
            },
          })),
        },
      },
      include: {
        engagement: true,
        phases: {
          include: { tasks: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(flow, { status: 201 });
  } catch (error) {
    console.error("Failed to generate flow:", error);
    return NextResponse.json({ error: "Failed to generate flow" }, { status: 500 });
  }
}
