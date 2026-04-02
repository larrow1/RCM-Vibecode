import Link from "next/link";
import { SeverityBadge } from "./severity-badge";
import { WorkstreamBadge } from "./workstream-badge";
import { StatusBadge } from "./status-badge";

interface FindingCardProps {
  finding: {
    id: string;
    title: string;
    description: string;
    workstream: string;
    severity: string;
    category: string;
    status: string;
    tags: string | null;
    financialImpact: number | null;
    createdBy: string | null;
    _count?: {
      evidence: number;
      linksFrom: number;
      linksTo: number;
    };
  };
}

export function FindingCard({ finding }: FindingCardProps) {
  const tags = finding.tags ? finding.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const linkCount = (finding._count?.linksFrom || 0) + (finding._count?.linksTo || 0);

  return (
    <Link
      href={`/findings/${finding.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{finding.title}</h3>
        <SeverityBadge severity={finding.severity} />
      </div>
      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{finding.description}</p>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <WorkstreamBadge workstream={finding.workstream} />
        <StatusBadge status={finding.status} />
        <span className="text-xs text-gray-400">{finding.category}</span>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        {finding.financialImpact != null && (
          <span>${(finding.financialImpact / 1000).toFixed(0)}K impact</span>
        )}
        {finding._count && finding._count.evidence > 0 && (
          <span>{finding._count.evidence} evidence</span>
        )}
        {linkCount > 0 && <span>{linkCount} links</span>}
        {finding.createdBy && <span>by {finding.createdBy}</span>}
      </div>
    </Link>
  );
}
