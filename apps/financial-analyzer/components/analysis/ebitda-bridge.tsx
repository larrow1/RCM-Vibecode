"use client";

import { formatCurrency } from "@/lib/financial-utils";

interface EbitdaAdjustment {
  id: string;
  description: string;
  amount: number;
  classification: string;
  notes?: string | null;
}

export function EbitdaBridge({
  reportedEbitda,
  adjustments,
  onAddAdjustment,
}: {
  reportedEbitda: number;
  adjustments: EbitdaAdjustment[];
  onAddAdjustment?: () => void;
}) {
  const totalAdjustments = adjustments.reduce((sum, a) => sum + a.amount, 0);
  const normalizedEbitda = reportedEbitda + totalAdjustments;

  const classificationColors: Record<string, string> = {
    NonRecurring: "text-orange-600",
    OwnerRelated: "text-purple-600",
    NonOperating: "text-blue-600",
    RunRate: "text-green-600",
    ProForma: "text-indigo-600",
    Other: "text-gray-600",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">
          EBITDA Normalization Bridge
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        <div className="flex items-center justify-between px-4 py-3 font-medium">
          <span>Reported EBITDA</span>
          <span>{formatCurrency(reportedEbitda)}</span>
        </div>
        {adjustments.map((adj) => (
          <div key={adj.id} className="flex items-center justify-between px-4 py-2">
            <div>
              <span className="text-sm text-gray-700">{adj.description}</span>
              <span
                className={`ml-2 text-xs ${classificationColors[adj.classification] ?? "text-gray-500"}`}
              >
                ({adj.classification})
              </span>
              {adj.notes && (
                <p className="text-xs text-gray-400">{adj.notes}</p>
              )}
            </div>
            <span
              className={`font-medium ${adj.amount >= 0 ? "text-green-700" : "text-red-700"}`}
            >
              {adj.amount >= 0 ? "+" : ""}
              {formatCurrency(adj.amount)}
            </span>
          </div>
        ))}
        {adjustments.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-400">
            No adjustments yet.
          </div>
        )}
        <div className="flex items-center justify-between bg-blue-50 px-4 py-3 font-bold">
          <span>Normalized EBITDA</span>
          <span>{formatCurrency(normalizedEbitda)}</span>
        </div>
      </div>
      {onAddAdjustment && (
        <div className="border-t border-gray-200 px-4 py-3">
          <button
            onClick={onAddAdjustment}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            + Add Adjustment
          </button>
        </div>
      )}
    </div>
  );
}
