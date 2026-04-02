import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardTitle } from "@/components/shared/card";
import {
  aggregateLineItems,
  calculateRatios,
  formatCurrency,
  formatPercent,
  type PeriodFinancials,
  type FinancialRatios,
} from "@/lib/financial-utils";
import { AnalysisCharts } from "./analysis-charts";

export const dynamic = "force-dynamic";

export default async function AnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      financialStatements: {
        include: { lineItems: true },
        orderBy: { period: "asc" },
      },
      ebitdaAdjustments: true,
    },
  });

  if (!engagement) return notFound();

  // Group line items by period
  const periodMap = new Map<
    string,
    Array<{ standardCategory: string | null; amount: number }>
  >();

  for (const stmt of engagement.financialStatements) {
    const existing = periodMap.get(stmt.period) ?? [];
    existing.push(
      ...stmt.lineItems.map((li) => ({
        standardCategory: li.standardCategory,
        amount: li.amount,
      }))
    );
    periodMap.set(stmt.period, existing);
  }

  const periods = [...periodMap.keys()].sort();
  const periodFinancials: PeriodFinancials[] = periods.map((period) => ({
    ...aggregateLineItems(periodMap.get(period) ?? []),
    period,
  }));

  // Calculate ratios
  const ratios: FinancialRatios[] = periodFinancials.map((pf, idx) =>
    calculateRatios(pf, idx > 0 ? periodFinancials[idx - 1] : undefined)
  );

  // Trend data for charts
  const trendData = periodFinancials.map((pf, idx) => ({
    period: pf.period,
    Revenue: pf.revenue,
    COGS: pf.cogs,
    "Gross Profit": pf.grossProfit,
    "Operating Income": pf.operatingIncome,
    EBITDA: pf.ebitda,
    "Net Income": pf.netIncome,
    "Gross Margin": ratios[idx].grossMargin
      ? +(ratios[idx].grossMargin! * 100).toFixed(1)
      : 0,
    "Operating Margin": ratios[idx].operatingMargin
      ? +(ratios[idx].operatingMargin! * 100).toFixed(1)
      : 0,
    "EBITDA Margin": ratios[idx].ebitdaMargin
      ? +(ratios[idx].ebitdaMargin! * 100).toFixed(1)
      : 0,
    "Net Margin": ratios[idx].netMargin
      ? +(ratios[idx].netMargin! * 100).toFixed(1)
      : 0,
  }));

  // EBITDA normalization
  const latestFinancials =
    periodFinancials[periodFinancials.length - 1];
  const reportedEbitda = latestFinancials?.ebitda ?? 0;
  const adjustments = engagement.ebitdaAdjustments.map((a) => ({
    id: a.id,
    description: a.description,
    amount: a.amount,
    classification: a.classification,
    notes: a.notes,
  }));

  if (periods.length === 0) {
    return (
      <div>
        <Header
          title="Analysis"
          subtitle={`${engagement.name} - ${engagement.clientName}`}
        />
        <p className="text-gray-500">
          No financial data available. Import data first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Financial Analysis"
        subtitle={`${engagement.name} - ${engagement.clientName} (${periods.length} periods)`}
      />

      <AnalysisCharts
        trendData={trendData}
        ratios={ratios}
        reportedEbitda={reportedEbitda}
        adjustments={adjustments}
        engagementId={engagement.id}
      />

      {/* Period-over-Period Comparison Table */}
      <Card className="mt-6">
        <CardTitle>Period-over-Period Comparison</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Period
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Revenue
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Gross Profit
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  EBITDA
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Net Income
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Gross Margin
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  EBITDA Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {periodFinancials.map((pf, idx) => (
                <tr key={pf.period}>
                  <td className="px-4 py-2 font-medium">{pf.period}</td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(pf.revenue)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(pf.grossProfit)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(pf.ebitda)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(pf.netIncome)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatPercent(ratios[idx].grossMargin)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatPercent(ratios[idx].ebitdaMargin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
