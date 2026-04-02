"use client";

interface Finding {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  description: string;
  financialImpact: number | null;
  orgUnit?: { name: string; department: string | null } | null;
}

const severityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-blue-100 text-blue-700",
  Informational: "bg-gray-100 text-gray-700",
};

export function FindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No findings yet. Create one to start documenting org issues.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Severity</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Linked Unit</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Impact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {findings.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{f.description}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{f.category}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${severityColors[f.severity] || ""}`}>
                  {f.severity}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {f.orgUnit ? `${f.orgUnit.name}${f.orgUnit.department ? ` (${f.orgUnit.department})` : ""}` : "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{f.status}</td>
              <td className="px-4 py-3 text-right text-sm">
                {f.financialImpact ? `$${(f.financialImpact / 1000).toFixed(0)}k` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
