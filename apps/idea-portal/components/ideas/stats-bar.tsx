import type { IdeaStats } from "@/lib/idea-utils";

export function StatsBar({ stats }: { stats: IdeaStats }) {
  return (
    <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-white px-6 py-3">
      <div>
        <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
        <span className="ml-1 text-sm text-gray-500">ideas</span>
      </div>
      <div className="h-8 w-px bg-gray-200" />
      <div>
        <span className="text-2xl font-bold text-blue-600">{stats.totalVotes}</span>
        <span className="ml-1 text-sm text-gray-500">votes</span>
      </div>
      <div className="h-8 w-px bg-gray-200" />
      <div className="flex gap-2 text-xs">
        {Object.entries(stats.byStatus)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([status, count]) => (
            <span key={status} className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
              {status}: {count}
            </span>
          ))}
      </div>
    </div>
  );
}
