"use client";

import { useState } from "react";

interface FindingFormProps {
  engagementId: string;
  onSubmit: (data: FindingFormData) => void;
  onCancel: () => void;
}

export interface FindingFormData {
  title: string;
  description: string;
  category: string;
  severity: string;
  financialImpact?: number;
  tags?: string;
}

export function FindingForm({
  engagementId,
  onSubmit,
  onCancel,
}: FindingFormProps) {
  const [formData, setFormData] = useState<FindingFormData>({
    title: "",
    description: "",
    category: "Observation",
    severity: "Medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option>Risk</option>
            <option>Opportunity</option>
            <option>Observation</option>
            <option>Anomaly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Severity
          </label>
          <select
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Informational</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Financial Impact ($)
        </label>
        <input
          type="number"
          value={formData.financialImpact ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              financialImpact: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            })
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="cost-structure, margin-erosion"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Finding
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
