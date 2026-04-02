import { PrismaClient } from ".prisma/client-findings";

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.themeFinding.deleteMany();
  await prisma.recommendationFinding.deleteMany();
  await prisma.findingLink.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.engagement.deleteMany();

  // Create engagement
  const engagement = await prisma.engagement.create({
    data: {
      name: "Acme Corp Operational Assessment",
      clientName: "Acme Corporation",
      type: "OperationalAssessment",
      status: "Synthesis",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-04-15"),
    },
  });

  // Create findings across workstreams
  const f1 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Risk",
      severity: "Critical",
      title: "Gross margin erosion — 8pp decline over 3 years",
      description:
        "Gross margin has declined from 42% in FY2023 to 34% in FY2025, driven by rising COGS in the Manufacturing division. Raw material costs grew 22% while revenue grew only 8%.",
      financialImpact: 4200000,
      tags: "cost-structure,manufacturing,margin",
      status: "Confirmed",
      createdBy: "Rachel Chen",
      evidence: {
        create: [
          { description: "P&L trend analysis — COGS growth outpacing revenue", sourceType: "FinancialStatement", sourceRef: "pl-fy2023-fy2025" },
          { description: "Raw material cost breakdown by supplier", sourceType: "Document", sourceRef: "doc-procurement-report" },
        ],
      },
    },
  });

  const f2 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Anomaly",
      severity: "High",
      title: "SG&A spike in Q3 2025 — $1.2M above trend",
      description:
        "Selling, General & Administrative expenses spiked by $1.2M in Q3 2025 compared to the trailing 4-quarter average. Investigation reveals one-time consulting fees and a failed marketing campaign.",
      financialImpact: 1200000,
      tags: "sga,non-recurring,cost-structure",
      status: "Confirmed",
      createdBy: "Rachel Chen",
      evidence: {
        create: [
          { description: "SG&A monthly trend chart showing Q3 anomaly", sourceType: "FinancialStatement", sourceRef: "pl-monthly-2025" },
        ],
      },
    },
  });

  const f3 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Organizational",
      category: "Observation",
      severity: "High",
      title: "Manufacturing division understaffed — 15% below target headcount",
      description:
        "Manufacturing has 42 FTEs against a target of 50. The shortfall is concentrated in quality control (3 of 8 positions vacant) and maintenance (2 of 6 vacant). This correlates with rising defect rates.",
      tags: "staffing,manufacturing,quality",
      status: "Confirmed",
      createdBy: "James Park",
      evidence: {
        create: [
          { description: "Headcount analysis by department — Manufacturing detail", sourceType: "OrgUnit", sourceRef: "org-manufacturing" },
          { description: "Vacancy report showing 8 open positions", sourceType: "Document", sourceRef: "doc-hr-vacancies" },
        ],
      },
    },
  });

  const f4 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Organizational",
      category: "Risk",
      severity: "Medium",
      title: "Excessive span of control in Sales — VP has 14 direct reports",
      description:
        "The VP of Sales has 14 direct reports, well above the recommended 6-8. This creates bottlenecks in decision-making and limits coaching capacity. Several reps report feeling unsupported.",
      tags: "span-of-control,sales,leadership",
      status: "Confirmed",
      createdBy: "James Park",
      evidence: {
        create: [
          { description: "Org chart showing Sales reporting structure", sourceType: "OrgUnit", sourceRef: "org-sales" },
        ],
      },
    },
  });

  const f5 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Contracts",
      category: "Opportunity",
      severity: "Medium",
      title: "Top 3 raw material suppliers — 18% above market rates",
      description:
        "Contracts with the three largest raw material suppliers show rates 12-24% above current market benchmarks. Combined annual spend is $8.4M. Contracts auto-renew in 6 months with 90-day notice required.",
      financialImpact: 1500000,
      tags: "vendor-risk,procurement,cost-structure",
      status: "Confirmed",
      createdBy: "Priya Sharma",
      evidence: {
        create: [
          { description: "Supplier rate comparison vs. market benchmarks", sourceType: "Contract", sourceRef: "contract-supplier-analysis" },
          { description: "Auto-renewal clauses in top 3 supplier agreements", sourceType: "Contract", sourceRef: "contract-renewal-schedule" },
        ],
      },
    },
  });

  const f6 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Contracts",
      category: "Risk",
      severity: "High",
      title: "Missing SLA enforcement on IT managed services contract",
      description:
        "The $1.8M/year IT managed services contract has no SLA enforcement mechanism. Uptime target is 99.5% but actual has been 97.2% over the past year with no financial recourse available.",
      financialImpact: 360000,
      tags: "vendor-risk,IT,sla",
      status: "Draft",
      createdBy: "Priya Sharma",
      evidence: {
        create: [
          { description: "IT MSA contract — SLA section review", sourceType: "Contract", sourceRef: "contract-it-msa" },
          { description: "IT uptime report showing 97.2% vs 99.5% target", sourceType: "Document", sourceRef: "doc-it-uptime" },
        ],
      },
    },
  });

  const f7 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Observation",
      severity: "Medium",
      title: "Working capital cycle lengthening — DSO increased from 35 to 52 days",
      description:
        "Days Sales Outstanding has increased from 35 days in FY2023 to 52 days in FY2025. This is being driven by concentration in two large customers with extended payment terms.",
      financialImpact: 800000,
      tags: "working-capital,receivables,cash-flow",
      status: "Confirmed",
      createdBy: "Rachel Chen",
      evidence: {
        create: [
          { description: "DSO trend analysis FY2023-FY2025", sourceType: "FinancialStatement", sourceRef: "bs-receivables" },
        ],
      },
    },
  });

  const f8 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "CrossCutting",
      category: "Risk",
      severity: "Critical",
      title: "Manufacturing cost crisis — financial, staffing, and vendor issues converge",
      description:
        "The margin erosion (financial), understaffing (org), and above-market supplier rates (contracts) in Manufacturing are interconnected. The staffing shortage leads to overtime and quality issues, which increases costs, while vendor contracts haven't been renegotiated.",
      financialImpact: 5500000,
      tags: "cross-cutting,manufacturing,cost-structure",
      status: "Confirmed",
      createdBy: "Marcus Williams",
      evidence: {
        create: [
          { description: "Cross-workstream analysis linking margin, staffing, and vendor findings", sourceType: "Other", sourceRef: "synthesis-manufacturing" },
        ],
      },
    },
  });

  // Create finding links (cross-references)
  await prisma.findingLink.createMany({
    data: [
      { fromFindingId: f1.id, toFindingId: f3.id, description: "Margin erosion correlates with manufacturing understaffing" },
      { fromFindingId: f1.id, toFindingId: f5.id, description: "Above-market supplier rates contribute to COGS growth" },
      { fromFindingId: f3.id, toFindingId: f5.id, description: "Understaffing and vendor costs both impact manufacturing" },
      { fromFindingId: f8.id, toFindingId: f1.id, description: "Cross-cutting finding synthesizes financial impact" },
      { fromFindingId: f8.id, toFindingId: f3.id, description: "Cross-cutting finding synthesizes org impact" },
      { fromFindingId: f8.id, toFindingId: f5.id, description: "Cross-cutting finding synthesizes contract impact" },
    ],
  });

  // Create themes
  const theme1 = await prisma.theme.create({
    data: {
      engagementId: engagement.id,
      name: "Manufacturing Cost Crisis",
      description: "Interconnected issues driving cost increases in Manufacturing division",
      color: "#EF4444",
    },
  });

  const theme2 = await prisma.theme.create({
    data: {
      engagementId: engagement.id,
      name: "Organizational Effectiveness",
      description: "Structural and staffing issues limiting operational performance",
      color: "#F59E0B",
    },
  });

  const theme3 = await prisma.theme.create({
    data: {
      engagementId: engagement.id,
      name: "Vendor & Contract Optimization",
      description: "Opportunities to improve terms and reduce costs across vendor portfolio",
      color: "#3B82F6",
    },
  });

  // Link findings to themes
  await prisma.themeFinding.createMany({
    data: [
      { themeId: theme1.id, findingId: f1.id },
      { themeId: theme1.id, findingId: f3.id },
      { themeId: theme1.id, findingId: f5.id },
      { themeId: theme1.id, findingId: f8.id },
      { themeId: theme2.id, findingId: f3.id },
      { themeId: theme2.id, findingId: f4.id },
      { themeId: theme3.id, findingId: f5.id },
      { themeId: theme3.id, findingId: f6.id },
    ],
  });

  // Create recommendations
  await prisma.recommendation.create({
    data: {
      engagementId: engagement.id,
      title: "Renegotiate top 3 raw material supplier contracts",
      description:
        "Issue RFPs for the three largest raw material supply contracts before auto-renewal in September 2026. Current rates are 18% above market. Target 12-15% rate reduction through competitive bidding.",
      type: "CostReduction",
      status: "Approved",
      impactBase: 8400000,
      impactAdjPct: 15,
      impactConfidence: "High",
      effort: "Medium",
      timeframe: "ShortTerm",
      risks: "Supplier switching costs; potential quality differences; relationship risk",
      dependencies: "Procurement team capacity; 90-day notice deadline in September",
      recommendationFindings: {
        create: [
          { findingId: f5.id },
          { findingId: f1.id },
        ],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      engagementId: engagement.id,
      title: "Fill critical manufacturing vacancies — QC and maintenance",
      description:
        "Immediately recruit for the 5 vacant quality control and maintenance positions. The staffing gap is contributing to defect rates and overtime costs. Consider temporary contractors while permanent hires are sourced.",
      type: "OperationalImprovement",
      status: "Approved",
      impactBase: 2000000,
      impactAdjPct: 30,
      impactConfidence: "Medium",
      effort: "Low",
      timeframe: "QuickWin",
      risks: "Tight labor market; training ramp-up time",
      recommendationFindings: {
        create: [
          { findingId: f3.id },
          { findingId: f1.id },
        ],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      engagementId: engagement.id,
      title: "Add SLA enforcement mechanisms to IT managed services contract",
      description:
        "Renegotiate the IT MSA to include financial penalties for SLA breaches. Current 97.2% uptime vs. 99.5% target represents ~$360K in unrealized service credits annually.",
      type: "RiskMitigation",
      status: "Reviewed",
      impactBase: 1800000,
      impactAdjPct: 20,
      impactConfidence: "Medium",
      effort: "Low",
      timeframe: "ShortTerm",
      recommendationFindings: {
        create: [{ findingId: f6.id }],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      engagementId: engagement.id,
      title: "Restructure Sales organization — add Regional Director layer",
      description:
        "Add 2 Regional Director positions between VP Sales and the 14 individual contributors. Target span of control of 7 per manager. Expected to improve rep coaching, pipeline discipline, and decision speed.",
      type: "StructuralChange",
      status: "Draft",
      impactBase: 5000000,
      impactAdjPct: 10,
      impactConfidence: "Low",
      effort: "High",
      timeframe: "MediumTerm",
      risks: "Internal politics; cost of new management layer; disruption during transition",
      dependencies: "VP Sales buy-in; budget approval for 2 new positions",
      recommendationFindings: {
        create: [{ findingId: f4.id }],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      engagementId: engagement.id,
      title: "Implement stricter payment terms for large customers",
      description:
        "Renegotiate payment terms with the two customers driving DSO increase from 35 to 52 days. Offer early-payment discounts (2/10 net 30) to incentivize faster payment.",
      type: "CostReduction",
      status: "Reviewed",
      impactBase: 800000,
      impactAdjPct: 50,
      impactConfidence: "Medium",
      effort: "Low",
      timeframe: "ShortTerm",
      recommendationFindings: {
        create: [{ findingId: f7.id }],
      },
    },
  });

  console.log("✓ Seed data created:");
  console.log(`  - 1 engagement: ${engagement.name}`);
  console.log(`  - 8 findings across Financial, Org, Contracts, CrossCutting`);
  console.log(`  - 6 finding cross-references`);
  console.log(`  - 3 themes`);
  console.log(`  - 5 recommendations with impact estimates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
