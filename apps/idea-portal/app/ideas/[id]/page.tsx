import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getStatusLabel, getCategoryLabel, parseTags } from "@/lib/idea-utils";
import { VoteButton } from "@/components/ideas/vote-button";
import { CommentSection } from "@/components/ideas/comment-section";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function IdeaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const idea = await prisma.idea.findUnique({
    where: { id: params.id },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      _count: { select: { comments: true, voters: true } },
    },
  });

  if (!idea) notFound();

  const status = getStatusLabel(idea.status);
  const category = getCategoryLabel(idea.category);
  const tags = parseTags(idea.tags);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; All Ideas
      </Link>

      <div className="flex gap-6">
        <VoteButton ideaId={idea.id} initialVotes={idea.votes} />

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
            <span className={`rounded-full px-2 py-0.5 text-xs ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
            <span>by <span className="text-gray-600">{idea.authorName}</span></span>
            <span>in <span className="text-gray-600">{category.name}</span></span>
            {idea.persona && (
              <span>
                for <span className="text-purple-600">{idea.persona}</span>
              </span>
            )}
            <span>{idea.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>

        {tags.length > 0 && (
          <div className="mt-4 flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {(idea.priority || idea.effort || idea.impact) && (
          <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4 text-sm">
            {idea.priority && (
              <div>
                <span className="text-gray-400">Priority:</span>{" "}
                <span className="font-medium text-gray-700">{idea.priority}</span>
              </div>
            )}
            {idea.impact && (
              <div>
                <span className="text-gray-400">Impact:</span>{" "}
                <span className="font-medium text-gray-700">{idea.impact}</span>
              </div>
            )}
            {idea.effort && (
              <div>
                <span className="text-gray-400">Effort:</span>{" "}
                <span className="font-medium text-gray-700">{idea.effort}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <CommentSection
        ideaId={idea.id}
        initialComments={idea.comments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
