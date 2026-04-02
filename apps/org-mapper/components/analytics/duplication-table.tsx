"use client";

import type { DuplicateGroup } from "@/lib/org-utils";

interface DuplicationTableProps {
  groups: DuplicateGroup[];
}

export function DuplicationTable({ groups }: DuplicationTableProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-gray-500">No duplicate roles detected across departments.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Role Duplications Across Departments</h3>
        <p className="text-xs text-gray-400 mt-1">Similar titles found in multiple departments — potential consolidation opportunities</p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Normalized Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Departments</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {groups.map((group) => (
            <tr key={group.normalizedTitle}>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{group.normalizedTitle}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {group.departments.map((dept) => (
                    <span key={dept} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {dept}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 text-right text-sm font-semibold">{group.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
