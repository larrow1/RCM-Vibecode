import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeFlowProgress } from "@/lib/flow-templates";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const flows = await prisma.flow.findMany({
    include: {
      engagement: true,
      phases: {
        include: { tasks: { select: { status: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const engagementCount = await prisma.engagement.count();
  const flowCount = await prisma.flow.count();
  const activeFlows = await prisma.flow.count({ where: { status: "In Progress" } });
  const totalTasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { status: "Completed" } });

  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-500 mt-1">Track assessment workflows and task progress</p>
        </div>
        <Link
          href="/flows/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          New AI Flow
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Engagements" value={engagementCount} color="blue" />
        <StatCard label="Active Flows" value={activeFlows} total={flowCount} color="indigo" />
        <StatCard label="Tasks Completed" value={completedTasks} total={totalTasks} color="green" />
        <StatCard label="Overall Progress" value={`${overallProgress}%`} color="purple" progress={overallProgress} />
      </div>

      {/* Recent Flows */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Flows</h2>
        </div>
        {flows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No flows created yet</p>
            <Link
              href="/flows/new"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first flow with AI
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {flows.map((flow) => {
              const progress = computeFlowProgress(flow.phases);
              return (
                <Link
                  key={flow.id}
                  href={`/flows/${flow.id}`}
                  className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{flow.name}</div>
                    <div className="text-sm text-gray-500">{flow.engagement.clientName} - {flow.engagement.name}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={flow.status} />
                    <div className="w-32">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{progress.completedTasks}/{progress.totalTasks}</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, total, color, progress }: {
  label: string;
  value: number | string;
  total?: number;
  color: string;
  progress?: number;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${colorMap[color]?.split(" ")[1] || "text-gray-900"}`}>
          {value}
        </span>
        {total !== undefined && (
          <span className="text-sm text-gray-400">/ {total}</span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Not Started": "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-700",
    "Completed": "bg-green-100 text-green-700",
    "On Hold": "bg-yellow-100 text-yellow-700",
    "Blocked": "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
