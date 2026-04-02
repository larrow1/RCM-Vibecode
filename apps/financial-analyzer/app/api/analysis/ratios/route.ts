import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aggregateLineItems, calculateRatios, type PeriodFinancials } from "@/lib/financial-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const engagementId = searchParams.get("engagementId");

  if (!engagementId) {
    return NextResponse.json({ error: "engagementId required" }, { status: 400 });
  }

  try {
    const statements = await prisma.financialStatement.findMany({
      where: { engagementId },
      include: { lineItems: true },
      orderBy: { period: "asc" },
    });

    // Group by period
    const periodMap = new Map<string, Array<{ standardCategory: string | null; amount: number }>>();
    for (const stmt of statements) {
      const existing = periodMap.get(stmt.period) ?? [];
      existing.push(...stmt.lineItems.map((li) => ({
        standardCategory: li.standardCategory,
        amount: li.amount,
      })));
      periodMap.set(stmt.period, existing);
    }

    const periods = [...periodMap.keys()].sort();
    const periodFinancials: PeriodFinancials[] = periods.map((period) => ({
      ...aggregateLineItems(periodMap.get(period) ?? []),
      period,
    }));

    const ratios = periodFinancials.map((pf, idx) =>
      calculateRatios(pf, idx > 0 ? periodFinancials[idx - 1] : undefined)
    );

    return NextResponse.json({ periods: periodFinancials, ratios });
  } catch (error) {
    console.error("Failed to compute ratios:", error);
    return NextResponse.json({ error: "Failed to compute ratios" }, { status: 500 });
  }
}
