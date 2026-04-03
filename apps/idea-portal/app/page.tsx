"use client";

import { useEffect, useState, useCallback } from "react";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters } from "@/components/ideas/idea-filters";
import { StatsBar } from "@/components/ideas/stats-bar";
import { computeIdeaStats, type SortOption } from "@/lib/idea-utils";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorName: string;
  category: string;
  persona: string | null;
  status: string;
  votes: number;
  tags: string | null;
  createdAt: string;
  _count: { comments: number };
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortOption>("most-voted");

  const fetchIdeas = useCallback(async () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    params.set("sort", sort);

    const res = await fetch(`/api/ideas?${params}`);
    const data = await res.json();
    setIdeas(data);
    setLoading(false);
  }, [category, status, sort]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const stats = computeIdeaStats(ideas);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Ideas</h1>
          <p className="text-sm text-gray-500">
            Vote on ideas or submit your own to shape the assessment platform
          </p>
        </div>
        <Link
          href="/submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit Idea
        </Link>
      </div>

      <StatsBar stats={stats} />

      <IdeaFilters
        category={category}
        status={status}
        sort={sort}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {loading ? (
        <p className="text-sm text-gray-400">Loading ideas...</p>
      ) : ideas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-gray-500">No ideas yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Be the first to{" "}
            <Link href="/submit" className="text-blue-600 hover:underline">
              submit an idea
            </Link>
            !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
