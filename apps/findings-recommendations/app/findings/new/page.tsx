"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const workstreams = ["Financial", "Organizational", "Contracts", "CrossCutting"];
const categories = ["Risk", "Opportunity", "Observation", "Anomaly"];
const severities = ["Critical", "High", "Medium", "Low", "Informational"];

interface EvidenceItem {
  description: string;
  sourceType: string;
  sourceRef: string;
}

interface EngagementOption {
  id: string;
  name: string;
  clientName: string;
}

export default function NewFindingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [engagements, setEngagements] = useState<EngagementOption[]>([]);
  const [selectedEngagementId, setSelectedEngagementId] = useState("");

  useEffect(() => {
    fetch("/api/engagements")
      .then((res) => res.json())
      .then((data) => {
        setEngagements(data);
        if (data.length > 0) {
          setSelectedEngagementId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      engagementId: form.get("engagementId") as string,
      workstream: form.get("workstream") as string,
      category: form.get("category") as string,
      severity: form.get("severity") as string,
      title: form.get("title") as string,
      description: form.get("description") as string,
      financialImpact: form.get("financialImpact")
        ? Number(form.get("financialImpact"))
        : null,
      tags: (form.get("tags") as string) || null,
      createdBy: (form.get("createdBy") as string) || null,
      evidence: evidence.filter((e) => e.description.trim()),
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
      const finding = await res.json();
      router.push(`/findings/${finding.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  function addEvidence() {
    setEvidence([...evidence, { description: "", sourceType: "", sourceRef: "" }]);
  }

  function updateEvidence(idx: number, field: keyof EvidenceItem, value: string) {
    const updated = [...evidence];
    updated[idx] = { ...updated[idx], [field]: value };
    setEvidence(updated);
  }

  function removeEvidence(idx: number) {
    setEvidence(evidence.filter((_, i) => i !== idx));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Finding</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engagement
          </label>
          <select
            name="engagementId"
            required
            value={selectedEngagementId}
            onChange={(e) => setSelectedEngagementId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="" disabled>Select an engagement...</option>
            {engagements.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name} ({eng.clientName})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workstream
            </label>
            <select
              name="workstream"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {workstreams.map((ws) => (
                <option key={ws} value={ws}>
                  {ws === "CrossCutting" ? "Cross-Cutting" : ws}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            name="severity"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Short description of the finding"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Detailed explanation of what was found"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Financial Impact ($)
            </label>
            <input
              name="financialImpact"
              type="number"
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Optional dollar estimate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <input
              name="createdBy"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Analyst name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            name="tags"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="cost-structure, vendor-risk, staffing"
          />
        </div>

        {/* Evidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Evidence</label>
            <button
              type="button"
              onClick={addEvidence}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add evidence
            </button>
          </div>
          {evidence.map((ev, idx) => (
            <div key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Evidence #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeEvidence(idx)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <input
                value={ev.description}
                onChange={(e) => updateEvidence(idx, "description", e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Evidence description"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={ev.sourceType}
                  onChange={(e) => updateEvidence(idx, "sourceType", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Source type...</option>
                  <option value="FinancialStatement">Financial Statement</option>
                  <option value="OrgUnit">Org Unit</option>
                  <option value="Contract">Contract</option>
                  <option value="Document">Document</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  value={ev.sourceRef}
                  onChange={(e) => updateEvidence(idx, "sourceRef", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Source reference"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Finding"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
