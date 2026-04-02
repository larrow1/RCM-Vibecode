import Link from "next/link";
import { TypeBadge } from "./type-badge";
import { StatusBadge } from "./status-badge";

interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    impactBase: number | null;
    impactAdjPct: number | null;
    impactConfidence: string | null;
    effort: string | null;
    timeframe: string | null;
    _count?: {
      recommendationFindings: number;
    };
  };
}

const timeframeLabels: Record<string, string> = {
  QuickWin: "0-3 mo",
  ShortTerm: "3-6 mo",
  MediumTerm: "6-12 mo",
  LongTerm: "12+ mo",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const calculatedImpact =
    recommendation.impactBase != null && recommendation.impactAdjPct != null
      ? recommendation.impactBase * (recommendation.impactAdjPct / 100)
      : null;

  return (
    <Link
      href={`/recommendations/${recommendation.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {recommendation.title}
        </h3>
        <TypeBadge type={recommendation.type} />
      </div>
      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{recommendation.description}</p>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <StatusBadge status={recommendation.status} />
        {recommendation.effort && (
          <span className="text-xs text-gray-500">Effort: {recommendation.effort}</span>
        )}
        {recommendation.timeframe && (
          <span className="text-xs text-gray-500">
            {timeframeLabels[recommendation.timeframe] || recommendation.timeframe}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        {calculatedImpact != null && (
          <span className="font-medium text-green-600">
            ${(calculatedImpact / 1000).toFixed(0)}K estimated impact
          </span>
        )}
        {recommendation.impactConfidence && (
          <span>{recommendation.impactConfidence} confidence</span>
        )}
        {recommendation._count && recommendation._count.recommendationFindings > 0 && (
          <span>{recommendation._count.recommendationFindings} findings</span>
        )}
      </div>
    </Link>
  );
}
