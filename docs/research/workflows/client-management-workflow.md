# Workflow Analysis: Client & Engagement Management

> Produced by: Business Analyst
> Date: 2026-04-02
> Feature: Client Hub

## Current State Workflow

### How consultants manage client information today

```
┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  New client lead  │────▶│  Add to personal │────▶│  Email contacts  │
│  comes in         │     │  spreadsheet     │     │  to team         │
└──────────────────┘     └─────────────────┘     └──────────────────┘
                                                          │
                         ┌─────────────────┐              ▼
                         │  Information     │◀──── ┌──────────────────┐
                         │  becomes stale   │      │  Others copy to  │
                         └─────────────────┘      │  their own sheets│
                                                   └──────────────────┘
```

### Pain Points in Current Workflow

1. **No single source of truth** — Each consultant has their own version of client data
2. **Manual synchronization** — Updates are communicated by email or Slack, often missed
3. **No engagement lifecycle tracking** — Status changes aren't captured systematically
4. **Contact info scattered** — Business cards, email signatures, LinkedIn, personal notes
5. **No historical context** — When revisiting a client, past engagement history is lost

## Proposed Workflow (with Client Hub)

### Client Lifecycle

```
[Prospect] ──▶ [Active] ──▶ [Inactive]
    │              │              │
    ▼              ▼              ▼
 Add basic      Full profile   Archived but
 info + key     with all       searchable for
 contact        engagements    future reference
```

### Engagement Lifecycle (within Client Hub)

```
[Lead] ──▶ [Proposal] ──▶ [Active] ──▶ [Delivered] ──▶ [Closed]
  │            │             │              │              │
  ▼            ▼             ▼              ▼              ▼
Capture      Link to       Track team,   Mark final    Collect
opportunity  proposal      budget,       deliverables  lessons
details      doc           timeline                    learned
```

### Core User Flows

#### Flow 1: Add a New Client
1. User clicks "New Client"
2. Enters client name (required) and optional fields (industry, website, notes)
3. Adds primary contact (name, email, role)
4. Client appears in the client list immediately
5. Total time: < 60 seconds

#### Flow 2: Find Client Information
1. User types in global search bar
2. Results show matching clients, contacts, and engagements
3. User clicks result to view full detail
4. Total time: < 10 seconds

#### Flow 3: Create an Engagement
1. User navigates to a client page
2. Clicks "New Engagement"
3. Enters engagement name, type (T&M/Fixed/Retainer), status, dates
4. Optionally adds team members and budget
5. Engagement appears on client page and in global engagement list

#### Flow 4: Review Engagement Pipeline
1. User views engagements list
2. Filters by status (Lead, Proposal, Active, Delivered, Closed)
3. Sees summary cards with client name, engagement name, dates, team size
4. Clicks through to engagement detail

## Functional Requirements

### Client Management
| ID | Requirement | Priority |
|----|------------|----------|
| FR-C01 | Create a client with name (required), industry, website, notes | Must Have |
| FR-C02 | Edit client details | Must Have |
| FR-C03 | Set client status (Prospect, Active, Inactive) | Must Have |
| FR-C04 | View list of all clients with search and filter | Must Have |
| FR-C05 | View client detail page with contacts and engagements | Must Have |
| FR-C06 | Delete/archive a client (soft delete) | Should Have |

### Contact Management
| ID | Requirement | Priority |
|----|------------|----------|
| FR-CT01 | Add contacts to a client (name, email, phone, role) | Must Have |
| FR-CT02 | Mark one contact as primary | Must Have |
| FR-CT03 | Edit and remove contacts | Must Have |
| FR-CT04 | Search contacts across all clients | Should Have |

### Engagement Management
| ID | Requirement | Priority |
|----|------------|----------|
| FR-E01 | Create an engagement linked to a client | Must Have |
| FR-E02 | Set engagement type (T&M, Fixed Fee, Retainer, Value-Based) | Must Have |
| FR-E03 | Set engagement status (Lead, Proposal, Active, Delivered, Closed) | Must Have |
| FR-E04 | Set start/end dates and budget | Should Have |
| FR-E05 | View list of all engagements with filter by status | Must Have |
| FR-E06 | View engagement detail page | Must Have |

### Dashboard / Overview
| ID | Requirement | Priority |
|----|------------|----------|
| FR-D01 | Dashboard showing summary stats (total clients, active engagements) | Should Have |
| FR-D02 | Recently viewed clients/engagements | Should Have |
| FR-D03 | Global search across clients, contacts, engagements | Must Have |

## Data Requirements

### Entity Relationships for Client Hub Scope
```
Client (1) ──── (N) Contact
Client (1) ──── (N) Engagement
```

### Data Validations
- Client name: required, unique recommended, max 200 characters
- Contact email: valid email format when provided
- Engagement dates: end date must be after start date
- Budget: non-negative number
- Hours in 0.25 increments (for future Time Tracker integration)

## Business Rules

1. A client must have at least a name to be created
2. Each client can have zero or more contacts; one can be marked primary
3. Engagements must belong to exactly one client
4. Engagement status transitions should follow the lifecycle (Lead -> Proposal -> Active -> Delivered -> Closed), but allow skipping states
5. Deleting a client should be a soft delete (archive) to preserve referential integrity
6. Client status auto-updates: if any engagement is Active, the client is Active

## Integration Points

- **Time Tracker** (future) — will need engagementId to log time against
- **Billing** (future) — will need client + engagement + budget data
- **Knowledge Base** (future) — will link deliverables to engagements
- **Resource Planner** (future) — will need engagement team assignments

## Metrics & KPIs

| Metric | Definition | Target |
|--------|-----------|--------|
| Time to find client info | From search initiation to viewing client detail | < 5 seconds |
| Client data completeness | % of clients with industry, contacts, and active engagements filled | > 70% after 30 days |
| Engagement pipeline accuracy | % of engagements with correct current status | > 90% |
| Adoption rate | % of consultants using Client Hub weekly | > 80% after 60 days |
