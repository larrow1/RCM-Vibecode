import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "@/components/client-form";

interface Props {
  params: { id: string };
}

export default async function EditClientPage({ params }: Props) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!client) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-500 mt-1">Update details for {client.name}</p>
      </div>
      <ClientForm
        mode="edit"
        initialData={{
          id: client.id,
          name: client.name,
          industry: client.industry || "",
          website: client.website || "",
          notes: client.notes || "",
          status: client.status,
        }}
      />
    </div>
  );
}
