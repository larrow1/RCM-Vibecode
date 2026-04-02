export interface FlowTemplatePhase {
  name: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    priority: string;
  }[];
}

export interface FlowTemplateDefinition {
  name: string;
  description: string;
  type: string;
  phases: FlowTemplatePhase[];
}

export const ASSESSMENT_TEMPLATES: Record<string, FlowTemplateDefinition> = {
  "full-assessment": {
    name: "Full Assessment",
    description: "Complete assessment lifecycle covering all workstreams",
    type: "Full Assessment",
    phases: [
      {
        name: "Scoping & Planning",
        description: "Define engagement scope, assemble team, establish timelines",
        tasks: [
          { title: "Define assessment scope and objectives", description: "Document what areas will be assessed and the key questions to answer", priority: "Critical" },
          { title: "Assemble engagement team", description: "Identify and assign team members with required expertise", priority: "High" },
          { title: "Create data request list", description: "Compile initial list of documents and data needed from the client", priority: "High" },
          { title: "Set up engagement workspace", description: "Configure tools, shared drives, and communication channels", priority: "Medium" },
          { title: "Schedule kickoff meeting", description: "Coordinate with client stakeholders for project kickoff", priority: "High" },
          { title: "Establish reporting cadence", description: "Agree on status update frequency and format with client", priority: "Medium" },
        ],
      },
      {
        name: "Data Collection & Ingestion",
        description: "Gather, organize, and validate source materials",
        tasks: [
          { title: "Send initial data requests", description: "Distribute data request list to client contacts", priority: "Critical" },
          { title: "Track data request fulfillment", description: "Monitor which requests have been fulfilled and follow up on outstanding items", priority: "High" },
          { title: "Ingest financial statements", description: "Import P&L, balance sheet, and cash flow statements into financial analyzer", priority: "High" },
          { title: "Collect organizational charts", description: "Obtain org charts, role descriptions, and headcount data", priority: "Medium" },
          { title: "Gather contract portfolio", description: "Collect all active contracts, agreements, and SLAs", priority: "Medium" },
          { title: "Validate data completeness", description: "Assess gaps in received data and issue follow-up requests", priority: "High" },
        ],
      },
      {
        name: "Analysis",
        description: "Perform detailed analysis across all workstreams",
        tasks: [
          { title: "Financial ratio analysis", description: "Calculate profitability, liquidity, leverage, and efficiency ratios", priority: "Critical" },
          { title: "Trend analysis across periods", description: "Identify trends in revenue, costs, and margins over time", priority: "High" },
          { title: "EBITDA normalization", description: "Identify and classify adjustments to arrive at normalized EBITDA", priority: "High" },
          { title: "Organizational structure review", description: "Analyze reporting lines, spans of control, and role clarity", priority: "High" },
          { title: "Contract risk assessment", description: "Review key terms, renewal dates, termination clauses, and obligations", priority: "Medium" },
          { title: "Benchmark comparison", description: "Compare key metrics against industry peers and standards", priority: "Medium" },
          { title: "Cross-workstream pattern identification", description: "Identify connections between financial, org, and contract findings", priority: "High" },
        ],
      },
      {
        name: "Synthesis & Recommendations",
        description: "Consolidate findings and develop actionable recommendations",
        tasks: [
          { title: "Compile findings by workstream", description: "Organize all findings with severity ratings and evidence", priority: "Critical" },
          { title: "Identify cross-cutting themes", description: "Group related findings into themes that span workstreams", priority: "High" },
          { title: "Develop recommendations", description: "Create actionable recommendations with impact and effort estimates", priority: "Critical" },
          { title: "Prioritize recommendations", description: "Rank recommendations using impact/effort matrix (Quick Wins, Strategic, etc.)", priority: "High" },
          { title: "Calculate financial impact", description: "Quantify the expected financial benefit of key recommendations", priority: "High" },
          { title: "Internal review", description: "Peer review findings and recommendations for quality and completeness", priority: "Medium" },
        ],
      },
      {
        name: "Deliverable & Presentation",
        description: "Produce final deliverables and present to stakeholders",
        tasks: [
          { title: "Draft executive summary", description: "Write concise summary of key findings and top recommendations", priority: "Critical" },
          { title: "Build detailed assessment report", description: "Compile full report with methodology, findings, and recommendations", priority: "Critical" },
          { title: "Create presentation deck", description: "Build slide deck for stakeholder presentation", priority: "High" },
          { title: "Prepare appendix materials", description: "Compile supporting data tables, charts, and detailed analyses", priority: "Medium" },
          { title: "Client presentation", description: "Present findings and recommendations to client leadership", priority: "Critical" },
          { title: "Address client feedback", description: "Incorporate client questions and feedback into final deliverables", priority: "High" },
        ],
      },
    ],
  },
  "financial-dd": {
    name: "Financial Due Diligence",
    description: "Focused financial analysis for transactions and investments",
    type: "Financial Due Diligence",
    phases: [
      {
        name: "Scoping",
        description: "Define financial DD scope and data needs",
        tasks: [
          { title: "Define DD scope and focus areas", description: "Agree on key financial areas to investigate", priority: "Critical" },
          { title: "Issue financial data request list", description: "Request historical financials, management accounts, projections", priority: "Critical" },
          { title: "Set up data room access", description: "Obtain access to virtual data room", priority: "High" },
        ],
      },
      {
        name: "Historical Analysis",
        description: "Analyze historical financial performance",
        tasks: [
          { title: "Normalize historical financials", description: "Adjust for one-time items, related party transactions, accounting changes", priority: "Critical" },
          { title: "Revenue quality analysis", description: "Assess revenue sustainability, customer concentration, recurring vs non-recurring", priority: "Critical" },
          { title: "Cost structure analysis", description: "Analyze fixed vs variable costs, identify optimization opportunities", priority: "High" },
          { title: "Working capital analysis", description: "Assess working capital trends and seasonality", priority: "High" },
          { title: "Capex review", description: "Evaluate maintenance vs growth capex, deferred spending", priority: "Medium" },
        ],
      },
      {
        name: "Forward-Looking Analysis",
        description: "Evaluate projections and future outlook",
        tasks: [
          { title: "Management case review", description: "Assess reasonableness of management projections", priority: "Critical" },
          { title: "Sensitivity analysis", description: "Model key assumption sensitivities on revenue and EBITDA", priority: "High" },
          { title: "Synergy assessment", description: "Evaluate potential cost and revenue synergies", priority: "High" },
          { title: "Risk identification", description: "Identify financial risks and red flags", priority: "Critical" },
        ],
      },
      {
        name: "Reporting",
        description: "Compile and deliver DD findings",
        tasks: [
          { title: "Draft Quality of Earnings report", description: "Compile QoE analysis with all adjustments and bridge", priority: "Critical" },
          { title: "Prepare financial model outputs", description: "Finalize adjusted financials and projections", priority: "High" },
          { title: "Present preliminary findings", description: "Share initial findings with deal team", priority: "High" },
          { title: "Finalize DD report", description: "Deliver final due diligence report", priority: "Critical" },
        ],
      },
    ],
  },
  "operational-review": {
    name: "Operational Review",
    description: "Focused organizational and operational assessment",
    type: "Operational Review",
    phases: [
      {
        name: "Discovery",
        description: "Understand current operations and organization",
        tasks: [
          { title: "Map organizational structure", description: "Document current org chart, reporting lines, and headcount", priority: "Critical" },
          { title: "Conduct stakeholder interviews", description: "Interview key leaders to understand operations and pain points", priority: "Critical" },
          { title: "Review policies and procedures", description: "Assess documented processes and governance frameworks", priority: "High" },
          { title: "Collect operational KPIs", description: "Gather current performance metrics and targets", priority: "High" },
        ],
      },
      {
        name: "Assessment",
        description: "Analyze operational effectiveness",
        tasks: [
          { title: "Span of control analysis", description: "Evaluate management layers and direct reports ratios", priority: "High" },
          { title: "Process efficiency review", description: "Identify bottlenecks, redundancies, and automation opportunities", priority: "High" },
          { title: "Capability gap analysis", description: "Assess skills gaps and talent needs", priority: "Medium" },
          { title: "Technology utilization review", description: "Evaluate effectiveness of current tools and systems", priority: "Medium" },
          { title: "Benchmark against best practices", description: "Compare operational metrics to industry standards", priority: "High" },
        ],
      },
      {
        name: "Recommendations",
        description: "Develop and prioritize improvement opportunities",
        tasks: [
          { title: "Develop improvement roadmap", description: "Create phased plan for operational improvements", priority: "Critical" },
          { title: "Estimate savings potential", description: "Quantify expected cost savings and efficiency gains", priority: "High" },
          { title: "Define implementation plan", description: "Detail steps, timeline, and resources for key initiatives", priority: "High" },
          { title: "Present findings and roadmap", description: "Deliver assessment results and recommended actions", priority: "Critical" },
        ],
      },
    ],
  },
};

export function getTemplateForType(engagementType: string): FlowTemplateDefinition {
  const typeMap: Record<string, string> = {
    "Full Assessment": "full-assessment",
    "Financial Due Diligence": "financial-dd",
    "Operational Review": "operational-review",
  };

  const templateKey = typeMap[engagementType] || "full-assessment";
  return ASSESSMENT_TEMPLATES[templateKey];
}

export function generateFlowFromTemplate(
  template: FlowTemplateDefinition,
  scope?: string
): { phases: FlowTemplatePhase[] } {
  let phases = [...template.phases];

  if (scope) {
    const scopeLower = scope.toLowerCase();
    if (scopeLower.includes("financial") && !scopeLower.includes("operational") && !scopeLower.includes("org")) {
      phases = phases.filter(
        (p) => !p.name.toLowerCase().includes("org") && !p.name.toLowerCase().includes("contract")
      );
    }
  }

  return { phases };
}

export function computeFlowProgress(phases: { tasks: { status: string }[] }[]): {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
} {
  let totalTasks = 0;
  let completedTasks = 0;

  for (const phase of phases) {
    for (const task of phase.tasks) {
      totalTasks++;
      if (task.status === "Completed") completedTasks++;
    }
  }

  return {
    totalTasks,
    completedTasks,
    percentage: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
  };
}

export function getPhaseStatus(tasks: { status: string }[]): string {
  if (tasks.length === 0) return "Not Started";
  const allCompleted = tasks.every((t) => t.status === "Completed" || t.status === "Skipped");
  const anyInProgress = tasks.some((t) => t.status === "In Progress");
  const anyBlocked = tasks.some((t) => t.status === "Blocked");

  if (allCompleted) return "Completed";
  if (anyBlocked) return "Blocked";
  if (anyInProgress) return "In Progress";
  const anyCompleted = tasks.some((t) => t.status === "Completed");
  if (anyCompleted) return "In Progress";
  return "Not Started";
}
