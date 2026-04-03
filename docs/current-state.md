# Current State

> Quick-resume document for any agent picking up this ClawTown. Read this first.
> Last updated: 2026-04-03 (Idea Portal + assessment ideation added)

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
- Port: 3001

### 2. Engagement Workspace (`apps/engagement-workspace/`)
- **Status**: DONE — builds, seeds, 31 tests passing
- Engagement overview with client, scope, status, timeline
- Data request tracker with status (Requested/Received/Overdue/N/A), bulk updates
- Document intake with category tagging and data request linking
- Workstream progress cards (Financial, Organizational, Contracts)
- Team management with roles
- Activity feed with timestamped entries
- Seed data: 3 engagements, 25 data requests, 12 documents, 7 team members
- Port: 3003

### 3. Findings & Recommendations (`apps/findings-recommendations/`)
- **Status**: DONE — builds, seeds, 43 tests passing
- Findings capture by workstream (Financial, Org, Contracts, Cross-Cutting) with severity and evidence
- Cross-referencing between findings via FindingLinks
- Recommendations with impact calculator (base × adjustment% × confidence ÷ effort)
- Priority matrix (Quick Win / Strategic Initiative / Fill-in / Deprioritize)
- Theme grouping for related findings
- Seed data: 8 findings, 6 cross-references, 5 recommendations, 3 themes
- Port: 3002 (default)

### 5. Org Mapper (`apps/org-mapper/`)
- **Status**: DONE — builds, seeds, 78 tests passing
- CSV import with auto-column detection for HR data exports
- Expandable org chart visualization (HTML/CSS tree, color-coded by department)
- Span of control analysis with flags for <3 and >12 direct reports
- Headcount and labor cost roll-ups by department and level
- Role duplication detection across departments
- Findings capture linked to specific org units
- Seed data: Acme Corp with 51 org units across 6 departments, 6 findings, 5 benchmarks
- Port: 3006

### 6. Idea Portal (`apps/idea-portal/`)
- **Status**: DONE — builds, seeds, 49 tests passing
- Submit ideas for new platform tools with title, description, category, persona, tags
- Vote on ideas to influence prioritization
- Comment threads with role-based indicators (user, product-manager, architect, developer)
- Filter by category (7 assessment fundamentals) and status; sort by votes or date
- Status lifecycle: submitted → under-review → researching → specified → in-development → shipped
- Product team triage with priority, impact, and effort scoring
- Seed data: 12 ideas from product brainstorm, 155 votes, 5 comments, 7 categories
- Port: 3007

### 7. AI Config Package (`packages/ai-config/`)
- **Status**: DONE — 26 tests passing
- Multi-provider support: Anthropic, OpenAI, Google AI
- React components: AIConfigPanel, AIConfigBadge, useAIConfig hook
- Session-scoped key storage (never persisted to disk)
- Server-side helpers: getAuthHeaders, getBaseUrl, session store

## What's In Progress

Nothing currently in active development. Ready for next feature.

## Next Priorities (from backlog)

| Priority | Feature | Why |
|----------|---------|-----|
| **1** | Contract Tracker (#5) | Catalog contracts, extract key terms, track obligations. Completes the three-pillar assessment capability. |
| **2** | Deliverable Builder (#6) | Generate reports from findings/recommendations. Saves 20-30% of engagement time on formatting. |

## Key Research Artifacts

- **Personas**: Rachel (financial DD lead), James (org consultant), Priya (contract specialist), Marcus (engagement lead) → `docs/research/findings/assessment-consultant-research.md`
- **Workflow**: 5-phase lifecycle (Scoping → Ingestion → Analysis → Synthesis → Deliverable) → `docs/research/workflows/assessment-workflow.md`
- **Domain Model**: 10 entities → `docs/domain-model.md`

## Known Issues / Tech Debt

- `apps/client-hub/` should be removed — deprecated from pre-pivot era
- No shared auth — each app is standalone; will need shared auth package for multi-user
- AI features scaffolded via `@rcm/ai-config` but not yet wired into any app
- All apps use SQLite for dev — will need PostgreSQL migration for production
- No integration between apps — each runs independently; future: shared engagement context
- Need front-end UI testing (user has expressed interest in this)

## Repo Structure

```
├── CLAUDE.md                    # Coordination protocol + resilience protocol
├── agents/                      # Agent role definitions (7 agents, 3 teams)
├── docs/
│   ├── current-state.md         # ← YOU ARE HERE
│   ├── coordination-log.md      # Timestamped activity journal
│   ├── backlog.md               # Prioritized feature backlog
│   ├── domain-model.md          # Entity definitions and relationships
│   ├── specs/                   # Feature specifications
│   │   ├── financial-analyzer.md
│   │   ├── engagement-workspace.md
│   │   └── findings-recommendations.md
│   ├── architecture/            # Technical design docs
│   ├── research/                # User research and workflow analysis
│   └── testing/                 # Test plans
├── apps/
│   ├── financial-analyzer/      # ✅ DONE — Financial analysis tool
│   ├── engagement-workspace/    # ✅ DONE — Assessment engagement hub
│   ├── findings-recommendations/ # ✅ DONE — Findings & recommendations engine
│   ├── org-mapper/              # ✅ DONE — Org visualization & analytics
│   ├── idea-portal/             # ✅ DONE — Community idea submission & voting
│   └── client-hub/              # ⚠️ DEPRECATED
├── packages/
│   └── ai-config/               # ✅ DONE — Multi-provider AI configuration
├── package.json                 # Monorepo root (npm workspaces)
└── turbo.json                   # Turborepo config
```

## Test Summary

| App/Package | Tests | Status |
|-------------|-------|--------|
| Financial Analyzer | 74 | ✅ Passing |
| Engagement Workspace | 31 | ✅ Passing |
| Findings & Recommendations | 43 | ✅ Passing |
| Org Mapper | 78 | ✅ Passing |
| Idea Portal | 49 | ✅ Passing |
| AI Config | 26 | ✅ Passing |
| **Total** | **301** | ✅ All Passing |
