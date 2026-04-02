import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateFindingSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const finding = await prisma.finding.findUnique({
    where: { id: params.id },
    include: {
      engagement: true,
      evidence: {
        include: {
          lineItem: {
            include: { financialStatement: true },
          },
        },
      },
    },
  });

  if (!finding) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(finding);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateFindingSchema.parse(body);

    const finding = await prisma.finding.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(finding);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.finding.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
