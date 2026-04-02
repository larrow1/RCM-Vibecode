import Link from "next/link";
import { Badge } from "@/components/shared/badge";
import { Card } from "@/components/shared/card";
import { formatCurrency } from "@/lib/financial-utils";

interface EngagementCardProps {
  id: string;
  name: string;
  clientName: string;
  type: string;
  status: string;
  startDate: string;
  statementCount: number;
  findingCount: number;
  latestRevenue?: number;
}

export function EngagementCard({
  id,
  name,
  clientName,
  type,
  status,
  startDate,
  statementCount,
  findingCount,
  latestRevenue,
}: EngagementCardProps) {
  return (
    <Link href={`/engagements/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{clientName}</p>
          </div>
          <Badge variant="status">{status}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Statements</p>
            <p className="font-medium">{statementCount}</p>
          </div>
          <div>
            <p className="text-gray-500">Findings</p>
            <p className="font-medium">{findingCount}</p>
          </div>
          <div>
            <p className="text-gray-500">Latest Revenue</p>
            <p className="font-medium">
              {latestRevenue != null ? formatCurrency(latestRevenue) : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
          <span>{type}</span>
          <span>Started {new Date(startDate).toLocaleDateString()}</span>
        </div>
      </Card>
    </Link>
  );
}
