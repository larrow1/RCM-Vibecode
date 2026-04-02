import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EngagementCard } from "@/components/engagements/engagement-card";

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const engagements = await prisma.engagement.findMany({
    include: {
      _count: {
        select: {
          dataRequests: true,
          documents: true,
          teamMembers: true,
        },
      },
      dataRequests: {
        select: { status: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="text-gray-500 mt-1">
            Manage assessment engagements and track progress
          </p>
        </div>
        <Link
          href="/engagements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Engagement
        </Link>
      </div>

      {engagements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No engagements yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first assessment engagement to get started.
          </p>
          <Link
            href="/engagements/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Engagement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {engagements.map((engagement) => (
            <EngagementCard
              key={engagement.id}
              engagement={{
                ...engagement,
                startDate: engagement.startDate.toISOString(),
                endDate: engagement.endDate?.toISOString() || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
