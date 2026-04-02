"use client";

import type { SpanOfControlEntry } from "@/lib/org-utils";

interface SpanOfControlTableProps {
  entries: SpanOfControlEntry[];
}

export function SpanOfControlTable({ entries }: SpanOfControlTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">No managers found in the org structure.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Manager</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Department</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Direct Reports</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <tr key={entry.id} className={entry.flag !== "healthy" ? "bg-yellow-50" : ""}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{entry.title || "-"}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{entry.department || "-"}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold">{entry.directReports}</td>
              <td className="px-4 py-3 text-center">
                {entry.flag === "too-few" && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">Too Few (&lt;3)</span>
                )}
                {entry.flag === "too-many" && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Too Many (&gt;12)</span>
                )}
                {entry.flag === "healthy" && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Healthy</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
