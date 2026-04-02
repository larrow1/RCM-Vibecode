"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_TEMPLATES } from "@/lib/flow-templates";

interface Engagement {
  id: string;
  name: string;
  clientName: string;
  type: string;
}

export default function NewFlowPage() {
  const router = useRouter();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [engagementId, setEngagementId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("full-assessment");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/engagements")
      .then((r) => r.json())
      .then(setEngagements)
      .catch(() => setError("Failed to load engagements"));
  }, []);

  const selectedEngagement = engagements.find((e) => e.id === engagementId);
  const template = ASSESSMENT_TEMPLATES[selectedTemplate];

  async function handleGenerate() {
    if (!engagementId || !name) {
      setError("Please select an engagement and provide a flow name");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/flows/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engagementId,
          name,
          description,
          templateKey: selectedTemplate,
          scope,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate flow");
      }

      const flow = await response.json();
      router.push(`/flows/${flow.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate flow");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create AI-Powered Flow</h1>
        <p className="text-gray-500 mt-1">
          Select an engagement and template, and AI will generate a customized progress flow
        </p>
      </div>

      <div className="space-y-6">
        {/* Engagement Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h2>
          <select
            value={engagementId}
            onChange={(e) => setEngagementId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an engagement...</option>
            {engagements.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.clientName} - {eng.name} ({eng.type})
              </option>
            ))}
          </select>
          {selectedEngagement && (
            <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
              Type: {selectedEngagement.type}
            </div>
          )}
        </div>

        {/* Flow Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flow Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q1 2026 Full Assessment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of this flow's purpose..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope Focus (optional)</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="e.g., Financial analysis and organizational review"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">AI will tailor the flow based on your scope description</p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Template</h2>
          <div className="grid gap-3">
            {Object.entries(ASSESSMENT_TEMPLATES).map(([key, tmpl]) => (
              <label
                key={key}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedTemplate === key
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={key}
                  checked={selectedTemplate === key}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{tmpl.name}</div>
                  <div className="text-sm text-gray-500">{tmpl.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {tmpl.phases.length} phases, {tmpl.phases.reduce((acc, p) => acc + p.tasks.length, 0)} tasks
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        {template && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h2>
            <div className="space-y-4">
              {template.phases.map((phase, i) => (
                <div key={i} className="border-l-4 border-indigo-300 pl-4">
                  <h3 className="font-medium text-gray-900">
                    Phase {i + 1}: {phase.name}
                  </h3>
                  <p className="text-sm text-gray-500">{phase.description}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {phase.tasks.length} tasks: {phase.tasks.map((t) => t.title).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !engagementId || !name}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg font-medium"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Flow...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Flow
            </>
          )}
        </button>
      </div>
    </div>
  );
}
