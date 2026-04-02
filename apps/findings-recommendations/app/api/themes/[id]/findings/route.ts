import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { findingId } = body;

    if (!findingId) {
      return NextResponse.json({ error: "findingId is required" }, { status: 400 });
    }

    // Check for duplicates
    const existing = await prisma.themeFinding.findUnique({
      where: {
        themeId_findingId: {
          themeId: params.id,
          findingId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Finding already assigned to this theme" },
        { status: 409 }
      );
    }

    const themeFinding = await prisma.themeFinding.create({
      data: {
        themeId: params.id,
        findingId,
      },
      include: {
        finding: true,
        theme: true,
      },
    });

    return NextResponse.json(themeFinding, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add finding to theme" }, { status: 500 });
  }
}
