import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/shared/badge";
import { Card, CardTitle } from "@/components/shared/card";
import { EvidenceLink } from "@/components/findings/evidence-link";
import { formatCurrency } from "@/lib/financial-utils";

export const dynamic = "force-dynamic";

export default async function FindingDetailPage({
  params,
}: {
  params: { id: string; findingId: string };
}) {
  const finding = await prisma.finding.findUnique({
    where: { id: params.findingId },
    include: {
      engagement: true,
      evidence: {
        include: {
          lineItem: {
            include: {
              financialStatement: true,
            },
          },
        },
      },
    },
  });

  if (!finding) return notFound();

  const evidenceItems = finding.evidence.map((ev) => ({
    id: ev.lineItem.id,
    accountName: ev.lineItem.accountName,
    standardCategory: ev.lineItem.standardCategory,
    amount: ev.lineItem.amount,
    period: ev.lineItem.financialStatement.period,
    entity: ev.lineItem.financialStatement.entity,
  }));

  return (
    <div>
      <Header
        title={finding.title}
        subtitle={`Finding for ${finding.engagement.name}`}
        actions={
          <Link
            href={`/engagements/${finding.engagementId}/findings`}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to Findings
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        <Badge variant="severity">{finding.severity}</Badge>
        <Badge variant="category">{finding.category}</Badge>
        <Badge variant="status">{finding.status}</Badge>
        {finding.workstream && (
          <Badge>{finding.workstream}</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Description</CardTitle>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {finding.description}
            </p>
          </Card>

          <Card>
            <CardTitle>Financial Evidence</CardTitle>
            <div className="mt-4">
              <EvidenceLink items={evidenceItems} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle>Details</CardTitle>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Financial Impact</dt>
                <dd className="font-medium">
                  {finding.financialImpact != null
                    ? formatCurrency(finding.financialImpact)
                    : "Not estimated"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Tags</dt>
                <dd>{finding.tags ?? "None"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd>{finding.createdAt.toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Updated</dt>
                <dd>{finding.updatedAt.toLocaleDateString()}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
