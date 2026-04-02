import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      orgUnits: { orderBy: { level: "asc" } },
      findings: {
        include: { orgUnit: { select: { name: true, department: true } } },
        orderBy: { createdAt: "desc" },
      },
      importLogs: { orderBy: { createdAt: "desc" } },
      _count: { select: { orgUnits: true, findings: true } },
    },
  });

  if (!engagement) {
    return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
  }

  return NextResponse.json(engagement);
}
