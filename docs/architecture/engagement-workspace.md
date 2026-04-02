# Architecture: Engagement Workspace

> Author: Architect
> Date: 2026-04-02
> Status: APPROVED
> Spec: `docs/specs/engagement-workspace.md`

---

## Overview

The Engagement Workspace is a Next.js app in `apps/engagement-workspace/` that provides the central hub for managing assessment engagements. It follows the same patterns as the Financial Analyzer — standalone Next.js 14 app with Prisma (SQLite), Tailwind CSS, and App Router.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14 (App Router) | Server components by default, client components for interactive UI |
| Language | TypeScript (strict) | Shared tsconfig pattern from financial-analyzer |
| Styling | Tailwind CSS 3.4 | Utility-first, consistent with financial-analyzer |
| Database | SQLite via Prisma 5 | Portable dev DB; same approach as financial-analyzer |
| Validation | Zod | Runtime schema validation at API boundaries |
| Testing | Vitest | Unit tests for schemas, logic, utilities |

## Data Model (Prisma Schema)

```prisma
model Engagement {
  id               String   @id @default(cuid())
  name             String
  clientName       String
  type             String   // DueDiligence, OrgAssessment, ContractReview, OperationalAssessment, CostOptimization
  status           String   @default("Scoping") // Scoping, DataCollection, Analysis, Synthesis, Reporting, Complete
  startDate        DateTime
  endDate          DateTime?
  scopeDescription String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  dataRequests     DataRequest[]
  documents        Document[]
  teamMembers      TeamMember[]
  activities       Activity[]
}

model DataRequest {
  id             String    @id @default(cuid())
  engagementId   String
  category       String    // Financial, Organizational, Contracts, Operational, Legal, IT
  description    String
  priority       String    @default("Medium") // Critical, High, Medium, Low
  status         String    @default("Requested") // Requested, Received, PartiallyReceived, Overdue, NotAvailable
  requestedDate  DateTime  @default(now())
  dueDate        DateTime?
  receivedDate   DateTime?
  notes          String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  engagement     Engagement @relation(fields: [engagementId], references: [id], onDelete: Cascade)
  documents      Document[]

  @@index([engagementId])
  @@index([category])
  @@index([status])
}

model Document {
  id             String   @id @default(cuid())
  engagementId   String
  dataRequestId  String?
  fileName       String
  fileType       String   // PDF, Excel, CSV, Word, Image, Other
  fileSize       Int      @default(0)
  category       String   // FinancialStatement, OrgChart, Contract, Policy, HRData, Other
  entity         String?
  period         String?
  status         String   @default("Pending") // Pending, Reviewed, Extracted, Flagged
  tags           String?  // JSON array stored as string
  uploadedAt     DateTime @default(now())

  engagement     Engagement   @relation(fields: [engagementId], references: [id], onDelete: Cascade)
  dataRequest    DataRequest? @relation(fields: [dataRequestId], references: [id])

  @@index([engagementId])
  @@index([category])
  @@index([dataRequestId])
}

model TeamMember {
  id             String   @id @default(cuid())
  engagementId   String
  name           String
  role           String   // Lead, Financial Analyst, Org Consultant, Contract Specialist, Associate
  email          String?
  createdAt      DateTime @default(now())

  engagement     Engagement @relation(fields: [engagementId], references: [id], onDelete: Cascade)

  @@index([engagementId])
}

model Activity {
  id             String   @id @default(cuid())
  engagementId   String
  type           String   // engagement_created, status_changed, data_request_added, data_request_updated, document_uploaded, team_member_added
  description    String
  metadata       String?  // JSON string with additional details
  createdAt      DateTime @default(now())

  engagement     Engagement @relation(fields: [engagementId], references: [id], onDelete: Cascade)

  @@index([engagementId])
  @@index([createdAt])
}
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/engagements` | List all engagements with counts |
| POST | `/api/engagements` | Create new engagement |
| GET | `/api/engagements/[id]` | Get engagement with all relations |
| PUT | `/api/engagements/[id]` | Update engagement details |
| GET | `/api/engagements/[id]/data-requests` | List data requests (filterable) |
| POST | `/api/engagements/[id]/data-requests` | Create data request |
| PUT | `/api/engagements/[id]/data-requests/[requestId]` | Update data request |
| POST | `/api/engagements/[id]/data-requests/bulk-update` | Bulk status update |
| GET | `/api/engagements/[id]/documents` | List documents (filterable) |
| POST | `/api/engagements/[id]/documents` | Create document record |
| PUT | `/api/engagements/[id]/documents/[docId]` | Update document |
| GET | `/api/engagements/[id]/team` | List team members |
| POST | `/api/engagements/[id]/team` | Add team member |
| DELETE | `/api/engagements/[id]/team/[memberId]` | Remove team member |
| GET | `/api/engagements/[id]/activities` | Get activity feed |

## Pages

| Route | Description | Components |
|-------|-------------|------------|
| `/` | Engagement list | EngagementCard, StatusBadge, ProgressBar |
| `/engagements/new` | Create engagement form | EngagementForm |
| `/engagements/[id]` | Engagement detail with tabs | TabNav, OverviewTab, DataRequestsTab, DocumentsTab, TeamTab, ActivityTab |
| `/engagements/[id]/edit` | Edit engagement form | EngagementForm |

## Component Architecture

```
components/
├── layout/
│   └── sidebar.tsx              # App navigation
├── ui/
│   ├── status-badge.tsx         # Color-coded status badges
│   ├── progress-bar.tsx         # Data request completion progress
│   ├── priority-badge.tsx       # Priority indicator (Critical/High/Medium/Low)
│   └── tab-nav.tsx              # Tab navigation component
├── engagements/
│   ├── engagement-card.tsx      # Card for engagement list
│   ├── engagement-form.tsx      # Create/edit form
│   ├── engagement-header.tsx    # Detail page header with status
│   └── workstream-cards.tsx     # 3 workstream status cards
├── data-requests/
│   ├── data-request-table.tsx   # Filterable, sortable table
│   ├── data-request-form.tsx    # Add/edit data request modal
│   ├── data-request-filters.tsx # Category/status/priority filters
│   └── bulk-actions.tsx         # Bulk status update controls
├── documents/
│   ├── document-grid.tsx        # Document cards by category
│   └── document-form.tsx        # Upload/create document modal
├── team/
│   ├── team-list.tsx            # Team member list
│   └── team-form.tsx            # Add team member
└── activity/
    └── activity-feed.tsx        # Timestamped activity list
```

## Key Decisions

1. **Separate database from Financial Analyzer** — Each app has its own SQLite DB. Future integration will use API calls, not shared DBs.
2. **Activity log via DB, not events** — Simple Activity model in the database. API routes create activity records when mutations happen. No event bus needed for MVP.
3. **Document metadata only** — No actual file storage. Documents are metadata records simulating upload. Real file upload is a future feature.
4. **Client-side tabs** — Engagement detail uses client-side tab navigation (URL hash or search params) to avoid full page reloads.
5. **Workstream progress calculated** — Workstream cards derive progress from data request categories. Financial workstream = data requests with category "Financial".
