# Research Findings: Assessment Consultant Platform

> Produced by: User Researcher
> Date: 2026-04-02
> Scope: Consultants performing financial analysis, org structure assessment, contract review, and advisory recommendations

---

## 1. Personas

### Persona A: Financial Due Diligence Lead — "Rachel"

- **Role**: Senior Consultant / Manager, Financial Advisory
- **Experience**: 8 years in transaction services and financial due diligence
- **Typical engagement**: Analyzing 3-5 years of financial statements for an M&A target, normalizing EBITDA, identifying quality-of-earnings adjustments, flagging risks for the buyer
- **Tools today**: Excel (90% of analysis), PowerPoint (deliverables), SharePoint (document collection), Capital IQ / Bloomberg (benchmarks)
- **Day-in-the-life during an engagement**:
  - 8:00 AM — Check data room for newly uploaded documents; update the data request tracker (Excel spreadsheet)
  - 9:00 AM — Pull P&L and balance sheet data into her analysis workbook; manually reformat because every client uses different chart-of-accounts structures
  - 10:30 AM — Build trend analysis across 36 months; manually flag anomalies like revenue spikes, margin compression, one-time items
  - 12:00 PM — Team standup — walk through open items, assign data follow-ups
  - 1:00 PM — Normalize EBITDA — manually create adjustment schedule with footnotes for each add-back/removal
  - 3:00 PM — Benchmark ratios against industry comps — toggle between Capital IQ exports and her workbook
  - 4:30 PM — Draft findings section for the report in PowerPoint — re-create charts by hand from Excel
  - 6:00 PM — Review junior analyst's contract analysis for financial terms (payment terms, earnouts, contingencies)

### Persona B: Organizational Design Consultant — "James"

- **Role**: Consultant, Organizational Effectiveness practice
- **Experience**: 5 years in org design, workforce planning, and change management
- **Typical engagement**: Assessing a company's org structure post-merger — identifying overlapping roles, unclear reporting lines, excessive management layers, and recommending a future-state org design
- **Tools today**: Visio / Lucidchart (org charts), Excel (headcount and labor cost analysis), PowerPoint (deliverables), Workday / SAP HR exports (raw data)
- **Day-in-the-life during an engagement**:
  - 8:30 AM — Import latest HR data export (CSV from Workday) into Excel; clean up titles, levels, reporting relationships
  - 9:30 AM — Rebuild org chart in Visio — manually, because the HR data never maps cleanly to visual hierarchy
  - 11:00 AM — Span-of-control analysis — count direct reports per manager, flag those with <3 or >12
  - 12:00 PM — Labor cost roll-up by department and level; compare to industry benchmarks for overhead ratios
  - 1:30 PM — Interview with client VP — discuss pain points in current structure, where decisions get stuck
  - 3:00 PM — Map current-state vs. future-state side by side in Visio; estimate headcount changes
  - 4:30 PM — Draft recommendations slide — "Consolidate X and Y under single VP, eliminate layer of directors, estimated savings $2.1M"
  - 6:00 PM — Update findings tracker with notes from interviews

### Persona C: Contract & Procurement Specialist — "Priya"

- **Role**: Senior Analyst, Contract Advisory
- **Experience**: 4 years in contract review, procurement optimization, vendor management assessments
- **Typical engagement**: Reviewing a portfolio of 50-200 contracts (vendor, customer, lease, employment) to identify risks, obligations, favorable/unfavorable terms, and consolidation opportunities
- **Tools today**: Excel (contract register), Adobe Acrobat (reading PDFs), Word (extracting terms), SharePoint (document storage), sometimes Agiloft or basic CLM for mature clients
- **Day-in-the-life during an engagement**:
  - 8:00 AM — Open the shared drive with 150 contract PDFs; start cataloging metadata (vendor, type, value, start/end dates) into the master Excel tracker
  - 9:30 AM — Read through 5-6 contracts extracting key terms: auto-renewal clauses, termination provisions, SLAs, liability caps, payment terms
  - 12:00 PM — Flag contracts with concerning clauses (change-of-control, assignment restrictions relevant to the deal)
  - 1:00 PM — Cross-reference financial data — are we paying the contracted rates? Any volume discount thresholds being missed?
  - 2:30 PM — Build the risk heat map — high-value contracts with near-term expirations and unfavorable terms
  - 4:00 PM — Draft the contract summary section for the report — top 10 risks, top 10 opportunities
  - 5:30 PM — Update the obligation tracker for upcoming renewal dates and required notices

### Persona D: Engagement Lead — "Marcus"

- **Role**: Director / Partner, Advisory Practice
- **Experience**: 15 years leading complex assessment engagements
- **Typical engagement**: Leads the overall assessment — sets scope, manages the client relationship, synthesizes findings across financial, org, and contract workstreams into a cohesive narrative and set of recommendations
- **Tools today**: PowerPoint (client presentations), Email (everything), Excel (summary views), Teams (coordination)
- **Day-in-the-life during an engagement**:
  - 8:00 AM — Review status of all workstreams — which data requests are outstanding, where is each team in their analysis
  - 9:00 AM — Client steering committee call — present preliminary findings, manage expectations
  - 10:30 AM — Read Rachel's financial findings, James's org analysis, Priya's contract risks — look for connections and conflicts
  - 12:00 PM — Synthesis session with the team — "The financials show margin erosion in Division B, the org chart shows it's understaffed, and the vendor contracts there are above market — this is one story, not three"
  - 2:00 PM — Prioritize recommendations — build the impact/effort matrix, estimate financial value of each
  - 3:30 PM — Draft the executive summary — the "so what" for the C-suite
  - 5:00 PM — Review and redline the full deliverable deck before sending to client

---

## 2. Jobs to Be Done

### Data Gathering & Organization
1. When I **receive a batch of financial statements in different formats**, I want to **quickly normalize them into a consistent structure**, so I can **start analysis without spending 2 days on data wrangling**.
2. When I **need to track which documents the client has provided vs. what's still outstanding**, I want to **see a live status dashboard of my data request list**, so I can **follow up on gaps efficiently**.
3. When I **receive 150 contract PDFs**, I want to **automatically extract key metadata (parties, dates, values, type)**, so I can **build a contract register in minutes instead of days**.

### Analysis
4. When I **have normalized financial data across periods**, I want to **automatically see ratio trends, anomalies, and peer comparisons**, so I can **focus my time on investigating issues rather than computing ratios**.
5. When I **import HR/org data**, I want to **instantly see a visual org chart with span-of-control metrics and labor cost allocation**, so I can **identify structural issues without manually building charts in Visio**.
6. When I **extract contract terms**, I want to **see a risk-scored summary highlighting the most problematic clauses**, so I can **prioritize my deep-dive review on what matters most**.
7. When I **find a financial anomaly**, I want to **link it to related org structure or contract findings**, so I can **build a cross-cutting narrative for the client**.

### Synthesis & Recommendations
8. When I **have findings across all workstreams**, I want to **see them consolidated in one place with tags and cross-references**, so I can **synthesize themes and build a coherent story**.
9. When I **draft a recommendation**, I want to **attach it to supporting findings with estimated financial impact**, so I can **justify the recommendation with evidence**.
10. When I **have a list of recommendations**, I want to **prioritize them by impact, effort, and risk in a visual matrix**, so I can **give the client a clear action roadmap**.

### Deliverable Production
11. When I **finalize my analysis and recommendations**, I want to **generate a structured report with executive summary, findings, and appendices**, so I can **avoid spending 40% of my engagement rebuilding charts in PowerPoint**.
12. When the **client asks a follow-up question about a specific finding**, I want to **trace back to the source data and documents**, so I can **answer confidently with evidence**.

---

## 3. Current Tools & Pain Points

| Tool | Used For | Pain Point |
|------|----------|------------|
| **Excel** | All financial analysis, data tracking, contract registers, org data | Version control nightmare; formulas break; can't link across workbooks; no collaboration; rebuilding from scratch each engagement |
| **PowerPoint** | All deliverables and client presentations | Manual chart recreation from Excel; no data linkage; formatting is 40% of the work; impossible to update when findings change late |
| **Visio / Lucidchart** | Org charts | Manual creation from HR data; doesn't scale past ~200 nodes; no analytical layer (span of control, costs) |
| **SharePoint / Data Rooms** | Document collection and storage | No structure; search is poor; no metadata extraction; can't track what's been reviewed |
| **Adobe Acrobat / Word** | Reading and extracting from contracts | Fully manual extraction; copy-paste into Excel; no standardized term taxonomy |
| **Email / Teams** | Coordination, data requests, client communication | Requests get lost in threads; no tracking of what's been received; status updates are manual |
| **Capital IQ / Bloomberg** | Financial benchmarks | Expensive; separate from analysis workflow; manual export/import |

### Top Time Sinks (by persona survey)
1. **Data wrangling** — 25-35% of engagement time spent reformatting, normalizing, and organizing source data
2. **Deliverable production** — 20-30% of time spent on formatting reports, recreating charts, and polishing slides
3. **Manual extraction** — 15-20% of time spent reading documents and manually pulling structured data
4. **Cross-referencing** — 10-15% of time spent flipping between workstreams to find connections
5. **Status tracking** — 5-10% of time spent on "where are we" coordination overhead

---

## 4. Key Unmet Needs (Ranked by Impact)

1. **Unified assessment workspace** — One place to see all data, findings, and deliverables for an engagement instead of scattered across 15 Excel files, 8 PowerPoints, and 3 SharePoint folders
2. **Automated financial normalization** — Import any chart-of-accounts structure and map it to a standard taxonomy for instant comparability
3. **Structured findings database** — Capture observations as structured data (linked to evidence, tagged by theme, scored by severity) instead of scattered across slides and notes
4. **Cross-workstream linking** — Connect a financial anomaly to an org structure issue to a contract risk, so the story builds itself
5. **One-click deliverable generation** — Findings and recommendations flow into report templates automatically; update the data and the deck updates
6. **Contract term extraction** — Pull structured terms from PDFs into a searchable, filterable register
7. **Org visualization with analytics** — Auto-generate org charts from data with embedded metrics (span, cost, layers)

---

## 5. Adoption Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Data sensitivity** — Client financial and HR data is highly confidential | High | Self-hosted / on-prem option; SOC2 compliance; data never leaves the platform |
| **Excel attachment** — Consultants live in Excel and resist leaving it | High | Support Excel import/export; don't replace Excel, augment it; allow copy-paste workflows |
| **Engagement variability** — Every assessment is different; rigid workflows won't fit | Medium | Flexible workspace structure; templates but not mandated flows |
| **Time pressure** — No time to learn new tools mid-engagement | Medium | Must be useful within 30 minutes; progressive disclosure; start simple |
| **Partner buy-in** — Senior leaders won't change unless they see immediate value | Medium | Focus on deliverable quality and speed; the "wow" moment is generating a polished deck from structured data |
| **Integration gaps** — If it doesn't connect to data rooms, email, and Excel, it's another silo | Medium | Robust import/export; API integrations; don't require exclusive use |
