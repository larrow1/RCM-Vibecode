"use client";

import { useState } from "react";
import {
  DATA_REQUEST_CATEGORIES,
  DATA_REQUEST_PRIORITIES,
} from "@/lib/schemas";

interface DataRequestFormProps {
  engagementId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DataRequestForm({
  engagementId,
  onSuccess,
  onCancel,
}: DataRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: "Financial" as string,
    description: "",
    priority: "Medium" as string,
    dueDate: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/engagements/${engagementId}/data-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            dueDate: formData.dueDate || null,
            notes: formData.notes || null,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create data request");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
    >
      <h3 className="font-medium text-gray-900 mb-3">New Data Request</h3>
      {error && (
        <div className="bg-red-50 text-red-800 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {DATA_REQUEST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {DATA_REQUEST_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">
          Description *
        </label>
        <input
          type="text"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          placeholder="What information is needed?"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Additional context..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Request"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
