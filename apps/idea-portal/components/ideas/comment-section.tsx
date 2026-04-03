"use client";

import { useState, useCallback, useEffect } from "react";
import { formatRelativeTime } from "@/lib/idea-utils";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  role: string | null;
  createdAt: string;
}

interface CommentSectionProps {
  ideaId: string;
  initialComments: Comment[];
}

const roleColors: Record<string, string> = {
  "product-manager": "bg-purple-100 text-purple-700",
  architect: "bg-blue-100 text-blue-700",
  developer: "bg-green-100 text-green-700",
  user: "bg-gray-100 text-gray-700",
};

export function CommentSection({ ideaId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId,
          authorName: form.get("authorName"),
          content: form.get("content"),
          role: form.get("role") || "user",
        }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments yet. Be the first to weigh in.</p>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium text-gray-700">{c.authorName}</span>
              {c.role && (
                <span className={`rounded-full px-2 py-0.5 ${roleColors[c.role] || roleColors.user}`}>
                  {c.role}
                </span>
              )}
              <span>{formatRelativeTime(c.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Your Name *</label>
            <input name="authorName" required className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <select name="role" className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
              <option value="user">User</option>
              <option value="product-manager">Product Manager</option>
              <option value="architect">Architect</option>
              <option value="developer">Developer</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Comment *</label>
          <textarea name="content" required rows={3} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" placeholder="Share your thoughts on this idea..." />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
