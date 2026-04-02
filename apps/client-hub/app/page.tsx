import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/stats-card";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clients, engagements, recentClients, recentEngagements] = await Promise.all([
    prisma.client.groupBy({
      by: ["status"],
      _count: true,
      where: { archivedAt: null },
    }),
    prisma.engagement.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.client.findMany({
      where: { archivedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { engagements: true } } },
    }),
    prisma.engagement.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  const totalClients = clients.reduce((sum, g) => sum + g._count, 0);
  const activeEngagements = engagements.find((g) => g.status === "Active")?._count || 0;
  const pipelineCount = engagements
    .filter((g) => ["Lead", "Proposal"].includes(g.status))
    .reduce((sum, g) => sum + g._count, 0);
  const totalEngagements = engagements.reduce((sum, g) => sum + g._count, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your consulting portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Clients" value={totalClients} color="blue" />
        <StatsCard title="Active Engagements" value={activeEngagements} color="green" />
        <StatsCard title="Pipeline" value={pipelineCount} subtitle="Leads + Proposals" color="purple" />
        <StatsCard title="Total Engagements" value={totalEngagements} color="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Clients</h2>
            <Link href="/clients" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentClients.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/clients/${client.id}`}
                  className="block px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {client.industry || "No industry"} &middot; {client._count.engagements} engagement(s)
                      </p>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Engagements */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Engagements</h2>
            <Link href="/engagements" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentEngagements.map((eng) => (
              <li key={eng.id}>
                <Link
                  href={`/engagements/${eng.id}`}
                  className="block px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{eng.name}</p>
                      <p className="text-xs text-gray-500">{eng.client.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TypeBadge type={eng.type} />
                      <StatusBadge status={eng.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
