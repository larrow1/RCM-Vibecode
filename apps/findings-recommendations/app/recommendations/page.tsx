import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RecommendationCard } from "@/components/recommendation-card";
import { PriorityMatrix } from "@/components/priority-matrix";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    view?: string;
    type?: string;
    status?: string;
  };
}

export default async function RecommendationsListPage({ searchParams }: Props) {
  const where: Record<string, string> = {};
  if (searchParams.type) where.type = searchParams.type;
  if (searchParams.status) where.status = searchParams.status;

  const recommendations = await prisma.recommendation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { recommendationFindings: true } },
    },
  });

  const isMatrixView = searchParams.view === "matrix";
  const types = [
    "CostReduction",
    "RevenueEnhancement",
    "RiskMitigation",
    "OperationalImprovement",
    "StructuralChange",
  ];
  const statuses = ["Draft", "Reviewed", "Approved", "Presented"];
  const typeLabels: Record<string, string> = {
    CostReduction: "Cost Reduction",
    RevenueEnhancement: "Revenue Enhancement",
    RiskMitigation: "Risk Mitigation",
    OperationalImprovement: "Operational Improvement",
    StructuralChange: "Structural Change",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={isMatrixView ? "/recommendations" : "/recommendations?view=matrix"}
            className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            {isMatrixView ? "List View" : "Matrix View"}
          </Link>
          <Link
            href="/recommendations/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            New Recommendation
          </Link>
        </div>
      </div>

      {/* Filters (list view only) */}
      {!isMatrixView && (
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Type:</span>
            <div className="flex gap-1">
              {types.map((t) => {
                const params = new URLSearchParams();
                for (const [k, v] of Object.entries(searchParams)) {
                  if (v && k !== "type") params.set(k, v);
                }
                if (t !== searchParams.type) params.set("type", t);
                const href = `/recommendations${params.toString() ? `?${params}` : ""}`;
                return (
                  <Link
                    key={t}
                    href={href}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      t === searchParams.type
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {typeLabels[t] || t}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Status:</span>
            <div className="flex gap-1">
              {statuses.map((s) => {
                const params = new URLSearchParams();
                for (const [k, v] of Object.entries(searchParams)) {
                  if (v && k !== "status") params.set(k, v);
                }
                if (s !== searchParams.status) params.set("status", s);
                const href = `/recommendations${params.toString() ? `?${params}` : ""}`;
                return (
                  <Link
                    key={s}
                    href={href}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      s === searchParams.status
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </Link>
                );
              })}
            </div>
          </div>
          {Object.keys(where).length > 0 && (
            <Link
              href="/recommendations"
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
            >
              Clear filters
            </Link>
          )}
        </div>
      )}

      {isMatrixView ? (
        <PriorityMatrix recommendations={recommendations} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No recommendations yet</p>
          <p className="text-sm mt-1">Create one to get started</p>
        </div>
      )}
    </div>
  );
}
