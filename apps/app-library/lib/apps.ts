export type AppStatus = "live" | "coming-soon" | "deprecated";
export type AppCategory = "core-analysis" | "workflow" | "infrastructure";

export interface AppInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AppCategory;
  status: AppStatus;
  port: number | null;
  path: string;
  icon: string;
  features: string[];
  primaryPersona: string;
  techStack: string[];
  testCount: number;
}

export const APP_CATEGORIES: Record<AppCategory, { label: string; description: string }> = {
  "core-analysis": {
    label: "Core Analysis",
    description: "Primary assessment workstream tools for financial, org, and contract analysis",
  },
  workflow: {
    label: "Workflow & Coordination",
    description: "Engagement management, findings synthesis, and deliverable production",
  },
  infrastructure: {
    label: "Infrastructure",
    description: "Shared platform capabilities and configuration",
  },
};

export const APPS: AppInfo[] = [
  {
    id: "financial-analyzer",
    name: "Financial Analyzer",
    tagline: "Financial statement analysis and ratio dashboards",
    description:
      "Import financial statements (P&L, balance sheet, cash flow) from Excel or CSV. Automatically map chart of accounts to a standard taxonomy. Run multi-period trend analysis, ratio dashboards (profitability, liquidity, leverage, efficiency), and EBITDA normalization with adjustment tracking. Capture findings linked directly to financial line items as evidence.",
    category: "core-analysis",
    status: "live",
    port: 3001,
    path: "apps/financial-analyzer",
    icon: "📊",
    features: [
      "CSV/Excel financial statement import",
      "Chart of accounts taxonomy mapping",
      "Multi-period trend analysis",
      "Ratio dashboards (profitability, liquidity, leverage)",
      "EBITDA normalization with adjustment schedules",
      "Anomaly detection and flagging",
      "Findings capture with financial evidence linking",
    ],
    primaryPersona: "Rachel — Financial Due Diligence Lead",
    techStack: ["Next.js 14", "Prisma", "SQLite", "Recharts", "Zod"],
    testCount: 74,
  },
  {
    id: "engagement-workspace",
    name: "Engagement Workspace",
    tagline: "Assessment engagement hub with data request tracking",
    description:
      "Central command center for managing an assessment engagement end-to-end. Track engagement scope, timelines, and team assignments. Manage data request lists with status tracking (Requested, Received, Overdue). Organize uploaded documents by category. Monitor workstream progress across Financial, Organizational, and Contracts analysis. Activity feed shows real-time engagement activity.",
    category: "workflow",
    status: "live",
    port: 3003,
    path: "apps/engagement-workspace",
    icon: "🏠",
    features: [
      "Engagement overview with scope and timeline",
      "Data request tracker with status and due dates",
      "Bulk status updates for data requests",
      "Document intake with category tagging",
      "Workstream progress cards (Financial, Org, Contracts)",
      "Team management with role assignments",
      "Real-time activity feed",
    ],
    primaryPersona: "Marcus — Engagement Lead",
    techStack: ["Next.js 14", "Prisma", "SQLite", "Tailwind CSS", "Zod"],
    testCount: 31,
  },
  {
    id: "findings-recommendations",
    name: "Findings & Recommendations",
    tagline: "Cross-workstream findings synthesis and impact-prioritized recommendations",
    description:
      "Capture analytical findings across all workstreams (Financial, Organizational, Contracts, Cross-Cutting) with severity scoring and evidence linking. Cross-reference related findings across workstreams to build connected narratives. Build recommendations with structured impact calculations (base impact × adjustment × confidence ÷ effort). View recommendations in a priority matrix (Quick Win, Strategic Initiative, Fill-in, Deprioritize). Group findings into themes for executive storytelling.",
    category: "workflow",
    status: "live",
    port: 3002,
    path: "apps/findings-recommendations",
    icon: "💡",
    features: [
      "Findings capture by workstream with severity scoring",
      "Evidence linking to source data",
      "Cross-workstream finding references",
      "Recommendation builder with impact calculator",
      "Impact/effort priority matrix visualization",
      "Theme grouping for narrative construction",
      "Quadrant classification (Quick Win through Deprioritize)",
    ],
    primaryPersona: "Marcus — Engagement Lead (synthesis), all personas (capture)",
    techStack: ["Next.js 14", "Prisma", "SQLite", "Tailwind CSS", "Zod"],
    testCount: 43,
  },
  {
    id: "org-mapper",
    name: "Org Mapper",
    tagline: "Organizational structure visualization and analysis",
    description:
      "Import organizational data from HR exports and visualize hierarchies interactively. Analyze spans of control, management layers, role clarity, and duplication. Compute headcount and labor cost allocations by department and level. Compare against industry benchmarks for overhead ratios. Identify structural issues and recommend future-state designs.",
    category: "core-analysis",
    status: "live",
    port: 3006,
    path: "apps/org-mapper",
    icon: "🏢",
    features: [
      "CSV import with auto-column detection",
      "Expandable HTML/CSS org chart visualization",
      "Span of control analysis with threshold flags",
      "Headcount and labor cost roll-ups by department and level",
      "Role duplication detection across departments",
      "Findings capture linked to org units",
    ],
    primaryPersona: "James — Organizational Design Consultant",
    techStack: ["Next.js 14", "Prisma", "SQLite", "Tailwind CSS", "Zod", "PapaParse"],
    testCount: 78,
  },
  {
    id: "contract-tracker",
    name: "Contract Tracker",
    tagline: "Contract portfolio cataloging, risk assessment, and obligation tracking",
    description:
      "Catalog an organization's contract portfolio with extracted key terms (duration, value, renewal clauses, termination provisions, SLAs). Score contracts by risk level and visualize the portfolio as a risk heat map. Track obligations, notice periods, and expiration timelines. Compare contracted rates against market benchmarks. Identify consolidation opportunities across vendors.",
    category: "core-analysis",
    status: "coming-soon",
    port: null,
    path: "apps/contract-tracker",
    icon: "📋",
    features: [
      "Contract cataloging with metadata extraction",
      "Key term extraction (renewal, termination, SLAs)",
      "Risk scoring and heat map",
      "Obligation and expiration timeline",
      "Rate benchmarking vs. market",
      "Vendor consolidation opportunity detection",
    ],
    primaryPersona: "Priya — Contract & Procurement Specialist",
    techStack: ["Next.js", "Prisma", "Tailwind CSS"],
    testCount: 0,
  },
  {
    id: "deliverable-builder",
    name: "Deliverable Builder",
    tagline: "Assessment report and presentation generation from structured findings",
    description:
      "Generate polished assessment deliverables directly from structured findings and recommendations. Produce executive summaries, full assessment reports, and presentation decks. Charts and data tables auto-populate from analysis results. Update deliverables automatically when underlying findings change. Supports multiple output formats and branded templates.",
    category: "workflow",
    status: "coming-soon",
    port: null,
    path: "apps/deliverable-builder",
    icon: "📑",
    features: [
      "Executive summary generation",
      "Full assessment report builder",
      "Auto-populated charts from analysis data",
      "Template-based presentation decks",
      "Live updates when findings change",
      "Multi-format export",
    ],
    primaryPersona: "Marcus — Engagement Lead",
    techStack: ["Next.js", "React-PDF", "Tailwind CSS"],
    testCount: 0,
  },
  {
    id: "ai-config",
    name: "AI Configuration",
    tagline: "Multi-provider AI model setup for platform intelligence features",
    description:
      "Shared configuration package for connecting AI models to the platform. Supports Anthropic (Claude), OpenAI (GPT-4o), and Google AI (Gemini). API keys are stored in session memory only — never persisted to disk. Provides React components (AIConfigPanel, AIConfigBadge) and a useAIConfig hook for easy integration into any app.",
    category: "infrastructure",
    status: "live",
    port: null,
    path: "packages/ai-config",
    icon: "🤖",
    features: [
      "Anthropic, OpenAI, and Google AI provider support",
      "Session-scoped API key storage (never persisted)",
      "AIConfigPanel — full configuration UI",
      "AIConfigBadge — status indicator for headers",
      "useAIConfig hook for React apps",
      "Server-side auth header generation",
    ],
    primaryPersona: "Platform-wide",
    techStack: ["React", "Zod", "TypeScript"],
    testCount: 26,
  },
  {
    id: "idea-portal",
    name: "Idea Portal",
    tagline: "Submit, vote, and discuss ideas for new platform tools",
    description:
      "A community-driven interface for submitting, voting on, and discussing ideas for new assessment platform tools. Ideas are organized by assessment fundamentals (evidence collection, data normalization, structural analysis, pattern recognition, cross-domain synthesis, impact quantification, communication & delivery). Users can vote to prioritize, comment with feedback, and product managers can triage ideas through the pipeline to the backlog.",
    category: "infrastructure",
    status: "live",
    port: 3007,
    path: "apps/idea-portal",
    icon: "💡",
    features: [
      "Submit ideas with category, persona, and tags",
      "Vote on ideas to influence prioritization",
      "Comment threads with role indicators",
      "Filter by category, status, and sort by votes/date",
      "Status lifecycle: submitted through shipped/declined",
      "Product team triage with priority/impact/effort scoring",
      "Ideas organized by 7 assessment fundamentals",
    ],
    primaryPersona: "All — consultants and product team",
    techStack: ["Next.js 14", "Prisma", "SQLite", "Tailwind CSS", "Zod"],
    testCount: 49,
  },
];

export function getAppsByCategory(): Record<AppCategory, AppInfo[]> {
  const result: Record<AppCategory, AppInfo[]> = {
    "core-analysis": [],
    workflow: [],
    infrastructure: [],
  };
  for (const app of APPS) {
    result[app.category].push(app);
  }
  return result;
}

export function getLiveApps(): AppInfo[] {
  return APPS.filter((a) => a.status === "live");
}

export function getComingSoonApps(): AppInfo[] {
  return APPS.filter((a) => a.status === "coming-soon");
}

export function getTotalTestCount(): number {
  return APPS.reduce((sum, app) => sum + app.testCount, 0);
}
