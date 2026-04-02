import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateClientSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
      engagements: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateClientSchema.parse(body);

    const client = await prisma.client.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(client);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete — set archivedAt
    const client = await prisma.client.update({
      where: { id: params.id },
      data: { archivedAt: new Date(), status: "Inactive" },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
