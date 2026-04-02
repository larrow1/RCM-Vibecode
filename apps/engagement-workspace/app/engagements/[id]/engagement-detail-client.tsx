"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TabNav } from "@/components/ui/tab-nav";
import { ProgressBar } from "@/components/ui/progress-bar";
import { WorkstreamCards } from "@/components/engagements/workstream-cards";
import { DataRequestTable } from "@/components/data-requests/data-request-table";
import { DataRequestForm } from "@/components/data-requests/data-request-form";
import { DocumentGrid } from "@/components/documents/document-grid";
import { DocumentForm } from "@/components/documents/document-form";
import { TeamList } from "@/components/team/team-list";
import { TeamForm } from "@/components/team/team-form";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { computeDataRequestStats } from "@/lib/utils";

interface EngagementDetailClientProps {
  engagement: {
    id: string;
    name: string;
    status: string;
    dataRequests: Array<{
      id: string;
      category: string;
      description: string;
      priority: string;
      status: string;
      dueDate: string | null;
      receivedDate: string | null;
      notes: string | null;
      _count?: { documents: number };
    }>;
    documents: Array<{
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      category: string;
      entity: string | null;
      period: string | null;
      status: string;
      uploadedAt: string;
      dataRequest?: { description: string } | null;
    }>;
    teamMembers: Array<{
      id: string;
      name: string;
      role: string;
      email: string | null;
      createdAt: string;
    }>;
    activities: Array<{
      id: string;
      type: string;
      description: string;
      createdAt: string;
    }>;
    _count: {
      dataRequests: number;
      documents: number;
      teamMembers: number;
    };
  };
}

export function EngagementDetailClient({
  engagement,
}: EngagementDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showDataRequestForm, setShowDataRequestForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  const stats = computeDataRequestStats(engagement.dataRequests);

  const documentCounts = engagement.documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "data-requests", label: "Data Requests", count: engagement._count.dataRequests },
    { id: "documents", label: "Documents", count: engagement._count.documents },
    { id: "team", label: "Team", count: engagement._count.teamMembers },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div>
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Data Request Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">
                Data Request Progress
              </h2>
              <ProgressBar
                value={stats.received}
                max={stats.total}
                label="Items Received"
              />
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.received}
                  </div>
                  <div className="text-xs text-gray-500">Received</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {stats.outstanding}
                  </div>
                  <div className="text-xs text-gray-500">Outstanding</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.overdue}
                  </div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">
                    {stats.notAvailable}
                  </div>
                  <div className="text-xs text-gray-500">N/A</div>
                </div>
              </div>
            </div>

            {/* Workstream Cards */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">
                Workstream Progress
              </h2>
              <WorkstreamCards
                dataRequests={engagement.dataRequests}
                documentCounts={documentCounts}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">
                Recent Activity
              </h2>
              <ActivityFeed activities={engagement.activities} limit={8} />
            </div>
          </div>
        )}

        {activeTab === "data-requests" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Data Requests</h2>
              <button
                onClick={() => setShowDataRequestForm(!showDataRequestForm)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
              >
                {showDataRequestForm ? "Cancel" : "Add Request"}
              </button>
            </div>
            {showDataRequestForm && (
              <DataRequestForm
                engagementId={engagement.id}
                onSuccess={() => {
                  setShowDataRequestForm(false);
                  refresh();
                }}
                onCancel={() => setShowDataRequestForm(false)}
              />
            )}
            <DataRequestTable
              dataRequests={engagement.dataRequests}
              engagementId={engagement.id}
              onRefresh={refresh}
            />
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Documents</h2>
              <button
                onClick={() => setShowDocumentForm(!showDocumentForm)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
              >
                {showDocumentForm ? "Cancel" : "Add Document"}
              </button>
            </div>
            {showDocumentForm && (
              <DocumentForm
                engagementId={engagement.id}
                onSuccess={() => {
                  setShowDocumentForm(false);
                  refresh();
                }}
                onCancel={() => setShowDocumentForm(false)}
              />
            )}
            <DocumentGrid
              documents={engagement.documents}
              engagementId={engagement.id}
              onRefresh={refresh}
            />
          </div>
        )}

        {activeTab === "team" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Team Members</h2>
              <button
                onClick={() => setShowTeamForm(!showTeamForm)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
              >
                {showTeamForm ? "Cancel" : "Add Member"}
              </button>
            </div>
            {showTeamForm && (
              <TeamForm
                engagementId={engagement.id}
                onSuccess={() => {
                  setShowTeamForm(false);
                  refresh();
                }}
                onCancel={() => setShowTeamForm(false)}
              />
            )}
            <TeamList
              members={engagement.teamMembers}
              engagementId={engagement.id}
              onRefresh={refresh}
            />
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">
              Activity Feed
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <ActivityFeed activities={engagement.activities} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
