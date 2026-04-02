# RCM ClawTown — Assessment Consultant Platform

A **ClawTown** of coordinated AI agents building tools for **assessment consultants** — professionals who evaluate organizations by analyzing financials, org structures, contracts, and operations to produce actionable recommendations.

## Who Is This For?

Consultants who do:
- **Financial due diligence** — Analyze P&L, balance sheets, cash flow across entities and periods
- **Organizational assessments** — Map structures, evaluate spans of control, identify gaps and overlaps
- **Contract portfolio reviews** — Catalog terms, track obligations, flag risks and expirations
- **Operational assessments** — Synthesize findings into prioritized, impact-estimated recommendations

## Agent Teams

```
                    ┌─────────────────┐
                    │   Orchestrator   │
                    │  (coordination)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌─────────────┐ ┌────────────┐ ┌────────────┐
     │ Product Team │ │  Dev Team  │ │  QA Team   │
     ├─────────────┤ ├────────────┤ ├────────────┤
     │ PM          │ │ Architect  │ │ QA Engineer│
     │ Researcher  │ │ Developer  │ │            │
     │ Analyst     │ │            │ │            │
     └─────────────┘ └────────────┘ └────────────┘
```

## Target Applications

| App | Purpose |
|-----|---------|
| **Financial Analyzer** | Ingest financial statements, normalize data, run ratio/trend analysis, benchmark against peers |
| **Org Mapper** | Build and visualize org structures, analyze spans of control, headcount, labor costs |
| **Contract Tracker** | Catalog contracts, extract key terms, track obligations and expirations, flag risks |
| **Findings & Recommendations** | Capture analytical findings, synthesize into prioritized recommendations with impact estimates |
| **Engagement Workspace** | Manage assessment scope, data requests, document intake, and deliverable production |

## Repo Structure

```
├── CLAUDE.md               # Agent coordination protocol & domain context
├── agents/
│   ├── product/            # Product team agent definitions
│   ├── development/        # Dev team agent definitions
│   └── coordination/       # Orchestrator agent definition
├── docs/
│   ├── backlog.md          # Prioritized work items
│   ├── domain-model.md     # Core business entities
│   ├── specs/              # Feature specifications
│   ├── architecture/       # Technical design docs
│   ├── decisions/          # Architecture Decision Records
│   ├── research/           # User research & findings
│   └── testing/            # Test plans & strategies
├── apps/                   # Application code (monorepo)
└── packages/               # Shared libraries
```

## Tech Stack

- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Node.js + TypeScript
- **Database**: PostgreSQL + Prisma
- **Testing**: Vitest + Playwright
- **Monorepo**: Turborepo

## Getting Started

Start with the **Orchestrator** (`agents/coordination/orchestrator.md`), which reads the backlog and drives work through the pipeline.
