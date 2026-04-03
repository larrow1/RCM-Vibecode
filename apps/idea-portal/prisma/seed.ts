import { PrismaClient } from "../node_modules/.prisma/client-idea-portal";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories
  const categories = [
    { slug: "evidence-collection", name: "Evidence Collection", description: "Gathering and organizing source data from clients", sortOrder: 1 },
    { slug: "data-normalization", name: "Data Normalization", description: "Making heterogeneous data comparable and analyzable", sortOrder: 2 },
    { slug: "structural-analysis", name: "Structural Analysis", description: "Understanding how the organization is built", sortOrder: 3 },
    { slug: "pattern-recognition", name: "Pattern Recognition", description: "Finding anomalies, trends, risks, and opportunities", sortOrder: 4 },
    { slug: "cross-domain-synthesis", name: "Cross-Domain Synthesis", description: "Connecting findings across workstreams", sortOrder: 5 },
    { slug: "impact-quantification", name: "Impact Quantification", description: "Putting dollar values on findings and recommendations", sortOrder: 6 },
    { slug: "communication-delivery", name: "Communication & Delivery", description: "Translating analysis into client-ready deliverables", sortOrder: 7 },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // Seed ideas from the product brainstorm
  const ideas = [
    {
      title: "Cost Driver Decomposition Tool",
      description: "\"Why did costs go up?\" is the #1 question in cost optimization engagements. This tool would decompose cost changes into volume, rate, mix, and one-time components across any cost category.\n\nFor example, if SG&A went up $2M, the tool would break that down: $800k from headcount growth (volume), $600k from salary increases (rate), $400k from shift toward higher-cost roles (mix), and $200k from one-time relocation costs.\n\nThis would work by comparing two periods of financial data, identifying the cost categories with the biggest changes, and applying a standard decomposition framework. Output would be a bridge/waterfall chart showing each driver.",
      authorName: "Rachel Kim",
      category: "structural-analysis",
      persona: "Rachel",
      status: "submitted",
      votes: 12,
      tags: "financial,cost-analysis,diagnostics,ai-powered",
    },
    {
      title: "Anomaly Detection Engine",
      description: "Consultants spend hours manually scanning spreadsheets for outliers and unusual patterns. An automated anomaly detection engine would flag statistical outliers in financial line items (sudden spikes/drops in revenue, margin shifts), headcount changes (departments growing/shrinking abnormally), contract terms (outlier pricing, unusual clause patterns), and operational metrics.\n\nThe engine should use statistical methods (z-scores, IQR) and optionally AI-powered pattern recognition via the AI Config package. Each anomaly gets a confidence score and a plain-English explanation of why it was flagged.\n\nThis applies across all three workstreams — financial, org, and contracts — making it a platform-wide capability.",
      authorName: "Marcus Rivera",
      category: "pattern-recognition",
      persona: "All",
      status: "under-review",
      votes: 18,
      tags: "ai-powered,cross-workstream,automation",
      priority: "high",
      impact: "very-high",
      effort: "medium",
    },
    {
      title: "Impact Waterfall Visualization",
      description: "At the end of every assessment, Marcus needs to present a single slide showing total value at stake: \"$X in cost savings, $Y in revenue uplift, $Z in risk mitigation.\"\n\nThis is currently built by hand in PowerPoint. A tool that rolls up all quantified recommendations into a waterfall chart — starting from current state, showing each recommendation's impact, and ending at the potential future state — would save hours and ensure accuracy.\n\nThis is a natural extension of the Findings & Recommendations app. Low effort to build, high visual impact for client presentations.",
      authorName: "Marcus Rivera",
      category: "communication-delivery",
      persona: "Marcus",
      status: "submitted",
      votes: 15,
      tags: "visualization,deliverables,recommendations",
    },
    {
      title: "Smart Data Request Templates",
      description: "Every engagement starts with sending the client a list of data requests. Currently, consultants copy from a previous engagement's Excel list and modify it.\n\nTemplated data request lists by engagement type (due diligence, org assessment, cost optimization) would save 2-4 hours per engagement startup. Each template would include standard items with descriptions, priority levels, and expected formats. Consultants can customize per client and toggle items on/off.\n\nIntegrates with Engagement Workspace's existing data request tracker.",
      authorName: "Marcus Rivera",
      category: "evidence-collection",
      persona: "Marcus",
      status: "submitted",
      votes: 9,
      tags: "engagement-management,templates,efficiency",
    },
    {
      title: "Finding Connection Graph",
      description: "The most powerful insight in any assessment is when findings from different workstreams connect: \"Revenue is declining (financial) because the sales team is understaffed (org) and the biggest customer contract is up for renewal with unfavorable terms (contracts).\"\n\nConsultants discover these connections by accident in team meetings. A graph visualization showing how financial findings connect to org issues connect to contract risks — with AI-suggested links based on shared entities, departments, or themes — would be transformational.\n\nThis builds on the existing cross-referencing in Findings & Recommendations but adds visual graph navigation and AI-powered link suggestions.",
      authorName: "James Chen",
      category: "cross-domain-synthesis",
      persona: "Marcus",
      status: "researching",
      votes: 22,
      tags: "ai-powered,visualization,synthesis,cross-workstream",
      priority: "high",
      impact: "very-high",
      effort: "high",
    },
    {
      title: "Executive Summary Generator",
      description: "The executive summary is the most-read page of any assessment deliverable — and the hardest to write. It needs to distill 200 pages of analysis into 1-2 pages of insight.\n\nAn AI-assisted generator that takes structured findings (tagged by severity, workstream, theme) and recommendations (prioritized by impact/effort) and produces a first-draft executive summary following standard consulting narrative patterns:\n1. Situation overview\n2. Key findings (3-5 headline issues)\n3. Recommendations summary\n4. Total value at stake\n5. Recommended next steps\n\nThe consultant reviews and refines, but the structure and first draft come from the tool. Leverages @rcm/ai-config for AI generation.",
      authorName: "Marcus Rivera",
      category: "communication-delivery",
      persona: "Marcus",
      status: "submitted",
      votes: 16,
      tags: "ai-powered,deliverables,executive-summary",
    },
    {
      title: "Peer Comparison Engine",
      description: "\"Is this company's 35% gross margin good or bad?\" is a question that requires context. A peer comparison engine that matches the client to relevant industry benchmarks and peer companies, then highlights where they're above/below norms.\n\nWould include: financial ratios vs. industry (margins, leverage, efficiency), org metrics (revenue per employee, management span, overhead ratio), and contract terms (market rates for common vendor categories).\n\nExtends the existing Benchmark model in Financial Analyzer with a more comprehensive, searchable benchmark library and automated comparison dashboards.",
      authorName: "Rachel Kim",
      category: "pattern-recognition",
      persona: "Rachel",
      status: "submitted",
      votes: 11,
      tags: "benchmarking,financial,comparison",
    },
    {
      title: "Interview Capture Tool",
      description: "During org assessments, James conducts 10-30 stakeholder interviews per engagement. Notes end up in personal Word docs and email threads. When it's time to synthesize, half the insights are lost.\n\nA structured interview capture tool with: templates by interview type (executive, middle management, IC), real-time tagging (themes, departments, pain points), automatic linking to related findings, and an AI-powered summary that extracts key themes across all interviews.\n\nThis bridges the gap between qualitative research and structured findings.",
      authorName: "James Chen",
      category: "evidence-collection",
      persona: "James",
      status: "submitted",
      votes: 8,
      tags: "interviews,qualitative,org-assessment",
    },
    {
      title: "Workforce Planning Scenario Modeler",
      description: "After diagnosing org issues in the Org Mapper, James needs to model future-state scenarios: \"What if we consolidate these two departments? Eliminate this management layer? Add 5 engineers to the platform team?\"\n\nAn interactive modeler that lets you clone the current org structure, make changes (move, add, remove roles), and see the impact: headcount delta, cost savings/additions, span of control changes, and layer count changes.\n\nSide-by-side comparison of current state vs. proposed state with clear delta metrics. Natural extension of the Org Mapper app.",
      authorName: "James Chen",
      category: "structural-analysis",
      persona: "James",
      status: "submitted",
      votes: 14,
      tags: "org-design,scenario-planning,modeling",
    },
    {
      title: "Document Completeness Scorer",
      description: "\"Do we have enough data to start analysis?\" is a daily question during data collection. A simple scorer that compares received documents against the data request list and produces a completeness percentage per workstream.\n\nFinancial: 80% complete (missing Q4 balance sheet). Org: 60% (no compensation data yet). Contracts: 40% (only received vendor contracts, no customer or lease).\n\nThis is low effort — it's essentially a join between data requests and documents with status logic — but it answers a question Marcus asks every day.",
      authorName: "Marcus Rivera",
      category: "evidence-collection",
      persona: "Marcus",
      status: "submitted",
      votes: 7,
      tags: "engagement-management,status-tracking,data-collection",
    },
    {
      title: "Savings Calculator Library",
      description: "Consultants re-derive savings calculations from scratch each engagement. A library of pre-built calculation templates would save time and improve accuracy:\n\n- Vendor consolidation: (current spend - projected spend) x confidence factor\n- Headcount reduction: (FTEs removed x avg comp) x (1 + benefits burden) - severance cost\n- Process automation: (hours saved x hourly rate x volume) - implementation cost\n- Renegotiation: (current rate - target rate) x annual volume\n\nEach template has input fields, a documented formula, and outputs a range (low/mid/high). Feeds into the recommendations impact calculator.",
      authorName: "Rachel Kim",
      category: "impact-quantification",
      persona: "All",
      status: "submitted",
      votes: 10,
      tags: "calculations,recommendations,savings",
    },
    {
      title: "HR Data Normalizer",
      description: "Employee data from Workday, ADP, SAP, and BambooHR comes in wildly different formats. Every engagement, James spends 4-8 hours cleaning and normalizing HR data before it can be imported into the Org Mapper.\n\nA normalizer that: detects common HR export schemas, maps columns automatically (like the Org Mapper's CSV importer but smarter), handles title variations ('Sr. Engineer' = 'Senior Software Engineer'), resolves reporting relationships from different formats (manager ID vs. manager name vs. department hierarchy), and handles compensation format differences (annual vs. hourly, with/without benefits).\n\nThis makes the Org Mapper's import 10x faster for real-world data.",
      authorName: "James Chen",
      category: "data-normalization",
      persona: "James",
      status: "submitted",
      votes: 13,
      tags: "hr-data,org-mapper,data-cleaning,automation",
    },
  ];

  for (const idea of ideas) {
    const created = await prisma.idea.create({
      data: {
        title: idea.title,
        description: idea.description,
        authorName: idea.authorName,
        category: idea.category,
        persona: idea.persona || null,
        status: idea.status,
        votes: idea.votes,
        tags: idea.tags || null,
        priority: (idea as any).priority || null,
        impact: (idea as any).impact || null,
        effort: (idea as any).effort || null,
      },
    });

    // Add votes
    const voters = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack",
      "Kate", "Leo", "Mia", "Nick", "Olivia", "Pete", "Quinn", "Rosa", "Sam", "Tina", "Uma", "Vic"];
    for (let i = 0; i < idea.votes && i < voters.length; i++) {
      await prisma.vote.create({
        data: { ideaId: created.id, voterName: voters[i] },
      });
    }
  }

  // Add some comments to the top-voted ideas
  const topIdea = await prisma.idea.findFirst({ orderBy: { votes: "desc" } });
  if (topIdea) {
    await prisma.comment.createMany({
      data: [
        {
          ideaId: topIdea.id,
          authorName: "Product Manager",
          content: "This is a strong idea with cross-workstream applicability. Moving to research phase to validate the specific connection patterns consultants look for most often. Key question: should the AI suggest connections or just visualize manually-created ones?",
          role: "product-manager",
        },
        {
          ideaId: topIdea.id,
          authorName: "Sarah (Architect)",
          content: "Technically feasible as an extension of the existing FindingLink model in Findings & Recommendations. We'd need a graph layout library (d3-force or react-flow) and an API endpoint that returns finding pairs with shared entities/tags. AI suggestions could use embedding similarity via @rcm/ai-config.",
          role: "architect",
        },
        {
          ideaId: topIdea.id,
          authorName: "James Chen",
          content: "This would fundamentally change how we do synthesis sessions. Currently I print out findings on index cards and physically arrange them on a table. A digital version that suggests connections I haven't seen yet would be incredible.",
          role: "user",
        },
      ],
    });
  }

  const anomalyIdea = await prisma.idea.findFirst({
    where: { title: { contains: "Anomaly Detection" } },
  });
  if (anomalyIdea) {
    await prisma.comment.createMany({
      data: [
        {
          ideaId: anomalyIdea.id,
          authorName: "Product Manager",
          content: "Under review for the next sprint. This has strong overlap with AI Config integration — would be a great first use case for wiring AI into actual app functionality. Priority: high.",
          role: "product-manager",
        },
        {
          ideaId: anomalyIdea.id,
          authorName: "Rachel Kim",
          content: "I spend at least 2 hours per engagement manually scanning P&Ls for anomalies. Even basic z-score flagging would save significant time. The key is making the output actionable — not just 'this is unusual' but 'this is unusual because...'",
          role: "user",
        },
      ],
    });
  }

  const counts = {
    ideas: await prisma.idea.count(),
    comments: await prisma.comment.count(),
    votes: await prisma.vote.count(),
    categories: await prisma.category.count(),
  };

  console.log("Seed complete:");
  console.log(`  Ideas: ${counts.ideas}`);
  console.log(`  Comments: ${counts.comments}`);
  console.log(`  Votes: ${counts.votes}`);
  console.log(`  Categories: ${counts.categories}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
