# Architecture: Org Mapper

> **Author**: Architect
> **Date**: 2026-04-02
> **Status**: DESIGNED
> **Spec**: `docs/specs/org-mapper.md`

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma (unique output: `.prisma/client-org-mapper`)
- **Validation**: Zod
- **CSV Parsing**: papaparse
- **Testing**: Vitest + Testing Library
- **Port**: 3006

---

## Prisma Schema (5 models)

### Engagement
- id, name, clientName, type, status, startDate, endDate, scopeDescription
- Relations: orgUnits[], findings[]

### OrgUnit
- id, engagementId, name, title, department, type (Division/Department/Team/Role)
- parentId (self-referential), level, headcount, totalCompensation
- managerName, managerTitle, employeeId (for CSV mapping)
- Relations: parent, children[], findings[]

### Finding
- id, engagementId, orgUnitId (nullable), workstream (default: "Organizational")
- category, severity, title, description, financialImpact, tags, status
- Relations: engagement, orgUnit

### ImportLog
- id, engagementId, fileName, rowCount, successCount, errorCount, errors, createdAt

### OrgBenchmark
- id, metric, industry, source, minHealthy, maxHealthy, median, year, notes

---

## API Routes (12 endpoints)

### Engagements
- `GET /api/engagements` — List all
- `POST /api/engagements` — Create
- `GET /api/engagements/[id]` — Get with org units + findings

### Org Units
- `GET /api/org-units?engagementId=X` — List for engagement (flat, with parent info)
- `POST /api/org-units` — Create
- `PUT /api/org-units/[id]` — Update
- `DELETE /api/org-units/[id]` — Delete (cascade children)
- `POST /api/org-units/import` — CSV import

### Findings
- `GET /api/findings?engagementId=X` — List for engagement
- `POST /api/findings` — Create
- `PUT /api/findings/[id]` — Update

### Analytics
- `GET /api/analytics?engagementId=X` — Computed analytics (span of control, headcount, costs, duplicates)

---

## Pages (5)

1. **Dashboard** (`/`) — Engagement list with summary metrics
2. **Engagement Detail** (`/engagements/[id]`) — Overview with org chart, key metrics cards
3. **Import** (`/engagements/[id]/import`) — CSV upload and column mapping
4. **Analytics** (`/engagements/[id]/analytics`) — Span of control, headcount, costs, duplication tables
5. **Findings** (`/engagements/[id]/findings`) — List and create findings linked to org units

---

## Components

### Layout
- `Sidebar` — Navigation with engagement context

### Dashboard
- `EngagementList` — List of engagements with metrics
- `MetricCard` — Key stat display

### Org Chart
- `OrgTree` — Recursive tree component (HTML/CSS based)
- `OrgNode` — Single node in the tree (name, title, dept, headcount, cost)

### Analytics
- `SpanOfControlTable` — Managers with direct report counts + flags
- `HeadcountSummary` — Breakdown by department and level
- `LaborCostSummary` — Cost roll-ups by department and level
- `DuplicationTable` — Similar titles across departments

### Findings
- `FindingsList` — Table of findings with filters
- `FindingForm` — Create/edit finding linked to org unit

### Import
- `CsvUploader` — File upload + preview
- `ColumnMapper` — Map CSV columns to schema fields

---

## Key Algorithms

### Span of Control
- For each org unit with children, count direct children
- Flag: <3 direct reports (too few — unnecessary layer?) or >12 (too many — overwhelmed manager)

### Headcount Roll-up
- Leaf nodes have headcount=1 (individual roles) or explicit headcount (departments)
- Parent headcount = sum of children headcount (computed, not stored)

### Labor Cost Roll-up
- Same tree traversal as headcount
- Total cost = sum of children's totalCompensation

### Role Duplication Detection
- Normalize titles (lowercase, strip common suffixes like Sr./Jr./I/II/III)
- Group by normalized title across departments
- Flag groups with >1 department represented

---

## Decisions

1. **HTML/CSS tree over D3.js** — Simpler, no additional dependency, sufficient for MVP. Can upgrade later.
2. **Flat storage with parentId** — Standard adjacency list for org hierarchy. Prisma handles self-relations well.
3. **Computed analytics** — Roll-ups computed on-demand from flat data rather than stored. Simpler, always accurate.
4. **Port 3006** — Following the sequence: 3001 (financial), 3002 (findings), 3003 (engagement), 3004 (app-library), 3005 (progress-flow), 3006 (org-mapper).
