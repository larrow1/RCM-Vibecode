"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const recTypes = [
  { value: "CostReduction", label: "Cost Reduction" },
  { value: "RevenueEnhancement", label: "Revenue Enhancement" },
  { value: "RiskMitigation", label: "Risk Mitigation" },
  { value: "OperationalImprovement", label: "Operational Improvement" },
  { value: "StructuralChange", label: "Structural Change" },
];
const effortLevels = ["Low", "Medium", "High"];
const timeframes = [
  { value: "QuickWin", label: "Quick Win (0-3 months)" },
  { value: "ShortTerm", label: "Short Term (3-6 months)" },
  { value: "MediumTerm", label: "Medium Term (6-12 months)" },
  { value: "LongTerm", label: "Long Term (12+ months)" },
];
const confidenceLevels = ["High", "Medium", "Low"];

interface FindingOption {
  id: string;
  title: string;
  workstream: string;
  severity: string;
}

export default function NewRecommendationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [findings, setFindings] = useState<FindingOption[]>([]);
  const [selectedFindingIds, setSelectedFindingIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/findings")
      .then((res) => res.json())
      .then((data) => setFindings(data))
      .catch(() => {});
  }, []);

  function toggleFinding(id: string) {
    setSelectedFindingIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedFindingIds.length === 0) {
      setError("At least one supporting finding is required");
      return;
    }
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      engagementId: "engagement-1",
      title: form.get("title") as string,
      description: form.get("description") as string,
      type: form.get("type") as string,
      effort: (form.get("effort") as string) || null,
      timeframe: (form.get("timeframe") as string) || null,
      impactBase: form.get("impactBase") ? Number(form.get("impactBase")) : null,
      impactAdjPct: form.get("impactAdjPct") ? Number(form.get("impactAdjPct")) : null,
      impactConfidence: (form.get("impactConfidence") as string) || null,
      risks: (form.get("risks") as string) || null,
      dependencies: (form.get("dependencies") as string) || null,
      findingIds: selectedFindingIds,
    };

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create recommendation");
      }
      const rec = await res.json();
      router.push(`/recommendations/${rec.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Recommendation</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {recTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Recommendation title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="What should be done and why"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Effort</label>
            <select name="effort" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select...</option>
              {effortLevels.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
            <select name="timeframe" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select...</option>
              {timeframes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Impact Calculator */}
        <fieldset className="border border-gray-200 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 px-2">Impact Estimate</legend>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Base Amount ($)</label>
              <input
                name="impactBase"
                type="number"
                step="any"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Adjustment %</label>
              <input
                name="impactAdjPct"
                type="number"
                min="0"
                max="100"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Confidence</label>
              <select name="impactConfidence" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                <option value="">Select...</option>
                {confidenceLevels.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Risks</label>
          <textarea
            name="risks"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Implementation risks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies</label>
          <textarea
            name="dependencies"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="What must happen first"
          />
        </div>

        {/* Finding Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Findings ({selectedFindingIds.length} selected)
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {findings.map((f) => (
              <label
                key={f.id}
                className={`flex items-center gap-3 px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedFindingIds.includes(f.id) ? "bg-indigo-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFindingIds.includes(f.id)}
                  onChange={() => toggleFinding(f.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{f.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{f.workstream}</span>
                </div>
              </label>
            ))}
            {findings.length === 0 && (
              <p className="p-3 text-sm text-gray-400">No findings available</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Recommendation"}
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
