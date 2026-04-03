import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = commentSchema.parse({ ...body, ideaId: params.id });
    const comment = await prisma.comment.create({
      data: {
        ideaId: params.id,
        authorName: data.authorName,
        content: data.content,
        role: data.role || "user",
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
