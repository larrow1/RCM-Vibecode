import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";

interface EngagementHeaderProps {
  engagement: {
    id: string;
    name: string;
    clientName: string;
    type: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date | null;
    scopeDescription: string | null;
  };
}

function formatType(type: string): string {
  return type.replace(/([A-Z])/g, " $1").trim();
}

export function EngagementHeader({ engagement }: EngagementHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Engagements
            </Link>
            <span className="text-sm text-gray-400">/</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {engagement.name}
          </h1>
          <p className="text-gray-500 mt-1">{engagement.clientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={engagement.status} />
          <Link
            href={`/engagements/${engagement.id}/edit`}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
        <span>{formatType(engagement.type)}</span>
        <span>
          {formatDate(engagement.startDate)}
          {engagement.endDate ? ` - ${formatDate(engagement.endDate)}` : ""}
        </span>
      </div>
      {engagement.scopeDescription && (
        <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          {engagement.scopeDescription}
        </p>
      )}
    </div>
  );
}
