# Feature Spec: Financial Analyzer

> Author: Product Manager
> Date: 2026-04-02
> Status: SPECIFIED
> Backlog Item: #1

---

## Problem Statement

Financial analysis is the core of most assessment engagements, yet consultants spend **25-35% of engagement time** on data wrangling -- reformatting client financial statements, manually mapping charts of accounts, and normalizing data across periods and entities before any real analysis can begin.

Rachel (Financial DD Lead) spends her first two days of every engagement just getting data into a consistent format in Excel. She manually reformats every client's P&L because chart-of-accounts structures vary wildly. Trend analysis across 36 months requires manual anomaly flagging. EBITDA normalization is a manual adjustment schedule with hand-written footnotes. Benchmarking means toggling between Capital IQ exports and her workbook. Charts must be recreated by hand in PowerPoint.

Marcus (Engagement Lead) needs a cross-workstream view but cannot get one because financial data lives in isolated Excel workbooks with no linking to org or contract findings.

**Every persona needs financial data**, and the current Excel-based workflow is fragile, slow, and non-collaborative. The Financial Analyzer is the highest-impact first feature because it attacks the single largest time sink in the engagement lifecycle.

### References
- Research: `docs/research/findings/assessment-consultant-research.md` -- Personas A (Rachel) and D (Marcus), JTBD #1 and #4, Pain Points #1
- Workflow: `docs/research/workflows/assessment-workflow.md` -- Phase 2 (Data Ingestion) and Phase 3 (Analysis)
- Domain Model: `docs/domain-model.md` -- FinancialStatement, FinancialLineItem, Finding, Benchmark

---

## User Stories

### Rachel -- Financial Due Diligence Lead

1. **As Rachel**, I want to **upload Excel/CSV financial statements and have them parsed into structured data**, so I can **skip the 2-day data reformatting step**.
2. **As Rachel**, I want to **map a client's chart of accounts to a standard taxonomy with suggestions and manual overrides**, so I can **compare across periods and entities immediately**.
3. **As Rachel**, I want to **see automated ratio analysis (profitability, liquidity, leverage, efficiency) across all periods**, so I can **focus on investigating anomalies instead of computing ratios**.
4. **As Rachel**, I want to **view trend charts across 12-60 months with anomalies highlighted**, so I can **identify issues at a glance**.
5. **As Rachel**, I want to **normalize EBITDA with an adjustment schedule that tracks each add-back/removal with classification and notes**, so I can **produce a defensible quality-of-earnings analysis**.
6. **As Rachel**, I want to **flag a financial anomaly as a Finding and link it to the source line items as evidence**, so I can **build a traceable chain from data to deliverable**.
7. **As Rachel**, I want to **compare client ratios against industry benchmarks**, so I can **contextualize performance**.

### Marcus -- Engagement Lead

8. **As Marcus**, I want to **see an engagement dashboard with key financial metrics at a glance**, so I can **monitor progress and prepare for client conversations**.
9. **As Marcus**, I want to **view all findings for an engagement with severity and status**, so I can **prioritize what gets into the final deliverable**.
10. **As Marcus**, I want to **click through from a finding to its supporting financial evidence**, so I can **validate the analysis before presenting to the client**.

---

## Core Capabilities

### 1. Financial Statement Import

Upload Excel or CSV files containing financial statements. The system parses the data, identifies columns, and extracts line items.

**Acceptance Criteria:**
- User can upload .xlsx and .csv files up to 10MB
- System displays a preview of parsed rows and detected columns
- User confirms or adjusts column mapping before import
- Imported data is stored as FinancialStatement + FinancialLineItem records
- Import errors are displayed with row/column context

### 2. Chart of Accounts Taxonomy Mapping

Map client account codes/names to a standard taxonomy (Revenue, COGS, Gross Profit, Operating Expenses by category, Operating Income, Other Income/Expense, EBITDA, Net Income). System suggests mappings based on account name similarity; users can override.

**Acceptance Criteria:**
- Standard taxonomy is predefined with categories and subcategories
- System suggests a mapping for each client account based on name matching
- User can accept, modify, or skip each mapping
- Mappings are saved per engagement and reusable across periods
- Unmapped accounts are flagged for attention

### 3. Multi-Period, Multi-Entity Normalization

View normalized financial data across periods and entities using the standard taxonomy.

**Acceptance Criteria:**
- Data displays in a consistent structure regardless of original chart of accounts
- Users can select which periods and entities to view
- Period-over-period changes are computed automatically ($ and %)
- Common-size analysis (each line as % of revenue) is available

### 4. Automated Ratio Analysis

Compute standard financial ratios from normalized data.

**Acceptance Criteria:**
- **Profitability**: Gross margin, operating margin, net margin, EBITDA margin
- **Liquidity**: Current ratio, quick ratio (when balance sheet data available)
- **Leverage**: Debt-to-equity, debt-to-EBITDA (when balance sheet data available)
- **Efficiency**: Asset turnover, revenue per employee (when data available)
- Ratios computed for each period in the dataset
- Traffic-light indicators (green/yellow/red) based on benchmark thresholds
- Ratios display in a dashboard with trend sparklines

### 5. Trend Visualization

Interactive charts showing financial metrics over time.

**Acceptance Criteria:**
- Line charts for margin trends, revenue/cost trends
- Bar charts for period-over-period comparisons
- Users can select which metrics to plot
- Charts support multi-entity overlay for comparison
- Time period selector (monthly, quarterly, annual roll-up)

### 6. EBITDA Normalization with Adjustment Tracking

Build a normalized EBITDA bridge with categorized adjustments.

**Acceptance Criteria:**
- Start from reported EBITDA (or compute from P&L data)
- User can add adjustment line items with: description, amount, category (non-recurring, owner-related, non-operating, run-rate, pro-forma), and notes
- The normalized EBITDA bridge displays as a waterfall/table
- Each adjustment links to source financial line item(s)
- Adjustment history is preserved

### 7. Findings Capture

Create findings linked to financial data as evidence.

**Acceptance Criteria:**
- User can create a finding with: title, description, category (Risk, Opportunity, Observation, Anomaly), severity (Critical, High, Medium, Low, Informational), and financial impact estimate
- Findings link to specific financial line items or ratios as evidence
- Findings have status tracking (Draft, Confirmed, Disputed, Resolved)
- Findings list view with filtering by severity, category, and status
- Finding detail view shows the linked financial evidence inline

---

## MVP Scope (v1)

### In Scope
- Single-file Excel/CSV upload and parsing
- Manual chart-of-accounts mapping with text-match suggestions
- P&L statement support (balance sheet and cash flow deferred)
- Monthly period granularity
- Core profitability ratios (gross margin, operating margin, EBITDA margin, net margin)
- Trend line charts for revenue, costs, and margins
- Basic EBITDA normalization with manual adjustments
- Findings capture linked to financial line items
- Engagement dashboard with summary metrics
- SQLite database (Prisma) for development simplicity
- Seed data: realistic 3-year monthly P&L for a mid-size company

### Deferred (v2+)
- Bulk/multi-file upload
- ML-powered account mapping suggestions
- Balance sheet and cash flow statement support
- Liquidity and leverage ratios (require balance sheet)
- Industry benchmark database with external data sources
- PDF financial statement parsing
- Cross-workstream linking (findings to org/contract data)
- Export to Excel/PowerPoint
- Collaborative editing and comments
- Multi-currency conversion
- Audit trail and version history

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first analysis | < 15 minutes from upload to ratio dashboard | User testing |
| Account mapping accuracy | > 70% of suggested mappings accepted without change | System telemetry |
| Ratio computation correctness | 100% match to manual calculation | Automated tests |
| Findings per engagement | Average 5+ findings captured with evidence | Usage data |
| Data wrangling reduction | 50% reduction vs. Excel baseline | User survey |

---

## Dependencies

- Monorepo infrastructure (root workspace, turbo, shared tsconfig) -- exists
- Prisma ORM with SQLite for development
- Chart library for visualization (recharts)
- File parsing libraries (xlsx for Excel, papaparse for CSV)

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Excel parsing complexity (merged cells, multi-sheet) | High | Medium | Start with clean single-sheet files; iterate |
| Chart of accounts variety | High | High | Flexible manual override; don't rely solely on auto-mapping |
| Performance with large datasets (60 months x 200 accounts) | Medium | Medium | Paginate and lazy-load; optimize queries |
| Scope creep into balance sheet / cash flow | Medium | Low | Hard boundary at P&L for v1 |

---

## Open Questions (Resolved)

1. **Multiple currencies in v1?** -- No. Single currency; field stored but no conversion.
2. **Standard taxonomy?** -- Simplified taxonomy based on common P&L structure (Revenue > Product/Service, COGS > Materials/Labor/Overhead, OpEx > S&M/G&A/R&D, etc.)
3. **Multi-user in v1?** -- No. Single-user; collaboration deferred.
