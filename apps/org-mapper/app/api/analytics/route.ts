import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  computeSpanOfControl,
  computeHeadcountByDepartment,
  computeHeadcountByLevel,
  detectDuplicateRoles,
  computeSummaryMetrics,
  type OrgNode,
} from "@/lib/org-utils";

export async function GET(request: NextRequest) {
  const engagementId = request.nextUrl.searchParams.get("engagementId");
  if (!engagementId) {
    return NextResponse.json({ error: "engagementId is required" }, { status: 400 });
  }

  const orgUnits = await prisma.orgUnit.findMany({
    where: { engagementId },
  });

  const nodes: OrgNode[] = orgUnits.map((u) => ({
    id: u.id,
    name: u.name,
    title: u.title,
    department: u.department,
    type: u.type,
    parentId: u.parentId,
    level: u.level,
    headcount: u.headcount,
    totalCompensation: u.totalCompensation,
    managerName: u.managerName,
    managerTitle: u.managerTitle,
    employeeId: u.employeeId,
  }));

  const summary = computeSummaryMetrics(nodes);
  const spanOfControl = computeSpanOfControl(nodes);
  const byDepartment = computeHeadcountByDepartment(nodes);
  const byLevel = computeHeadcountByLevel(nodes);
  const duplicates = detectDuplicateRoles(nodes);

  return NextResponse.json({
    summary,
    spanOfControl,
    byDepartment,
    byLevel,
    duplicates,
  });
}
