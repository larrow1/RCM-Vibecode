import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ideaUpdateSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idea = await prisma.idea.findUnique({
    where: { id: params.id },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      _count: { select: { comments: true, voters: true } },
    },
  });

  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json(idea);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = ideaUpdateSchema.parse(body);
    const idea = await prisma.idea.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(idea);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update idea" }, { status: 500 });
  }
}
