import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDocumentSchema } from "@/lib/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { engagementId: params.id };
    if (category) where.category = category;

    const documents = await prisma.document.findMany({
      where,
      include: {
        dataRequest: { select: { description: true } },
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createDocumentSchema.parse(body);

    const document = await prisma.document.create({
      data: {
        engagementId: params.id,
        fileName: validated.fileName,
        fileType: validated.fileType,
        fileSize: validated.fileSize,
        category: validated.category,
        entity: validated.entity,
        period: validated.period,
        dataRequestId: validated.dataRequestId,
        tags: validated.tags,
      },
    });

    await prisma.activity.create({
      data: {
        engagementId: params.id,
        type: "document_uploaded",
        description: `Document uploaded: ${validated.fileName}`,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to create document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
