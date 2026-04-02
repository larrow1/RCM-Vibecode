import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDocumentSchema } from "@/lib/schemas";

export async function PUT(
  request: Request,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    const body = await request.json();
    const validated = updateDocumentSchema.parse(body);

    const existing = await prisma.document.findUnique({
      where: { id: params.docId },
    });
    if (!existing || existing.engagementId !== params.id) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const document = await prisma.document.update({
      where: { id: params.docId },
      data: validated,
    });

    return NextResponse.json(document);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to update document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
