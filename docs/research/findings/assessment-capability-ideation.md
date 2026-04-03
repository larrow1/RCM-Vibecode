# Ideation: Core Assessment Capabilities

> **Facilitated by**: Product Manager, User Researcher, Business Analyst
> **Date**: 2026-04-03
> **Purpose**: Brainstorm platform tool ideas grounded in the fundamentals of consultant assessments — what consultants *must* do well to deliver value, and where software can create leverage.

---

## Assessment Fundamentals Framework

Every consultant assessment, regardless of type (due diligence, org review, cost optimization, operational assessment), follows a universal structure. We orient ideas around these **seven fundamentals**:

1. **Evidence Collection** — Gathering and organizing source data from the client
2. **Data Normalization** — Making heterogeneous data comparable and analyzable
3. **Structural Analysis** — Understanding how the organization is built (people, contracts, finances)
4. **Pattern Recognition** — Finding anomalies, trends, risks, and opportunities in the data
5. **Cross-Domain Synthesis** — Connecting findings across workstreams into a cohesive narrative
6. **Impact Quantification** — Putting dollar values on findings and recommendations
7. **Communication & Delivery** — Translating analysis into client-ready deliverables

---

## Ideas by Fundamental

### 1. Evidence Collection

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 10 | **Data Room Connector** | Consultants spend hours downloading files from virtual data rooms (Intralinks, Datasite, SharePoint), renaming them, and cataloging metadata manually. A connector that watches a data room folder and auto-catalogs incoming files with type detection and OCR-based metadata extraction. | All | High | High |
| 11 | **Smart Data Request Templates** | Every engagement starts with a data request list. Templates by engagement type (DD, org review, cost optimization) pre-populated with standard items, customizable per client, with status tracking and automated reminders. | Marcus | Medium | High |
| 12 | **Interview Capture Tool** | James and Marcus conduct 10-30 stakeholder interviews per engagement. Notes are scattered across personal docs. A structured interview tool with templates, tagging, and automatic linking to findings. | James, Marcus | Medium | Medium |
| 13 | **Document Completeness Scorer** | "Do we have enough data to start analysis?" is a daily question. A scorer that compares received documents against the data request list and flags gaps, with confidence levels per workstream. | Marcus | Low | Medium |

### 2. Data Normalization

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 14 | **Universal Chart of Accounts Mapper** | Every client uses different account names. An AI-assisted mapper that learns from past engagements and suggests standard taxonomy mappings with increasing accuracy over time. | Rachel | High | Very High |
| 15 | **HR Data Normalizer** | Employee data from Workday, ADP, SAP comes in wildly different formats. A normalizer that detects common HR export schemas and maps to a standard org-unit structure, handling title variations, reporting-line ambiguity, and compensation format differences. | James | Medium | High |
| 16 | **Multi-Currency / Multi-Entity Consolidator** | International engagements involve multiple currencies, entities, and intercompany eliminations. A tool to consolidate financial data across entities with FX conversion and elimination rules. | Rachel | High | High |
| 17 | **Period Alignment Tool** | Client fiscal years don't always match calendar years, and some data is monthly while other data is quarterly or annual. A tool to align and interpolate financial data across mismatched periods. | Rachel | Medium | Medium |

### 3. Structural Analysis

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 18 | **Process Flow Mapper** | Operational assessments require mapping business processes (procurement, order-to-cash, hire-to-retire). A visual process flow tool with bottleneck identification and cycle-time analysis. | Marcus, James | High | High |
| 19 | **Vendor Landscape Analyzer** | Who does the client buy from? A tool that maps the vendor portfolio from AP data and contracts, identifies concentration risk, volume discount opportunities, and duplicate vendors. | Priya | Medium | High |
| 20 | **Cost Driver Decomposition** | "Why did costs go up?" is the #1 question in cost optimization. A tool that decomposes cost changes into volume, rate, mix, and one-time components across any cost category. | Rachel | Medium | Very High |
| 21 | **Workforce Planning Modeler** | After diagnosing org issues, James needs to model future-state scenarios: "What if we consolidate these two departments? Eliminate this management layer? Add 5 engineers?" An interactive scenario modeler. | James | High | High |

### 4. Pattern Recognition

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 22 | **Anomaly Detection Engine** | Consultants manually scan spreadsheets for outliers. An engine that automatically flags statistical anomalies in financial line items, headcount changes, contract terms, and operational metrics. | Rachel, James, Priya | Medium | Very High |
| 23 | **Trend Narrative Generator** | "Revenue grew 12% but margins declined 3pp because COGS grew faster" — consultants write these narratives by hand. AI-generated plain-English summaries of key trends from data. | Rachel | Medium | High |
| 24 | **Contract Risk Patterns** | Across 150 contracts, which patterns indicate risk? An analyzer that learns risk indicators (auto-renewal + no notice period, change-of-control restrictions, unlimited liability) and surfaces the highest-risk contracts first. | Priya | Medium | High |
| 25 | **Peer Comparison Engine** | "Is this company's 35% gross margin good or bad?" Requires context. A tool that matches the client to relevant peers/industry benchmarks and highlights where they're above/below norms. | Rachel, Marcus | Medium | High |

### 5. Cross-Domain Synthesis

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 26 | **Finding Connection Graph** | Findings from different workstreams are often related but consultants discover connections by accident. A graph visualization showing how financial findings connect to org issues connect to contract risks, with AI-suggested links. | Marcus | Medium | Very High |
| 27 | **Narrative Builder** | Marcus spends days synthesizing findings into a story. A tool that takes tagged findings, groups them into themes, suggests a logical narrative arc, and generates a first-draft story outline. | Marcus | High | Very High |
| 28 | **Impact Waterfall** | "Here's the total potential value: $X in cost savings, $Y in revenue uplift, $Z in risk mitigation." A waterfall visualization that rolls up all quantified recommendations into a single value-at-stake picture. | Marcus | Low | High |
| 29 | **Workstream Health Dashboard** | Across all three workstreams (financial, org, contracts), where are we complete and where are there gaps? A meta-dashboard showing analysis completeness, finding coverage, and recommendation status. | Marcus | Low | Medium |

### 6. Impact Quantification

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 30 | **Savings Calculator Library** | Consultants re-derive savings calculations from scratch each engagement. A library of pre-built calculation templates: vendor consolidation savings, headcount reduction, process automation ROI, etc. | All | Medium | High |
| 31 | **Sensitivity Analysis Tool** | "What if we only capture 70% of the savings?" Recommendations need sensitivity ranges, not point estimates. A Monte Carlo or scenario-based tool that generates confidence-weighted impact ranges. | Rachel, Marcus | Medium | High |
| 32 | **Implementation Roadmap Builder** | Recommendations need sequencing. A tool that takes recommendations with dependencies, effort, and impact, and generates an optimized implementation timeline with quick wins first. | Marcus | Medium | High |

### 7. Communication & Delivery

| # | Idea | Problem it solves | Persona | Effort | Impact |
|---|------|-------------------|---------|--------|--------|
| 33 | **Executive Summary Generator** | The exec summary is the most-read and hardest-to-write page. AI-assisted generation from structured findings and recommendations, following standard consulting narrative patterns. | Marcus | Medium | Very High |
| 34 | **Chart Factory** | Consultants manually recreate charts from Excel data in PowerPoint. A chart generator that produces presentation-ready visualizations (waterfalls, bridges, stacked bars, treemaps) directly from analysis data. | All | Medium | High |
| 35 | **Appendix Compiler** | The data appendix is tedious but critical for credibility. A tool that auto-compiles supporting data tables, source document references, and methodology notes into a structured appendix. | Rachel | Low | Medium |
| 36 | **Deliverable Version Tracker** | Assessment reports go through 5-10 review cycles. A version tracker with redline history, comment resolution, and status per section. | Marcus | Medium | Medium |

---

## Prioritization Recommendations

### Immediate (build next — high impact, medium effort)

1. **#20 — Cost Driver Decomposition**: Answers the most common client question across all engagement types. Extends Financial Analyzer with diagnostic power.
2. **#22 — Anomaly Detection Engine**: Applies across all workstreams. AI-powered, leverages `@rcm/ai-config`.
3. **#28 — Impact Waterfall**: Low effort, high visual impact. Natural extension of Findings & Recommendations.
4. **#13 — Document Completeness Scorer**: Low effort, solves daily engagement management pain.

### Near-term (after Contract Tracker and Deliverable Builder)

5. **#26 — Finding Connection Graph**: Key differentiator for cross-domain synthesis.
6. **#25 — Peer Comparison Engine**: Makes benchmarking useful rather than manual.
7. **#33 — Executive Summary Generator**: High AI leverage, high client-visible impact.
8. **#11 — Smart Data Request Templates**: Reduces engagement startup time significantly.

### Strategic (higher effort, transformational)

9. **#14 — Universal Chart of Accounts Mapper**: Gets better with every engagement. Moat-building.
10. **#27 — Narrative Builder**: The "holy grail" of consultant tooling — AI-assisted synthesis.
11. **#21 — Workforce Planning Modeler**: Extends Org Mapper from diagnostic to prescriptive.
12. **#10 — Data Room Connector**: Integration play, high technical complexity but massive time savings.

---

## How This Feeds the Backlog

These ideas should flow through the standard pipeline:
1. User votes/comments on ideas in the **Idea Portal** (being built)
2. Product Manager promotes high-priority ideas to `RESEARCHING` in backlog
3. User Researcher validates with persona needs analysis
4. Business Analyst maps workflow impact
5. Product Manager writes spec → Architect designs → Developer builds → QA tests

The Idea Portal enables this loop to include actual users, not just agent-generated priorities.
