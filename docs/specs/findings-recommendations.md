# Feature Spec: Findings & Recommendations

> Author: Product Manager
> Date: 2026-04-02
> Status: SPECIFIED
> Backlog Item: #3

---

## Problem Statement

After consultants complete financial, organizational, and contract analysis, they need to **synthesize findings into actionable recommendations**. Today, this synthesis happens in isolated PowerPoint slides and scattered Excel notes with no structured linkage between evidence and conclusions.

Marcus (Engagement Lead) spends 15-20% of each engagement manually cross-referencing findings across workstreams. He reads Rachel's financial findings, James's org analysis, and Priya's contract risks -- then tries to connect the dots in his head and on whiteboards. "The financials show margin erosion in Division B, the org chart shows it's understaffed, and the vendor contracts there are above market -- this is one story, not three." But there is no tool to capture these cross-references or build recommendations with traceable evidence chains.

Impact estimates are rough and poorly documented. Prioritization is gut-feel rather than systematic. When the client asks "why should we do this first?", there is no structured framework to defend the answer.

The Findings & Recommendations engine is the **"so what" layer** -- it turns raw analysis into the structured, evidence-backed advice that clients pay for.

### References
- Research: `docs/research/findings/assessment-consultant-research.md` -- All four personas, JTBD #7-#10
- Workflow: `docs/research/workflows/assessment-workflow.md` -- Phase 4 (Synthesis & Recommendations)
- Domain Model: `docs/domain-model.md` -- Finding, Recommendation entities

---

## User Stories

### Rachel (Financial DD Lead) -- Capturing Financial Findings

1. **As Rachel**, I want to **create a finding tagged to the Financial workstream with severity and category**, so I can **systematically capture observations instead of burying them in spreadsheet notes**.
2. **As Rachel**, I want to **attach evidence to a finding** (references to financial line items, documents, or free-text descriptions), so I can **trace every finding back to its source data**.
3. **As Rachel**, I want to **see all my financial findings in one filtered list by severity and status**, so I can **review what I have captured and identify gaps**.

### James (Org Consultant) -- Capturing Organizational Findings

4. **As James**, I want to **create findings tagged to the Organizational workstream**, so I can **capture span-of-control issues, role duplications, and structural problems in a structured way**.
5. **As James**, I want to **link my org findings to related financial findings** (e.g., "overstaffing in Division B" links to "rising SGA costs in Division B"), so the **cross-workstream story builds itself**.

### Priya (Contract Specialist) -- Capturing Contract Findings

6. **As Priya**, I want to **create findings tagged to the Contracts workstream with risk severity**, so I can **catalog contract risks, unfavorable terms, and consolidation opportunities**.
7. **As Priya**, I want to **link contract findings to financial findings** (e.g., "above-market vendor rates" links to "COGS higher than benchmarks"), so **the evidence chain is complete**.

### Marcus (Engagement Lead) -- Synthesis and Recommendations

8. **As Marcus**, I want to **view all findings across workstreams in a single list with filtering by workstream, severity, status, and tags**, so I can **see the full picture**.
9. **As Marcus**, I want to **group findings into themes** (e.g., "cost structure issues", "organizational complexity", "contract risk exposure"), so I can **organize the narrative**.
10. **As Marcus**, I want to **create a recommendation with a title, description, type, and linked supporting findings**, so I can **ensure every recommendation is evidence-based**.
11. **As Marcus**, I want to **estimate the financial impact of a recommendation using a structured calculator** (base amount, adjustment factor, confidence level), so I can **defend impact estimates to clients**.
12. **As Marcus**, I want to **set effort level and timeframe for each recommendation**, so I can **build the impact vs. effort prioritization matrix**.
13. **As Marcus**, I want to **view recommendations in a priority matrix** (impact vs. effort grid showing quick wins, strategic initiatives, fill-ins, and deprioritize), so I can **give clients a clear action roadmap**.
14. **As Marcus**, I want to **see a theme view that groups findings by theme with their linked recommendations**, so I can **build a coherent story for the deliverable**.

---

## Core Capabilities

### 1. Finding Capture

Create, edit, and manage findings across all workstreams.

**Acceptance Criteria:**
- Create a finding with: title, description, workstream (Financial/Organizational/Contracts/CrossCutting), category (Risk/Opportunity/Observation/Anomaly), severity (Critical/High/Medium/Low/Informational)
- Attach evidence items (free-text descriptions with optional source type and source reference)
- Tag findings with thematic tags (free-form text, comma-separated)
- Set status (Draft/Confirmed/Disputed/Resolved)
- Estimate optional financial impact (dollar value)
- Assign a creator name

### 2. Cross-Reference Linking

Link related findings across workstreams to build connected narratives.

**Acceptance Criteria:**
- Link any two findings together with a relationship description
- A finding can be linked to multiple other findings
- Links are bidirectional (if A links to B, B shows A in its linked findings)
- Cross-Cutting findings must link to findings in at least 2 workstreams
- Visual display of linked findings on finding detail page

### 3. Theme Grouping

Group findings into themes for narrative organization.

**Acceptance Criteria:**
- Create themes with name, description, and color
- Assign findings to themes (a finding can belong to multiple themes)
- Theme view shows all findings grouped by theme
- Themes display aggregate severity distribution and financial impact

### 4. Recommendation Builder

Create structured recommendations backed by findings.

**Acceptance Criteria:**
- Create a recommendation with: title, description, type (CostReduction/RevenueEnhancement/RiskMitigation/OperationalImprovement/StructuralChange)
- Link one or more supporting findings (required -- no unsupported recommendations)
- Set effort level (Low/Medium/High)
- Set timeframe (QuickWin 0-3mo, ShortTerm 3-6mo, MediumTerm 6-12mo, LongTerm 12mo+)
- Set status (Draft/Reviewed/Approved/Presented)
- Add dependencies and risks as text fields

### 5. Impact Calculator

Structured framework for estimating dollar impact with confidence levels.

**Acceptance Criteria:**
- Each recommendation has an impact estimate with: base amount, adjustment percentage (0-100%), confidence level (High/Medium/Low)
- Calculated impact = base amount * (adjustment percentage / 100)
- Confidence-weighted impact applies a multiplier: High=1.0, Medium=0.7, Low=0.4
- Priority score = (confidence-weighted impact) / effort multiplier (Low=1, Medium=2, High=3)
- Impact estimates are editable and recalculated on change

### 6. Priority Matrix

Visual impact vs. effort classification.

**Acceptance Criteria:**
- Recommendations are plotted on a 2x2 matrix: high/low impact vs. high/low effort
- Quadrant labels: Quick Wins (high impact, low effort), Strategic Initiatives (high impact, high effort), Fill-ins (low impact, low effort), Deprioritize (low impact, high effort)
- Matrix updates dynamically as impact and effort values change
- Click-through from matrix to recommendation detail

---

## MVP Scope

### In Scope
- Finding CRUD with evidence, tags, severity, workstream filtering
- Cross-reference linking between findings
- Theme creation and finding assignment
- Recommendation CRUD with linked findings
- Impact calculator with confidence levels
- Priority matrix view (HTML/CSS based, not chart library)
- Finding detail with linked findings and evidence
- Recommendation detail with supporting findings and impact calc
- Seed data: 15+ findings, 8+ recommendations, 3-4 themes

### Out of Scope (Future)
- Integration with Financial Analyzer findings
- AI-assisted finding generation
- Auto-suggested cross-references
- Export to PowerPoint/PDF
- Multi-user collaboration
- Real-time updates

---

## Success Metrics

1. All findings traceable to evidence
2. All recommendations linked to at least one finding
3. Impact estimates follow structured calculation framework
4. Priority matrix correctly classifies recommendations by quadrant
5. Cross-workstream findings linked to show connected narratives

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Overly rigid finding structure may not fit all assessment types | Medium | Keep fields flexible; tags and free-text evidence provide escape hatches |
| Impact estimation is inherently uncertain | Medium | Confidence levels and ranges acknowledge uncertainty explicitly |
| Too many clicks to capture a finding during analysis | Medium | Streamlined forms with sensible defaults; batch operations for tagging and linking |
