import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateThemeSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateThemeSchema.parse(body);

    const theme = await prisma.theme.update({
      where: { id: params.id },
      data: validated,
      include: {
        _count: { select: { themeFindings: true } },
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.theme.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 });
  }
}
