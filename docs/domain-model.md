# Domain Model: Assessment Consultant Platform

> Core business entities for the assessment consultant platform. Maintained by the Business Analyst, referenced by Architect and Developer.

## Entity Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Engagement  │────▶│ DataRequest  │────▶│   Document   │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │         ┌───────────────────────────────┤
       │         ▼                ▼               ▼
       │  ┌──────────────┐ ┌──────────┐  ┌──────────────┐
       │  │  Financial   │ │   Org    │  │   Contract   │
       │  │  Statement   │ │  Unit    │  │              │
       │  └──────┬───────┘ └────┬─────┘  └──────┬───────┘
       │         │              │                │
       │         ▼              ▼                ▼
       │  ┌──────────────────────────────────────────┐
       ├─▶│              Finding                      │
       │  └──────────────────┬───────────────────────┘
       │                     │
       │                     ▼
       │  ┌──────────────────────────────────────────┐
       ├─▶│           Recommendation                  │
       │  └──────────────────┬───────────────────────┘
       │                     │
       │                     ▼
       │  ┌──────────────────────────────────────────┐
       └─▶│            Deliverable                    │
          └──────────────────────────────────────────┘
```

---

## Core Entities

### Engagement
The assessment project — the top-level container for all work.
- `id` — Unique identifier
- `name` — Engagement name (e.g., "Acme Corp Financial Due Diligence")
- `clientName` — Client organization name
- `type` — DueDiligence, OrgAssessment, ContractReview, OperationalAssessment, CostOptimization
- `status` — Scoping, DataCollection, Analysis, Synthesis, Reporting, Complete
- `startDate` — Engagement start
- `endDate` — Target completion
- `scopeDescription` — What's in scope (entities, periods, domains)
- `teamMembers[]` — Consultants assigned with roles
- `dataRequests[]` — Items requested from the client
- `findings[]` — Analytical observations
- `recommendations[]` — Proposed actions
- `deliverables[]` — Output documents

### DataRequest
A specific item of information requested from the client.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `category` — Financial, Organizational, Contracts, Operational, Legal, IT
- `description` — What's being requested (e.g., "P&L by month for FY2023-FY2025")
- `priority` — Critical, High, Medium, Low
- `status` — Requested, Received, PartiallyReceived, Overdue, NotAvailable
- `requestedDate` — When the request was sent
- `dueDate` — When the item is needed
- `receivedDate` — When it was received (null if outstanding)
- `documents[]` — Documents received that fulfill this request
- `notes` — Follow-up context or client responses

### Document
A source document received from the client or created during the engagement.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `dataRequestId` — Which request this fulfills (nullable)
- `fileName` — Original file name
- `fileType` — PDF, Excel, CSV, Word, Image, Other
- `category` — FinancialStatement, OrgChart, Contract, Policy, HRData, Other
- `entity` — Which business entity this relates to (nullable)
- `period` — Time period covered (nullable, e.g., "FY2024", "Q3 2025")
- `uploadedAt` — When it was received
- `status` — Pending, Reviewed, Extracted, Flagged
- `tags[]` — Free-form categorization tags
- `extractedData` — Reference to structured data extracted from this document

### FinancialStatement
Structured financial data extracted from source documents.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `documentId` — Source document
- `entity` — Business entity name
- `statementType` — ProfitAndLoss, BalanceSheet, CashFlow, TrialBalance
- `period` — Fiscal period (e.g., "2024-01" for monthly, "FY2024" for annual)
- `periodType` — Monthly, Quarterly, Annual
- `currency` — Currency code
- `lineItems[]` — Array of { accountCode, accountName, category, subcategory, amount }
- `isNormalized` — Whether normalization adjustments have been applied
- `adjustments[]` — Normalization adjustments applied (nullable)

### FinancialLineItem
A single line in a financial statement.
- `id` — Unique identifier
- `financialStatementId` — Parent statement
- `accountCode` — Client's account code
- `accountName` — Account description
- `standardCategory` — Mapped to standard taxonomy (Revenue, COGS, OpEx, etc.)
- `subcategory` — More specific classification
- `amount` — Value in original currency
- `isRecurring` — Whether this is a recurring item
- `notes` — Analyst notes on this line

### OrgUnit
A node in the organizational structure.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `name` — Unit name (department, team, or individual)
- `type` — Division, Department, Team, Role
- `parentId` — Parent org unit (null for root)
- `level` — Hierarchy depth (0 = CEO, 1 = C-suite, etc.)
- `headcount` — Number of FTEs (for departments/teams)
- `totalCompensation` — Total labor cost
- `averageCompensation` — Average per head
- `managerName` — Manager/leader name
- `managerTitle` — Manager/leader title
- `directReports` — Count of direct reports (for span-of-control analysis)
- `children[]` — Child org units
- `findings[]` — Linked findings

### Contract
A contract record with extracted key terms.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `documentId` — Source document
- `title` — Contract name or description
- `contractType` — Vendor, Customer, Lease, Employment, Partnership, Licensing, Other
- `counterparty` — The other party
- `status` — Active, Expired, PendingRenewal, Terminated, Draft
- `effectiveDate` — Start date
- `expirationDate` — End date
- `totalValue` — Contract value (annual or total)
- `annualValue` — Annualized value
- `currency` — Currency code
- `autoRenewal` — Whether it auto-renews
- `renewalNoticeDays` — Days notice required to terminate/not renew
- `terminationProvisions` — Summary of termination clauses
- `keyTerms[]` — Array of { termType, description, riskLevel }
- `obligations[]` — Array of { description, dueDate, responsible }
- `riskScore` — Assessed risk level (1-5)
- `riskNotes` — Why this risk score
- `findings[]` — Linked findings

### Finding
An analytical observation or issue identified during assessment.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `workstream` — Financial, Organizational, Contracts, CrossCutting
- `category` — Risk, Opportunity, Observation, Anomaly
- `severity` — Critical, High, Medium, Low, Informational
- `title` — Short description (e.g., "Gross margin declined 8pp over 3 years")
- `description` — Detailed explanation of what was found
- `evidence[]` — Links to supporting data (documents, financial line items, org units, contracts)
- `financialImpact` — Estimated dollar impact (nullable)
- `tags[]` — Thematic tags (e.g., "cost-structure", "staffing", "vendor-risk")
- `status` — Draft, Confirmed, Disputed, Resolved
- `linkedFindings[]` — Related findings in other workstreams
- `recommendations[]` — Recommendations that address this finding
- `createdBy` — Which consultant identified this
- `createdAt` — When it was identified

### Recommendation
A proposed action based on assessment findings.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `title` — Action title (e.g., "Consolidate IT vendor contracts to achieve volume pricing")
- `description` — Detailed explanation of what to do and why
- `type` — CostReduction, RevenueEnhancement, RiskMitigation, OperationalImprovement, StructuralChange
- `findings[]` — Supporting findings (evidence)
- `estimatedImpact` — Dollar value of expected benefit
- `impactConfidence` — High, Medium, Low
- `effort` — Low, Medium, High (implementation effort)
- `timeframe` — QuickWin (0-3mo), ShortTerm (3-6mo), MediumTerm (6-12mo), LongTerm (12mo+)
- `priority` — Computed from impact × confidence ÷ effort
- `risks` — Implementation risks
- `dependencies` — What else must happen first
- `status` — Draft, Reviewed, Approved, Presented

### Deliverable
An output document produced by the engagement.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `title` — Document title
- `type` — ExecutiveSummary, FullReport, PresentationDeck, DataAppendix, ContractRegister, OrgChart
- `status` — Draft, InReview, Final, Delivered
- `sections[]` — Array of { title, content, findings[], recommendations[], charts[] }
- `version` — Version number
- `lastUpdated` — Last modification time
- `reviewComments[]` — Feedback from reviewers

### Benchmark
Industry or peer comparison data used for analysis.
- `id` — Unique identifier
- `metric` — What's being measured (e.g., "Gross Margin", "Revenue per Employee")
- `industry` — Industry vertical
- `source` — Where this benchmark comes from
- `percentile25` — 25th percentile value
- `median` — Median value
- `percentile75` — 75th percentile value
- `year` — Year of the benchmark data
- `notes` — Context or caveats

---

## Key Relationships

- An **Engagement** is the root container — everything belongs to one engagement
- **DataRequests** track what's needed; **Documents** fulfill requests
- **Documents** are the raw source; structured data is extracted into **FinancialStatements**, **OrgUnits**, and **Contracts**
- **Findings** are produced from analysis of structured data; they link back to evidence (financial line items, org units, contracts)
- **Recommendations** are supported by one or more **Findings**
- **Deliverables** are composed from **Findings** and **Recommendations**
- **Benchmarks** provide external reference points for financial and org analysis

---

## Business Rules

1. Every **Finding** must link to at least one piece of evidence (document, financial data, org unit, or contract)
2. Every **Recommendation** must link to at least one **Finding** — no unsupported recommendations
3. **Financial impact estimates** on recommendations should document their calculation methodology
4. **Data requests** overdue by more than 5 business days should be escalated automatically
5. **Contract risk scores** are assessed on a 1-5 scale: 1=Minimal, 2=Low, 3=Moderate, 4=High, 5=Critical
6. **Findings** marked as Cross-Cutting must link to findings in at least 2 different workstreams
7. **Engagement status** transitions follow the phase sequence: Scoping → DataCollection → Analysis → Synthesis → Reporting → Complete
8. **Financial normalization adjustments** must include a description and classification (non-recurring, owner-related, non-operating, etc.)
