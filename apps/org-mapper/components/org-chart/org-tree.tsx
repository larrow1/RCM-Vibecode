"use client";

import { OrgNodeComponent } from "./org-node";
import type { OrgNode } from "@/lib/org-utils";

interface OrgTreeProps {
  roots: OrgNode[];
}

export function OrgTree({ roots }: OrgTreeProps) {
  if (roots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-gray-500">No org structure data</p>
        <p className="mt-1 text-sm text-gray-400">Import org data or add units manually.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-gray-200 bg-white p-8">
      <div className="flex gap-8 justify-center items-start min-w-max">
        {roots.map((root) => (
          <OrgNodeComponent key={root.id} node={root} defaultExpanded={true} />
        ))}
      </div>
    </div>
  );
}
