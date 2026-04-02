# Feature Spec: Engagement Workspace

> Author: Product Manager
> Date: 2026-04-02
> Status: APPROVED
> Backlog Item: #2

---

## Problem Statement

Assessment consultants manage complex engagements involving dozens of data requests, hundreds of documents, multiple workstreams, and cross-functional teams. Today, this coordination happens across scattered Excel trackers, email threads, SharePoint folders, and ad-hoc status meetings. There is no single place to see the full picture of an engagement.

Marcus (Engagement Lead persona) spends 8:00 AM every morning trying to piece together: which data requests are outstanding, where each workstream stands, and what needs his attention. This overhead consumes 5-10% of total engagement hours.

## Target Users

**Primary**: Marcus (Engagement Lead) — Needs a command center to manage the overall engagement, track data collection progress, and coordinate workstreams.

**Secondary**: Rachel (Financial DD Lead), James (Org Consultant), Priya (Contract Specialist) — Need to see what data has arrived for their workstream, upload documents, and update status.

## User Stories

### Engagement Management
1. **As** Marcus, **I want to** create a new assessment engagement with client details, scope, type, and timeline, **so that** I have a structured container for all engagement work.
2. **As** Marcus, **I want to** see a list of all my engagements with status and key metrics, **so that** I can quickly navigate to the right engagement.
3. **As** Marcus, **I want to** see an engagement overview dashboard with status across all dimensions (data requests, documents, workstreams, team), **so that** I know where things stand at a glance.

### Data Request Tracking
4. **As** Marcus, **I want to** create a data request list for an engagement with categorized items (Financial, Org, Contracts, Operational), **so that** the client knows exactly what we need.
5. **As** Marcus, **I want to** see which data requests are Received, Outstanding, Overdue, or N/A, **so that** I can follow up on gaps efficiently.
6. **As** Rachel, **I want to** filter data requests by my workstream (Financial), **so that** I can see only the items relevant to me.
7. **As** Marcus, **I want to** bulk-update data request statuses (e.g., mark 5 items as Received at once), **so that** I can process updates quickly after a client data drop.
8. **As** Marcus, **I want to** see overdue data requests highlighted, **so that** I can escalate with the client.

### Document Intake
9. **As** Rachel, **I want to** upload documents and tag them by category (Financial, Org, Contract, Policy), **so that** they're organized for the right workstream.
10. **As** Marcus, **I want to** link uploaded documents to the data requests they fulfill, **so that** the tracker updates automatically.
11. **As** Marcus, **I want to** see all documents for an engagement organized by category, **so that** I can quickly find what I need.

### Workstream Status
12. **As** Marcus, **I want to** see at-a-glance progress for each workstream (Financial, Org, Contract), **so that** I know which areas need attention.
13. **As** Marcus, **I want to** link to the Financial Analyzer from the Financial workstream card, **so that** the workspace connects to our analysis tools.

### Team & Timeline
14. **As** Marcus, **I want to** assign team members to the engagement with their roles, **so that** everyone knows who's responsible for what.
15. **As** Marcus, **I want to** see key milestones and deadlines, **so that** I can manage the engagement timeline.

### Activity Feed
16. **As** Marcus, **I want to** see a feed of recent actions (documents uploaded, status changes, new data requests), **so that** I know what's happened since I last checked.

## Acceptance Criteria

### Engagement CRUD
- [ ] Can create an engagement with: name, clientName, type (5 types), status, startDate, endDate, scopeDescription
- [ ] Can view a list of all engagements with status badges and key counts (data requests, documents)
- [ ] Can edit engagement details
- [ ] Can transition engagement status through phases: Scoping -> DataCollection -> Analysis -> Synthesis -> Reporting -> Complete

### Data Request Tracker
- [ ] Can add data request items with: category, description, priority, status, dueDate
- [ ] Can view all data requests in a filterable, sortable table
- [ ] Can filter by category (Financial, Organizational, Contracts, Operational, Legal, IT)
- [ ] Can filter by status (Requested, Received, PartiallyReceived, Overdue, NotAvailable)
- [ ] Can filter by priority (Critical, High, Medium, Low)
- [ ] Can bulk-update status for multiple selected items
- [ ] Overdue items (past dueDate and not Received/NotAvailable) are visually highlighted
- [ ] Progress bar shows % of items Received vs total

### Document Management
- [ ] Can upload documents with metadata: fileName, fileType, category, entity, period, tags
- [ ] Can link a document to a data request
- [ ] Can view documents in a grid/list organized by category
- [ ] Can filter documents by category, file type, status

### Workstream Status
- [ ] Dashboard shows cards for Financial, Organizational, and Contract workstreams
- [ ] Each card shows: data requests received/total, documents count, overall progress
- [ ] Financial workstream card links to Financial Analyzer app

### Team Management
- [ ] Can add team members with: name, role, email
- [ ] Team members displayed on engagement detail page

### Activity Feed
- [ ] Activity log shows timestamped events: engagement created, data request status changes, documents uploaded
- [ ] Feed displayed on engagement detail page

## MVP Scope

### In Scope
- Engagement CRUD (create, read, update, list)
- Data request tracker with full CRUD, filters, bulk status update
- Document metadata management (upload simulation — store metadata, not actual files)
- Workstream status dashboard
- Team member management
- Activity feed
- Seed data with realistic engagement (20+ data requests)
- Link to Financial Analyzer from workstream card

### Out of Scope (Future)
- Actual file upload/storage (MVP tracks metadata only)
- Real-time collaboration / multi-user
- Email integration for data request sending
- Automated overdue notifications
- Template data request lists by engagement type
- Integration with Financial Analyzer's database

## Success Metrics
1. Marcus can see full engagement status in under 30 seconds (vs. 15+ minutes with Excel)
2. Data request tracking is complete — no items fall through the cracks
3. Document organization by category eliminates the "which folder is it in" problem
4. Workstream progress visible at a glance without asking each team lead

## Risks
| Risk | Mitigation |
|------|------------|
| Consultants resist yet another tool | Make it immediately useful — seed realistic data, fast onboarding |
| Data model diverges from Financial Analyzer | Reuse same Engagement entity shape; plan for future integration |
| Too many features for MVP | Strict scope — metadata-only documents, no real file storage |

## Dependencies
- Financial Analyzer (already built) — link to it from workstream card
- Domain model entities: Engagement, DataRequest, Document, TeamMember

---

## Wireframe Descriptions

### Engagement List Page (`/`)
- Header: "Engagements" with "New Engagement" button
- Table/card list showing: name, client, type, status badge, data request progress (e.g., "14/23 received"), document count, dates
- Click row to navigate to engagement detail

### Engagement Detail Page (`/engagements/[id]`)
- Top: Engagement header with name, client, status badge, type, date range
- Tab navigation: Overview | Data Requests | Documents | Team | Activity
- **Overview tab**: Workstream status cards (3), data request summary, recent activity preview
- **Data Requests tab**: Full data request table with filters and bulk actions
- **Documents tab**: Document grid organized by category
- **Team tab**: Team member list with roles
- **Activity tab**: Full activity feed

### Create/Edit Engagement (`/engagements/new`, `/engagements/[id]/edit`)
- Form with fields: name, clientName, type (dropdown), status, startDate, endDate, scopeDescription (textarea)
