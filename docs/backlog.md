# Product Backlog

> Maintained by the Product Manager. Updated as items move through the workflow.
> States: `IDEA` → `RESEARCHING` → `SPECIFIED` → `DESIGNING` → `READY` → `IN PROGRESS` → `IN REVIEW` → `TESTING` → `DONE`

## Current Sprint

_No items in active development. Ready for next feature._

## Ideas

### High Priority

| # | Feature | Description | Status | Owner |
|---|---------|-------------|--------|-------|
| 4 | Org Mapper | Visualize and analyze organizational structures — hierarchy, spans of control, role clarity, headcount, labor cost allocation | IDEA | — |
| 5 | Contract Tracker | Catalog contracts, extract key terms (value, duration, renewal, termination, SLAs), track obligations, flag risks | IDEA | — |
| 6 | Deliverable Builder | Generate assessment reports, executive summaries, and presentation decks from structured findings and recommendations | IDEA | — |

### Future

| # | Feature | Description | Status | Owner |
|---|---------|-------------|--------|-------|
| 7 | Benchmarking Library | Maintain industry/peer benchmarks for financial ratios, org metrics, and contract terms for comparison | IDEA | — |
| 8 | Document Intelligence | AI-assisted extraction of structured data from unstructured documents (PDFs, spreadsheets, scanned org charts) | IDEA | — |
| 9 | Cross-Engagement Analytics | Compare findings and metrics across past engagements to identify patterns and improve assessments | IDEA | — |

## Done

| # | Feature | Description | Completed | Artifacts |
|---|---------|-------------|-----------|-----------|
| 1 | Financial Analyzer | Ingest financial statements, normalize across periods/entities, ratio analysis, trend charts, EBITDA normalization, findings capture | 2026-04-02 | `docs/specs/financial-analyzer.md`, `docs/architecture/financial-analyzer.md`, `apps/financial-analyzer/`, `docs/testing/financial-analyzer-test-plan.md` |
| 2 | Engagement Workspace | Central hub for assessment scope, data requests, document intake, team, workstream status | 2026-04-02 | `docs/specs/engagement-workspace.md`, `docs/architecture/engagement-workspace.md`, `apps/engagement-workspace/` |
| 3 | Findings & Recommendations | Cross-workstream findings, evidence linking, recommendations with impact/effort scoring, priority matrix, themes | 2026-04-02 | `docs/specs/findings-recommendations.md`, `apps/findings-recommendations/` |
| — | AI Config Package | Multi-provider AI model configuration (Anthropic, OpenAI, Google) with React components | 2026-04-02 | `packages/ai-config/` |
| — | Progress Flow | AI-powered assessment workflow creation and progress tracking with templates | 2026-04-02 | `apps/progress-flow/` |
| — | App Library | Platform catalog portal for discovering and accessing all apps | 2026-04-02 | `apps/app-library/` |
| — | Client Hub (deprecated) | Generic CRM — replaced by assessment-focused features | 2026-04-02 | Superseded |
