import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-bold">Engagement</h1>
        <p className="text-sm text-slate-400">Workspace</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Engagements
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          Assessment Consultant Platform
        </div>
        <a
          href={process.env.NEXT_PUBLIC_FINANCIAL_ANALYZER_URL || "http://localhost:3002"}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 text-xs text-blue-400 hover:text-blue-300"
        >
          Open Financial Analyzer
        </a>
      </div>
    </aside>
  );
}
