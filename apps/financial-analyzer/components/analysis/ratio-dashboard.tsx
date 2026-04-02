"use client";

import { RatioCard } from "./ratio-card";
import { getRatioRating, type FinancialRatios } from "@/lib/financial-utils";

const BENCHMARKS: Record<string, number> = {
  grossMargin: 0.35,
  operatingMargin: 0.12,
  ebitdaMargin: 0.15,
  netMargin: 0.08,
};

export function RatioDashboard({ ratios }: { ratios: FinancialRatios[] }) {
  // Use latest period's ratios
  const latest = ratios[ratios.length - 1];
  if (!latest) {
    return (
      <p className="text-gray-500">
        No financial data available for ratio analysis.
      </p>
    );
  }

  const ratioItems = [
    {
      label: "Gross Margin",
      value: latest.grossMargin,
      benchmark: BENCHMARKS.grossMargin,
    },
    {
      label: "Operating Margin",
      value: latest.operatingMargin,
      benchmark: BENCHMARKS.operatingMargin,
    },
    {
      label: "EBITDA Margin",
      value: latest.ebitdaMargin,
      benchmark: BENCHMARKS.ebitdaMargin,
    },
    {
      label: "Net Margin",
      value: latest.netMargin,
      benchmark: BENCHMARKS.netMargin,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {ratioItems.map((r) => (
        <RatioCard
          key={r.label}
          label={r.label}
          value={r.value}
          rating={getRatioRating(r.value, r.benchmark)}
          benchmark={`${(r.benchmark * 100).toFixed(0)}% median`}
        />
      ))}
    </div>
  );
}
