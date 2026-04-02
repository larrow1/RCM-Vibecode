import { APPS, getLiveApps, getComingSoonApps, getTotalTestCount } from "@/lib/apps";

export function PlatformStats() {
  const liveCount = getLiveApps().length;
  const comingSoonCount = getComingSoonApps().length;
  const totalTests = getTotalTestCount();
  const totalApps = APPS.length;

  const stats = [
    { label: "Total Apps", value: totalApps, color: "text-blue-600" },
    { label: "Live", value: liveCount, color: "text-green-600" },
    { label: "Coming Soon", value: comingSoonCount, color: "text-amber-600" },
    { label: "Tests Passing", value: totalTests, color: "text-emerald-600" },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      data-testid="platform-stats"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-4 text-center"
        >
          <p className={`text-3xl font-bold ${stat.color}`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
