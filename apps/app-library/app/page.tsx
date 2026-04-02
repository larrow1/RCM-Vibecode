import { PlatformStats } from "@/components/platform-stats";
import { SearchFilter } from "@/components/search-filter";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900" data-testid="page-title">
          Assessment Platform
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Tools for consultants who evaluate organizations by analyzing financials,
          org structures, contracts, and operations to produce actionable recommendations.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10">
        <PlatformStats />
      </div>

      {/* App Catalog */}
      <SearchFilter />
    </main>
  );
}
