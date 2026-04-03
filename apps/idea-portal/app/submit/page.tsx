"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, PERSONAS } from "@/lib/validations";
import Link from "next/link";

export default function SubmitIdeaPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      description: form.get("description"),
      authorName: form.get("authorName"),
      category: form.get("category"),
      persona: form.get("persona") || undefined,
      tags: form.get("tags") || undefined,
    };

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit idea");
      }
      const idea = await res.json();
      router.push(`/ideas/${idea.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Ideas
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Submit an Idea</h1>
        <p className="text-sm text-gray-500">
          Propose a new tool or feature for the assessment platform. Ideas are reviewed by the product team and the community votes on priorities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input name="authorName" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="e.g., James Chen" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idea Title *</label>
          <input name="title" required minLength={5} maxLength={200} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="e.g., Anomaly Detection Engine for Financial Data" />
          <p className="mt-1 text-xs text-gray-400">Clear and concise — what is the tool or capability?</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" required minLength={20} maxLength={5000} rows={6} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Describe the problem this solves, who benefits, and how you envision it working..." />
          <p className="mt-1 text-xs text-gray-400">Include: what problem it solves, who benefits, and a rough vision of how it works.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Fundamental *</label>
            <select name="category" required className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
              {Object.entries(CATEGORY_LABELS).map(([slug, { name, description }]) => (
                <option key={slug} value={slug} title={description}>{name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Which part of the assessment process does this improve?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Persona</label>
            <select name="persona" className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="">Any / All</option>
              {PERSONAS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Who benefits most from this?</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input name="tags" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="ai-powered, financial, automation" />
          <p className="mt-1 text-xs text-gray-400">Comma-separated keywords for discovery.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Idea"}
        </button>
      </form>
    </div>
  );
}
