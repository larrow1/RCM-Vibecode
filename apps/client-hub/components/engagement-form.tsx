"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ENGAGEMENT_STATUSES, ENGAGEMENT_TYPES, ENGAGEMENT_TYPE_LABELS } from "@/lib/utils";

interface EngagementFormProps {
  initialData?: {
    id?: string;
    clientId: string;
    name: string;
    description: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    budget: number | null;
  };
  mode: "create" | "edit";
  preselectedClientId?: string;
}

interface ClientOption {
  id: string;
  name: string;
}

export function EngagementForm({ initialData, mode, preselectedClientId }: EngagementFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientOption[]>([]);

  const [form, setForm] = useState({
    clientId: initialData?.clientId || preselectedClientId || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "TM",
    status: initialData?.status || "Lead",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    budget: initialData?.budget?.toString() || "",
  });

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url =
        mode === "create"
          ? "/api/engagements"
          : `/api/engagements/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const engagement = await res.json();
      router.push(`/engagements/${engagement.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
          Client <span className="text-red-500">*</span>
        </label>
        <select
          id="clientId"
          required
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          disabled={mode === "edit"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="eng-name" className="block text-sm font-medium text-gray-700">
          Engagement Name <span className="text-red-500">*</span>
        </label>
        <input
          id="eng-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., Operations Transformation"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="eng-type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="eng-type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ENGAGEMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {ENGAGEMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="eng-status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="eng-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ENGAGEMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget ($)
        </label>
        <input
          id="budget"
          type="number"
          min="0"
          step="1000"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="What does this engagement involve?"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Engagement" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
