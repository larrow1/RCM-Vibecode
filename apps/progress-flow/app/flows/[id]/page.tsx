import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeFlowProgress } from "@/lib/flow-templates";
import { FlowBoard } from "@/components/flows/flow-board";

export const dynamic = "force-dynamic";

export default async function FlowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const flow = await prisma.flow.findUnique({
    where: { id: params.id },
    include: {
      engagement: true,
      phases: {
        include: {
          tasks: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!flow) return notFound();

  const progress = computeFlowProgress(flow.phases);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{flow.name}</h1>
            <StatusBadge status={flow.status} />
          </div>
          <p className="text-gray-500 mt-1">
            {flow.engagement.clientName} - {flow.engagement.name}
          </p>
          {flow.description && (
            <p className="text-gray-600 mt-2">{flow.description}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{progress.percentage}%</div>
          <div className="text-sm text-gray-500">
            {progress.completedTasks}/{progress.totalTasks} tasks
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {flow.phases.map((phase, index) => {
          const phaseTasks = phase.tasks.length;
          const phaseCompleted = phase.tasks.filter((t) => t.status === "Completed").length;
          const phasePercent = phaseTasks === 0 ? 0 : Math.round((phaseCompleted / phaseTasks) * 100);
          const isActive = phase.status === "In Progress";

          return (
            <div
              key={phase.id}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 text-sm ${
                phase.status === "Completed"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : isActive
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <div className="font-medium">Phase {index + 1}: {phase.name}</div>
              <div className="text-xs mt-1">{phaseCompleted}/{phaseTasks} tasks ({phasePercent}%)</div>
            </div>
          );
        })}
      </div>

      {/* Interactive Board */}
      <FlowBoard flowId={flow.id} initialPhases={flow.phases} />
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
