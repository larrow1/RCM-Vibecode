"use client";

import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/validations";
import type { SortOption } from "@/lib/idea-utils";

interface IdeaFiltersProps {
  category: string;
  status: string;
  sort: SortOption;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onSortChange: (val: SortOption) => void;
}

export function IdeaFilters({
  category,
  status,
  sort,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}: IdeaFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="">All Categories</option>
        {Object.entries(CATEGORY_LABELS).map(([slug, { name }]) => (
          <option key={slug} value={slug}>{name}</option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="most-voted">Most Voted</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
