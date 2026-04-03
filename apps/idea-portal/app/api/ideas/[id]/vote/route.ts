import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { voteSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { voterName } = voteSchema.parse(body);

    // Check for duplicate vote
    const existing = await prisma.vote.findUnique({
      where: { ideaId_voterName: { ideaId: params.id, voterName } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    // Create vote and increment count
    await prisma.vote.create({
      data: { ideaId: params.id, voterName },
    });

    const idea = await prisma.idea.update({
      where: { id: params.id },
      data: { votes: { increment: 1 } },
    });

    return NextResponse.json({ votes: idea.votes });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
