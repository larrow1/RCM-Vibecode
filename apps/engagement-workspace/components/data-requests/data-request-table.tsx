"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDate, isDataRequestOverdue } from "@/lib/utils";
import {
  DATA_REQUEST_CATEGORIES,
  DATA_REQUEST_STATUSES,
  DATA_REQUEST_PRIORITIES,
} from "@/lib/schemas";

interface DataRequest {
  id: string;
  category: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string | null;
  receivedDate: string | null;
  notes: string | null;
  _count?: { documents: number };
}

interface DataRequestTableProps {
  dataRequests: DataRequest[];
  engagementId: string;
  onRefresh: () => void;
}

export function DataRequestTable({
  dataRequests,
  engagementId,
  onRefresh,
}: DataRequestTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("Received");
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = dataRequests.filter((dr) => {
    if (categoryFilter !== "all" && dr.category !== categoryFilter) return false;
    if (statusFilter !== "all" && dr.status !== statusFilter) return false;
    if (priorityFilter !== "all" && dr.priority !== priorityFilter) return false;
    return true;
  });

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((dr) => dr.id)));
    }
  }

  async function handleBulkUpdate() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch(
        `/api/engagements/${engagementId}/data-requests/bulk-update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: Array.from(selectedIds),
            status: bulkStatus,
          }),
        }
      );
      if (res.ok) {
        setSelectedIds(new Set());
        onRefresh();
      }
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All Categories</option>
          {DATA_REQUEST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All Statuses</option>
          {DATA_REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/([A-Z])/g, " $1").trim()}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="all">All Priorities</option>
          {DATA_REQUEST_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {filtered.length} of {dataRequests.length} items
        </span>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-800">
            {selectedIds.size} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="rounded-lg border border-blue-300 px-3 py-1.5 text-sm"
          >
            {DATA_REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
          <button
            onClick={handleBulkUpdate}
            disabled={bulkLoading}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {bulkLoading ? "Updating..." : "Update Status"}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 && selectedIds.size === filtered.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Description
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Category
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Priority
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Due Date
              </th>
              <th className="py-3 px-2 text-left font-medium text-gray-600">
                Docs
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dr) => {
              const overdue = isDataRequestOverdue(dr);
              return (
                <tr
                  key={dr.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    overdue ? "bg-red-50" : ""
                  }`}
                >
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(dr.id)}
                      onChange={() => toggleSelect(dr.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-2 text-gray-900 max-w-md">
                    {dr.description}
                    {dr.notes && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {dr.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-gray-600">{dr.category}</span>
                  </td>
                  <td className="py-3 px-2">
                    <PriorityBadge priority={dr.priority} />
                  </td>
                  <td className="py-3 px-2">
                    <StatusBadge
                      status={overdue ? "Overdue" : dr.status}
                    />
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {formatDate(dr.dueDate)}
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {dr._count?.documents || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data requests match the current filters.
        </div>
      )}
    </div>
  );
}
