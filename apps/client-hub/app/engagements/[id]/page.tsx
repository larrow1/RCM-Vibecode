import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { formatDate, formatCurrency, ENGAGEMENT_TYPE_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EngagementDetailPage({ params }: Props) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: { client: true },
  });

  if (!engagement) notFound();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            <Link href={`/clients/${engagement.client.id}`} className="text-blue-600 hover:text-blue-800">
              {engagement.client.name}
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{engagement.name}</h1>
            <StatusBadge status={engagement.status} />
            <TypeBadge type={engagement.type} />
          </div>
        </div>
        <Link
          href={`/engagements/${engagement.id}/edit`}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Edit
        </Link>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Engagement Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-400">Type</dt>
              <dd className="text-sm text-gray-900">{ENGAGEMENT_TYPE_LABELS[engagement.type] || engagement.type}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Status</dt>
              <dd><StatusBadge status={engagement.status} /></dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Start Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(engagement.startDate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">End Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(engagement.endDate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Budget</dt>
              <dd className="text-sm text-gray-900">{formatCurrency(engagement.budget)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Created</dt>
              <dd className="text-sm text-gray-900">{formatDate(engagement.createdAt)}</dd>
            </div>
          </dl>
        </div>

        {engagement.description && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Description</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{engagement.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
