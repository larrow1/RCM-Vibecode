import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EngagementForm } from "@/components/engagement-form";

interface Props {
  params: { id: string };
}

export default async function EditEngagementPage({ params }: Props) {
  const engagement = await prisma.engagement.findUnique({
    where: { id: params.id },
  });

  if (!engagement) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Engagement</h1>
        <p className="text-gray-500 mt-1">Update details for {engagement.name}</p>
      </div>
      <EngagementForm
        mode="edit"
        initialData={{
          id: engagement.id,
          clientId: engagement.clientId,
          name: engagement.name,
          description: engagement.description || "",
          type: engagement.type,
          status: engagement.status,
          startDate: engagement.startDate
            ? engagement.startDate.toISOString().split("T")[0]
            : "",
          endDate: engagement.endDate
            ? engagement.endDate.toISOString().split("T")[0]
            : "",
          budget: engagement.budget,
        }}
      />
    </div>
  );
}
