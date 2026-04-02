import type { AppInfo } from "@/lib/apps";

interface AppCardProps {
  app: AppInfo;
}

export function AppCard({ app }: AppCardProps) {
  const statusStyles = {
    live: "bg-green-100 text-green-800 border-green-200",
    "coming-soon": "bg-amber-50 text-amber-700 border-amber-200",
    deprecated: "bg-gray-100 text-gray-500 border-gray-200",
  };

  const statusLabels = {
    live: "Live",
    "coming-soon": "Coming Soon",
    deprecated: "Deprecated",
  };

  return (
    <div
      className={`group rounded-xl border bg-white p-6 transition-all hover:shadow-lg ${
        app.status === "live" ? "border-gray-200 hover:border-blue-300" : "border-gray-100 opacity-80"
      }`}
      data-testid={`app-card-${app.id}`}
      data-status={app.status}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={app.name}>
            {app.icon}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
            <p className="text-sm text-gray-500">{app.tagline}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[app.status]}`}
          data-testid={`status-badge-${app.id}`}
        >
          {statusLabels[app.status]}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-gray-600">{app.description}</p>

      {/* Features */}
      <div className="mb-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Key Features</h4>
        <ul className="space-y-1">
          {app.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer metadata */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 text-xs text-gray-400">
        <span title="Primary persona">👤 {app.primaryPersona}</span>
        {app.testCount > 0 && (
          <span title="Tests passing" className="text-green-600">
            ✓ {app.testCount} tests
          </span>
        )}
        {app.port && (
          <span title="Development port">
            Port {app.port}
          </span>
        )}
      </div>

      {/* Tech stack pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {app.techStack.map((tech) => (
          <span key={tech} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {tech}
          </span>
        ))}
      </div>

      {/* Launch button for live apps */}
      {app.status === "live" && app.port && (
        <div className="mt-4">
          <a
            href={`http://localhost:${app.port}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            data-testid={`launch-btn-${app.id}`}
          >
            Open App →
          </a>
        </div>
      )}
    </div>
  );
}
