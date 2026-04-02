import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; linkId: string } }
) {
  try {
    const link = await prisma.findingLink.findFirst({
      where: { id: params.linkId, fromFindingId: params.id },
    });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    await prisma.findingLink.delete({
      where: { id: params.linkId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
