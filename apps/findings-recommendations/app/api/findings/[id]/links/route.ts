import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFindingLinkSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createFindingLinkSchema.parse(body);

    // Prevent self-links
    if (params.id === validated.toFindingId) {
      return NextResponse.json(
        { error: "Cannot link a finding to itself" },
        { status: 400 }
      );
    }

    // Check both findings exist
    const [from, to] = await Promise.all([
      prisma.finding.findUnique({ where: { id: params.id } }),
      prisma.finding.findUnique({ where: { id: validated.toFindingId } }),
    ]);

    if (!from || !to) {
      return NextResponse.json(
        { error: "One or both findings not found" },
        { status: 404 }
      );
    }

    // Check for existing link in either direction
    const existing = await prisma.findingLink.findFirst({
      where: {
        OR: [
          { fromFindingId: params.id, toFindingId: validated.toFindingId },
          { fromFindingId: validated.toFindingId, toFindingId: params.id },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Link already exists between these findings" },
        { status: 409 }
      );
    }

    const link = await prisma.findingLink.create({
      data: {
        fromFindingId: params.id,
        toFindingId: validated.toFindingId,
        description: validated.description || null,
      },
      include: {
        fromFinding: true,
        toFinding: true,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
