import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { formatDate, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { status?: string };
}

export default async function EngagementsPage({ searchParams }: Props) {
  const { status } = searchParams;

  const where: any = {};
  if (status) where.status = status;

  const engagements = await prisma.engagement.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { client: true },
  });

  const statuses = ["All", "Lead", "Proposal", "Active", "Delivered", "Closed"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="text-gray-500 mt-1">{engagements.length} engagement(s)</p>
        </div>
        <Link
          href="/engagements/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          + New Engagement
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map((s) => {
          const isActive = s === "All" ? !status : status === s;
          const href = s === "All" ? "/engagements" : `/engagements?status=${s}`;
          return (
            <Link
              key={s}
              href={href}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {engagements.length === 0 ? (
        <EmptyState
          title="No engagements found"
          description={status ? `No ${status.toLowerCase()} engagements.` : "Create your first engagement."}
          actionLabel="New Engagement"
          actionHref="/engagements/new"
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {engagements.map((eng) => (
                <tr key={eng.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/engagements/${eng.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {eng.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/clients/${eng.client.id}`} className="text-sm text-gray-700 hover:text-blue-600">
                      {eng.client.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4"><TypeBadge type={eng.type} /></td>
                  <td className="px-6 py-4"><StatusBadge status={eng.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(eng.startDate)} &ndash; {formatDate(eng.endDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(eng.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
