import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createThemeSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const engagementId = searchParams.get("engagementId");

  const where: Record<string, unknown> = {};
  if (engagementId) where.engagementId = engagementId;

  const themes = await prisma.theme.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      _count: { select: { themeFindings: true } },
    },
  });

  return NextResponse.json(themes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createThemeSchema.parse(body);

    const theme = await prisma.theme.create({
      data: validated,
      include: {
        _count: { select: { themeFindings: true } },
      },
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 });
  }
}
