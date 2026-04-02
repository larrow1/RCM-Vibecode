import { PrismaClient } from "../node_modules/.prisma/client-org-mapper";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.finding.deleteMany();
  await prisma.importLog.deleteMany();
  await prisma.orgUnit.deleteMany();
  await prisma.orgBenchmark.deleteMany();
  await prisma.engagement.deleteMany();

  // Create engagement
  const engagement = await prisma.engagement.create({
    data: {
      name: "Acme Corp Organizational Assessment",
      clientName: "Acme Corporation",
      type: "OrgAssessment",
      status: "Analysis",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-05-15"),
      scopeDescription:
        "Full organizational assessment of Acme Corp — evaluating structure, spans of control, management layers, role clarity, headcount allocation, and labor cost efficiency across all departments.",
    },
  });

  // Build org structure: ~65 people across 6 departments
  // Level 0: CEO
  const ceo = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "Sarah Chen",
      title: "Chief Executive Officer",
      department: "Executive",
      type: "Role",
      level: 0,
      headcount: 1,
      totalCompensation: 450000,
      employeeId: "E001",
    },
  });

  // Level 1: C-suite (5 direct reports to CEO)
  const csuite = await Promise.all([
    prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: "Michael Torres",
        title: "Chief Technology Officer",
        department: "Engineering",
        type: "Role",
        parentId: ceo.id,
        level: 1,
        headcount: 1,
        totalCompensation: 350000,
        employeeId: "E002",
      },
    }),
    prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: "Jennifer Park",
        title: "Chief Financial Officer",
        department: "Finance",
        type: "Role",
        parentId: ceo.id,
        level: 1,
        headcount: 1,
        totalCompensation: 320000,
        employeeId: "E003",
      },
    }),
    prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: "Robert Williams",
        title: "VP of Sales",
        department: "Sales",
        type: "Role",
        parentId: ceo.id,
        level: 1,
        headcount: 1,
        totalCompensation: 310000,
        employeeId: "E004",
      },
    }),
    prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: "Lisa Chang",
        title: "VP of Marketing",
        department: "Marketing",
        type: "Role",
        parentId: ceo.id,
        level: 1,
        headcount: 1,
        totalCompensation: 280000,
        employeeId: "E005",
      },
    }),
    prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: "David Johnson",
        title: "VP of Human Resources",
        department: "Human Resources",
        type: "Role",
        parentId: ceo.id,
        level: 1,
        headcount: 1,
        totalCompensation: 260000,
        employeeId: "E006",
      },
    }),
  ]);

  const [cto, cfo, vpSales, vpMarketing, vpHR] = csuite;

  // Engineering department (under CTO) - 25 people total
  const engDir = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "Anna Rodriguez",
      title: "Director of Engineering",
      department: "Engineering",
      type: "Role",
      parentId: cto.id,
      level: 2,
      headcount: 1,
      totalCompensation: 220000,
      employeeId: "E010",
    },
  });

  const platformLead = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "James Liu",
      title: "Senior Engineering Manager",
      department: "Engineering",
      type: "Role",
      parentId: engDir.id,
      level: 3,
      headcount: 1,
      totalCompensation: 190000,
      employeeId: "E011",
    },
  });

  // Platform team - 14 direct reports (TOO MANY - span of control issue)
  const platformEngineers = [
    { name: "Alex Kim", title: "Senior Software Engineer", comp: 165000, eid: "E020" },
    { name: "Maria Garcia", title: "Senior Software Engineer", comp: 160000, eid: "E021" },
    { name: "Tom Brown", title: "Software Engineer", comp: 130000, eid: "E022" },
    { name: "Sara White", title: "Software Engineer", comp: 125000, eid: "E023" },
    { name: "Kevin Patel", title: "Software Engineer", comp: 128000, eid: "E024" },
    { name: "Emily Davis", title: "Software Engineer", comp: 132000, eid: "E025" },
    { name: "Chris Lee", title: "Software Engineer", comp: 127000, eid: "E026" },
    { name: "Diana Martinez", title: "Junior Software Engineer", comp: 95000, eid: "E027" },
    { name: "Ryan Taylor", title: "Junior Software Engineer", comp: 92000, eid: "E028" },
    { name: "Nicole Anderson", title: "QA Engineer", comp: 110000, eid: "E029" },
    { name: "Paul Wilson", title: "QA Engineer", comp: 108000, eid: "E030" },
    { name: "Laura Thomas", title: "DevOps Engineer", comp: 145000, eid: "E031" },
    { name: "Mark Jackson", title: "DevOps Engineer", comp: 142000, eid: "E032" },
    { name: "Rachel Green", title: "Technical Writer", comp: 90000, eid: "E033" },
  ];

  for (const eng of platformEngineers) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: eng.name,
        title: eng.title,
        department: "Engineering",
        type: "Role",
        parentId: platformLead.id,
        level: 4,
        headcount: 1,
        totalCompensation: eng.comp,
        employeeId: eng.eid,
      },
    });
  }

  // Data team under CTO - small team with manager (2 direct reports - TOO FEW)
  const dataLead = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "Steven Clark",
      title: "Data Engineering Manager",
      department: "Engineering",
      type: "Role",
      parentId: cto.id,
      level: 2,
      headcount: 1,
      totalCompensation: 200000,
      employeeId: "E040",
    },
  });

  for (const de of [
    { name: "Amanda Foster", title: "Data Engineer", comp: 140000, eid: "E041" },
    { name: "Derek Nguyen", title: "Data Engineer", comp: 135000, eid: "E042" },
  ]) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: de.name,
        title: de.title,
        department: "Engineering",
        type: "Role",
        parentId: dataLead.id,
        level: 3,
        headcount: 1,
        totalCompensation: de.comp,
        employeeId: de.eid,
      },
    });
  }

  // Finance department (under CFO) - 8 people
  const financeDir = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "Catherine Bell",
      title: "Director of Finance",
      department: "Finance",
      type: "Role",
      parentId: cfo.id,
      level: 2,
      headcount: 1,
      totalCompensation: 195000,
      employeeId: "E050",
    },
  });

  const financeTeam = [
    { name: "George Martin", title: "Senior Accountant", comp: 110000, eid: "E051" },
    { name: "Helen Wright", title: "Senior Accountant", comp: 108000, eid: "E052" },
    { name: "Ian Brooks", title: "Financial Analyst", comp: 95000, eid: "E053" },
    { name: "Jessica Reed", title: "Financial Analyst", comp: 92000, eid: "E054" },
    { name: "Kenneth Hall", title: "AP/AR Specialist", comp: 72000, eid: "E055" },
    { name: "Linda Cooper", title: "Payroll Specialist", comp: 75000, eid: "E056" },
  ];

  for (const f of financeTeam) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: f.name,
        title: f.title,
        department: "Finance",
        type: "Role",
        parentId: financeDir.id,
        level: 3,
        headcount: 1,
        totalCompensation: f.comp,
        employeeId: f.eid,
      },
    });
  }

  // Sales department (under VP Sales) - 12 people
  const salesDir = await prisma.orgUnit.create({
    data: {
      engagementId: engagement.id,
      name: "Patricia Adams",
      title: "Director of Sales",
      department: "Sales",
      type: "Role",
      parentId: vpSales.id,
      level: 2,
      headcount: 1,
      totalCompensation: 185000,
      employeeId: "E060",
    },
  });

  const salesTeam = [
    { name: "Quinn Sullivan", title: "Senior Account Executive", comp: 140000, eid: "E061" },
    { name: "Richard Evans", title: "Senior Account Executive", comp: 135000, eid: "E062" },
    { name: "Samantha Price", title: "Account Executive", comp: 105000, eid: "E063" },
    { name: "Timothy Ross", title: "Account Executive", comp: 102000, eid: "E064" },
    { name: "Ursula Diaz", title: "Account Executive", comp: 98000, eid: "E065" },
    { name: "Victor Morales", title: "SDR Manager", comp: 115000, eid: "E066" },
  ];

  for (const s of salesTeam) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: s.name,
        title: s.title,
        department: "Sales",
        type: "Role",
        parentId: salesDir.id,
        level: 3,
        headcount: 1,
        totalCompensation: s.comp,
        employeeId: s.eid,
      },
    });
  }

  // SDRs under SDR Manager (2 reports - TOO FEW)
  const sdrManager = await prisma.orgUnit.findFirst({
    where: { employeeId: "E066" },
  });

  for (const sdr of [
    { name: "Wendy Harper", title: "Sales Development Rep", comp: 65000, eid: "E067" },
    { name: "Xavier Collins", title: "Sales Development Rep", comp: 62000, eid: "E068" },
  ]) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: sdr.name,
        title: sdr.title,
        department: "Sales",
        type: "Role",
        parentId: sdrManager!.id,
        level: 4,
        headcount: 1,
        totalCompensation: sdr.comp,
        employeeId: sdr.eid,
      },
    });
  }

  // Marketing department (under VP Marketing) - 7 people
  const mktgTeam = [
    { name: "Yolanda Fisher", title: "Content Marketing Manager", comp: 120000, eid: "E070" },
    { name: "Zachary Hunt", title: "Digital Marketing Specialist", comp: 85000, eid: "E071" },
    { name: "Amber Perry", title: "Digital Marketing Specialist", comp: 82000, eid: "E072" },
    { name: "Brandon Scott", title: "Graphic Designer", comp: 78000, eid: "E073" },
    { name: "Carla Gonzalez", title: "Marketing Analyst", comp: 88000, eid: "E074" },
    { name: "Dylan Murphy", title: "Events Coordinator", comp: 70000, eid: "E075" },
  ];

  for (const m of mktgTeam) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: m.name,
        title: m.title,
        department: "Marketing",
        type: "Role",
        parentId: vpMarketing.id,
        level: 2,
        headcount: 1,
        totalCompensation: m.comp,
        employeeId: m.eid,
      },
    });
  }

  // HR department (under VP HR) - 4 people
  const hrTeam = [
    { name: "Evelyn Foster", title: "HR Manager", comp: 110000, eid: "E080" },
    { name: "Frank Butler", title: "Recruiter", comp: 75000, eid: "E081" },
    { name: "Grace Howard", title: "HR Coordinator", comp: 62000, eid: "E082" },
    { name: "Henry Simmons", title: "Training Specialist", comp: 72000, eid: "E083" },
  ];

  for (const h of hrTeam) {
    await prisma.orgUnit.create({
      data: {
        engagementId: engagement.id,
        name: h.name,
        title: h.title,
        department: "Human Resources",
        type: "Role",
        parentId: vpHR.id,
        level: 2,
        headcount: 1,
        totalCompensation: h.comp,
        employeeId: h.eid,
      },
    });
  }

  // Create findings
  const findings = [
    {
      orgUnitId: platformLead.id,
      category: "Risk",
      severity: "High",
      title: "Excessive span of control — Platform Engineering Manager has 14 direct reports",
      description:
        "James Liu manages 14 individual contributors directly with no intermediate leads. This exceeds the recommended maximum of 12 and likely results in insufficient 1:1 time, delayed code reviews, and burnout risk. Industry benchmark for engineering managers is 5-8 direct reports.",
      financialImpact: null,
      tags: "span-of-control,engineering,management",
    },
    {
      orgUnitId: dataLead.id,
      category: "Observation",
      severity: "Medium",
      title: "Data Engineering Manager has only 2 direct reports — potential unnecessary management layer",
      description:
        "Steven Clark manages only 2 data engineers. This is below the minimum healthy threshold of 3 direct reports, suggesting this management layer may be unnecessary. The team could potentially report directly to the CTO or be merged with the platform team.",
      financialImpact: 200000,
      tags: "span-of-control,management-layers,cost",
    },
    {
      orgUnitId: null,
      category: "Opportunity",
      severity: "Medium",
      title: "Duplicate Financial Analyst roles across Finance and Marketing",
      description:
        "Both Finance and Marketing departments have 'Financial Analyst' and 'Marketing Analyst' roles performing overlapping analysis work. Consolidating into a shared analytics function could improve efficiency and reduce headcount by 1-2 FTEs.",
      financialImpact: 180000,
      tags: "role-duplication,consolidation,cost",
    },
    {
      orgUnitId: sdrManager!.id,
      category: "Observation",
      severity: "Low",
      title: "SDR Manager oversees only 2 SDRs — layer may not be justified at current scale",
      description:
        "Victor Morales as SDR Manager has only 2 direct reports. At this team size, a dedicated manager may not be cost-effective. Consider having SDRs report to the Director of Sales until the team grows to 5+.",
      financialImpact: 115000,
      tags: "span-of-control,sales,management-layers",
    },
    {
      orgUnitId: null,
      category: "Observation",
      severity: "Informational",
      title: "Engineering department represents 46% of total headcount",
      description:
        "Engineering has 28 of 61 total employees (46%). This is within normal range for a technology company but should be monitored. Labor costs for engineering represent approximately 48% of total compensation spend.",
      financialImpact: null,
      tags: "headcount,cost-allocation,engineering",
    },
    {
      orgUnitId: vpMarketing.id,
      category: "Risk",
      severity: "Medium",
      title: "VP of Marketing has 6 direct reports spanning diverse functions with no middle management",
      description:
        "Lisa Chang directly manages content, digital marketing, design, analytics, and events with no directors or managers in between. As the team grows, this flat structure may become unsustainable. Consider grouping into 2-3 sub-teams with leads.",
      financialImpact: null,
      tags: "span-of-control,marketing,structure",
    },
  ];

  for (const f of findings) {
    await prisma.finding.create({
      data: {
        engagementId: engagement.id,
        orgUnitId: f.orgUnitId,
        workstream: "Organizational",
        category: f.category,
        severity: f.severity,
        title: f.title,
        description: f.description,
        financialImpact: f.financialImpact,
        tags: f.tags,
        status: "Confirmed",
      },
    });
  }

  // Create benchmarks
  const benchmarks = [
    { metric: "Span of Control", industry: "Technology", source: "Gartner 2025", minHealthy: 3, maxHealthy: 12, median: 7, year: 2025 },
    { metric: "Engineering Headcount %", industry: "Technology", source: "Radford Survey 2025", minHealthy: 25, maxHealthy: 50, median: 35, year: 2025 },
    { metric: "Management Overhead Ratio", industry: "Technology", source: "McKinsey 2025", minHealthy: 0.08, maxHealthy: 0.15, median: 0.12, year: 2025 },
    { metric: "Org Layers (CEO to IC)", industry: "Technology", source: "Bain & Company 2025", minHealthy: 4, maxHealthy: 8, median: 6, year: 2025 },
    { metric: "Revenue per Employee", industry: "Technology", source: "KeyBanc SaaS Survey 2025", minHealthy: 150000, maxHealthy: 400000, median: 250000, year: 2025 },
  ];

  for (const b of benchmarks) {
    await prisma.orgBenchmark.create({ data: b });
  }

  // Count results
  const counts = {
    orgUnits: await prisma.orgUnit.count({ where: { engagementId: engagement.id } }),
    findings: await prisma.finding.count({ where: { engagementId: engagement.id } }),
    benchmarks: await prisma.orgBenchmark.count(),
  };

  console.log("Seed complete:");
  console.log(`  Engagement: ${engagement.name}`);
  console.log(`  Org Units: ${counts.orgUnits}`);
  console.log(`  Findings: ${counts.findings}`);
  console.log(`  Benchmarks: ${counts.benchmarks}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
