import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/utils";

interface EngagementCardProps {
  engagement: {
    id: string;
    name: string;
    clientName: string;
    type: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date | null;
    _count?: {
      dataRequests: number;
      documents: number;
      teamMembers: number;
    };
    dataRequests?: Array<{ status: string }>;
  };
}

function formatType(type: string): string {
  return type.replace(/([A-Z])/g, " $1").trim();
}

export function EngagementCard({ engagement }: EngagementCardProps) {
  const totalRequests = engagement._count?.dataRequests || 0;
  const receivedRequests =
    engagement.dataRequests?.filter(
      (dr) => dr.status === "Received" || dr.status === "NotAvailable"
    ).length || 0;

  return (
    <Link href={`/engagements/${engagement.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {engagement.name}
            </h3>
            <p className="text-sm text-gray-500">{engagement.clientName}</p>
          </div>
          <StatusBadge status={engagement.status} />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{formatType(engagement.type)}</span>
          <span>
            {formatDate(engagement.startDate)}
            {engagement.endDate ? ` - ${formatDate(engagement.endDate)}` : ""}
          </span>
        </div>

        {totalRequests > 0 && (
          <div className="mb-3">
            <ProgressBar
              value={receivedRequests}
              max={totalRequests}
              label="Data Requests"
            />
          </div>
        )}

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>{engagement._count?.documents || 0} documents</span>
          <span>{engagement._count?.teamMembers || 0} team members</span>
        </div>
      </div>
    </Link>
  );
}
