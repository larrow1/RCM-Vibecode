import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const engagementId = searchParams.get("engagementId");

  const where = engagementId ? { engagementId } : {};

  const statements = await prisma.financialStatement.findMany({
    where,
    include: {
      lineItems: true,
    },
    orderBy: { period: "asc" },
  });

  return NextResponse.json(statements);
}
