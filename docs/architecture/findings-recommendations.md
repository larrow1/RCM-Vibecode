# Architecture: Findings & Recommendations

> Author: Architect
> Date: 2026-04-02
> Status: DESIGNED
> Spec: `docs/specs/findings-recommendations.md`

---

## Overview

The Findings & Recommendations app is the synthesis engine for assessment engagements. It captures analytical observations from all workstreams (Financial, Organizational, Contracts), cross-references them, groups them into themes, and builds evidence-backed recommendations with structured impact estimates and prioritization.

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components by default)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Validation**: Zod schemas at API boundaries
- **Testing**: Vitest
- **Port**: 3004

## Data Model (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Engagement {
  id               String   @id @default(cuid())
  name             String
  clientName       String
  type             String
  status           String   @default("Synthesis")
  startDate        DateTime
  endDate          DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  findings         Finding[]
  recommendations  Recommendation[]
  themes           Theme[]
}

model Finding {
  id              String   @id @default(cuid())
  engagementId    String
  workstream      String   // Financial, Organizational, Contracts, CrossCutting
  category        String   // Risk, Opportunity, Observation, Anomaly
  severity        String   // Critical, High, Medium, Low, Informational
  title           String
  description     String
  financialImpact Float?
  tags            String?  // comma-separated
  status          String   @default("Draft")  // Draft, Confirmed, Disputed, Resolved
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  engagement      Engagement @relation(fields: [engagementId], references: [id])
  evidence        Evidence[]
  linksFrom       FindingLink[] @relation("FindingLinkFrom")
  linksTo         FindingLink[] @relation("FindingLinkTo")
  recommendationFindings RecommendationFinding[]
  themeFindings   ThemeFinding[]

  @@index([engagementId])
  @@index([workstream])
  @@index([severity])
  @@index([status])
}

model Evidence {
  id          String @id @default(cuid())
  findingId   String
  description String
  sourceType  String?  // FinancialStatement, OrgUnit, Contract, Document, Other
  sourceRef   String?  // reference ID or description

  finding     Finding @relation(fields: [findingId], references: [id], onDelete: Cascade)

  @@index([findingId])
}

model FindingLink {
  id            String @id @default(cuid())
  fromFindingId String
  toFindingId   String
  description   String?

  fromFinding   Finding @relation("FindingLinkFrom", fields: [fromFindingId], references: [id], onDelete: Cascade)
  toFinding     Finding @relation("FindingLinkTo", fields: [toFindingId], references: [id], onDelete: Cascade)

  @@unique([fromFindingId, toFindingId])
  @@index([fromFindingId])
  @@index([toFindingId])
}

model Recommendation {
  id               String   @id @default(cuid())
  engagementId     String
  title            String
  description      String
  type             String   // CostReduction, RevenueEnhancement, RiskMitigation, OperationalImprovement, StructuralChange
  status           String   @default("Draft")  // Draft, Reviewed, Approved, Presented
  impactBase       Float?   // base dollar amount
  impactAdjPct     Float?   // adjustment percentage (0-100)
  impactConfidence String?  // High, Medium, Low
  effort           String?  // Low, Medium, High
  timeframe        String?  // QuickWin, ShortTerm, MediumTerm, LongTerm
  risks            String?
  dependencies     String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  engagement       Engagement @relation(fields: [engagementId], references: [id])
  recommendationFindings RecommendationFinding[]

  @@index([engagementId])
  @@index([type])
  @@index([status])
}

model RecommendationFinding {
  id               String @id @default(cuid())
  recommendationId String
  findingId        String

  recommendation   Recommendation @relation(fields: [recommendationId], references: [id], onDelete: Cascade)
  finding          Finding @relation(fields: [findingId], references: [id], onDelete: Cascade)

  @@unique([recommendationId, findingId])
  @@index([recommendationId])
  @@index([findingId])
}

model Theme {
  id            String @id @default(cuid())
  engagementId  String
  name          String
  description   String?
  color         String  @default("#3B82F6")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  engagement    Engagement @relation(fields: [engagementId], references: [id])
  themeFindings ThemeFinding[]

  @@index([engagementId])
}

model ThemeFinding {
  id       String @id @default(cuid())
  themeId  String
  findingId String

  theme    Theme @relation(fields: [themeId], references: [id], onDelete: Cascade)
  finding  Finding @relation(fields: [findingId], references: [id], onDelete: Cascade)

  @@unique([themeId, findingId])
  @@index([themeId])
  @@index([findingId])
}
```

### Entity Count: 8 models
- Engagement (context container)
- Finding (core analytical observation)
- Evidence (supporting data for findings)
- FindingLink (cross-reference between findings)
- Recommendation (proposed action)
- RecommendationFinding (join: recommendation to supporting findings)
- Theme (grouping construct)
- ThemeFinding (join: theme to findings)

---

## API Routes

All routes under `/api/`:

### Findings
| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/findings` | List findings with filtering (workstream, severity, status, engagementId) |
| POST   | `/api/findings` | Create a finding with evidence items |
| GET    | `/api/findings/[id]` | Get finding detail with evidence, links, themes |
| PUT    | `/api/findings/[id]` | Update finding |
| DELETE | `/api/findings/[id]` | Delete finding |

### Finding Links
| Method | Path | Description |
|--------|------|-------------|
| POST   | `/api/findings/[id]/links` | Create a link between two findings |
| DELETE | `/api/findings/[id]/links/[linkId]` | Remove a finding link |

### Recommendations
| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/recommendations` | List recommendations with filtering |
| POST   | `/api/recommendations` | Create recommendation with linked findings |
| GET    | `/api/recommendations/[id]` | Get recommendation detail with findings |
| PUT    | `/api/recommendations/[id]` | Update recommendation |
| DELETE | `/api/recommendations/[id]` | Delete recommendation |

### Themes
| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/themes` | List themes with finding counts |
| POST   | `/api/themes` | Create theme |
| PUT    | `/api/themes/[id]` | Update theme |
| DELETE | `/api/themes/[id]` | Delete theme |
| POST   | `/api/themes/[id]/findings` | Add finding to theme |
| DELETE | `/api/themes/[id]/findings/[findingId]` | Remove finding from theme |

### Impact Calculation
| Method | Path | Description |
|--------|------|-------------|
| POST   | `/api/impact/calculate` | Calculate impact from base, adjustment, confidence |

---

## Pages

| Path | Description | Key Components |
|------|-------------|----------------|
| `/` | Dashboard -- summary stats, recent findings, priority matrix overview | StatsCards, RecentFindings, MiniMatrix |
| `/findings` | Findings list -- filterable by workstream, severity, status | FindingCard, FilterBar, WorkstreamTabs |
| `/findings/[id]` | Finding detail -- evidence, linked findings, themes | EvidenceList, LinkedFindings, ThemeBadges |
| `/findings/new` | Create finding form | FindingForm, EvidenceAdder |
| `/recommendations` | Recommendations list + priority matrix view | RecommendationCard, PriorityMatrix, FilterBar |
| `/recommendations/[id]` | Recommendation detail -- findings, impact calc | ImpactCalculator, SupportingFindings |
| `/recommendations/new` | Create recommendation form | RecommendationForm, FindingPicker |
| `/themes` | Theme view -- findings grouped by theme | ThemeCard, FindingsByTheme |

---

## Components

### Layout
- `Sidebar` -- Navigation sidebar with links to all pages

### Finding Components
- `FindingCard` -- Card displaying finding title, workstream badge, severity badge, tags
- `FindingForm` -- Form for creating/editing findings
- `EvidenceList` -- List of evidence items on a finding
- `EvidenceAdder` -- Form to add evidence to a finding
- `LinkedFindings` -- List of cross-referenced findings with link descriptions

### Recommendation Components
- `RecommendationCard` -- Card with title, type badge, impact estimate, effort/timeframe
- `RecommendationForm` -- Form for creating/editing recommendations with finding picker
- `ImpactCalculator` -- Interactive calculator: base amount, adjustment %, confidence, computed values
- `FindingPicker` -- Multi-select for linking findings to a recommendation
- `PriorityMatrix` -- 2x2 grid (impact vs effort) with recommendation dots

### Shared Components
- `SeverityBadge` -- Color-coded badge for severity levels
- `WorkstreamBadge` -- Color-coded badge for workstream type
- `StatusBadge` -- Badge for finding/recommendation status
- `FilterBar` -- Filter controls for list views
- `ThemeBadge` -- Colored badge for theme assignment

---

## Business Logic

### Impact Calculation
```
calculatedImpact = impactBase * (impactAdjPct / 100)
confidenceMultiplier = { High: 1.0, Medium: 0.7, Low: 0.4 }
weightedImpact = calculatedImpact * confidenceMultiplier[impactConfidence]
effortDivisor = { Low: 1, Medium: 2, High: 3 }
priorityScore = weightedImpact / effortDivisor[effort]
```

### Priority Matrix Quadrant Assignment
```
impactThreshold = median of all weighted impacts
effortMapping: Low = 1, Medium = 2, High = 3
effortThreshold = 2

High Impact + Low Effort = "Quick Win"
High Impact + High Effort = "Strategic Initiative"
Low Impact + Low Effort = "Fill-in"
Low Impact + High Effort = "Deprioritize"
```

### Severity Color Mapping
- Critical: red-700
- High: red-500
- Medium: yellow-500
- Low: blue-500
- Informational: gray-400

### Workstream Color Mapping
- Financial: emerald-600
- Organizational: purple-600
- Contracts: amber-600
- CrossCutting: indigo-600

---

## Key Decisions

1. **SQLite for dev** -- Consistent with Financial Analyzer. PostgreSQL for production later.
2. **Bidirectional links stored once** -- FindingLink stores from/to. Query both directions in the API.
3. **Impact fields on Recommendation** -- Rather than a separate ImpactEstimate model, keep impact fields directly on Recommendation for simplicity.
4. **Tags as comma-separated string** -- SQLite lacks array types. Parse on read, join on write.
5. **Theme-Finding as join table** -- Many-to-many; a finding can belong to multiple themes.
6. **Priority matrix uses CSS grid** -- No chart library dependency for the 2x2 matrix. Recharts only if we add the scatter plot variant later.
