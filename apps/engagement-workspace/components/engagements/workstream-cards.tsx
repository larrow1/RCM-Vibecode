import { ProgressBar } from "@/components/ui/progress-bar";
import { computeWorkstreamProgress } from "@/lib/utils";

interface WorkstreamCardsProps {
  dataRequests: Array<{ category: string; status: string }>;
  documentCounts: Record<string, number>;
}

const workstreamMeta: Record<
  string,
  { label: string; icon: string; color: string; link?: string }
> = {
  Financial: {
    label: "Financial Analysis",
    icon: "chart",
    color: "border-green-500",
    link: "http://localhost:3002",
  },
  Organizational: {
    label: "Org Assessment",
    icon: "people",
    color: "border-blue-500",
  },
  Contracts: {
    label: "Contract Review",
    icon: "document",
    color: "border-purple-500",
  },
};

const docCategoryMap: Record<string, string[]> = {
  Financial: ["FinancialStatement"],
  Organizational: ["OrgChart", "HRData"],
  Contracts: ["Contract"],
};

export function WorkstreamCards({
  dataRequests,
  documentCounts,
}: WorkstreamCardsProps) {
  const progress = computeWorkstreamProgress(dataRequests);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {progress.map((ws) => {
        const meta = workstreamMeta[ws.workstream];
        const docCategories = docCategoryMap[ws.workstream] || [];
        const docCount = docCategories.reduce(
          (sum, cat) => sum + (documentCounts[cat] || 0),
          0
        );

        return (
          <div
            key={ws.workstream}
            className={`bg-white rounded-lg border-l-4 ${meta.color} border border-gray-200 p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{meta.label}</h3>
              {meta.link && (
                <a
                  href={meta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Open Tool
                </a>
              )}
            </div>
            <ProgressBar
              value={ws.received}
              max={ws.total}
              label="Data Received"
            />
            <div className="mt-3 text-sm text-gray-500">
              {docCount} document{docCount !== 1 ? "s" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
