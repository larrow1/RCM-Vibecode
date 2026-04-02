import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { FindingCard } from "@/components/findings/finding-card";

export const dynamic = "force-dynamic";

export default async function FindingsPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      findings: {
        include: {
          evidence: true,
        },
        orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!engagement) return notFound();

  const severityOrder = ["Critical", "High", "Medium", "Low", "Informational"];
  const sortedFindings = [...engagement.findings].sort(
    (a, b) =>
      severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <div>
      <Header
        title="Findings"
        subtitle={`${engagement.name} - ${engagement.clientName}`}
        actions={
          <Link
            href={`/engagements/${engagement.id}`}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to Engagement
          </Link>
        }
      />

      {sortedFindings.length === 0 ? (
        <p className="text-gray-500">
          No findings yet. Findings will appear here as you analyze financial data.
        </p>
      ) : (
        <div className="space-y-3">
          {sortedFindings.map((f) => (
            <FindingCard
              key={f.id}
              id={f.id}
              engagementId={engagement.id}
              title={f.title}
              category={f.category}
              severity={f.severity}
              status={f.status}
              financialImpact={f.financialImpact}
              description={f.description}
              evidenceCount={f.evidence.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
