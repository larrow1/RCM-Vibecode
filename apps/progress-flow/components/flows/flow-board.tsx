"use client";

import { useState } from "react";

interface Task {
  id: string;
  phaseId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: string | null;
  dueDate: string | Date | null;
  aiGenerated: boolean;
  sortOrder: number;
}

interface Phase {
  id: string;
  name: string;
  description: string | null;
  status: string;
  sortOrder: number;
  tasks: Task[];
}

const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Blocked", "Skipped"];
const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Blocked: "bg-red-100 text-red-700",
  Skipped: "bg-gray-100 text-gray-400",
};

export function FlowBoard({
  flowId,
  initialPhases,
}: {
  flowId: string;
  initialPhases: Phase[];
}) {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    initialPhases[0]?.id || null
  );
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateTaskStatus(phaseId: string, taskId: string, newStatus: string) {
    setUpdating(taskId);
    try {
      const response = await fetch(
        `/api/flows/${flowId}/phases/${phaseId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setPhases((prev) =>
          prev.map((phase) =>
            phase.id === phaseId
              ? {
                  ...phase,
                  tasks: phase.tasks.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                  ),
                }
              : phase
          )
        );
      }
    } catch {
      // silently fail, user can retry
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-4">
      {phases.map((phase, phaseIndex) => {
        const isExpanded = expandedPhase === phase.id;
        const completedCount = phase.tasks.filter((t) => t.status === "Completed").length;
        const totalCount = phase.tasks.length;
        const phasePercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

        return (
          <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Phase Header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-sm font-medium text-gray-400">Phase {phaseIndex + 1}</span>
                <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {completedCount}/{totalCount} tasks
                </span>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${phasePercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{phasePercent}%</span>
              </div>
            </button>

            {/* Phase Tasks */}
            {isExpanded && (
              <div className="border-t border-gray-200">
                {phase.description && (
                  <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">{phase.description}</div>
                )}
                <div className="divide-y divide-gray-100">
                  {phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`px-6 py-4 flex items-start gap-4 ${
                        task.status === "Completed" ? "bg-green-50/30" : ""
                      } ${task.status === "Blocked" ? "bg-red-50/30" : ""}`}
                    >
                      {/* Status Toggle */}
                      <button
                        onClick={() =>
                          updateTaskStatus(
                            phase.id,
                            task.id,
                            task.status === "Completed" ? "Pending" : "Completed"
                          )
                        }
                        disabled={updating === task.id}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.status === "Completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-indigo-400"
                        } ${updating === task.id ? "opacity-50" : ""}`}
                      >
                        {task.status === "Completed" && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Task Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              task.status === "Completed"
                                ? "text-gray-400 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.aiGenerated && (
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">AI</span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority] || ""}`}>
                            {task.priority}
                          </span>
                          {task.assignee && (
                            <span className="text-xs text-gray-500">{task.assignee}</span>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-gray-400">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(phase.id, task.id, e.target.value)}
                        disabled={updating === task.id}
                        className={`text-xs px-2 py-1 rounded-lg border-0 ${STATUS_COLORS[task.status] || "bg-gray-100"} cursor-pointer`}
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
