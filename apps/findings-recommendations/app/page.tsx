import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SeverityBadge } from "@/components/severity-badge";
import { WorkstreamBadge } from "@/components/workstream-badge";
import { PriorityMatrix } from "@/components/priority-matrix";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [findings, recommendations, themes] = await Promise.all([
    prisma.finding.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { evidence: true, linksFrom: true, linksTo: true } } },
    }),
    prisma.recommendation.findMany({
      include: { _count: { select: { recommendationFindings: true } } },
    }),
    prisma.theme.findMany({
      include: { _count: { select: { themeFindings: true } } },
    }),
  ]);

  const totalFindings = await prisma.finding.count();
  const criticalFindings = await prisma.finding.count({ where: { severity: "Critical" } });
  const highFindings = await prisma.finding.count({ where: { severity: "High" } });
  const totalRecs = await prisma.recommendation.count();

  const workstreamCounts = {
    Financial: await prisma.finding.count({ where: { workstream: "Financial" } }),
    Organizational: await prisma.finding.count({ where: { workstream: "Organizational" } }),
    Contracts: await prisma.finding.count({ where: { workstream: "Contracts" } }),
    CrossCutting: await prisma.finding.count({ where: { workstream: "CrossCutting" } }),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Assessment synthesis overview -- findings, recommendations, and impact analysis
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Findings" value={totalFindings} />
        <StatCard label="Critical / High" value={`${criticalFindings} / ${highFindings}`} color="text-red-600" />
        <StatCard label="Recommendations" value={totalRecs} />
        <StatCard label="Themes" value={themes.length} />
      </div>

      {/* Workstream Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Findings by Workstream</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(workstreamCounts).map(([ws, count]) => (
            <div key={ws} className="text-center">
              <WorkstreamBadge workstream={ws} />
              <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Priority Matrix</h2>
            <p className="text-sm text-gray-500">Impact vs. Effort classification</p>
          </div>
          <Link
            href="/recommendations"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all recommendations
          </Link>
        </div>
        <PriorityMatrix recommendations={recommendations} />
      </div>

      {/* Recent Findings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Findings</h2>
          <Link href="/findings" className="text-sm text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {findings.slice(0, 5).map((finding) => (
            <Link
              key={finding.id}
              href={`/findings/${finding.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SeverityBadge severity={finding.severity} />
                <span className="text-sm text-gray-900">{finding.title}</span>
              </div>
              <WorkstreamBadge workstream={finding.workstream} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
