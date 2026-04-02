import { formatCurrency } from "@/lib/financial-utils";
import { getCategoryLabel } from "@/lib/taxonomy";

interface EvidenceItem {
  id: string;
  accountName: string;
  standardCategory: string | null;
  amount: number;
  period: string;
  entity: string;
}

export function EvidenceLink({ items }: { items: EvidenceItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400">No evidence linked.</p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <h4 className="text-sm font-medium text-gray-700">
          Linked Financial Evidence ({items.length})
        </h4>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-2"
          >
            <div>
              <span className="text-sm text-gray-700">
                {item.accountName}
              </span>
              {item.standardCategory && (
                <span className="ml-2 text-xs text-gray-400">
                  ({getCategoryLabel(item.standardCategory)})
                </span>
              )}
              <span className="ml-2 text-xs text-gray-400">
                {item.entity} / {item.period}
              </span>
            </div>
            <span className="text-sm font-medium">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
