# Workflow Analysis: Assessment Engagement Lifecycle

> Produced by: Business Analyst
> Date: 2026-04-02
> Scope: End-to-end workflow for consultants performing financial, organizational, and contract assessments

---

## Engagement Phases

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Scoping &  │──▶│    Data      │──▶│   Analysis   │──▶│  Synthesis & │──▶│  Deliverable │
│ Data Request │   │  Ingestion   │   │              │   │   Recommend  │   │  Production  │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
     1-2 days          2-5 days          5-15 days           3-5 days          3-5 days
```

---

## Phase 1: Scoping & Data Request

### Activities
1. **Define assessment scope** — What entities, time periods, and domains are in scope? What questions must the assessment answer?
2. **Build data request list** — Standardized but customized per engagement. Typically 50-150 line items covering:
   - Financial: P&L, balance sheet, cash flow (3-5 years), trial balance, budget vs. actual, revenue by customer/product
   - Organizational: Org chart, headcount by department/level, compensation data, open positions, contractor spend
   - Contracts: Vendor contracts, customer agreements, leases, employment agreements, partnership/JV agreements
   - Operational: Policies, procedures, IT systems inventory, KPI reports
3. **Send data request** — Usually via email with an Excel tracker attached
4. **Track receipt** — Manually check off items as they arrive; follow up on outstanding items

### Current Tools
- Excel (data request tracker)
- Email (sending requests, receiving documents)
- SharePoint / data room (document upload destination)

### Pain Points
- Data arrives piecemeal over days/weeks — constant status tracking overhead
- Client uploads documents with unhelpful filenames ("Final_v3_revised.pdf")
- No automated matching of received documents to request line items
- Scope creep — additional questions emerge during analysis, requiring supplemental requests

### Automation Opportunities
- **Templated data request lists** by assessment type with smart customization
- **Automated receipt tracking** — match uploaded documents to request items
- **Status dashboard** — real-time view of what's received, what's outstanding, what's overdue

---

## Phase 2: Data Ingestion & Organization

### Activities
1. **Document cataloging** — Tag each document by type, entity, time period, workstream
2. **Data extraction** — Pull structured data from unstructured sources:
   - Financial statements (PDF/Excel) → standardized financial model
   - HR exports (CSV/Excel) → normalized org hierarchy with levels, titles, compensation
   - Contracts (PDF) → structured register with key terms
3. **Normalization** — Map client's chart of accounts to standard taxonomy; adjust for different fiscal years, currencies, entity structures
4. **Quality check** — Do the numbers tie? Are there gaps? Do the org chart counts match the headcount data?

### Current Tools
- Excel (all data restructuring and normalization)
- Adobe Acrobat (reading contract PDFs)
- Manual copy-paste (primary extraction method)

### Pain Points
- **Biggest time sink of the entire engagement** — 25-35% of total hours
- Every client's chart of accounts is different; mapping is manual and error-prone
- Contract extraction is fully manual — reading PDFs, typing terms into Excel
- HR data quality varies wildly — missing fields, inconsistent titles, broken hierarchies
- No versioning — when client sends updated data, analyst must re-do extraction

### Automation Opportunities
- **Chart-of-accounts mapping** — ML-assisted mapping to standard taxonomy with manual override
- **Financial statement parser** — Extract P&L/BS/CF structure from PDF/Excel automatically
- **Contract term extractor** — Pull key clauses, dates, values from contract PDFs
- **Org data normalizer** — Clean and structure HR exports into consistent hierarchy

---

## Phase 3: Analysis

### Financial Analysis
| Analysis Type | Description | Output |
|--------------|-------------|--------|
| **Trend analysis** | Revenue, costs, margins over 12-60 months | Line/bar charts with commentary |
| **Ratio analysis** | Profitability, liquidity, leverage, efficiency ratios | Ratio dashboard with traffic-light indicators |
| **Normalization** | Adjust EBITDA for one-time, non-recurring, owner-related items | Normalized EBITDA bridge |
| **Benchmarking** | Compare ratios to industry medians / peer set | Percentile ranking charts |
| **Variance analysis** | Budget vs. actual, YoY changes, entity comparisons | Waterfall charts, variance tables |
| **Quality of earnings** | Assess sustainability and quality of reported earnings | Adjustment schedule with footnotes |

### Organizational Analysis
| Analysis Type | Description | Output |
|--------------|-------------|--------|
| **Structure mapping** | Visualize hierarchy with reporting lines | Interactive org chart |
| **Span of control** | Direct reports per manager, layers to CEO | Heat map by department |
| **Role clarity** | Overlapping responsibilities, unclear mandates | Gap/overlap matrix |
| **Duplication detection** | Similar roles across departments/entities | Role comparison table |
| **Labor cost analysis** | Compensation by level, department, entity | Cost waterfall, benchmark comparison |
| **Headcount analysis** | FTE trends, contractor mix, vacancy rate | Trend charts by category |

### Contract Analysis
| Analysis Type | Description | Output |
|--------------|-------------|--------|
| **Portfolio overview** | Contracts by type, value, vendor, expiration | Summary dashboard |
| **Risk assessment** | Unfavorable terms, missing protections, auto-renewals | Risk heat map |
| **Obligation tracking** | Notice periods, renewal windows, milestone payments | Calendar/timeline view |
| **Rate benchmarking** | Contracted rates vs. market rates | Variance table |
| **Consolidation opportunities** | Multiple vendors for same service, volume discount gaps | Opportunity register |

### Cross-Cutting Analysis
- Financial anomaly → org structure investigation (e.g., rising costs in a department → overstaffing or unclear ownership)
- Contract terms → financial impact (e.g., above-market vendor rates → cost reduction opportunity)
- Org gaps → contract dependency (e.g., missing internal capability → expensive outsourcing contracts)

### Pain Points
- Analysis happens in isolated Excel workbooks per workstream — no cross-linking
- Findings are captured in notes, email threads, and slide comments — no structured repository
- Re-running analysis when data updates requires manual rework
- No standard framework for how to prioritize or score findings

### Automation Opportunities
- **Pre-built analysis templates** that auto-populate from ingested data
- **Anomaly detection** — auto-flag statistical outliers in financial and org data
- **Cross-reference engine** — suggest connections between findings across workstreams
- **Findings repository** — structured capture with severity, evidence links, and tags

---

## Phase 4: Synthesis & Recommendations

### Activities
1. **Theme identification** — Group findings into themes (e.g., "cost structure issues," "organizational complexity," "contract risk exposure")
2. **Recommendation development** — For each theme, define:
   - What to do (specific action)
   - Why (linked findings as evidence)
   - Expected impact (financial estimate, risk reduction, efficiency gain)
   - Effort required (timeline, resources, complexity)
   - Dependencies and risks
3. **Prioritization** — Plot on impact vs. effort matrix:
   - **Quick wins** — High impact, low effort → do immediately
   - **Strategic initiatives** — High impact, high effort → plan carefully
   - **Fill-ins** — Low impact, low effort → do when convenient
   - **Deprioritize** — Low impact, high effort → don't do
4. **Narrative construction** — Build the "so what" story that connects findings to recommendations to business outcomes

### Current Tools
- PowerPoint (the synthesis happens directly in slide-building)
- Excel (impact estimation models)
- Whiteboard / Miro (team synthesis sessions)

### Pain Points
- Synthesis is the highest-skill activity but happens under the most time pressure
- No structured way to link recommendations back to supporting evidence
- Impact estimates are rough and poorly documented — hard to defend
- Prioritization is often gut-feel rather than systematic

### Automation Opportunities
- **Recommendation builder** — Template with required fields (action, evidence, impact, effort)
- **Auto-linking** — Attach findings to recommendations with click-through to source data
- **Impact calculator** — Structured framework for estimating financial impact
- **Priority matrix** — Auto-generated from impact/effort scores

---

## Phase 5: Deliverable Production

### Typical Deliverable Structure
1. **Executive Summary** (2-3 pages) — Situation overview, key findings, top recommendations, expected total impact
2. **Financial Assessment** (10-20 pages) — Detailed financial analysis with charts, tables, commentary
3. **Organizational Assessment** (10-15 pages) — Org structure analysis, findings, future-state recommendations
4. **Contract Review** (8-12 pages) — Portfolio summary, risk register, key opportunities
5. **Recommendations & Roadmap** (5-10 pages) — Prioritized recommendations with impact, effort, timeline
6. **Appendices** (20-50 pages) — Detailed data tables, full contract register, org charts, methodology

### Current Tools
- PowerPoint (primary deliverable format)
- Excel (backup data tables in appendix)
- Word (detailed reports for some clients)

### Pain Points
- **Deliverable production consumes 20-30% of engagement time**
- Charts must be manually recreated from Excel analysis into PowerPoint
- When analysis updates, every chart in the deck must be manually updated
- Formatting and visual consistency is a constant battle
- Multiple team members editing the same deck causes version conflicts
- Senior reviewers redline slides, requiring manual rework

### Automation Opportunities
- **Report generator** — Findings and recommendations flow into branded templates automatically
- **Live chart linking** — Charts in deliverables update when underlying data changes
- **Executive summary generator** — Draft summary from structured findings and recommendations
- **Version control** — Track changes across team edits

---

## Time Allocation (Typical 4-6 Week Engagement)

| Phase | % of Total Hours | Key Bottleneck |
|-------|-----------------|----------------|
| Scoping & Data Request | 5-10% | Client responsiveness |
| Data Ingestion & Organization | 25-35% | Manual data wrangling |
| Analysis | 25-30% | Cross-workstream coordination |
| Synthesis & Recommendations | 15-20% | Senior bandwidth |
| Deliverable Production | 20-30% | Manual formatting |

**Biggest automation opportunity**: Data ingestion (save 15-20% of engagement hours) and deliverable production (save 10-15% of engagement hours).
