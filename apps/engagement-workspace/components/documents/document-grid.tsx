"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { DOCUMENT_CATEGORIES, DOCUMENT_FILE_TYPES } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  entity: string | null;
  period: string | null;
  status: string;
  uploadedAt: string;
  dataRequest?: { description: string } | null;
}

interface DocumentGridProps {
  documents: Document[];
  engagementId: string;
  onRefresh: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatCategory(cat: string): string {
  return cat.replace(/([A-Z])/g, " $1").trim();
}

const fileTypeIcons: Record<string, string> = {
  PDF: "pdf",
  Excel: "xls",
  CSV: "csv",
  Word: "doc",
  Image: "img",
  Other: "file",
};

export function DocumentGrid({
  documents,
  engagementId,
  onRefresh,
}: DocumentGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = documents.filter(
    (doc) => categoryFilter === "all" || doc.category === categoryFilter
  );

  // Group by category
  const grouped = filtered.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All Categories</option>
          {DOCUMENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {filtered.length} document{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {Object.entries(grouped).map(([category, docs]) => (
        <div key={category} className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">
            {formatCategory(category)} ({docs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded uppercase text-gray-600">
                      {fileTypeIcons[doc.fileType] || "file"}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {doc.fileName}
                    </span>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {doc.entity && <p>Entity: {doc.entity}</p>}
                  {doc.period && <p>Period: {doc.period}</p>}
                  <p>
                    {formatFileSize(doc.fileSize)} &middot; Uploaded{" "}
                    {formatDate(doc.uploadedAt)}
                  </p>
                  {doc.dataRequest && (
                    <p className="text-blue-600 truncate">
                      Fulfills: {doc.dataRequest.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents match the current filter.
        </div>
      )}
    </div>
  );
}
