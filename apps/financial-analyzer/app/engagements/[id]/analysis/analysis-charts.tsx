"use client";

import { Card, CardTitle } from "@/components/shared/card";
import { RatioDashboard } from "@/components/analysis/ratio-dashboard";
import { TrendChart } from "@/components/analysis/trend-chart";
import { EbitdaBridge } from "@/components/analysis/ebitda-bridge";
import type { FinancialRatios } from "@/lib/financial-utils";

interface AnalysisChartsProps {
  trendData: Array<Record<string, string | number>>;
  ratios: FinancialRatios[];
  reportedEbitda: number;
  adjustments: Array<{
    id: string;
    description: string;
    amount: number;
    classification: string;
    notes?: string | null;
  }>;
  engagementId: string;
}

export function AnalysisCharts({
  trendData,
  ratios,
  reportedEbitda,
  adjustments,
}: AnalysisChartsProps) {
  return (
    <div className="space-y-6">
      {/* Ratio Dashboard */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Key Ratios (Latest Period)
        </h2>
        <RatioDashboard ratios={ratios} />
      </div>

      {/* Revenue & Profit Trends */}
      <Card>
        <CardTitle>Revenue & Profit Trends</CardTitle>
        <div className="mt-4">
          <TrendChart
            data={trendData}
            xKey="period"
            yKeys={["Revenue", "Gross Profit", "EBITDA", "Net Income"]}
            type="line"
            height={350}
            formatter={(v) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(v)
            }
          />
        </div>
      </Card>

      {/* Margin Trends */}
      <Card>
        <CardTitle>Margin Trends (%)</CardTitle>
        <div className="mt-4">
          <TrendChart
            data={trendData}
            xKey="period"
            yKeys={[
              "Gross Margin",
              "Operating Margin",
              "EBITDA Margin",
              "Net Margin",
            ]}
            type="line"
            height={300}
            formatter={(v) => `${v}%`}
          />
        </div>
      </Card>

      {/* EBITDA Normalization */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          EBITDA Normalization
        </h2>
        <EbitdaBridge
          reportedEbitda={reportedEbitda}
          adjustments={adjustments}
        />
      </div>
    </div>
  );
}
