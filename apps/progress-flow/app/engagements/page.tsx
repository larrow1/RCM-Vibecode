import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const engagements = await prisma.engagement.findMany({
    include: {
      _count: { select: { flows: true } },
      flows: {
        include: {
          phases: {
            include: { tasks: { select: { status: true } } },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
        <p className="text-gray-500 mt-1">Assessment engagements with progress flows</p>
      </div>

      {engagements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No engagements yet</h3>
          <p className="text-gray-500 mt-2">Engagements will appear here once seeded or created.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {engagements.map((eng) => {
            let totalTasks = 0;
            let completedTasks = 0;
            for (const flow of eng.flows) {
              for (const phase of flow.phases) {
                for (const task of phase.tasks) {
                  totalTasks++;
                  if (task.status === "Completed") completedTasks++;
                }
              }
            }
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return (
              <div key={eng.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{eng.name}</h3>
                    <p className="text-sm text-gray-500">{eng.clientName} - {eng.type}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    eng.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    eng.status === "Completed" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {eng.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>{eng._count.flows} flow(s)</span>
                  <span>{totalTasks} tasks</span>
                  {totalTasks > 0 && (
                    <span className="text-indigo-600 font-medium">{progress}% complete</span>
                  )}
                </div>

                {totalTasks > 0 && (
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                )}

                {eng.flows.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {eng.flows.map((flow) => (
                      <Link
                        key={flow.id}
                        href={`/flows/${flow.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        {flow.name || "View Flow"} &rarr;
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
