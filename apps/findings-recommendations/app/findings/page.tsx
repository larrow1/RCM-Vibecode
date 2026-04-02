import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FindingCard } from "@/components/finding-card";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    workstream?: string;
    severity?: string;
    status?: string;
  };
}

export default async function FindingsListPage({ searchParams }: Props) {
  const where: Record<string, string> = {};
  if (searchParams.workstream) where.workstream = searchParams.workstream;
  if (searchParams.severity) where.severity = searchParams.severity;
  if (searchParams.status) where.status = searchParams.status;

  const findings = await prisma.finding.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { evidence: true, linksFrom: true, linksTo: true },
      },
    },
  });

  const workstreams = ["Financial", "Organizational", "Contracts", "CrossCutting"];
  const severities = ["Critical", "High", "Medium", "Low", "Informational"];
  const statuses = ["Draft", "Confirmed", "Disputed", "Resolved"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Findings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {findings.length} finding{findings.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/findings/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Finding
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <FilterDropdown
          label="Workstream"
          param="workstream"
          options={workstreams}
          current={searchParams.workstream}
          searchParams={searchParams}
        />
        <FilterDropdown
          label="Severity"
          param="severity"
          options={severities}
          current={searchParams.severity}
          searchParams={searchParams}
        />
        <FilterDropdown
          label="Status"
          param="status"
          options={statuses}
          current={searchParams.status}
          searchParams={searchParams}
        />
        {Object.keys(where).length > 0 && (
          <Link
            href="/findings"
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
          >
            Clear filters
          </Link>
        )}
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>

      {findings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No findings match your filters</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new finding</p>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  param,
  options,
  current,
  searchParams,
}: {
  label: string;
  param: string;
  options: string[];
  current?: string;
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500">{label}:</span>
      <div className="flex gap-1">
        {options.map((opt) => {
          const params = new URLSearchParams();
          for (const [k, v] of Object.entries(searchParams)) {
            if (v && k !== param) params.set(k, v);
          }
          if (opt !== current) params.set(param, opt);
          const href = `/findings${params.toString() ? `?${params}` : ""}`;
          const isActive = opt === current;
          return (
            <Link
              key={opt}
              href={href}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {opt === "CrossCutting" ? "Cross-Cutting" : opt}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
