import { PrismaClient } from ".prisma/client-financial";

const prisma = new PrismaClient();

// Realistic P&L account structure for a mid-size company
const PNL_ACCOUNTS = [
  { name: "Product Revenue", category: "Revenue", base: 800000 },
  { name: "Service Revenue", category: "Revenue", base: 350000 },
  { name: "Other Revenue", category: "Revenue", base: 25000 },
  { name: "Cost of Materials", category: "COGS", base: 320000 },
  { name: "Direct Labor", category: "COGS", base: 180000 },
  { name: "Manufacturing Overhead", category: "COGS", base: 95000 },
  { name: "Salaries & Wages", category: "OpEx_SGA", base: 175000 },
  { name: "Employee Benefits", category: "OpEx_SGA", base: 45000 },
  { name: "Rent & Facilities", category: "OpEx_SGA", base: 35000 },
  { name: "Office Supplies & Expenses", category: "OpEx_SGA", base: 8000 },
  { name: "Professional Fees (Legal, Accounting)", category: "OpEx_SGA", base: 22000 },
  { name: "Insurance", category: "OpEx_SGA", base: 12000 },
  { name: "Travel & Entertainment", category: "OpEx_SGA", base: 18000 },
  { name: "Utilities & Telecom", category: "OpEx_SGA", base: 9000 },
  { name: "Advertising & Marketing Programs", category: "OpEx_SM", base: 42000 },
  { name: "Sales Commissions", category: "OpEx_SM", base: 58000 },
  { name: "Marketing Staff", category: "OpEx_SM", base: 35000 },
  { name: "R&D Staff & Contractors", category: "OpEx_RD", base: 65000 },
  { name: "Lab & Equipment", category: "OpEx_RD", base: 12000 },
  { name: "Depreciation", category: "OpEx_DA", base: 28000 },
  { name: "Amortization of Intangibles", category: "OpEx_DA", base: 8000 },
  { name: "Interest Income", category: "OtherIncomeExpense", base: 2000 },
  { name: "Interest Expense", category: "OtherIncomeExpense", base: -15000 },
  { name: "Income Tax Expense", category: "Tax", base: 25000 },
];

function vary(base: number, month: number, year: number): number {
  // Seasonality: Q4 is 15% higher, Q1 is 10% lower
  const seasonality = [
    -0.1, -0.05, 0, 0.02, 0.05, 0.03, 0, -0.02, 0.05, 0.08, 0.12, 0.15,
  ];
  // Year-over-year growth: 8% for year 1->2, declining to 3% for year 2->3
  const yearGrowth = year === 0 ? 1.0 : year === 1 ? 1.08 : 1.08 * 1.03;
  // Random noise +/- 5%
  const noise = 1 + (Math.random() * 0.1 - 0.05);
  // Seasonal factor
  const seasonal = 1 + (seasonality[month] ?? 0);

  return Math.round(base * yearGrowth * seasonal * noise);
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.findingEvidence.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.ebitdaAdjustment.deleteMany();
  await prisma.financialLineItem.deleteMany();
  await prisma.financialStatement.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.engagement.deleteMany();

  console.log("Creating engagement...");
  const engagement = await prisma.engagement.create({
    data: {
      name: "Acme Corp Financial Due Diligence",
      clientName: "Acme Corporation",
      type: "DueDiligence",
      status: "Analysis",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-03-15"),
      scopeDescription:
        "Full financial due diligence for proposed acquisition of Acme Corp. Scope includes 3-year historical P&L analysis, EBITDA normalization, quality of earnings assessment, and identification of financial risks and opportunities.",
    },
  });

  console.log("Creating 36 months of P&L data...");
  const years = [2023, 2024, 2025];
  const allStatements = [];

  for (let yearIdx = 0; yearIdx < years.length; yearIdx++) {
    const year = years[yearIdx];
    for (let month = 0; month < 12; month++) {
      const period = `${year}-${String(month + 1).padStart(2, "0")}`;

      const lineItems = PNL_ACCOUNTS.map((acct, idx) => ({
        accountName: acct.name,
        accountCode: `${1000 + idx * 10}`,
        standardCategory: acct.category,
        amount: vary(acct.base, month, yearIdx),
        isRecurring: true,
        sortOrder: idx,
      }));

      const stmt = await prisma.financialStatement.create({
        data: {
          engagementId: engagement.id,
          entity: "Acme Corporation",
          statementType: "ProfitAndLoss",
          period,
          periodType: "Monthly",
          currency: "USD",
          sourceFileName: `acme_pnl_${year}.xlsx`,
          lineItems: {
            create: lineItems,
          },
        },
        include: { lineItems: true },
      });

      allStatements.push(stmt);
    }
  }

  console.log(`Created ${allStatements.length} financial statements`);

  // Create some EBITDA adjustments
  console.log("Creating EBITDA adjustments...");
  await prisma.ebitdaAdjustment.createMany({
    data: [
      {
        engagementId: engagement.id,
        description: "CEO discretionary bonus (one-time)",
        amount: 150000,
        classification: "OwnerRelated",
        notes: "One-time bonus paid to founder/CEO in 2024. Not expected to recur under new ownership.",
      },
      {
        engagementId: engagement.id,
        description: "Litigation settlement",
        amount: 275000,
        classification: "NonRecurring",
        notes: "Settlement of patent dispute in Q3 2025. Fully resolved, no ongoing liability.",
      },
      {
        engagementId: engagement.id,
        description: "Facility relocation costs",
        amount: 85000,
        classification: "NonRecurring",
        notes: "One-time costs for warehouse relocation in Q1 2025.",
      },
      {
        engagementId: engagement.id,
        description: "Above-market rent to related party",
        amount: 120000,
        classification: "OwnerRelated",
        notes: "Annual excess rent paid to property owned by CEO. Market rate would be $120K/yr less.",
      },
      {
        engagementId: engagement.id,
        description: "Run-rate savings from recent headcount reduction",
        amount: 200000,
        classification: "RunRate",
        notes: "Annualized savings from 3 positions eliminated in Q4 2025.",
      },
    ],
  });

  // Create sample findings
  console.log("Creating findings...");
  const recentStmt = allStatements[allStatements.length - 1];
  const revenueItem = recentStmt.lineItems.find((li) =>
    li.accountName.includes("Product Revenue")
  );
  const cogsItem = recentStmt.lineItems.find((li) =>
    li.accountName.includes("Cost of Materials")
  );

  const finding1 = await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Risk",
      severity: "High",
      title: "Gross margin declined 3.2pp over 3 years (42.1% to 38.9%)",
      description:
        "Gross margin has shown a persistent declining trend from 42.1% in 2023 to 38.9% in 2025. This is driven primarily by rising material costs (+12% YoY) that have outpaced revenue growth (+8% then +3%). The company has been unable to pass through cost increases to customers. If the trend continues, EBITDA margin could compress below 10% within 18 months.",
      financialImpact: -1500000,
      tags: "margin-erosion,cost-structure,pricing",
      status: "Confirmed",
      evidence: revenueItem
        ? {
            create: [
              { lineItemId: revenueItem.id },
              ...(cogsItem ? [{ lineItemId: cogsItem.id }] : []),
            ],
          }
        : undefined,
    },
  });

  const salaryItem = recentStmt.lineItems.find((li) =>
    li.accountName.includes("Salaries")
  );

  await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Observation",
      severity: "Medium",
      title: "SG&A growing faster than revenue (14% vs 3% YoY)",
      description:
        "Selling, General & Administrative expenses have grown 14% year-over-year in 2025 while revenue grew only 3%. Key drivers are salaries (+11%), professional fees (+18%), and travel (+22%). This suggests operational inefficiency or investment ahead of revenue growth that has not yet materialized.",
      financialImpact: -450000,
      tags: "cost-structure,overhead,efficiency",
      status: "Draft",
      evidence: salaryItem
        ? { create: [{ lineItemId: salaryItem.id }] }
        : undefined,
    },
  });

  await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Opportunity",
      severity: "Medium",
      title: "Sales commission rate above industry benchmark (4.9% vs 3.5% median)",
      description:
        "Sales commissions as a percentage of revenue are 4.9%, compared to the industry median of 3.5%. Restructuring the commission plan to align with market rates could yield $165K in annual savings without impacting sales effectiveness, based on benchmarking data.",
      financialImpact: 165000,
      tags: "cost-reduction,compensation,sales",
      status: "Draft",
    },
  });

  await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Anomaly",
      severity: "High",
      title: "Professional fees spike in Q3 2025 (+180% vs prior quarter)",
      description:
        "Professional fees (legal and accounting) spiked from $22K/month average to $62K in Q3 2025. Investigation revealed this was related to the patent litigation settlement. While the settlement is non-recurring, the underlying patent risk should be assessed for future exposure.",
      financialImpact: -120000,
      tags: "legal,non-recurring,risk",
      status: "Confirmed",
    },
  });

  await prisma.finding.create({
    data: {
      engagementId: engagement.id,
      workstream: "Financial",
      category: "Risk",
      severity: "Low",
      title: "Strong seasonal concentration in Q4 (35% of annual revenue)",
      description:
        "Q4 consistently accounts for approximately 35% of annual revenue, creating working capital pressure and delivery concentration risk. The buyer should model cash flow implications of this seasonality pattern.",
      tags: "seasonality,working-capital,revenue-concentration",
      status: "Draft",
    },
  });

  // Create benchmarks
  console.log("Creating benchmarks...");
  await prisma.benchmark.createMany({
    data: [
      {
        engagementId: engagement.id,
        metric: "Gross Margin",
        industry: "Mid-Market Manufacturing",
        source: "Industry Report 2025",
        percentile25: 0.3,
        median: 0.35,
        percentile75: 0.42,
        year: 2025,
      },
      {
        engagementId: engagement.id,
        metric: "Operating Margin",
        industry: "Mid-Market Manufacturing",
        source: "Industry Report 2025",
        percentile25: 0.08,
        median: 0.12,
        percentile75: 0.18,
        year: 2025,
      },
      {
        engagementId: engagement.id,
        metric: "EBITDA Margin",
        industry: "Mid-Market Manufacturing",
        source: "Industry Report 2025",
        percentile25: 0.1,
        median: 0.15,
        percentile75: 0.22,
        year: 2025,
      },
      {
        engagementId: engagement.id,
        metric: "Net Margin",
        industry: "Mid-Market Manufacturing",
        source: "Industry Report 2025",
        percentile25: 0.04,
        median: 0.08,
        percentile75: 0.13,
        year: 2025,
      },
    ],
  });

  console.log("Seed complete!");
  console.log(`  Engagement: ${engagement.name} (${engagement.id})`);
  console.log(`  Statements: ${allStatements.length}`);
  console.log(`  Line items: ${allStatements.reduce((s, st) => s + st.lineItems.length, 0)}`);
  console.log(`  Findings: 5`);
  console.log(`  EBITDA Adjustments: 5`);
  console.log(`  Benchmarks: 4`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
