# Technical Design: Client Hub

> Author: Architect
> Date: 2026-04-02
> Spec: [docs/specs/client-hub.md](../specs/client-hub.md)
> Status: Approved

## Overview

Client Hub is the first application in the consulting platform monorepo. It provides CRUD operations for Clients, Contacts, and Engagements with a dashboard, global search, and pipeline views.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma ORM |
| Validation | Zod |
| Build | Turborepo |
| Testing | Vitest + React Testing Library |

## Monorepo Structure

```
/
  package.json            -- Root workspace config
  turbo.json              -- Turborepo pipeline config
  tsconfig.json           -- Base TypeScript config
  apps/
    client-hub/
      package.json
      tsconfig.json
      next.config.js
      tailwind.config.ts
      prisma/
        schema.prisma
        seed.ts
      app/
        layout.tsx          -- Root layout with sidebar nav
        page.tsx            -- Dashboard
        globals.css         -- Tailwind imports
        clients/
          page.tsx          -- Client list
          new/page.tsx      -- Create client
          [id]/
            page.tsx        -- Client detail
            edit/page.tsx   -- Edit client
        engagements/
          page.tsx          -- Engagement list
          new/page.tsx      -- Create engagement
          [id]/
            page.tsx        -- Engagement detail
            edit/page.tsx   -- Edit engagement
        api/
          clients/
            route.ts        -- GET (list+search), POST (create)
            [id]/
              route.ts      -- GET, PUT, DELETE (archive)
              contacts/
                route.ts    -- GET, POST
                [contactId]/
                  route.ts  -- PUT, DELETE
          engagements/
            route.ts        -- GET (list+filter), POST (create)
            [id]/
              route.ts      -- GET, PUT, DELETE
          search/
            route.ts        -- GET (global search)
      components/
        sidebar.tsx
        search-bar.tsx
        client-form.tsx
        contact-form.tsx
        engagement-form.tsx
        stats-card.tsx
        data-table.tsx
        status-badge.tsx
        empty-state.tsx
      lib/
        prisma.ts           -- Prisma client singleton
        utils.ts            -- Shared utilities
```

## Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Client {
  id          String       @id @default(cuid())
  name        String
  industry    String?
  website     String?
  notes       String?
  status      String       @default("Active") // Prospect, Active, Inactive
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  archivedAt  DateTime?
  contacts    Contact[]
  engagements Engagement[]
}

model Contact {
  id        String   @id @default(cuid())
  clientId  String
  client    Client   @relation(fields: [clientId], references: [id])
  name      String
  email     String?
  phone     String?
  role      String?
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Engagement {
  id          String    @id @default(cuid())
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  name        String
  description String?
  type        String    @default("TM") // TM, FixedFee, Retainer, ValueBased
  status      String    @default("Lead") // Lead, Proposal, Active, Delivered, Closed
  startDate   DateTime?
  endDate     DateTime?
  budget      Float?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## API Design

### Clients

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients?search=&status=` | List clients with optional search/filter |
| POST | `/api/clients` | Create a client |
| GET | `/api/clients/[id]` | Get client with contacts and engagements |
| PUT | `/api/clients/[id]` | Update a client |
| DELETE | `/api/clients/[id]` | Archive a client (soft delete) |

### Contacts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients/[id]/contacts` | List contacts for a client |
| POST | `/api/clients/[id]/contacts` | Add a contact |
| PUT | `/api/clients/[id]/contacts/[contactId]` | Update a contact |
| DELETE | `/api/clients/[id]/contacts/[contactId]` | Remove a contact |

### Engagements

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/engagements?status=&clientId=` | List engagements with filters |
| POST | `/api/engagements` | Create an engagement |
| GET | `/api/engagements/[id]` | Get engagement with client |
| PUT | `/api/engagements/[id]` | Update an engagement |
| DELETE | `/api/engagements/[id]` | Delete an engagement |

### Search

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/search?q=` | Global search across all entities |

## Validation Schemas (Zod)

```typescript
const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
  status: z.enum(["Prospect", "Active", "Inactive"]).default("Active"),
});

const createContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  isPrimary: z.boolean().default(false),
});

const createEngagementSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(["TM", "FixedFee", "Retainer", "ValueBased"]).default("TM"),
  status: z.enum(["Lead", "Proposal", "Active", "Delivered", "Closed"]).default("Lead"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().nonnegative().optional(),
});
```

## Key Design Decisions

1. **SQLite for development** -- Simplifies local setup. Prisma makes switching to PostgreSQL trivial for production.
2. **Next.js App Router** -- Server components by default for fast initial loads; client components only for interactive forms.
3. **API Routes** -- Keep API layer clean for future cross-app consumption (e.g., Time Tracker fetching engagement list).
4. **No auth for MVP** -- Simplifies initial build. Will add NextAuth.js when multi-user support is needed.
5. **Soft delete for clients** -- Set archivedAt timestamp instead of hard delete to preserve referential integrity.

## Performance Considerations

- Client list: paginate if > 100 clients (defer pagination to later; unlikely in MVP)
- Search: simple LIKE queries on SQLite; upgrade to full-text search when needed
- Engagement list: index on status and clientId columns

## Security Notes (Future)

- Input validation via Zod on all API endpoints
- SQL injection prevented by Prisma parameterized queries
- XSS prevented by React's default escaping
- Auth and authorization to be added in a future iteration
