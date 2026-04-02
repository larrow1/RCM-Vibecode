# Current State

> Quick-resume document for any agent picking up this ClawTown. Read this first.
> Last updated: 2026-04-02 (end of session 2)

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

### 4. AI Config Package (`packages/ai-config/`)
- **Status**: DONE — 26 tests passing
- Multi-provider support: Anthropic, OpenAI, Google AI
- React components: AIConfigPanel, AIConfigBadge, useAIConfig hook
- Session-scoped key storage (never persisted to disk)
- Server-side helpers: getAuthHeaders, getBaseUrl, session store

### 5. App Library (`apps/app-library/`)
- **Status**: DONE — builds, 26 Playwright e2e tests
- Platform catalog portal for discovering and accessing all apps
- Search/filter by name, feature, status
- Environment-aware URLs
- Port: 3004

### 6. Progress Flow (`apps/progress-flow/`)
- **Status**: DONE — builds, seeds, 50 tests passing
- AI-powered workflow creation for assessment engagements
- 3 assessment templates: Full Assessment (5 phases, 31 tasks), Financial DD (4 phases, 16 tasks), Operational Review (3 phases, 13 tasks)
- Generate flows from templates scoped to engagement context
- Interactive phase/task board with status tracking and progress visualization
- Dashboard with engagement-wide completion metrics
- Seed data: 3 engagements, 1 flow with 5 phases and 31 tasks, 3 templates
- Port: 3005

## What's In Progress

Nothing currently in active development. Ready for next feature.

## Next Priorities (from backlog)

| Priority | Feature | Why |
|----------|---------|-----|
| **1** | Org Mapper (#4) | Visualize and analyze org structures — hierarchy, spans of control, headcount, labor costs. Core assessment workstream. |
| **2** | Contract Tracker (#5) | Catalog contracts, extract key terms, track obligations. Completes the three-pillar assessment capability. |
| **3** | Deliverable Builder (#6) | Generate reports from findings/recommendations. Saves 20-30% of engagement time on formatting. |

## Key Research Artifacts

- **Personas**: Rachel (financial DD lead), James (org consultant), Priya (contract specialist), Marcus (engagement lead) → `docs/research/findings/assessment-consultant-research.md`
- **Workflow**: 5-phase lifecycle (Scoping → Ingestion → Analysis → Synthesis → Deliverable) → `docs/research/workflows/assessment-workflow.md`
- **Domain Model**: 10 entities → `docs/domain-model.md`

## Known Issues / Tech Debt

- Bug fixes complete: 10 critical/high + 5 medium = 15 bugs fixed; 6 low remaining
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
│   ├── progress-flow/           # ✅ DONE — AI progress flow tracker
│   ├── app-library/             # ✅ DONE — Platform catalog portal
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
| AI Config | 26 | ✅ Passing |
| Progress Flow | 50 | ✅ Passing |
| App Library (e2e) | 26 | ✅ Passing (Playwright) |
| **Total** | **250** | ✅ All Passing |
