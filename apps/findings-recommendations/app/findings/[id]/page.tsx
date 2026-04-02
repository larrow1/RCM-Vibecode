import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SeverityBadge } from "@/components/severity-badge";
import { WorkstreamBadge } from "@/components/workstream-badge";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function FindingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const finding = await prisma.finding.findUnique({
    where: { id: params.id },
    include: {
      evidence: true,
      linksFrom: {
        include: { toFinding: true },
      },
      linksTo: {
        include: { fromFinding: true },
      },
      recommendationFindings: {
        include: { recommendation: true },
      },
      themeFindings: {
        include: { theme: true },
      },
    },
  });

  if (!finding) return notFound();

  const tags = finding.tags
    ? finding.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Combine bidirectional links
  const linkedFindings = [
    ...finding.linksFrom.map((l) => ({
      linkId: l.id,
      finding: l.toFinding,
      description: l.description,
      direction: "outgoing" as const,
    })),
    ...finding.linksTo.map((l) => ({
      linkId: l.id,
      finding: l.fromFinding,
      description: l.description,
      direction: "incoming" as const,
    })),
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/findings" className="hover:text-gray-700">
          Findings
        </Link>
        <span>/</span>
        <span className="text-gray-900">{finding.title}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-900">{finding.title}</h1>
          <div className="flex gap-2">
            <SeverityBadge severity={finding.severity} />
            <WorkstreamBadge workstream={finding.workstream} />
            <StatusBadge status={finding.status} />
          </div>
        </div>

        <p className="text-gray-700">{finding.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Category:</span>{" "}
            <span className="font-medium">{finding.category}</span>
          </div>
          {finding.financialImpact != null && (
            <div>
              <span className="text-gray-500">Financial Impact:</span>{" "}
              <span className="font-medium text-green-700">
                ${finding.financialImpact.toLocaleString()}
              </span>
            </div>
          )}
          {finding.createdBy && (
            <div>
              <span className="text-gray-500">Created By:</span>{" "}
              <span className="font-medium">{finding.createdBy}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500">Created:</span>{" "}
            <span className="font-medium">
              {new Date(finding.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Evidence ({finding.evidence.length})
        </h2>
        {finding.evidence.length > 0 ? (
          <div className="space-y-3">
            {finding.evidence.map((ev) => (
              <div key={ev.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700">{ev.description}</p>
                {(ev.sourceType || ev.sourceRef) && (
                  <div className="mt-1 flex gap-3 text-xs text-gray-500">
                    {ev.sourceType && <span>Type: {ev.sourceType}</span>}
                    {ev.sourceRef && <span>Ref: {ev.sourceRef}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No evidence attached</p>
        )}
      </div>

      {/* Linked Findings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Cross-References ({linkedFindings.length})
        </h2>
        {linkedFindings.length > 0 ? (
          <div className="space-y-2">
            {linkedFindings.map((link) => (
              <Link
                key={link.linkId}
                href={`/findings/${link.finding.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{link.finding.title}</p>
                  {link.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <SeverityBadge severity={link.finding.severity} />
                  <WorkstreamBadge workstream={link.finding.workstream} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No cross-references</p>
        )}
      </div>

      {/* Themes */}
      {finding.themeFindings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Themes</h2>
          <div className="flex flex-wrap gap-2">
            {finding.themeFindings.map((tf) => (
              <Link
                key={tf.theme.id}
                href="/themes"
                className="px-3 py-1 rounded-full text-sm font-medium border"
                style={{
                  backgroundColor: tf.theme.color + "20",
                  borderColor: tf.theme.color,
                  color: tf.theme.color,
                }}
              >
                {tf.theme.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {finding.recommendationFindings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Supporting Recommendations
          </h2>
          <div className="space-y-2">
            {finding.recommendationFindings.map((rf) => (
              <Link
                key={rf.recommendation.id}
                href={`/recommendations/${rf.recommendation.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
              >
                <span className="text-sm font-medium text-gray-900">
                  {rf.recommendation.title}
                </span>
                <StatusBadge status={rf.recommendation.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
