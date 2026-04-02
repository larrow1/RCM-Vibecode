"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEngagementPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      clientName: form.get("clientName"),
      type: form.get("type"),
      startDate: form.get("startDate"),
      scopeDescription: form.get("scopeDescription") || undefined,
    };

    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create engagement");
      }
      const engagement = await res.json();
      router.push(`/engagements/${engagement.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create engagement");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Engagement</h1>

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Name *</label>
          <input name="name" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="e.g., Acme Corp Org Assessment" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
          <input name="clientName" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="e.g., Acme Corporation" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select name="type" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="OrgAssessment">Org Assessment</option>
              <option value="DueDiligence">Due Diligence</option>
              <option value="PostMergerIntegration">Post-Merger Integration</option>
              <option value="CostOptimization">Cost Optimization</option>
              <option value="OperationalAssessment">Operational Assessment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input name="startDate" type="date" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scope Description</label>
          <textarea name="scopeDescription" rows={3} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="What's in scope for this assessment..." />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Engagement"}
        </button>
      </form>
    </div>
  );
}
