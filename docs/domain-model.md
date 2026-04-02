# Domain Model

> Core business entities for the consulting support platform. Maintained by the Business Analyst, referenced by Architect and Developer.

## Entity Overview

```
┌──────────┐     ┌────────────┐     ┌───────────┐
│  Client   │────▶│ Engagement │────▶│  Project   │
└──────────┘     └────────────┘     └───────────┘
                       │                   │
                       ▼                   ▼
                ┌────────────┐     ┌───────────┐
                │ TimeEntry  │     │   Task     │
                └────────────┘     └───────────┘
                       │
                       ▼
                ┌────────────┐
                │  Invoice   │
                └────────────┘
```

## Core Entities

### Client
The organization being served.
- `id` — Unique identifier
- `name` — Company name
- `industry` — Industry vertical
- `contacts[]` — Key people at the client
- `engagements[]` — All engagements for this client
- `status` — Active, Inactive, Prospect

### Contact
A person at a client organization.
- `id` — Unique identifier
- `clientId` — Parent client
- `name` — Full name
- `email` — Email address
- `phone` — Phone number
- `role` — Their role/title
- `isPrimary` — Whether they're the main point of contact

### Engagement
A contracted piece of work for a client.
- `id` — Unique identifier
- `clientId` — Parent client
- `name` — Engagement name
- `description` — What the work involves
- `type` — T&M, Fixed Fee, Retainer, Value-Based
- `status` — Lead, Proposal, Active, Delivered, Closed
- `startDate` — When work begins
- `endDate` — Expected completion
- `budget` — Total budget (for fixed fee) or rate schedule
- `team[]` — Consultants assigned
- `projects[]` — Sub-projects within the engagement

### Consultant
A member of the consulting team.
- `id` — Unique identifier
- `name` — Full name
- `email` — Email address
- `role` — Job title / level (Analyst, Consultant, Senior, Manager, Partner)
- `skills[]` — Areas of expertise
- `billableRate` — Default hourly rate
- `targetUtilization` — Target billable percentage (e.g., 0.80)
- `engagements[]` — Active engagements

### TimeEntry
A record of time spent on work.
- `id` — Unique identifier
- `consultantId` — Who logged the time
- `engagementId` — Which engagement
- `projectId` — Which project (optional)
- `date` — Date of the work
- `hours` — Duration (in hours, typically 0.25 increments)
- `description` — What was done
- `billable` — Whether this time is billable
- `rate` — Billing rate applied
- `status` — Draft, Submitted, Approved, Invoiced

### Project
A distinct workstream within an engagement.
- `id` — Unique identifier
- `engagementId` — Parent engagement
- `name` — Project name
- `status` — Planning, Active, Complete
- `tasks[]` — Work items

### Task
A unit of work within a project.
- `id` — Unique identifier
- `projectId` — Parent project
- `title` — What needs to be done
- `assigneeId` — Consultant responsible
- `status` — Todo, In Progress, Done
- `dueDate` — When it's due
- `priority` — Low, Medium, High, Critical

### Invoice
A bill sent to a client.
- `id` — Unique identifier
- `clientId` — Who's being billed
- `engagementId` — For which engagement
- `timeEntries[]` — Approved time entries included
- `amount` — Total amount
- `status` — Draft, Sent, Paid, Overdue
- `issuedDate` — When sent
- `dueDate` — Payment due date

### KnowledgeAsset
A reusable deliverable, template, or reference document.
- `id` — Unique identifier
- `title` — Asset name
- `type` — Template, Deliverable, Framework, Checklist, Reference
- `tags[]` — Categorization tags
- `engagementId` — Source engagement (optional)
- `createdBy` — Contributing consultant
- `content` — The asset content or file reference

## Key Relationships

- A **Client** has many **Engagements**
- An **Engagement** belongs to one **Client** and has many **Projects** and **TimeEntries**
- A **Consultant** works on many **Engagements** and logs many **TimeEntries**
- An **Invoice** aggregates approved **TimeEntries** for a **Client**/**Engagement**
- A **KnowledgeAsset** may be linked to an **Engagement** as its source

## Business Rules

1. Time entries must be in increments of 0.25 hours (15 minutes)
2. A consultant cannot log more than 24 hours in a single day
3. Only Approved time entries can be added to an Invoice
4. Billable rate defaults to the consultant's rate but can be overridden per engagement
5. Engagement budget tracking should warn when 80% consumed
6. Utilization = (Billable Hours / Available Hours) over a time period
