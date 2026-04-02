import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; findingId: string } }
) {
  try {
    await prisma.themeFinding.delete({
      where: {
        themeId_findingId: {
          themeId: params.id,
          findingId: params.findingId,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove finding from theme" },
      { status: 500 }
    );
  }
}
