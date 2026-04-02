import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeFlowProgress } from "@/lib/flow-templates";

export const dynamic = "force-dynamic";

export default async function FlowsPage() {
  const flows = await prisma.flow.findMany({
    include: {
      engagement: true,
      phases: {
        include: { tasks: { select: { status: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Flows</h1>
          <p className="text-gray-500 mt-1">Manage assessment workflows and track completion</p>
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

      {flows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No flows yet</h3>
          <p className="mt-2 text-gray-500">Create your first AI-powered progress flow to get started.</p>
          <Link
            href="/flows/new"
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Flow
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {flows.map((flow) => {
            const progress = computeFlowProgress(flow.phases);
            return (
              <Link
                key={flow.id}
                href={`/flows/${flow.id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{flow.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {flow.engagement.clientName} - {flow.engagement.name}
                    </p>
                    {flow.description && (
                      <p className="text-sm text-gray-600 mt-2">{flow.description}</p>
                    )}
                  </div>
                  <StatusBadge status={flow.status} />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{flow.phases.length} phases</span>
                    <span>{progress.completedTasks}/{progress.totalTasks} tasks ({progress.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {flow.phases.map((phase) => {
                    const phaseTasks = phase.tasks.length;
                    const phaseCompleted = phase.tasks.filter((t) => t.status === "Completed").length;
                    return (
                      <span
                        key={phase.id}
                        className={`text-xs px-2 py-1 rounded ${
                          phaseCompleted === phaseTasks && phaseTasks > 0
                            ? "bg-green-100 text-green-700"
                            : phaseCompleted > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {phase.name} ({phaseCompleted}/{phaseTasks})
                      </span>
                    );
                  })}
                </div>
              </Link>
            );
          })}
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
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
