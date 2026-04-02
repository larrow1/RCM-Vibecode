import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buildTree, computeSummaryMetrics, type OrgNode } from "@/lib/org-utils";
import { OrgTree } from "@/components/org-chart/org-tree";
import { MetricCard } from "@/components/dashboard/metric-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EngagementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      orgUnits: { orderBy: [{ level: "asc" }, { name: "asc" }] },
      findings: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { orgUnits: true, findings: true } },
    },
  });

  if (!engagement) notFound();

  const nodes: OrgNode[] = engagement.orgUnits.map((u) => ({
    id: u.id,
    name: u.name,
    title: u.title,
    department: u.department,
    type: u.type,
    parentId: u.parentId,
    level: u.level,
    headcount: u.headcount,
    totalCompensation: u.totalCompensation,
    managerName: u.managerName,
    managerTitle: u.managerTitle,
    employeeId: u.employeeId,
  }));

  const tree = buildTree(nodes);
  const metrics = computeSummaryMetrics(nodes);

  const formatCurrency = (val: number) =>
    val >= 1_000_000
      ? `$${(val / 1_000_000).toFixed(1)}M`
      : `$${(val / 1_000).toFixed(0)}k`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; All Engagements
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {engagement.name}
          </h1>
          <p className="text-sm text-gray-500">{engagement.clientName}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/engagements/${engagement.id}/import`}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Import Data
          </Link>
          <Link
            href={`/engagements/${engagement.id}/analytics`}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Analytics
          </Link>
          <Link
            href={`/engagements/${engagement.id}/findings`}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Findings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <MetricCard label="Total Headcount" value={metrics.totalHeadcount} color="blue" />
        <MetricCard label="Total Compensation" value={formatCurrency(metrics.totalCompensation)} color="green" />
        <MetricCard label="Departments" value={metrics.departmentCount} color="purple" />
        <MetricCard label="Org Levels" value={metrics.levelCount} color="teal" />
        <MetricCard label="Avg Span of Control" value={metrics.avgSpanOfControl} color="orange" />
        <MetricCard label="Managers" value={metrics.managersCount} color="blue" />
        <MetricCard
          label="Span Issues"
          value={metrics.spanIssues}
          color={metrics.spanIssues > 0 ? "red" : "green"}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Organization Chart
        </h2>
        <OrgTree roots={tree} />
      </div>
    </div>
  );
}
