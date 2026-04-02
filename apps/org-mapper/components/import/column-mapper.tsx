"use client";

import { useState } from "react";

interface ColumnMapperProps {
  headers: string[];
  rows: Record<string, string>[];
  engagementId: string;
  onImported: () => void;
}

const FIELDS = [
  { key: "name", label: "Name *", required: true },
  { key: "title", label: "Title", required: false },
  { key: "department", label: "Department", required: false },
  { key: "managerName", label: "Manager Name", required: false },
  { key: "level", label: "Level", required: false },
  { key: "compensation", label: "Compensation", required: false },
  { key: "employeeId", label: "Employee ID", required: false },
  { key: "headcount", label: "Headcount", required: false },
  { key: "type", label: "Type (Division/Department/Team/Role)", required: false },
];

function autoDetectMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  const patterns: Record<string, string[]> = {
    name: ["name", "employee name", "full name", "employee"],
    title: ["title", "job title", "position", "role"],
    department: ["department", "dept", "division", "team", "group"],
    managerName: ["manager", "manager name", "reports to", "supervisor"],
    level: ["level", "grade", "band"],
    compensation: ["compensation", "salary", "pay", "total comp", "annual salary"],
    employeeId: ["employee id", "id", "emp id", "employee_id"],
    headcount: ["headcount", "hc", "fte"],
    type: ["type", "unit type", "org type"],
  };

  for (const [field, keywords] of Object.entries(patterns)) {
    for (let i = 0; i < lowerHeaders.length; i++) {
      if (keywords.some((kw) => lowerHeaders[i].includes(kw))) {
        mapping[field] = headers[i];
        break;
      }
    }
  }

  return mapping;
}

export function ColumnMapper({ headers, rows, engagementId, onImported }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>(() => autoDetectMapping(headers));
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    if (!mapping.name) {
      setError("Name column mapping is required");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const res = await fetch("/api/org-units/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId, mapping, rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult({ success: data.successCount, errors: data.errorCount });
      onImported();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900">Map CSV Columns</h3>
        <p className="text-xs text-gray-400 mt-1">
          {rows.length} rows detected. Map your columns to the org unit fields below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            <select
              value={mapping[field.key] || ""}
              onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-- Skip --</option>
              {headers.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Preview (first 3 rows)</h4>
        <div className="overflow-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-2 py-1 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 3).map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h} className="px-2 py-1 text-gray-700">{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <p className="text-sm text-green-600">
          Import complete: {result.success} succeeded, {result.errors} errors.
        </p>
      )}

      <button
        onClick={handleImport}
        disabled={importing || !mapping.name}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {importing ? "Importing..." : `Import ${rows.length} Rows`}
      </button>
    </div>
  );
}
