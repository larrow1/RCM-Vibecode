import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EngagementHeader } from "@/components/engagements/engagement-header";
import { EngagementDetailClient } from "./engagement-detail-client";

export const dynamic = "force-dynamic";

export default async function EngagementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      dataRequests: {
        include: {
          _count: { select: { documents: true } },
        },
        orderBy: [{ dueDate: "asc" }],
      },
      documents: {
        include: {
          dataRequest: { select: { description: true } },
        },
        orderBy: { uploadedAt: "desc" },
      },
      teamMembers: {
        orderBy: { createdAt: "asc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: {
        select: {
          dataRequests: true,
          documents: true,
          teamMembers: true,
        },
      },
    },
  });

  if (!engagement) {
    notFound();
  }

  // Serialize dates for client component
  const serialized = {
    ...engagement,
    startDate: engagement.startDate.toISOString(),
    endDate: engagement.endDate?.toISOString() || null,
    createdAt: engagement.createdAt.toISOString(),
    updatedAt: engagement.updatedAt.toISOString(),
    dataRequests: engagement.dataRequests.map((dr) => ({
      ...dr,
      requestedDate: dr.requestedDate.toISOString(),
      dueDate: dr.dueDate?.toISOString() || null,
      receivedDate: dr.receivedDate?.toISOString() || null,
      createdAt: dr.createdAt.toISOString(),
      updatedAt: dr.updatedAt.toISOString(),
    })),
    documents: engagement.documents.map((doc) => ({
      ...doc,
      uploadedAt: doc.uploadedAt.toISOString(),
    })),
    teamMembers: engagement.teamMembers.map((tm) => ({
      ...tm,
      createdAt: tm.createdAt.toISOString(),
    })),
    activities: engagement.activities.map((act) => ({
      ...act,
      createdAt: act.createdAt.toISOString(),
    })),
  };

  return (
    <div>
      <EngagementHeader engagement={serialized} />
      <EngagementDetailClient engagement={serialized} />
    </div>
  );
}
