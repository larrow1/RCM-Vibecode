"use client";

import Link from "next/link";

interface EngagementSummary {
  id: string;
  name: string;
  clientName: string;
  status: string;
  startDate: string;
  _count: { orgUnits: number; findings: number };
}

export function EngagementList({ engagements }: { engagements: EngagementSummary[] }) {
  if (engagements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-gray-500">No engagements yet</p>
        <p className="mt-1 text-sm text-gray-400">Create an engagement to get started with org mapping.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {engagements.map((eng) => (
        <Link
          key={eng.id}
          href={`/engagements/${eng.id}`}
          className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-semibold text-gray-900">{eng.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{eng.clientName}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">{eng.status}</span>
            <span>{eng._count.orgUnits} org units</span>
            <span>{eng._count.findings} findings</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
