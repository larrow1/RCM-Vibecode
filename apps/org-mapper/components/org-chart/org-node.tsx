"use client";

import { useState } from "react";
import { getDepartmentColor } from "@/lib/org-utils";
import type { OrgNode } from "@/lib/org-utils";

interface OrgNodeProps {
  node: OrgNode;
  defaultExpanded?: boolean;
}

export function OrgNodeComponent({ node, defaultExpanded = true }: OrgNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;
  const colorClass = getDepartmentColor(node.department);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-lg border-2 px-4 py-3 min-w-[180px] max-w-[220px] text-center cursor-pointer transition hover:shadow-md ${colorClass}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <p className="font-semibold text-sm truncate">{node.name}</p>
        {node.title && <p className="text-xs opacity-75 truncate">{node.title}</p>}
        {node.department && (
          <p className="text-xs mt-1 opacity-60">{node.department}</p>
        )}
        <div className="flex justify-center gap-2 mt-1 text-xs opacity-60">
          {node.headcount > 0 && <span>{node.headcount} HC</span>}
          {node.totalCompensation > 0 && (
            <span>${(node.totalCompensation / 1000).toFixed(0)}k</span>
          )}
        </div>
        {hasChildren && (
          <p className="text-xs mt-1 opacity-50">
            {expanded ? "[-]" : `[+] ${node.children!.length} reports`}
          </p>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="flex flex-col items-center mt-2">
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex gap-4 items-start">
            {node.children!.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300" />
                <OrgNodeComponent
                  node={child}
                  defaultExpanded={node.level < 2}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
