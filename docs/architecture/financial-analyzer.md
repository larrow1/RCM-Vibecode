# Technical Design: Financial Analyzer

> Author: Architect
> Date: 2026-04-02
> Status: APPROVED
> Spec: `docs/specs/financial-analyzer.md`

---

## Overview

The Financial Analyzer is a Next.js 14 application using the App Router, deployed as `apps/financial-analyzer/` in the monorepo. It provides financial statement import, normalization, ratio analysis, trend visualization, EBITDA adjustments, and findings capture for assessment engagements.

---

## Component Architecture

```
apps/financial-analyzer/
  app/
    layout.tsx                    # Root layout with navigation
    page.tsx                      # Dashboard -- engagement list with metrics
    globals.css                   # Tailwind globals
    engagements/
      [id]/
        page.tsx                  # Engagement detail -- financial overview
        import/
          page.tsx                # File upload + column mapping + taxonomy
        analysis/
          page.tsx                # Ratio dashboard + trend charts
        findings/
          page.tsx                # Findings list for engagement
          [findingId]/
            page.tsx              # Finding detail with evidence
    api/
      engagements/
        route.ts                  # GET list, POST create
        [id]/
          route.ts                # GET detail, PATCH update
      financial-statements/
        route.ts                  # POST create (from import)
        [id]/
          route.ts                # GET, DELETE
      line-items/
        route.ts                  # GET (filtered by statement), PATCH (update mapping)
        bulk-update/
          route.ts                # PATCH bulk taxonomy mapping
      findings/
        route.ts                  # GET list, POST create
        [id]/
          route.ts                # GET detail, PATCH update, DELETE
      analysis/
        ratios/
          route.ts                # GET computed ratios for engagement
        trends/
          route.ts                # GET trend data for charting
      import/
        parse/
          route.ts                # POST upload file, return parsed preview
        confirm/
          route.ts                # POST confirm import, create records
  components/
    layout/
      sidebar.tsx                 # Navigation sidebar
      header.tsx                  # Page header
    dashboard/
      engagement-card.tsx         # Summary card for an engagement
      metrics-summary.tsx         # Key financial metrics
    import/
      file-upload.tsx             # Drag-and-drop file upload
      data-preview.tsx            # Preview parsed data in table
      taxonomy-mapper.tsx         # Map accounts to standard categories
    analysis/
      ratio-card.tsx              # Single ratio with traffic light
      ratio-dashboard.tsx         # Grid of ratio cards
      trend-chart.tsx             # Recharts line/bar chart
      period-selector.tsx         # Select periods to compare
      ebitda-bridge.tsx           # EBITDA normalization table
    findings/
      finding-card.tsx            # Finding summary in list
      finding-form.tsx            # Create/edit finding
      evidence-link.tsx           # Display linked financial evidence
    shared/
      data-table.tsx              # Reusable data table
      badge.tsx                   # Status/severity badge
      card.tsx                    # Card container
  lib/
    prisma.ts                     # Prisma client singleton
    financial-utils.ts            # Ratio calculations, formatting
    import-parser.ts              # Excel/CSV parsing logic
    taxonomy.ts                   # Standard taxonomy definition + matching
    validations.ts                # Zod schemas
  prisma/
    schema.prisma                 # Database schema
    seed.ts                       # Seed data generator
```

---

## Database Schema (Prisma)

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
  type             String   // DueDiligence, OrgAssessment, etc.
  status           String   @default("Analysis") // Scoping, DataCollection, Analysis, Synthesis, Reporting, Complete
  startDate        DateTime
  endDate          DateTime?
  scopeDescription String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  financialStatements FinancialStatement[]
  findings            Finding[]
  benchmarks          Benchmark[]
}

model FinancialStatement {
  id            String   @id @default(cuid())
  engagementId  String
  entity        String   // Business entity name
  statementType String   // ProfitAndLoss, BalanceSheet, CashFlow
  period        String   // e.g., "2024-01" for monthly
  periodType    String   // Monthly, Quarterly, Annual
  currency      String   @default("USD")
  sourceFileName String?
  isNormalized  Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  engagement Engagement         @relation(fields: [engagementId], references: [id])
  lineItems  FinancialLineItem[]

  @@index([engagementId])
  @@index([entity, period])
}

model FinancialLineItem {
  id                   String  @id @default(cuid())
  financialStatementId String
  accountCode          String?
  accountName          String
  standardCategory     String? // Mapped taxonomy category
  subcategory          String?
  amount               Float
  isRecurring          Boolean @default(true)
  notes                String?
  sortOrder            Int     @default(0)

  financialStatement FinancialStatement @relation(fields: [financialStatementId], references: [id], onDelete: Cascade)
  evidenceForFindings FindingEvidence[]

  @@index([financialStatementId])
  @@index([standardCategory])
}

model Finding {
  id              String   @id @default(cuid())
  engagementId    String
  workstream      String   @default("Financial") // Financial, Organizational, Contracts, CrossCutting
  category        String   // Risk, Opportunity, Observation, Anomaly
  severity        String   // Critical, High, Medium, Low, Informational
  title           String
  description     String
  financialImpact Float?
  tags            String?  // Comma-separated tags
  status          String   @default("Draft") // Draft, Confirmed, Disputed, Resolved
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  engagement Engagement       @relation(fields: [engagementId], references: [id])
  evidence   FindingEvidence[]

  @@index([engagementId])
  @@index([severity])
  @@index([status])
}

model FindingEvidence {
  id        String @id @default(cuid())
  findingId String
  lineItemId String

  finding  Finding            @relation(fields: [findingId], references: [id], onDelete: Cascade)
  lineItem FinancialLineItem  @relation(fields: [lineItemId], references: [id])

  @@index([findingId])
  @@index([lineItemId])
}

model Benchmark {
  id           String @id @default(cuid())
  engagementId String?
  metric       String  // e.g., "Gross Margin", "Operating Margin"
  industry     String
  source       String
  percentile25 Float
  median       Float
  percentile75 Float
  year         Int
  notes        String?

  engagement Engagement? @relation(fields: [engagementId], references: [id])

  @@index([metric, industry])
}

model EbitdaAdjustment {
  id             String   @id @default(cuid())
  engagementId   String
  description    String
  amount         Float
  classification String   // NonRecurring, OwnerRelated, NonOperating, RunRate, ProForma, Other
  notes          String?
  lineItemId     String?  // Optional link to source line item
  createdAt      DateTime @default(now())

  @@index([engagementId])
}
```

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/engagements` | List all engagements with summary metrics |
| POST | `/api/engagements` | Create a new engagement |
| GET | `/api/engagements/[id]` | Get engagement detail with stats |
| PATCH | `/api/engagements/[id]` | Update engagement fields |
| POST | `/api/import/parse` | Upload file, return parsed preview (no DB write) |
| POST | `/api/import/confirm` | Confirm import, create FinancialStatement + LineItems |
| GET | `/api/financial-statements` | List statements (filter by engagementId) |
| GET | `/api/financial-statements/[id]` | Get statement with line items |
| DELETE | `/api/financial-statements/[id]` | Delete statement and its line items |
| GET | `/api/line-items` | List line items (filter by statementId, category) |
| PATCH | `/api/line-items/bulk-update` | Bulk update standardCategory mappings |
| GET | `/api/analysis/ratios?engagementId=X` | Compute and return ratios |
| GET | `/api/analysis/trends?engagementId=X&metric=Y` | Trend data for charting |
| GET | `/api/findings` | List findings (filter by engagementId, severity, status) |
| POST | `/api/findings` | Create finding with evidence links |
| GET | `/api/findings/[id]` | Get finding with evidence |
| PATCH | `/api/findings/[id]` | Update finding |
| DELETE | `/api/findings/[id]` | Delete finding |

---

## File Upload and Parsing Approach

1. **Client-side**: User selects file via drag-and-drop or file picker
2. **Upload**: File sent as FormData to `/api/import/parse`
3. **Server parsing**:
   - CSV: Use `papaparse` to parse rows
   - Excel: Use `xlsx` (SheetJS) to read workbook, extract first sheet as JSON
4. **Preview response**: Return parsed rows with detected columns to the client
5. **Column mapping**: User maps columns to fields (accountCode, accountName, and amount columns per period)
6. **Taxonomy mapping**: Each account name gets a suggested `standardCategory` from `lib/taxonomy.ts` using keyword matching
7. **Confirm**: User confirms, server creates FinancialStatement + FinancialLineItem records

---

## Chart/Visualization Approach

- **Library**: `recharts` -- React-based, composable, good TypeScript support
- **Charts used**:
  - `LineChart` for margin trends over time
  - `BarChart` for revenue/cost comparisons
  - `ComposedChart` for overlaying line + bar (revenue bars with margin line)
- **Responsive**: Charts use `ResponsiveContainer` for fluid sizing
- **Colors**: Consistent palette defined in a theme constant

---

## Key Technical Decisions

### 1. SQLite via Prisma
SQLite for local development simplicity. No database server needed. Prisma provides type-safe queries and migration support. Can swap to PostgreSQL for production by changing the datasource.

### 2. Server Components by Default
Next.js App Router with React Server Components for data-fetching pages. Client components only for interactive elements (charts, forms, file upload).

### 3. File Parsing on Server
Excel/CSV parsing happens server-side in API routes. This avoids shipping large parsing libraries to the client and ensures consistent parsing behavior.

### 4. Ratio Computation on Demand
Ratios are computed on-the-fly from stored line items rather than pre-computed and stored. This ensures ratios always reflect current data. If performance becomes an issue, we can add caching later.

### 5. Standard Taxonomy as Code
The standard taxonomy (category hierarchy) is defined as a TypeScript constant in `lib/taxonomy.ts`, not in the database. This makes it easy to update and version-control. Mappings are stored on each FinancialLineItem.

### 6. Zod for API Validation
All API inputs are validated with Zod schemas defined in `lib/validations.ts`. This provides runtime type safety and clear error messages.

---

## Performance Considerations

- **Large datasets**: A 3-year monthly P&L with 50 accounts = 1,800 line items. Well within SQLite capabilities.
- **Chart rendering**: Recharts handles hundreds of data points smoothly. For 60-month trends, we aggregate if needed.
- **File parsing**: xlsx library can handle files up to 10MB in under a second on server.

---

## Security Considerations

- File upload size limited to 10MB via API route config
- File type validation (only .xlsx, .csv accepted)
- Input sanitization via Zod on all API endpoints
- No authentication in v1 (single-user local development) -- deferred to v2
