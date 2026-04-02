import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ClientContacts } from "./client-contacts";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function ClientDetailPage({ params }: Props) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
      engagements: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!client) notFound();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <StatusBadge status={client.status} />
          </div>
          {client.industry && (
            <p className="text-gray-500 mt-1">{client.industry}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clients/${client.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            href={`/engagements/new?clientId=${client.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            + Engagement
          </Link>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
          <dl className="space-y-2">
            {client.website && (
              <div>
                <dt className="text-xs text-gray-400">Website</dt>
                <dd className="text-sm">
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {client.website}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-400">Created</dt>
              <dd className="text-sm text-gray-900">{formatDate(client.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Last Updated</dt>
              <dd className="text-sm text-gray-900">{formatDate(client.updatedAt)}</dd>
            </div>
          </dl>
          {client.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-700">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Contacts */}
        <div className="lg:col-span-2">
          <ClientContacts clientId={client.id} initialContacts={client.contacts} />
        </div>
      </div>

      {/* Engagements */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Engagements ({client.engagements.length})
          </h2>
        </div>
        {client.engagements.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No engagements yet.{" "}
            <Link href={`/engagements/new?clientId=${client.id}`} className="text-blue-600 hover:text-blue-800">
              Create one
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {client.engagements.map((eng) => (
                <tr key={eng.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/engagements/${eng.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {eng.name}
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
        )}
      </div>
    </div>
  );
}
