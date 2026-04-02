import { PrismaClient } from "../node_modules/.prisma/client-progress";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.flow.deleteMany();
  await prisma.flowTemplate.deleteMany();
  await prisma.engagement.deleteMany();

  // Create engagements
  const eng1 = await prisma.engagement.create({
    data: {
      name: "Q1 2026 Full Assessment",
      clientName: "Acme Corporation",
      type: "Full Assessment",
      status: "In Progress",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-04-30"),
    },
  });

  const eng2 = await prisma.engagement.create({
    data: {
      name: "Financial Due Diligence - Project Alpha",
      clientName: "TechStart Inc.",
      type: "Financial Due Diligence",
      status: "Scoping",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-05-15"),
    },
  });

  const eng3 = await prisma.engagement.create({
    data: {
      name: "Operational Review",
      clientName: "GlobalRetail Corp",
      type: "Operational Review",
      status: "In Progress",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-04-15"),
    },
  });

  // Create a flow for engagement 1 (full assessment, partially completed)
  const flow1 = await prisma.flow.create({
    data: {
      engagementId: eng1.id,
      name: "Acme Full Assessment Flow",
      description: "Complete assessment covering financial, organizational, and contract workstreams",
      status: "In Progress",
      templateId: "full-assessment",
    },
  });

  // Phase 1: Scoping (completed)
  const phase1 = await prisma.phase.create({
    data: {
      flowId: flow1.id,
      name: "Scoping & Planning",
      description: "Define engagement scope, assemble team, establish timelines",
      sortOrder: 0,
      status: "Completed",
    },
  });

  const phase1Tasks = [
    { title: "Define assessment scope and objectives", status: "Completed", priority: "Critical" },
    { title: "Assemble engagement team", status: "Completed", priority: "High" },
    { title: "Create data request list", status: "Completed", priority: "High" },
    { title: "Set up engagement workspace", status: "Completed", priority: "Medium" },
    { title: "Schedule kickoff meeting", status: "Completed", priority: "High" },
    { title: "Establish reporting cadence", status: "Completed", priority: "Medium" },
  ];

  for (let i = 0; i < phase1Tasks.length; i++) {
    await prisma.task.create({
      data: {
        phaseId: phase1.id,
        title: phase1Tasks[i].title,
        description: `Task for scoping phase`,
        status: phase1Tasks[i].status,
        priority: phase1Tasks[i].priority,
        sortOrder: i,
        aiGenerated: true,
        completedAt: new Date("2026-01-25"),
      },
    });
  }

  // Phase 2: Data Collection (in progress)
  const phase2 = await prisma.phase.create({
    data: {
      flowId: flow1.id,
      name: "Data Collection & Ingestion",
      description: "Gather, organize, and validate source materials",
      sortOrder: 1,
      status: "In Progress",
    },
  });

  const phase2Tasks = [
    { title: "Send initial data requests", status: "Completed", priority: "Critical" },
    { title: "Track data request fulfillment", status: "In Progress", priority: "High" },
    { title: "Ingest financial statements", status: "Completed", priority: "High" },
    { title: "Collect organizational charts", status: "In Progress", priority: "Medium" },
    { title: "Gather contract portfolio", status: "Pending", priority: "Medium" },
    { title: "Validate data completeness", status: "Pending", priority: "High" },
  ];

  for (let i = 0; i < phase2Tasks.length; i++) {
    await prisma.task.create({
      data: {
        phaseId: phase2.id,
        title: phase2Tasks[i].title,
        description: `Task for data collection phase`,
        status: phase2Tasks[i].status,
        priority: phase2Tasks[i].priority,
        sortOrder: i,
        aiGenerated: true,
        completedAt: phase2Tasks[i].status === "Completed" ? new Date("2026-02-10") : null,
      },
    });
  }

  // Phase 3: Analysis (not started)
  const phase3 = await prisma.phase.create({
    data: {
      flowId: flow1.id,
      name: "Analysis",
      description: "Perform detailed analysis across all workstreams",
      sortOrder: 2,
      status: "Not Started",
    },
  });

  const phase3Tasks = [
    { title: "Financial ratio analysis", priority: "Critical" },
    { title: "Trend analysis across periods", priority: "High" },
    { title: "EBITDA normalization", priority: "High" },
    { title: "Organizational structure review", priority: "High" },
    { title: "Contract risk assessment", priority: "Medium" },
    { title: "Benchmark comparison", priority: "Medium" },
    { title: "Cross-workstream pattern identification", priority: "High" },
  ];

  for (let i = 0; i < phase3Tasks.length; i++) {
    await prisma.task.create({
      data: {
        phaseId: phase3.id,
        title: phase3Tasks[i].title,
        description: `Task for analysis phase`,
        status: "Pending",
        priority: phase3Tasks[i].priority,
        sortOrder: i,
        aiGenerated: true,
      },
    });
  }

  // Phase 4: Synthesis (not started)
  const phase4 = await prisma.phase.create({
    data: {
      flowId: flow1.id,
      name: "Synthesis & Recommendations",
      description: "Consolidate findings and develop actionable recommendations",
      sortOrder: 3,
      status: "Not Started",
    },
  });

  const phase4Tasks = [
    { title: "Compile findings by workstream", priority: "Critical" },
    { title: "Identify cross-cutting themes", priority: "High" },
    { title: "Develop recommendations", priority: "Critical" },
    { title: "Prioritize recommendations", priority: "High" },
    { title: "Calculate financial impact", priority: "High" },
    { title: "Internal review", priority: "Medium" },
  ];

  for (let i = 0; i < phase4Tasks.length; i++) {
    await prisma.task.create({
      data: {
        phaseId: phase4.id,
        title: phase4Tasks[i].title,
        description: `Task for synthesis phase`,
        status: "Pending",
        priority: phase4Tasks[i].priority,
        sortOrder: i,
        aiGenerated: true,
      },
    });
  }

  // Phase 5: Deliverable (not started)
  const phase5 = await prisma.phase.create({
    data: {
      flowId: flow1.id,
      name: "Deliverable & Presentation",
      description: "Produce final deliverables and present to stakeholders",
      sortOrder: 4,
      status: "Not Started",
    },
  });

  const phase5Tasks = [
    { title: "Draft executive summary", priority: "Critical" },
    { title: "Build detailed assessment report", priority: "Critical" },
    { title: "Create presentation deck", priority: "High" },
    { title: "Prepare appendix materials", priority: "Medium" },
    { title: "Client presentation", priority: "Critical" },
    { title: "Address client feedback", priority: "High" },
  ];

  for (let i = 0; i < phase5Tasks.length; i++) {
    await prisma.task.create({
      data: {
        phaseId: phase5.id,
        title: phase5Tasks[i].title,
        description: `Task for deliverable phase`,
        status: "Pending",
        priority: phase5Tasks[i].priority,
        sortOrder: i,
        aiGenerated: true,
      },
    });
  }

  // Create flow templates
  await prisma.flowTemplate.create({
    data: {
      name: "Full Assessment",
      description: "Complete assessment lifecycle covering all workstreams",
      type: "Full Assessment",
      phases: JSON.stringify([
        { name: "Scoping & Planning", tasksCount: 6 },
        { name: "Data Collection & Ingestion", tasksCount: 6 },
        { name: "Analysis", tasksCount: 7 },
        { name: "Synthesis & Recommendations", tasksCount: 6 },
        { name: "Deliverable & Presentation", tasksCount: 6 },
      ]),
      isDefault: true,
    },
  });

  await prisma.flowTemplate.create({
    data: {
      name: "Financial Due Diligence",
      description: "Focused financial analysis for transactions and investments",
      type: "Financial Due Diligence",
      phases: JSON.stringify([
        { name: "Scoping", tasksCount: 3 },
        { name: "Historical Analysis", tasksCount: 5 },
        { name: "Forward-Looking Analysis", tasksCount: 4 },
        { name: "Reporting", tasksCount: 4 },
      ]),
      isDefault: true,
    },
  });

  await prisma.flowTemplate.create({
    data: {
      name: "Operational Review",
      description: "Focused organizational and operational assessment",
      type: "Operational Review",
      phases: JSON.stringify([
        { name: "Discovery", tasksCount: 4 },
        { name: "Assessment", tasksCount: 5 },
        { name: "Recommendations", tasksCount: 4 },
      ]),
      isDefault: true,
    },
  });

  console.log("Seed data created:");
  console.log(`  - ${3} engagements`);
  console.log(`  - ${1} flow with ${5} phases and ${31} tasks`);
  console.log(`  - ${3} flow templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
