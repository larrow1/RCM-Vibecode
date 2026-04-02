import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.document.deleteMany();
  await prisma.dataRequest.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.engagement.deleteMany();

  // Create primary engagement
  const engagement = await prisma.engagement.create({
    data: {
      id: "eng_acme_dd_2026",
      name: "Acme Corp Financial Due Diligence",
      clientName: "Acme Corporation",
      type: "DueDiligence",
      status: "DataCollection",
      startDate: new Date("2026-03-15"),
      endDate: new Date("2026-05-15"),
      scopeDescription:
        "Full financial due diligence for potential acquisition. Scope includes 3-year financial review (FY2023-FY2025), org structure assessment for Divisions A and B, and top 50 vendor contracts review. Target entity: Acme Corp and subsidiaries.",
    },
  });

  // Create second engagement
  const engagement2 = await prisma.engagement.create({
    data: {
      id: "eng_globex_org_2026",
      name: "Globex Org Effectiveness Review",
      clientName: "Globex Industries",
      type: "OrgAssessment",
      status: "Scoping",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-01"),
      scopeDescription:
        "Post-merger organizational effectiveness assessment. Focus on overlapping roles, management layers, and cost optimization opportunities.",
    },
  });

  // Create third engagement
  await prisma.engagement.create({
    data: {
      id: "eng_initech_contract_2026",
      name: "Initech Contract Portfolio Review",
      clientName: "Initech LLC",
      type: "ContractReview",
      status: "Analysis",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-04-15"),
      scopeDescription:
        "Review of 120+ vendor and customer contracts. Identify risk exposure, consolidation opportunities, and renewal strategy.",
    },
  });

  // Team members for primary engagement
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        engagementId: engagement.id,
        name: "Marcus Chen",
        role: "Lead",
        email: "marcus.chen@advisory.com",
      },
    }),
    prisma.teamMember.create({
      data: {
        engagementId: engagement.id,
        name: "Rachel Torres",
        role: "Financial Analyst",
        email: "rachel.torres@advisory.com",
      },
    }),
    prisma.teamMember.create({
      data: {
        engagementId: engagement.id,
        name: "James Park",
        role: "Org Consultant",
        email: "james.park@advisory.com",
      },
    }),
    prisma.teamMember.create({
      data: {
        engagementId: engagement.id,
        name: "Priya Sharma",
        role: "Contract Specialist",
        email: "priya.sharma@advisory.com",
      },
    }),
    prisma.teamMember.create({
      data: {
        engagementId: engagement.id,
        name: "Alex Kim",
        role: "Associate",
        email: "alex.kim@advisory.com",
      },
    }),
  ]);

  // Team for second engagement
  await prisma.teamMember.create({
    data: {
      engagementId: engagement2.id,
      name: "Marcus Chen",
      role: "Lead",
      email: "marcus.chen@advisory.com",
    },
  });
  await prisma.teamMember.create({
    data: {
      engagementId: engagement2.id,
      name: "James Park",
      role: "Org Consultant",
      email: "james.park@advisory.com",
    },
  });

  // Data requests for primary engagement - 25 items across categories
  const dataRequests = [
    // Financial (8 items)
    { category: "Financial", description: "Profit & Loss statements by month, FY2023-FY2025", priority: "Critical", status: "Received", dueDate: "2026-03-25", receivedDate: "2026-03-24" },
    { category: "Financial", description: "Balance sheets as of each quarter end, FY2023-FY2025", priority: "Critical", status: "Received", dueDate: "2026-03-25", receivedDate: "2026-03-26" },
    { category: "Financial", description: "Cash flow statements, annual, FY2023-FY2025", priority: "High", status: "Received", dueDate: "2026-03-28", receivedDate: "2026-03-27" },
    { category: "Financial", description: "Trial balance detail for FY2025", priority: "High", status: "PartiallyReceived", dueDate: "2026-03-28", receivedDate: null },
    { category: "Financial", description: "Revenue breakdown by customer and product line, FY2024-FY2025", priority: "Critical", status: "Requested", dueDate: "2026-04-01", receivedDate: null },
    { category: "Financial", description: "Budget vs. actual reports for FY2025", priority: "Medium", status: "Requested", dueDate: "2026-04-05", receivedDate: null },
    { category: "Financial", description: "Accounts receivable aging as of most recent month end", priority: "Medium", status: "Received", dueDate: "2026-04-01", receivedDate: "2026-03-30" },
    { category: "Financial", description: "Capital expenditure detail and projections", priority: "Low", status: "Requested", dueDate: "2026-04-10", receivedDate: null },
    // Organizational (6 items)
    { category: "Organizational", description: "Current org chart (all levels through director)", priority: "Critical", status: "Received", dueDate: "2026-03-25", receivedDate: "2026-03-23" },
    { category: "Organizational", description: "Headcount by department, level, and location", priority: "High", status: "Received", dueDate: "2026-03-28", receivedDate: "2026-03-28" },
    { category: "Organizational", description: "Compensation data by level and department (anonymized)", priority: "High", status: "Requested", dueDate: "2026-04-01", receivedDate: null },
    { category: "Organizational", description: "Open positions and hiring plan for FY2026", priority: "Medium", status: "PartiallyReceived", dueDate: "2026-04-05", receivedDate: null },
    { category: "Organizational", description: "Contractor and temporary staff detail", priority: "Medium", status: "Requested", dueDate: "2026-04-05", receivedDate: null },
    { category: "Organizational", description: "Employee turnover data, last 24 months", priority: "Low", status: "NotAvailable", dueDate: "2026-04-10", receivedDate: null },
    // Contracts (7 items)
    { category: "Contracts", description: "Top 20 vendor contracts by annual spend", priority: "Critical", status: "Received", dueDate: "2026-03-28", receivedDate: "2026-03-29" },
    { category: "Contracts", description: "Top 10 customer contracts by revenue", priority: "Critical", status: "Received", dueDate: "2026-03-28", receivedDate: "2026-03-30" },
    { category: "Contracts", description: "Real estate and facility leases", priority: "High", status: "Received", dueDate: "2026-04-01", receivedDate: "2026-04-01" },
    { category: "Contracts", description: "IT service agreements and software licenses", priority: "High", status: "PartiallyReceived", dueDate: "2026-04-01", receivedDate: null },
    { category: "Contracts", description: "Employment agreements for C-suite and VP+", priority: "Medium", status: "Requested", dueDate: "2026-04-05", receivedDate: null },
    { category: "Contracts", description: "Partnership and joint venture agreements", priority: "Medium", status: "NotAvailable", dueDate: "2026-04-05", receivedDate: null },
    { category: "Contracts", description: "Insurance policies (D&O, E&O, property, liability)", priority: "Low", status: "Requested", dueDate: "2026-04-10", receivedDate: null },
    // Operational (4 items)
    { category: "Operational", description: "IT systems inventory and architecture diagram", priority: "Medium", status: "Received", dueDate: "2026-04-05", receivedDate: "2026-04-02" },
    { category: "Operational", description: "Key performance indicator (KPI) reports, last 12 months", priority: "Medium", status: "Requested", dueDate: "2026-04-05", receivedDate: null },
    { category: "Operational", description: "Board meeting minutes, last 4 quarters", priority: "Low", status: "Requested", dueDate: "2026-04-10", receivedDate: null },
    { category: "Operational", description: "Pending or threatened litigation summary", priority: "High", status: "Requested", dueDate: "2026-04-01", receivedDate: null },
  ];

  const createdRequests: Array<{ id: string; category: string; description: string }> = [];
  for (const dr of dataRequests) {
    const created = await prisma.dataRequest.create({
      data: {
        engagementId: engagement.id,
        category: dr.category,
        description: dr.description,
        priority: dr.priority,
        status: dr.status,
        requestedDate: new Date("2026-03-18"),
        dueDate: dr.dueDate ? new Date(dr.dueDate) : null,
        receivedDate: dr.receivedDate ? new Date(dr.receivedDate) : null,
      },
    });
    createdRequests.push({ id: created.id, category: dr.category, description: dr.description });
  }

  // Documents linked to received data requests
  const receivedRequests = createdRequests.filter((_, i) => dataRequests[i].status === "Received");

  const documents = [
    { fileName: "Acme_PL_Monthly_FY2023-FY2025.xlsx", fileType: "Excel", fileSize: 2450000, category: "FinancialStatement", entity: "Acme Corp", period: "FY2023-FY2025", requestIdx: 0 },
    { fileName: "Acme_BalanceSheet_Quarterly_FY2023-FY2025.xlsx", fileType: "Excel", fileSize: 1800000, category: "FinancialStatement", entity: "Acme Corp", period: "FY2023-FY2025", requestIdx: 1 },
    { fileName: "Acme_CashFlow_Annual_FY2023-FY2025.pdf", fileType: "PDF", fileSize: 980000, category: "FinancialStatement", entity: "Acme Corp", period: "FY2023-FY2025", requestIdx: 2 },
    { fileName: "Acme_AR_Aging_Feb2026.xlsx", fileType: "Excel", fileSize: 340000, category: "FinancialStatement", entity: "Acme Corp", period: "Feb 2026", requestIdx: 6 },
    { fileName: "Acme_OrgChart_Current.pdf", fileType: "PDF", fileSize: 1200000, category: "OrgChart", entity: "Acme Corp", period: null, requestIdx: 8 },
    { fileName: "Acme_Headcount_ByDept_March2026.xlsx", fileType: "Excel", fileSize: 560000, category: "HRData", entity: "Acme Corp", period: "March 2026", requestIdx: 9 },
    { fileName: "Vendor_Contracts_Top20.zip", fileType: "Other", fileSize: 15600000, category: "Contract", entity: "Acme Corp", period: null, requestIdx: 14 },
    { fileName: "Customer_Agreements_Top10.zip", fileType: "Other", fileSize: 8900000, category: "Contract", entity: "Acme Corp", period: null, requestIdx: 15 },
    { fileName: "Acme_Leases_AllLocations.pdf", fileType: "PDF", fileSize: 4500000, category: "Contract", entity: "Acme Corp", period: null, requestIdx: 16 },
    { fileName: "Acme_IT_Systems_Inventory.xlsx", fileType: "Excel", fileSize: 780000, category: "Other", entity: "Acme Corp", period: "2026", requestIdx: 21 },
    // Extra documents not linked to requests
    { fileName: "Acme_Annual_Report_2025.pdf", fileType: "PDF", fileSize: 5400000, category: "FinancialStatement", entity: "Acme Corp", period: "FY2025", requestIdx: -1 },
    { fileName: "Acme_Employee_Handbook_2025.pdf", fileType: "PDF", fileSize: 2100000, category: "Policy", entity: "Acme Corp", period: null, requestIdx: -1 },
  ];

  for (const doc of documents) {
    const linkedRequest = doc.requestIdx >= 0 ? createdRequests[doc.requestIdx] : null;
    await prisma.document.create({
      data: {
        engagementId: engagement.id,
        dataRequestId: linkedRequest?.id || null,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        category: doc.category,
        entity: doc.entity,
        period: doc.period,
        status: doc.requestIdx >= 0 ? "Reviewed" : "Pending",
        uploadedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
      },
    });
  }

  // Activity feed for primary engagement
  const activities = [
    { type: "engagement_created", description: "Engagement created: Acme Corp Financial Due Diligence", daysAgo: 18 },
    { type: "team_member_added", description: "Marcus Chen added as Lead", daysAgo: 18 },
    { type: "team_member_added", description: "Rachel Torres added as Financial Analyst", daysAgo: 18 },
    { type: "team_member_added", description: "James Park added as Org Consultant", daysAgo: 17 },
    { type: "team_member_added", description: "Priya Sharma added as Contract Specialist", daysAgo: 17 },
    { type: "team_member_added", description: "Alex Kim added as Associate", daysAgo: 17 },
    { type: "data_request_added", description: "25 data request items sent to client", daysAgo: 15 },
    { type: "status_changed", description: "Engagement status changed to DataCollection", daysAgo: 14 },
    { type: "document_uploaded", description: "Acme_OrgChart_Current.pdf uploaded", daysAgo: 10 },
    { type: "data_request_updated", description: "Org chart (current) marked as Received", daysAgo: 10 },
    { type: "document_uploaded", description: "Acme_PL_Monthly_FY2023-FY2025.xlsx uploaded", daysAgo: 9 },
    { type: "data_request_updated", description: "P&L statements marked as Received", daysAgo: 9 },
    { type: "document_uploaded", description: "Acme_BalanceSheet_Quarterly_FY2023-FY2025.xlsx uploaded", daysAgo: 7 },
    { type: "document_uploaded", description: "Acme_CashFlow_Annual_FY2023-FY2025.pdf uploaded", daysAgo: 6 },
    { type: "data_request_updated", description: "Balance sheets and cash flows marked as Received", daysAgo: 6 },
    { type: "document_uploaded", description: "Acme_Headcount_ByDept_March2026.xlsx uploaded", daysAgo: 5 },
    { type: "document_uploaded", description: "Vendor_Contracts_Top20.zip uploaded", daysAgo: 4 },
    { type: "document_uploaded", description: "Customer_Agreements_Top10.zip uploaded", daysAgo: 3 },
    { type: "data_request_updated", description: "Top 20 vendor contracts and top 10 customer contracts marked as Received", daysAgo: 3 },
    { type: "document_uploaded", description: "Acme_Leases_AllLocations.pdf uploaded", daysAgo: 2 },
    { type: "document_uploaded", description: "Acme_IT_Systems_Inventory.xlsx uploaded", daysAgo: 1 },
    { type: "data_request_updated", description: "Employee turnover data marked as Not Available (client does not track)", daysAgo: 1 },
    { type: "data_request_updated", description: "Partnership agreements marked as Not Available (none exist)", daysAgo: 1 },
  ];

  for (const act of activities) {
    await prisma.activity.create({
      data: {
        engagementId: engagement.id,
        type: act.type,
        description: act.description,
        createdAt: new Date(Date.now() - act.daysAgo * 86400000),
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  - 3 engagements created`);
  console.log(`  - ${teamMembers.length + 2} team members created`);
  console.log(`  - ${dataRequests.length} data requests created`);
  console.log(`  - ${documents.length} documents created`);
  console.log(`  - ${activities.length} activity entries created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
