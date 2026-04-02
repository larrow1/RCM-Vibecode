# Feature Spec: Client Hub

> Author: Product Manager
> Date: 2026-04-02
> Status: Approved
> Based on: [Research Findings](../research/findings/client-hub-research.md), [Workflow Analysis](../research/workflows/client-management-workflow.md)

## Problem Statement

Consulting teams have no single source of truth for client information. Client details, contact information, and engagement status are scattered across personal spreadsheets, email threads, and individual memory. This leads to:

- **20-30 minutes/week** per consultant wasted finding client info
- Embarrassing moments when reaching out to wrong contacts
- Partners learning about at-risk engagements weeks too late
- New team members with no way to get up to speed on client context

## User Story

> As a **consultant**, I want a **central hub for all client, contact, and engagement information** so I can **quickly find what I need before client interactions and maintain an accurate pipeline view**.

## Scope

### In Scope (MVP)

1. **Client CRUD** -- Create, view, edit, and archive clients
2. **Contact Management** -- Add/edit/remove contacts linked to clients, mark primary
3. **Engagement CRUD** -- Create, view, edit engagements linked to clients
4. **Client List** -- Searchable, filterable list of all clients
5. **Engagement List** -- Filterable by status (pipeline view)
6. **Client Detail Page** -- Shows client info, contacts, and engagements
7. **Engagement Detail Page** -- Shows engagement info with client context
8. **Global Search** -- Search across clients, contacts, and engagements
9. **Dashboard** -- Summary stats (total clients, active engagements, pipeline)

### Out of Scope (Future)

- Team member assignment to engagements (Resource Planner feature)
- Time entry on engagements (Time Tracker feature)
- Budget burn tracking (Billing feature)
- File/document attachments
- Activity log / audit trail
- User authentication (will use seed data for now)

## Acceptance Criteria

### Clients

- [ ] Can create a client with just a name (all other fields optional)
- [ ] Can set client status: Prospect, Active, Inactive
- [ ] Can edit all client fields after creation
- [ ] Can archive (soft-delete) a client
- [ ] Client list shows name, industry, status, number of engagements
- [ ] Can search clients by name
- [ ] Can filter client list by status

### Contacts

- [ ] Can add a contact to a client with name, email, phone, role
- [ ] Can mark one contact as primary per client
- [ ] Can edit and remove contacts
- [ ] Contacts display on the client detail page

### Engagements

- [ ] Can create an engagement linked to a client
- [ ] Can set type: T&M, Fixed Fee, Retainer, Value-Based
- [ ] Can set status: Lead, Proposal, Active, Delivered, Closed
- [ ] Can set start date, end date, budget, description
- [ ] Engagement list shows name, client, type, status, dates
- [ ] Can filter engagements by status
- [ ] Engagement detail page shows all fields with link back to client

### Dashboard

- [ ] Shows total number of clients by status
- [ ] Shows total number of engagements by status
- [ ] Shows recently viewed items (up to 5)

### Search

- [ ] Global search bar in the header/navigation
- [ ] Searches across client names, contact names/emails, engagement names
- [ ] Results grouped by entity type
- [ ] Click result to navigate to detail page

## Data Model

References `docs/domain-model.md`. For this MVP, we need:

- **Client**: id, name, industry, website, notes, status (Prospect/Active/Inactive), createdAt, updatedAt, archivedAt
- **Contact**: id, clientId (FK), name, email, phone, role, isPrimary, createdAt, updatedAt
- **Engagement**: id, clientId (FK), name, description, type (enum), status (enum), startDate, endDate, budget, createdAt, updatedAt

## Page Structure

```
/                     -- Dashboard (summary stats, recent items)
/clients              -- Client list (search + filter)
/clients/new          -- Create client form
/clients/[id]         -- Client detail (info + contacts + engagements)
/clients/[id]/edit    -- Edit client form
/engagements          -- Engagement list (filter by status)
/engagements/new      -- Create engagement form (with client selector)
/engagements/[id]     -- Engagement detail
/engagements/[id]/edit -- Edit engagement form
```

## UI/UX Guidelines

- **Navigation**: Sidebar with links to Dashboard, Clients, Engagements
- **Search**: Global search bar in the top nav, always accessible
- **Speed**: Pages should feel instant; use optimistic updates
- **Mobile**: Responsive; list views stack to single-column on mobile
- **Forms**: Minimal required fields, clear labels, inline validation
- **Empty states**: Helpful messages when no data exists, with CTAs to create

## Dependencies

- None (this is the foundation)

## Risks

1. **Data migration**: Consultants have existing spreadsheet data. Future: CSV import.
2. **Adoption**: Must be faster than spreadsheets or consultants won't switch.
3. **Scope creep**: Easy to add "just one more field." Stay disciplined on MVP.

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to find client info | < 5 seconds via search |
| Client creation time | < 60 seconds |
| Engagement pipeline accuracy | > 90% of engagements have correct status |
| Weekly active usage | > 80% of consultants after 60 days |
