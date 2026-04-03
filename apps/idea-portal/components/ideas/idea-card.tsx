"use client";

import Link from "next/link";
import { getStatusLabel, getCategoryLabel, formatRelativeTime, parseTags } from "@/lib/idea-utils";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    authorName: string;
    category: string;
    persona: string | null;
    status: string;
    votes: number;
    tags: string | null;
    createdAt: string | Date;
    _count: { comments: number };
  };
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const status = getStatusLabel(idea.status);
  const category = getCategoryLabel(idea.category);
  const tags = parseTags(idea.tags);

  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2 min-w-[50px]">
          <span className="text-lg font-bold text-blue-600">{idea.votes}</span>
          <span className="text-xs text-gray-400">votes</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{idea.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs ${status.color}`}>
              {status.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{idea.description}</p>

          <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-gray-400">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
              {category.name}
            </span>
            {idea.persona && (
              <span className="rounded bg-purple-50 px-2 py-0.5 text-purple-600">
                {idea.persona}
              </span>
            )}
            <span>{idea._count.comments} comments</span>
            <span>by {idea.authorName}</span>
            <span>{formatRelativeTime(idea.createdAt)}</span>
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
