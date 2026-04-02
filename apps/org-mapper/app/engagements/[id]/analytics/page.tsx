import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  computeSpanOfControl,
  computeHeadcountByDepartment,
  computeHeadcountByLevel,
  detectDuplicateRoles,
  computeSummaryMetrics,
  type OrgNode,
} from "@/lib/org-utils";
import { SpanOfControlTable } from "@/components/analytics/span-of-control-table";
import { HeadcountSummary } from "@/components/analytics/headcount-summary";
import { DuplicationTable } from "@/components/analytics/duplication-table";
import { MetricCard } from "@/components/dashboard/metric-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      orgUnits: { orderBy: [{ level: "asc" }, { name: "asc" }] },
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

  const metrics = computeSummaryMetrics(nodes);
  const spanOfControl = computeSpanOfControl(nodes);
  const byDepartment = computeHeadcountByDepartment(nodes);
  const byLevel = computeHeadcountByLevel(nodes);
  const duplicates = detectDuplicateRoles(nodes);

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/engagements/${params.id}`} className="text-sm text-blue-600 hover:underline">
          &larr; Back to Engagement
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Organizational Analytics
        </h1>
        <p className="text-sm text-gray-500">{engagement.name} &mdash; {engagement.clientName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Headcount" value={metrics.totalHeadcount} color="blue" />
        <MetricCard label="Avg Span of Control" value={metrics.avgSpanOfControl} color="orange" />
        <MetricCard label="Managers" value={metrics.managersCount} color="purple" />
        <MetricCard
          label="Span Issues"
          value={metrics.spanIssues}
          color={metrics.spanIssues > 0 ? "red" : "green"}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Span of Control Analysis</h2>
        <p className="text-xs text-gray-400 mb-2">
          Healthy range: 3-12 direct reports. Flagged managers are outside this range.
        </p>
        <SpanOfControlTable entries={spanOfControl} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HeadcountSummary title="Headcount by Department" data={byDepartment} />
        <HeadcountSummary title="Headcount by Level" data={byLevel} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Role Duplication Detection</h2>
        <DuplicationTable groups={duplicates} />
      </div>
    </div>
  );
}
