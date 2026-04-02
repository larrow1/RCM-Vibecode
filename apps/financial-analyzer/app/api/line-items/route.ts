import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statementId = searchParams.get("statementId");
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (statementId) where.financialStatementId = statementId;
  if (category) where.standardCategory = category;

  const lineItems = await prisma.financialLineItem.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(lineItems);
}
