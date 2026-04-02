import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const statement = await prisma.financialStatement.findUnique({
      where: { id: params.id },
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });

    if (!statement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(statement);
  } catch (error) {
    console.error("Failed to fetch financial statement:", error);
    return NextResponse.json({ error: "Failed to fetch financial statement" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.financialStatement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete financial statement:", error);
    return NextResponse.json({ error: "Failed to delete financial statement" }, { status: 500 });
  }
}
