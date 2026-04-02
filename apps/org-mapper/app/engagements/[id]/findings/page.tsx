"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { FindingsList } from "@/components/findings/findings-list";
import { FindingForm } from "@/components/findings/finding-form";
import Link from "next/link";

interface Finding {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  description: string;
  financialImpact: number | null;
  orgUnit?: { name: string; department: string | null } | null;
}

interface OrgUnit {
  id: string;
  name: string;
  department: string | null;
}

export default function FindingsPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const [findings, setFindings] = useState<Finding[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [findingsRes, orgUnitsRes] = await Promise.all([
      fetch(`/api/findings?engagementId=${engagementId}`),
      fetch(`/api/org-units?engagementId=${engagementId}`),
    ]);
    const [findingsData, orgUnitsData] = await Promise.all([
      findingsRes.json(),
      orgUnitsRes.json(),
    ]);
    setFindings(findingsData);
    setOrgUnits(orgUnitsData);
    setLoading(false);
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="text-sm text-gray-400">Loading findings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/engagements/${engagementId}`} className="text-sm text-blue-600 hover:underline">
          &larr; Back to Engagement
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Findings</h1>
        <p className="text-sm text-gray-500">
          Document organizational issues and link them to specific org units.
        </p>
      </div>

      <FindingForm
        engagementId={engagementId}
        orgUnits={orgUnits}
        onCreated={fetchData}
      />

      <FindingsList findings={findings} />
    </div>
  );
}
