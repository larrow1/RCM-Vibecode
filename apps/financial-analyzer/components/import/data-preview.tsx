"use client";

interface ParsedRow {
  rowIndex: number;
  values: Record<string, string | number>;
}

export function DataPreview({
  headers,
  rows,
  maxRows = 20,
}: {
  headers: string[];
  rows: ParsedRow[];
  maxRows?: number;
}) {
  const displayRows = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
              #
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayRows.map((row) => (
            <tr key={row.rowIndex}>
              <td className="px-3 py-1.5 text-gray-400">{row.rowIndex + 1}</td>
              {headers.map((h) => (
                <td key={h} className="px-3 py-1.5 text-gray-700">
                  {String(row.values[h] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}
