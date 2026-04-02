"use client";

import Link from "next/link";
import {
  calculateImpact,
  computeImpactThreshold,
  getQuadrant,
  type ConfidenceLevel,
  type EffortLevel,
  type Quadrant,
} from "@/lib/impact-calculator";

interface MatrixRecommendation {
  id: string;
  title: string;
  impactBase: number | null;
  impactAdjPct: number | null;
  impactConfidence: string | null;
  effort: string | null;
}

interface PriorityMatrixProps {
  recommendations: MatrixRecommendation[];
}

const quadrantStyles: Record<Quadrant, { bg: string; border: string; label: string; desc: string }> = {
  "Quick Win": {
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Quick Wins",
    desc: "High impact, low effort",
  },
  "Strategic Initiative": {
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Strategic Initiatives",
    desc: "High impact, high effort",
  },
  "Fill-in": {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    label: "Fill-ins",
    desc: "Low impact, low effort",
  },
  Deprioritize: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Deprioritize",
    desc: "Low impact, high effort",
  },
};

export function PriorityMatrix({ recommendations }: PriorityMatrixProps) {
  // Calculate weighted impacts for all recs that have complete data
  const recsWithImpact = recommendations
    .filter(
      (r) =>
        r.impactBase != null &&
        r.impactAdjPct != null &&
        r.impactConfidence != null &&
        r.effort != null
    )
    .map((r) => {
      const result = calculateImpact({
        impactBase: r.impactBase!,
        impactAdjPct: r.impactAdjPct!,
        impactConfidence: r.impactConfidence as ConfidenceLevel,
        effort: r.effort as EffortLevel,
      });
      return { ...r, ...result };
    });

  const threshold = computeImpactThreshold(recsWithImpact.map((r) => r.weightedImpact));

  const grouped: Record<Quadrant, typeof recsWithImpact> = {
    "Quick Win": [],
    "Strategic Initiative": [],
    "Fill-in": [],
    Deprioritize: [],
  };

  for (const rec of recsWithImpact) {
    const quadrant = getQuadrant(rec.weightedImpact, rec.effort as EffortLevel, threshold);
    grouped[quadrant].push(rec);
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px]">
      {/* Top-left: Quick Wins (High impact, Low effort) */}
      <QuadrantCell quadrant="Quick Win" items={grouped["Quick Win"]} />
      {/* Top-right: Strategic Initiatives (High impact, High effort) */}
      <QuadrantCell quadrant="Strategic Initiative" items={grouped["Strategic Initiative"]} />
      {/* Bottom-left: Fill-ins (Low impact, Low effort) */}
      <QuadrantCell quadrant="Fill-in" items={grouped["Fill-in"]} />
      {/* Bottom-right: Deprioritize (Low impact, High effort) */}
      <QuadrantCell quadrant="Deprioritize" items={grouped["Deprioritize"]} />
    </div>
  );
}

function QuadrantCell({
  quadrant,
  items,
}: {
  quadrant: Quadrant;
  items: Array<{ id: string; title: string; weightedImpact: number; priorityScore: number }>;
}) {
  const style = quadrantStyles[quadrant];
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-3 overflow-y-auto`}>
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-800">{style.label}</h4>
        <p className="text-xs text-gray-500">{style.desc}</p>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/recommendations/${item.id}`}
            className="block px-2 py-1.5 bg-white rounded border border-gray-100 hover:border-gray-300 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700 line-clamp-1">{item.title}</span>
            <span className="text-xs text-gray-400 ml-1">
              ${(item.weightedImpact / 1000).toFixed(0)}K
            </span>
          </Link>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400 italic">No recommendations</p>
        )}
      </div>
    </div>
  );
}
