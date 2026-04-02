import { ASSESSMENT_TEMPLATES } from "@/lib/flow-templates";

export default function TemplatesPage() {
  const templates = Object.entries(ASSESSMENT_TEMPLATES);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Flow Templates</h1>
        <p className="text-gray-500 mt-1">
          Pre-built assessment workflow templates powered by AI
        </p>
      </div>

      <div className="grid gap-6">
        {templates.map(([key, template]) => {
          const totalTasks = template.phases.reduce((acc, p) => acc + p.tasks.length, 0);
          return (
            <div key={key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
                    <p className="text-gray-500 mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                      {template.phases.length} phases
                    </span>
                    <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                      {totalTasks} tasks
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="space-y-4">
                  {template.phases.map((phase, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{phase.name}</h3>
                        <p className="text-sm text-gray-500">{phase.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {phase.tasks.map((task, j) => (
                            <span
                              key={j}
                              className={`text-xs px-2 py-0.5 rounded border ${
                                task.priority === "Critical"
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : task.priority === "High"
                                  ? "bg-orange-50 text-orange-600 border-orange-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {task.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
