import { formatRelativeTime } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

const typeIcons: Record<string, { icon: string; color: string }> = {
  engagement_created: { icon: "E", color: "bg-purple-100 text-purple-700" },
  status_changed: { icon: "S", color: "bg-blue-100 text-blue-700" },
  data_request_added: { icon: "R", color: "bg-yellow-100 text-yellow-700" },
  data_request_updated: { icon: "R", color: "bg-green-100 text-green-700" },
  document_uploaded: { icon: "D", color: "bg-teal-100 text-teal-700" },
  team_member_added: { icon: "T", color: "bg-indigo-100 text-indigo-700" },
};

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
  const displayed = limit ? activities.slice(0, limit) : activities;

  return (
    <div className="space-y-3">
      {displayed.map((activity) => {
        const meta = typeIcons[activity.type] || {
          icon: "?",
          color: "bg-gray-100 text-gray-700",
        };
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${meta.color}`}
            >
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      {displayed.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No activity yet.
        </div>
      )}
    </div>
  );
}
