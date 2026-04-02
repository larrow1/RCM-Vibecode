"use client";

import { STANDARD_TAXONOMY, suggestCategory, getCategoryLabel } from "@/lib/taxonomy";

interface AccountMapping {
  accountName: string;
  suggestedCategory: string | null;
  selectedCategory: string | null;
}

export function TaxonomyMapper({
  accounts,
  onMappingsChange,
}: {
  accounts: string[];
  onMappingsChange: (mappings: Record<string, string | null>) => void;
}) {
  const initialMappings: AccountMapping[] = accounts.map((name) => {
    const suggested = suggestCategory(name);
    return {
      accountName: name,
      suggestedCategory: suggested,
      selectedCategory: suggested,
    };
  });

  const handleChange = (accountName: string, category: string | null) => {
    const newMappings: Record<string, string | null> = {};
    for (const m of initialMappings) {
      newMappings[m.accountName] =
        m.accountName === accountName ? category : m.selectedCategory;
    }
    onMappingsChange(newMappings);
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="font-medium text-gray-900">
          Map Accounts to Standard Taxonomy
        </h3>
        <p className="text-xs text-gray-500">
          Review the suggested mappings and adjust as needed.
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {initialMappings.map((m) => (
          <div
            key={m.accountName}
            className="flex items-center justify-between px-4 py-2"
          >
            <span className="text-sm text-gray-700">{m.accountName}</span>
            <select
              defaultValue={m.selectedCategory ?? ""}
              onChange={(e) =>
                handleChange(
                  m.accountName,
                  e.target.value === "" ? null : e.target.value
                )
              }
              className={`rounded-md border px-2 py-1 text-sm ${
                m.selectedCategory
                  ? "border-green-300 bg-green-50"
                  : "border-yellow-300 bg-yellow-50"
              }`}
            >
              <option value="">-- Unmapped --</option>
              {STANDARD_TAXONOMY.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
