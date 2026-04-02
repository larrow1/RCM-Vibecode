"use client";

import { useState } from "react";

interface OrgUnitOption {
  id: string;
  name: string;
  department: string | null;
}

interface FindingFormProps {
  engagementId: string;
  orgUnits: OrgUnitOption[];
  onCreated?: () => void;
}

export function FindingForm({ engagementId, orgUnits, onCreated }: FindingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      engagementId,
      orgUnitId: form.get("orgUnitId") || null,
      category: form.get("category"),
      severity: form.get("severity"),
      title: form.get("title"),
      description: form.get("description"),
      financialImpact: form.get("financialImpact") ? parseFloat(form.get("financialImpact") as string) : null,
      tags: form.get("tags") || "",
    };

    try {
      const res = await fetch("/api/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create finding");
      }
      (e.target as HTMLFormElement).reset();
      onCreated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create finding");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">New Finding</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
          <input name="title" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Linked Org Unit</label>
          <select name="orgUnitId" className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
            <option value="">None</option>
            {orgUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} {u.department ? `(${u.department})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
        <textarea name="description" required rows={3} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
          <select name="category" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
            <option value="Risk">Risk</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Observation">Observation</option>
            <option value="Anomaly">Anomaly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Severity *</label>
          <select name="severity" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
            <option value="Informational">Informational</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Financial Impact ($)</label>
          <input name="financialImpact" type="number" step="0.01" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
        <input name="tags" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="span-of-control, staffing, overhead" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Finding"}
      </button>
    </form>
  );
}
