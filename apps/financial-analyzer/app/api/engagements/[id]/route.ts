import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateEngagementSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      financialStatements: {
        include: { lineItems: true },
        orderBy: { period: "asc" },
      },
      findings: true,
      benchmarks: true,
      ebitdaAdjustments: true,
    },
  });

  if (!engagement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(engagement);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateEngagementSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.startDate) data.startDate = new Date(validated.startDate);
    if (validated.endDate) data.endDate = new Date(validated.endDate);

    const engagement = await prisma.engagement.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(engagement);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
