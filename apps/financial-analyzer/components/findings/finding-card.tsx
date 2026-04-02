import Link from "next/link";
import { Badge } from "@/components/shared/badge";
import { formatCurrency } from "@/lib/financial-utils";

interface FindingCardProps {
  id: string;
  engagementId: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  financialImpact?: number | null;
  description: string;
  evidenceCount: number;
}

export function FindingCard({
  id,
  engagementId,
  title,
  category,
  severity,
  status,
  financialImpact,
  description,
  evidenceCount,
}: FindingCardProps) {
  return (
    <Link href={`/engagements/${engagementId}/findings/${id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <div className="flex gap-1">
            <Badge variant="severity">{severity}</Badge>
            <Badge variant="category">{category}</Badge>
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <Badge variant="status">{status}</Badge>
          {financialImpact != null && (
            <span>Impact: {formatCurrency(financialImpact)}</span>
          )}
          <span>{evidenceCount} evidence item(s)</span>
        </div>
      </div>
    </Link>
  );
}
