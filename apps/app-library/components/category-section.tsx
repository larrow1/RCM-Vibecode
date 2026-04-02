import type { AppInfo, AppCategory } from "@/lib/apps";
import { APP_CATEGORIES } from "@/lib/apps";
import { AppCard } from "./app-card";

interface CategorySectionProps {
  category: AppCategory;
  apps: AppInfo[];
}

export function CategorySection({ category, apps }: CategorySectionProps) {
  const { label, description } = APP_CATEGORIES[category];

  if (apps.length === 0) return null;

  return (
    <section className="mb-12" data-testid={`category-${category}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
