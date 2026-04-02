# Feature Spec: Financial Analyzer

> Author: Product Manager
> Date: 2026-04-02
> Status: SPECIFIED
> Backlog Item: #1

---

## Problem Statement

Financial analysis is the core of most assessment engagements. Today, consultants spend **25-35% of total engagement time** on data wrangling — reformatting client financial statements, manually mapping disparate chart-of-accounts structures to a common taxonomy, and rebuilding analysis workbooks from scratch for each engagement.

Rachel (Financial DD Lead) describes her morning routine: pulling P&L and balance sheet data into analysis workbooks, manually reformatting because every client uses different chart-of-accounts structures, then hand-building trend analysis across 36 months and manually flagging anomalies. This work is repetitive, error-prone, and consumes time that should be spent on high-value analytical judgment.

Marcus (Engagement Lead) needs a consolidated view across workstreams. He synthesizes financial findings with org and contract analysis, but today this means flipping between disconnected Excel workbooks.

The Financial Analyzer addresses the **#1 unmet need** (automated financial normalization) and the **#1 time sink** (data wrangling) identified in user research.

---

## User Stories

### Rachel — Financial Due Diligence Lead

1. **As Rachel**, I want to upload Excel/CSV financial statements and have them parsed into structured data, so I don't spend half a day reformatting every new client's data.
2. **As Rachel**, I want to map a client's chart of accounts to a standard taxonomy with suggested mappings and manual override, so I can normalize data across entities and periods in minutes instead of hours.
3. **As Rachel**, I want to see automated ratio analysis (profitability, liquidity, leverage, efficiency) computed across all periods, so I can focus on interpreting results rather than computing formulas.
4. **As Rachel**, I want to visualize financial trends across 12-60 months with charts, so I can quickly identify anomalies like revenue spikes and margin compression.
5. **As Rachel**, I want to build a normalized EBITDA schedule with adjustment tracking (non-recurring, owner-related, non-operating items), so I can produce quality-of-earnings analysis efficiently.
6. **As Rachel**, I want to capture findings linked directly to the financial line items that support them, so every observation is traceable to evidence.
7. **As Rachel**, I want to compare client ratios against industry benchmarks, so I can contextualize performance.

### Marcus — Engagement Lead

8. **As Marcus**, I want a dashboard showing all active engagements with key financial metrics at a glance, so I can monitor progress across my portfolio.
9. **As Marcus**, I want to see all findings for an engagement in one place with severity and status, so I can prioritize the team's investigation efforts.
10. **As Marcus**, I want findings to include financial impact estimates, so I can build the business case for recommendations.

---

## Core Capabilities

### 1. Financial Statement Import

Upload Excel or CSV files containing financial statements. The system parses the data, identifies statement type (P&L, Balance Sheet, Cash Flow), and extracts line items.

**Acceptance Criteria:**
- User can upload .xlsx, .xls, and .csv files
- System extracts line items with account codes, names, and amounts
- User can preview parsed data before confirming import
- System associates the statement with an engagement, entity, period, and statement type
- Validation errors are displayed clearly (missing columns, unparseable amounts)

### 2. Chart of Accounts Mapping

Map client account codes/names to a standard taxonomy (Revenue, COGS, Gross Profit, Operating Expenses by category, EBITDA, etc.). The system suggests mappings based on account name similarity; users can override.

**Acceptance Criteria:**
- Standard taxonomy is predefined with categories and subcategories
- System suggests a mapping for each client account based on name matching
- User can accept, modify, or skip each mapping
- Mappings are saved per engagement and reusable across periods for the same entity
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
- **Profitability**: Gross margin, operating margin, net margin, EBITDA margin, ROA, ROE
- **Liquidity**: Current ratio, quick ratio, cash ratio (when balance sheet data available)
- **Leverage**: Debt-to-equity, debt-to-EBITDA, interest coverage (when balance sheet data available)
- **Efficiency**: Revenue per employee, asset turnover, days payable/receivable (when data available)
- Ratios computed for each period in the dataset
- Traffic-light indicators (green/yellow/red) based on benchmark thresholds
- Ratios display in a dashboard with sparkline trends

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
- User can add adjustment line items with: description, amount, category (non-recurring, owner-related, non-operating, run-rate), and notes
- The normalized EBITDA bridge displays as a waterfall/table
- Each adjustment links back to the source financial line item(s)
- Adjustment history is preserved

### 7. Findings Capture

Create findings linked to financial data as evidence.

**Acceptance Criteria:**
- User can create a finding with: title, description, category (Risk, Opportunity, Observation, Anomaly), severity (Critical to Informational), and financial impact estimate
- Findings link to specific financial line items, periods, or ratios as evidence
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
- Core profitability ratios (margins) and trend visualization
- Basic EBITDA normalization with manual adjustments
- Findings capture linked to financial line items
- Engagement dashboard with summary metrics
- SQLite database (Prisma) for development simplicity
- Seed data with realistic sample engagement

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
- Audit trail and version history

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first analysis | < 30 minutes from upload to ratio dashboard | User testing |
| Account mapping accuracy | > 70% of suggested mappings accepted without modification | System telemetry |
| Findings per engagement | Average 10+ findings captured per engagement | Usage data |
| Data wrangling reduction | 50% reduction vs. Excel baseline (from 25-35% to 12-17% of engagement time) | User survey |
| Consultant adoption | 80% of financial DD consultants using for active engagements within 3 months | Usage data |

---

## Dependencies

- Monorepo infrastructure (root workspace, turbo, shared tsconfig)
- Prisma ORM with SQLite for development
- Chart library for visualization (recharts recommended)
- File parsing library for Excel (xlsx/exceljs)

---

## Open Questions

1. Should we support multiple currencies in v1, or assume single-currency engagements?
   - **Decision**: Single currency in v1. Currency field stored but no conversion logic.
2. What standard taxonomy should we use for chart-of-accounts mapping?
   - **Decision**: A simplified taxonomy based on common financial statement structure (Revenue > Product/Service, COGS > Materials/Labor/Overhead, OpEx > S&M/G&A/R&D, etc.)
3. Should findings be shared across the team in v1?
   - **Decision**: Single-user in v1. Multi-user collaboration deferred.
