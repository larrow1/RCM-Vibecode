import { ClientForm } from "@/components/client-form";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Client</h1>
        <p className="text-gray-500 mt-1">Add a new client to your portfolio</p>
      </div>
      <ClientForm mode="create" />
    </div>
  );
}
