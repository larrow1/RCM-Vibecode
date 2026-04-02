# Spec: Org Mapper

> **Author**: Product Manager
> **Date**: 2026-04-02
> **Status**: SPECIFIED
> **Primary Persona**: James — Organizational Design Consultant
> **Supporting Personas**: Marcus (synthesis), Rachel (labor cost impact)

---

## Problem Statement

Assessment consultants spend 30-40% of org assessment time manually building org charts from HR data exports, computing span-of-control metrics, and rolling up labor costs by department. The process is error-prone (Visio doesn't scale past ~200 nodes) and the resulting charts have no analytical layer — span of control, headcount, and labor costs must be tracked separately in Excel.

## Solution

The Org Mapper provides a unified workspace for importing organizational data, visualizing hierarchies interactively, and running structural analytics (span of control, headcount, labor cost roll-ups, role duplication detection) — all from a single tool.

---

## User Stories

### Import & Data Management (James)
1. **As James**, I want to import org data from CSV (HR system exports with name, title, department, manager, level, compensation), so I can populate the org structure without manual entry.
2. **As James**, I want to manually add/edit org units and people when the data is incomplete, so I can fill gaps the HR export doesn't cover.
3. **As James**, I want to see a list of all engagements with their org structures, so I can switch between assessments.

### Visualization (James)
4. **As James**, I want to see an interactive org chart (tree layout) that shows hierarchy, levels, and department groupings, so I can understand the structure at a glance.
5. **As James**, I want to expand/collapse branches in the org chart, so I can focus on specific parts of the organization.
6. **As James**, I want to color-code nodes by department or by metric (e.g., span of control issues), so I can spot patterns visually.

### Analytics (James, Marcus)
7. **As James**, I want to see span-of-control analysis — direct reports per manager — with flags for those with <3 or >12 direct reports, so I can identify management structure issues.
8. **As James**, I want headcount roll-ups by department and by level, so I can see where the people are concentrated.
9. **As James**, I want labor cost roll-ups by department, level, and manager, so I can identify cost concentration and overhead ratios.
10. **As James**, I want to detect potential role duplications (similar titles across departments), so I can flag consolidation opportunities.

### Findings Integration (James, Marcus)
11. **As James**, I want to create findings linked to specific org units (e.g., "Marketing has 14 direct reports to VP — exceeds benchmark"), so I can build evidence-based recommendations.
12. **As Marcus**, I want to see org-related findings alongside financial and contract findings in my synthesis view.

---

## MVP Scope

### In Scope
- Engagement management (create, list, select)
- Org unit CRUD (manual add/edit/delete)
- CSV import of org data (name, title, department, manager, level, compensation)
- Tree-based org chart visualization (HTML/CSS tree, expandable)
- Span of control analysis with thresholds
- Headcount summary by department and level
- Labor cost summary by department and level
- Role duplication detection (similar titles)
- Findings capture linked to org units
- Seed data: realistic company org structure (~50-80 nodes)

### Out of Scope (Future)
- D3.js/React Flow interactive charts (MVP uses HTML/CSS tree)
- Current-state vs. future-state comparison
- Industry benchmark comparison for overhead ratios
- AI-powered org analysis suggestions
- Drag-and-drop org chart editing

---

## Acceptance Criteria

1. User can create an engagement and import org data from CSV
2. Org chart displays as an expandable tree with department color coding
3. Dashboard shows key metrics: total headcount, total labor cost, avg span of control, number of levels
4. Span of control table lists all managers with direct report counts, flagging outliers
5. Headcount and labor cost breakdowns by department and level are accurate
6. Role duplication detection identifies similar titles across departments
7. User can create findings linked to org units
8. Seed data demonstrates all features with realistic org structure
9. All unit tests pass; app builds successfully

---

## Success Metrics

- Time to visualize an org structure from CSV: <5 minutes (vs. 2-4 hours in Visio)
- Span of control issues identified: automated vs. manual counting
- Labor cost accuracy: roll-ups match source data within rounding
