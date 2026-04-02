import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { MetricsSummary } from "@/components/dashboard/metrics-summary";
import { EngagementCard } from "@/components/dashboard/engagement-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const engagements = await prisma.engagement.findMany({
    include: {
      financialStatements: {
        include: { lineItems: true },
      },
      findings: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const totalEngagements = engagements.length;
  const totalStatements = engagements.reduce(
    (sum, e) => sum + e.financialStatements.length,
    0
  );
  const totalFindings = engagements.reduce(
    (sum, e) => sum + e.findings.length,
    0
  );
  const activeEngagements = engagements.filter(
    (e) => e.status !== "Complete"
  ).length;

  const metrics = [
    { label: "Active Engagements", value: activeEngagements },
    { label: "Total Statements", value: totalStatements },
    { label: "Total Findings", value: totalFindings },
    { label: "Engagements", value: totalEngagements },
  ];

  return (
    <div>
      <Header
        title="Financial Analyzer"
        subtitle="Assessment engagement financial analysis dashboard"
      />
      <MetricsSummary metrics={metrics} />
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Engagements
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engagements.map((eng) => {
            // Calculate latest revenue from most recent period
            const allLineItems = eng.financialStatements.flatMap(
              (s) => s.lineItems
            );
            const revenueItems = allLineItems.filter(
              (li) => li.standardCategory === "Revenue"
            );
            const latestRevenue =
              revenueItems.length > 0
                ? revenueItems.reduce((sum, li) => sum + li.amount, 0)
                : undefined;

            return (
              <EngagementCard
                key={eng.id}
                id={eng.id}
                name={eng.name}
                clientName={eng.clientName}
                type={eng.type}
                status={eng.status}
                startDate={eng.startDate.toISOString()}
                statementCount={eng.financialStatements.length}
                findingCount={eng.findings.length}
                latestRevenue={latestRevenue}
              />
            );
          })}
        </div>
        {engagements.length === 0 && (
          <p className="text-gray-500">
            No engagements yet. Run the seed script to add sample data.
          </p>
        )}
      </div>
    </div>
  );
}
