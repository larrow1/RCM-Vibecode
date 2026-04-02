"use client";

import { useState, useMemo } from "react";
import type { AppInfo, AppStatus } from "@/lib/apps";
import { APPS, getAppsByCategory } from "@/lib/apps";
import { CategorySection } from "./category-section";

export function SearchFilter() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");

  const filteredApps = useMemo(() => {
    let apps = APPS;

    if (statusFilter !== "all") {
      apps = apps.filter((a) => a.status === statusFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    return apps;
  }, [query, statusFilter]);

  const grouped = useMemo(() => {
    const result: Record<string, AppInfo[]> = {
      "core-analysis": [],
      workflow: [],
      infrastructure: [],
    };
    for (const app of filteredApps) {
      result[app.category].push(app);
    }
    return result;
  }, [filteredApps]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search apps, features, or capabilities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            data-testid="search-input"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          {(["all", "live", "coming-soon"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid={`filter-${status}`}
            >
              {status === "all" ? "All" : status === "live" ? "Live" : "Coming Soon"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredApps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center" data-testid="no-results">
          <p className="text-gray-500">No apps match your search.</p>
          <button
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {(["core-analysis", "workflow", "infrastructure"] as const).map((cat) =>
            grouped[cat].length > 0 ? (
              <CategorySection key={cat} category={cat} apps={grouped[cat]} />
            ) : null
          )}
        </>
      )}
    </div>
  );
}
