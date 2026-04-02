import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { status?: string; search?: string };
}

export default async function ClientsPage({ searchParams }: Props) {
  const { status, search } = searchParams;

  const where: any = { archivedAt: null };
  if (status) where.status = status;
  if (search) where.name = { contains: search };

  const clients = await prisma.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { engagements: true, contacts: true } },
    },
  });

  const statuses = ["All", "Prospect", "Active", "Inactive"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">{clients.length} client(s)</p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          + New Client
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {statuses.map((s) => {
          const isActive = s === "All" ? !status : status === s;
          const href = s === "All" ? "/clients" : `/clients?status=${s}`;
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

      {clients.length === 0 ? (
        <EmptyState
          title="No clients found"
          description={status ? `No ${status.toLowerCase()} clients.` : "Get started by adding your first client."}
          actionLabel="Add Client"
          actionHref="/clients/new"
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/clients/${client.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.industry || "—"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client._count.engagements}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client._count.contacts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
