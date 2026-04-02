import { prisma } from "@/lib/prisma";
import { EngagementList } from "@/components/dashboard/engagement-list";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const engagements = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orgUnits: true, findings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Org Mapper</h1>
          <p className="text-sm text-gray-500">
            Visualize and analyze organizational structures
          </p>
        </div>
        <Link
          href="/engagements/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Engagement
        </Link>
      </div>

      <EngagementList engagements={engagements as any} />
    </div>
  );
}
