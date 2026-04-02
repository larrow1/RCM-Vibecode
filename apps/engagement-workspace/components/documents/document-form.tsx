"use client";

import { useState } from "react";
import { DOCUMENT_CATEGORIES, DOCUMENT_FILE_TYPES } from "@/lib/schemas";

interface DocumentFormProps {
  engagementId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DocumentForm({
  engagementId,
  onSuccess,
  onCancel,
}: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fileName: "",
    fileType: "PDF" as string,
    category: "FinancialStatement" as string,
    entity: "",
    period: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/engagements/${engagementId}/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            fileSize: Math.floor(Math.random() * 5000000) + 100000,
            entity: formData.entity || null,
            period: formData.period || null,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add document");
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
      <h3 className="font-medium text-gray-900 mb-3">Add Document</h3>
      {error && (
        <div className="bg-red-50 text-red-800 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            File Name *
          </label>
          <input
            type="text"
            required
            value={formData.fileName}
            onChange={(e) =>
              setFormData({ ...formData, fileName: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="document.pdf"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">File Type</label>
          <select
            value={formData.fileType}
            onChange={(e) =>
              setFormData({ ...formData, fileType: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {DOCUMENT_FILE_TYPES.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Entity</label>
          <input
            type="text"
            value={formData.entity}
            onChange={(e) =>
              setFormData({ ...formData, entity: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="e.g., Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Period</label>
          <input
            type="text"
            value={formData.period}
            onChange={(e) =>
              setFormData({ ...formData, period: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="e.g., FY2025"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Document"}
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
