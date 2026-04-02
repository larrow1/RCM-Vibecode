# Current State

> Quick-resume document for any agent picking up this ClawTown. Read this first.
> Last updated: 2026-04-02

## Platform

**Assessment Consultant Platform** — Tools for consultants who evaluate organizations by analyzing financials, org structure, contracts, and operations to produce recommendations.

**Tech stack**: Next.js + TypeScript + Tailwind + Prisma (SQLite for dev) + Vitest + Turborepo monorepo

## What's Built and Working

### 1. Financial Analyzer (`apps/financial-analyzer/`)
- **Status**: DONE — builds, seeds, 74 tests passing
- Import financial statements (CSV/Excel), map to standard taxonomy
- Multi-period trend analysis, ratio dashboards (profitability, liquidity, leverage)
- EBITDA normalization with adjustment tracking
- Findings capture linked to financial evidence
- Seed data: 3 years monthly P&L for Acme Corp (864 line items)
- Spec: `docs/specs/financial-analyzer.md`
- Architecture: `docs/architecture/financial-analyzer.md`
- Tests: `docs/testing/financial-analyzer-test-plan.md`

### 2. AI Config Package (`packages/ai-config/`)
- **Status**: DONE — 26 tests passing
- Multi-provider support: Anthropic, OpenAI, Google AI
- React components: AIConfigPanel, AIConfigBadge, useAIConfig hook
- Session-scoped key storage (never persisted to disk)
- Server-side helpers: getAuthHeaders, getBaseUrl, session store

### 3. Client Hub (`apps/client-hub/`) — DEPRECATED
- Built before the pivot to assessment focus. Superseded by new apps.

## What's In Progress

Nothing currently in active development. Ready for next feature.

## Next Priorities (from backlog)

| Priority | Feature | Why |
|----------|---------|-----|
| **1** | Engagement Workspace (#2) | Central hub tying together all assessment data — needed to connect financial, org, and contract analysis into one engagement |
| **2** | Findings & Recommendations (#3) | Cross-workstream findings capture and recommendation synthesis — the core analytical output |
| **3** | Org Mapper (#4) | Visualize and analyze org structures — second most common assessment workstream |
| **4** | Contract Tracker (#5) | Catalog contracts, extract terms, track obligations — third core workstream |
| **5** | Deliverable Builder (#6) | Generate reports from structured findings — huge time saver (20-30% of engagement hours) |

## Key Research Artifacts

- **Personas**: Rachel (financial DD lead), James (org consultant), Priya (contract specialist), Marcus (engagement lead) → `docs/research/findings/assessment-consultant-research.md`
- **Workflow**: 5-phase assessment lifecycle (Scoping → Ingestion → Analysis → Synthesis → Deliverable) → `docs/research/workflows/assessment-workflow.md`
- **Domain Model**: 10 entities (Engagement, DataRequest, Document, FinancialStatement, OrgUnit, Contract, Finding, Recommendation, Deliverable, Benchmark) → `docs/domain-model.md`

## Known Issues / Tech Debt

- `apps/client-hub/` should be removed or repurposed — it's from the pre-pivot era
- Financial Analyzer uses SQLite for dev — will need PostgreSQL migration for production
- No authentication implemented yet — will need shared auth package when multi-user
- No integration between Financial Analyzer and @rcm/ai-config yet — AI features are scaffolded but not wired

## Repo Structure

```
├── CLAUDE.md                    # Coordination protocol
├── agents/                      # Agent role definitions (7 agents, 3 teams)
├── docs/
│   ├── current-state.md         # ← YOU ARE HERE
│   ├── coordination-log.md      # Timestamped activity journal
│   ├── backlog.md               # Prioritized feature backlog
│   ├── domain-model.md          # Entity definitions and relationships
│   ├── specs/                   # Feature specifications
│   ├── architecture/            # Technical design docs
│   ├── research/                # User research and workflow analysis
│   └── testing/                 # Test plans
├── apps/
│   ├── financial-analyzer/      # ✅ DONE — Financial analysis tool
│   └── client-hub/              # ⚠️ DEPRECATED
├── packages/
│   └── ai-config/               # ✅ DONE — Multi-provider AI configuration
├── package.json                 # Monorepo root (npm workspaces)
└── turbo.json                   # Turborepo config
```
