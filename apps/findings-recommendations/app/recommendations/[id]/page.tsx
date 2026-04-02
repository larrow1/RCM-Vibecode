import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TypeBadge } from "@/components/type-badge";
import { StatusBadge } from "@/components/status-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { WorkstreamBadge } from "@/components/workstream-badge";
import {
  calculateImpact,
  CONFIDENCE_MULTIPLIERS,
  EFFORT_DIVISORS,
  type ConfidenceLevel,
  type EffortLevel,
} from "@/lib/impact-calculator";

export const dynamic = "force-dynamic";

const timeframeLabels: Record<string, string> = {
  QuickWin: "Quick Win (0-3 months)",
  ShortTerm: "Short Term (3-6 months)",
  MediumTerm: "Medium Term (6-12 months)",
  LongTerm: "Long Term (12+ months)",
};

export default async function RecommendationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recommendation = await prisma.recommendation.findUnique({
    where: { id: params.id },
    include: {
      recommendationFindings: {
        include: {
          finding: {
            include: { _count: { select: { evidence: true } } },
          },
        },
      },
    },
  });

  if (!recommendation) return notFound();

  const hasImpactData =
    recommendation.impactBase != null &&
    recommendation.impactAdjPct != null &&
    recommendation.impactConfidence != null &&
    recommendation.effort != null;

  const impact = hasImpactData
    ? calculateImpact({
        impactBase: recommendation.impactBase!,
        impactAdjPct: recommendation.impactAdjPct!,
        impactConfidence: recommendation.impactConfidence as ConfidenceLevel,
        effort: recommendation.effort as EffortLevel,
      })
    : null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/recommendations" className="hover:text-gray-700">
          Recommendations
        </Link>
        <span>/</span>
        <span className="text-gray-900">{recommendation.title}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-900">{recommendation.title}</h1>
          <div className="flex gap-2">
            <TypeBadge type={recommendation.type} />
            <StatusBadge status={recommendation.status} />
          </div>
        </div>

        <p className="text-gray-700">{recommendation.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {recommendation.effort && (
            <div>
              <span className="text-gray-500">Effort:</span>{" "}
              <span className="font-medium">{recommendation.effort}</span>
            </div>
          )}
          {recommendation.timeframe && (
            <div>
              <span className="text-gray-500">Timeframe:</span>{" "}
              <span className="font-medium">
                {timeframeLabels[recommendation.timeframe] || recommendation.timeframe}
              </span>
            </div>
          )}
        </div>

        {recommendation.risks && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Risks</h3>
            <p className="text-sm text-gray-700">{recommendation.risks}</p>
          </div>
        )}

        {recommendation.dependencies && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Dependencies</h3>
            <p className="text-sm text-gray-700">{recommendation.dependencies}</p>
          </div>
        )}
      </div>

      {/* Impact Calculator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Analysis</h2>
        {hasImpactData && impact ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Base Amount</p>
                <p className="text-lg font-bold text-gray-900">
                  ${recommendation.impactBase!.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Adjustment %</p>
                <p className="text-lg font-bold text-gray-900">
                  {recommendation.impactAdjPct}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Calculated Impact</p>
                <p className="text-lg font-bold text-green-700">
                  ${impact.calculatedImpact.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  Confidence ({recommendation.impactConfidence} ={" "}
                  {CONFIDENCE_MULTIPLIERS[recommendation.impactConfidence as ConfidenceLevel]}x)
                </p>
                <p className="text-lg font-bold text-blue-700">
                  ${impact.weightedImpact.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="text-xs text-indigo-600">Effort Divisor</p>
                <p className="text-lg font-bold text-indigo-700">
                  {recommendation.effort} ({EFFORT_DIVISORS[recommendation.effort as EffortLevel]}x)
                </p>
              </div>
              <div className="text-2xl text-indigo-300">=</div>
              <div>
                <p className="text-xs text-indigo-600">Priority Score</p>
                <p className="text-2xl font-bold text-indigo-700">
                  ${impact.priorityScore.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Impact data incomplete. Set base amount, adjustment %, confidence, and effort to calculate.
          </p>
        )}
      </div>

      {/* Supporting Findings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Supporting Findings ({recommendation.recommendationFindings.length})
        </h2>
        {recommendation.recommendationFindings.length > 0 ? (
          <div className="space-y-2">
            {recommendation.recommendationFindings.map((rf) => (
              <Link
                key={rf.finding.id}
                href={`/findings/${rf.finding.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{rf.finding.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {rf.finding.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <SeverityBadge severity={rf.finding.severity} />
                  <WorkstreamBadge workstream={rf.finding.workstream} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No supporting findings linked</p>
        )}
      </div>
    </div>
  );
}
