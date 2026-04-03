import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ideaSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const status = request.nextUrl.searchParams.get("status");
  const sort = request.nextUrl.searchParams.get("sort") || "newest";

  const where: Record<string, string> = {};
  if (category) where.category = category;
  if (status) where.status = status;

  const orderBy =
    sort === "most-voted"
      ? { votes: "desc" as const }
      : sort === "oldest"
      ? { createdAt: "asc" as const }
      : { createdAt: "desc" as const };

  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    include: { _count: { select: { comments: true } } },
  });

  return NextResponse.json(ideas);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ideaSchema.parse(body);
    const idea = await prisma.idea.create({
      data: {
        ...data,
        persona: data.persona || null,
        tags: data.tags || null,
      },
      include: { _count: { select: { comments: true } } },
    });
    return NextResponse.json(idea, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
  }
}
