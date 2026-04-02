import { EngagementForm } from "@/components/engagement-form";

interface Props {
  searchParams: { clientId?: string };
}

export default function NewEngagementPage({ searchParams }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Engagement</h1>
        <p className="text-gray-500 mt-1">Create a new engagement for a client</p>
      </div>
      <EngagementForm mode="create" preselectedClientId={searchParams.clientId} />
    </div>
  );
}
