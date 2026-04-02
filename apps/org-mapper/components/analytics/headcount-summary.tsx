"use client";

import type { HeadcountBreakdown } from "@/lib/org-utils";

interface HeadcountSummaryProps {
  title: string;
  data: HeadcountBreakdown[];
}

export function HeadcountSummary({ title, data }: HeadcountSummaryProps) {
  const total = data.reduce((sum, d) => sum + d.headcount, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">{title.includes("Level") ? "Level" : "Department"}</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Headcount</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">% of Total</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Total Comp</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Avg Comp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{row.label}</td>
              <td className="px-4 py-2 text-right text-sm">{row.headcount}</td>
              <td className="px-4 py-2 text-right text-sm text-gray-500">
                {total > 0 ? ((row.headcount / total) * 100).toFixed(1) : 0}%
              </td>
              <td className="px-4 py-2 text-right text-sm">${(row.compensation / 1000).toFixed(0)}k</td>
              <td className="px-4 py-2 text-right text-sm text-gray-500">${(row.avgCompensation / 1000).toFixed(0)}k</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-4 py-2 text-sm font-semibold text-gray-900">Total</td>
            <td className="px-4 py-2 text-right text-sm font-semibold">{total}</td>
            <td className="px-4 py-2 text-right text-sm font-semibold">100%</td>
            <td className="px-4 py-2 text-right text-sm font-semibold">
              ${(data.reduce((s, d) => s + d.compensation, 0) / 1000).toFixed(0)}k
            </td>
            <td className="px-4 py-2 text-right text-sm text-gray-500">
              ${total > 0 ? (data.reduce((s, d) => s + d.compensation, 0) / total / 1000).toFixed(0) : 0}k
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
