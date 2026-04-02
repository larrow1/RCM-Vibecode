"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENGAGEMENT_TYPES, ENGAGEMENT_STATUSES } from "@/lib/schemas";

interface EngagementFormProps {
  engagement?: {
    id: string;
    name: string;
    clientName: string;
    type: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date | null;
    scopeDescription: string | null;
  };
}

function formatDateForInput(date: string | Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function formatType(type: string): string {
  return type.replace(/([A-Z])/g, " $1").trim();
}

export function EngagementForm({ engagement }: EngagementFormProps) {
  const router = useRouter();
  const isEditing = !!engagement;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: engagement?.name || "",
    clientName: engagement?.clientName || "",
    type: engagement?.type || "DueDiligence",
    status: engagement?.status || "Scoping",
    startDate: formatDateForInput(engagement?.startDate || null),
    endDate: formatDateForInput(engagement?.endDate || null),
    scopeDescription: engagement?.scopeDescription || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/engagements/${engagement.id}`
        : "/api/engagements";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          endDate: formData.endDate || null,
          scopeDescription: formData.scopeDescription || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save engagement");
      }

      const data = await res.json();
      router.push(`/engagements/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Engagement Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Acme Corp Financial Due Diligence"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client Name *
        </label>
        <input
          type="text"
          required
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Acme Corporation"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ENGAGEMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ENGAGEMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scope Description
        </label>
        <textarea
          rows={4}
          value={formData.scopeDescription}
          onChange={(e) =>
            setFormData({ ...formData, scopeDescription: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the assessment scope, entities, time periods, and key questions..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Engagement"
            : "Create Engagement"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
