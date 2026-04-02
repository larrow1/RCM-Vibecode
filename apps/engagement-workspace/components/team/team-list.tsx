"use client";

import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  createdAt: string;
}

interface TeamListProps {
  members: TeamMember[];
  engagementId: string;
  onRefresh: () => void;
}

export function TeamList({ members, engagementId, onRefresh }: TeamListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleRemove(memberId: string) {
    setDeleting(memberId);
    try {
      const res = await fetch(
        `/api/engagements/${engagementId}/team/${memberId}`,
        { method: "DELETE" }
      );
      if (res.ok) onRefresh();
    } finally {
      setDeleting(null);
    }
  }

  const roleColors: Record<string, string> = {
    Lead: "bg-purple-100 text-purple-800",
    "Financial Analyst": "bg-green-100 text-green-800",
    "Org Consultant": "bg-blue-100 text-blue-800",
    "Contract Specialist": "bg-orange-100 text-orange-800",
    Associate: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="font-medium text-gray-900">{member.name}</div>
              {member.email && (
                <div className="text-sm text-gray-500">{member.email}</div>
              )}
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                roleColors[member.role] || "bg-gray-100 text-gray-800"
              }`}
            >
              {member.role}
            </span>
          </div>
          <button
            onClick={() => handleRemove(member.id)}
            disabled={deleting === member.id}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {deleting === member.id ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
      {members.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No team members assigned yet.
        </div>
      )}
    </div>
  );
}
