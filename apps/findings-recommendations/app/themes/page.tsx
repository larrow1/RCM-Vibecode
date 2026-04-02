import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SeverityBadge } from "@/components/severity-badge";
import { WorkstreamBadge } from "@/components/workstream-badge";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    include: {
      themeFindings: {
        include: {
          finding: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Findings grouped by theme for narrative organization
          </p>
        </div>
      </div>

      {themes.length > 0 ? (
        <div className="space-y-6">
          {themes.map((theme) => {
            const findings = theme.themeFindings.map((tf) => tf.finding);
            const severityCounts: Record<string, number> = {};
            let totalImpact = 0;
            for (const f of findings) {
              severityCounts[f.severity] = (severityCounts[f.severity] || 0) + 1;
              if (f.financialImpact) totalImpact += f.financialImpact;
            }

            return (
              <div
                key={theme.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderLeft: `4px solid ${theme.color}` }}
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{theme.name}</h2>
                    {theme.description && (
                      <p className="text-sm text-gray-500 mt-0.5">{theme.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{findings.length} findings</span>
                    {totalImpact > 0 && (
                      <span className="font-medium text-green-700">
                        ${(totalImpact / 1000).toFixed(0)}K total impact
                      </span>
                    )}
                  </div>
                </div>

                {/* Severity distribution */}
                {Object.keys(severityCounts).length > 0 && (
                  <div className="px-6 py-2 bg-gray-50 border-t border-b border-gray-100 flex gap-3">
                    {Object.entries(severityCounts).map(([sev, count]) => (
                      <span key={sev} className="flex items-center gap-1">
                        <SeverityBadge severity={sev} />
                        <span className="text-xs text-gray-500">{count}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Findings list */}
                <div className="divide-y divide-gray-100">
                  {findings.map((finding) => (
                    <Link
                      key={finding.id}
                      href={`/findings/${finding.id}`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <SeverityBadge severity={finding.severity} />
                        <span className="text-sm text-gray-900">{finding.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <WorkstreamBadge workstream={finding.workstream} />
                        {finding.financialImpact != null && (
                          <span className="text-xs text-gray-400">
                            ${(finding.financialImpact / 1000).toFixed(0)}K
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                  {findings.length === 0 && (
                    <p className="px-6 py-3 text-sm text-gray-400">No findings in this theme</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No themes created yet</p>
          <p className="text-sm mt-1">Themes help organize findings into narrative groups</p>
        </div>
      )}
    </div>
  );
}
