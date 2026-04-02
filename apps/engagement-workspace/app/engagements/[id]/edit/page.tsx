import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EngagementForm } from "@/components/engagements/engagement-form";

export const dynamic = "force-dynamic";

export default async function EditEngagementPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
  });

  if (!engagement) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Engagement
      </h1>
      <EngagementForm
        engagement={{
          ...engagement,
          startDate: engagement.startDate.toISOString(),
          endDate: engagement.endDate?.toISOString() || null,
        }}
      />
    </div>
  );
}
