"use client";

import { useState } from "react";
import { TEAM_ROLES } from "@/lib/schemas";

interface TeamFormProps {
  engagementId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeamForm({
  engagementId,
  onSuccess,
  onCancel,
}: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "Associate" as string,
    email: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/engagements/${engagementId}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: formData.email || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add team member");
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
      <h3 className="font-medium text-gray-900 mb-3">Add Team Member</h3>
      {error && (
        <div className="bg-red-50 text-red-800 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {TEAM_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Member"}
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
