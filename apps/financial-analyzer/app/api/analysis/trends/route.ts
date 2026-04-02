import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aggregateLineItems } from "@/lib/financial-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const engagementId = searchParams.get("engagementId");
  const metric = searchParams.get("metric"); // revenue, grossProfit, ebitda, etc.

  if (!engagementId) {
    return NextResponse.json({ error: "engagementId required" }, { status: 400 });
  }

  const statements = await prisma.financialStatement.findMany({
    where: { engagementId },
    include: { lineItems: true },
    orderBy: { period: "asc" },
  });

  const periodMap = new Map<string, Array<{ standardCategory: string | null; amount: number }>>();
  for (const stmt of statements) {
    const existing = periodMap.get(stmt.period) ?? [];
    existing.push(...stmt.lineItems.map((li) => ({
      standardCategory: li.standardCategory,
      amount: li.amount,
    })));
    periodMap.set(stmt.period, existing);
  }

  const trendData = [...periodMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, items]) => {
      const agg = aggregateLineItems(items);
      return {
        period,
        revenue: agg.revenue,
        cogs: agg.cogs,
        grossProfit: agg.grossProfit,
        operatingExpenses: agg.operatingExpenses,
        operatingIncome: agg.operatingIncome,
        ebitda: agg.ebitda,
        netIncome: agg.netIncome,
      };
    });

  return NextResponse.json(trendData);
}
