import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/shared/badge";
import { Card, CardTitle } from "@/components/shared/card";
import { formatCurrency } from "@/lib/financial-utils";
import { aggregateLineItems } from "@/lib/financial-utils";

export const dynamic = "force-dynamic";

export default async function EngagementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      financialStatements: {
        include: { lineItems: true },
        orderBy: { period: "asc" },
      },
      findings: {
        orderBy: { severity: "asc" },
      },
      ebitdaAdjustments: true,
    },
  });

  if (!engagement) return notFound();

  // Aggregate financials for latest period
  const periods = [
    ...new Set(engagement.financialStatements.map((s) => s.period)),
  ].sort();
  const latestPeriod = periods[periods.length - 1];
  const latestStatements = engagement.financialStatements.filter(
    (s) => s.period === latestPeriod
  );
  const latestLineItems = latestStatements.flatMap((s) => s.lineItems);
  const aggregated = aggregateLineItems(latestLineItems);

  return (
    <div>
      <Header
        title={engagement.name}
        subtitle={`${engagement.clientName} - ${engagement.type}`}
        actions={
          <Badge variant="status">{engagement.status}</Badge>
        }
      />

      {/* Quick Nav */}
      <div className="mb-6 flex gap-3">
        <Link
          href={`/engagements/${engagement.id}/import`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Import Data
        </Link>
        <Link
          href={`/engagements/${engagement.id}/analysis`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Analysis
        </Link>
        <Link
          href={`/engagements/${engagement.id}/findings`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Findings ({engagement.findings.length})
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500">Statements</p>
          <p className="text-2xl font-bold">
            {engagement.financialStatements.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Periods</p>
          <p className="text-2xl font-bold">{periods.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Latest Revenue</p>
          <p className="text-2xl font-bold">
            {formatCurrency(aggregated.revenue)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Findings</p>
          <p className="text-2xl font-bold">{engagement.findings.length}</p>
        </Card>
      </div>

      {/* Financial Statements Table */}
      <Card className="mb-6">
        <CardTitle>Financial Statements</CardTitle>
        {engagement.financialStatements.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            No financial statements imported yet.{" "}
            <Link
              href={`/engagements/${engagement.id}/import`}
              className="text-blue-600 hover:underline"
            >
              Import now
            </Link>
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Entity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Period
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                    Line Items
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {engagement.financialStatements.map((stmt) => (
                  <tr key={stmt.id}>
                    <td className="px-4 py-2">{stmt.entity}</td>
                    <td className="px-4 py-2">{stmt.period}</td>
                    <td className="px-4 py-2">{stmt.statementType}</td>
                    <td className="px-4 py-2 text-right">
                      {stmt.lineItems.length}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {stmt.sourceFileName ?? "Manual"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Recent Findings */}
      <Card>
        <CardTitle>Recent Findings</CardTitle>
        {engagement.findings.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No findings yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {engagement.findings.slice(0, 5).map((f) => (
              <Link
                key={f.id}
                href={`/engagements/${engagement.id}/findings/${f.id}`}
                className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-2 hover:bg-gray-50"
              >
                <div>
                  <span className="text-sm font-medium">{f.title}</span>
                  <span className="ml-2">
                    <Badge variant="severity">{f.severity}</Badge>
                  </span>
                </div>
                <Badge variant="status">{f.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
