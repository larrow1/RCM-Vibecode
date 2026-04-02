# ClawTown: Consulting Support Platform

## Overview

This repo is a **ClawTown** — a coordinated multi-agent system where specialized AI agents operate as product and development teams to build applications that support a team of consultants.

## How This ClawTown Works

### Teams

**Product Team** (`agents/product/`)
- **Product Manager** — Owns the backlog, writes specs, prioritizes work based on consultant impact
- **User Researcher** — Gathers consultant needs, synthesizes feedback, validates ideas before development
- **Business Analyst** — Maps consulting workflows, identifies automation opportunities, defines requirements

**Development Team** (`agents/development/`)
- **Architect** — Makes system design decisions, defines tech stack, reviews code for quality
- **Developer** — Implements features, writes code across the full stack
- **QA Engineer** — Defines test strategy, writes tests, validates quality before release

**Coordination** (`agents/coordination/`)
- **Orchestrator** — Routes work between teams, resolves blockers, manages cross-team dependencies

### Workflow

1. **Ideation** — Product Manager + User Researcher identify consultant pain points and propose solutions
2. **Specification** — Business Analyst documents requirements; Product Manager writes specs in `docs/specs/`
3. **Design** — Architect creates technical designs in `docs/architecture/`
4. **Implementation** — Developer builds features in `apps/`
5. **Validation** — QA Engineer tests; User Researcher validates with consultants
6. **Iteration** — Feedback loops back to step 1

### Communication Protocol

Agents communicate through structured artifacts:
- **Specs** → `docs/specs/` — Feature specifications written by Product Manager
- **Research** → `docs/research/` — User research findings and consultant feedback
- **Architecture** → `docs/architecture/` — Technical design documents
- **Backlog** → `docs/backlog.md` — Prioritized list of work items
- **Decisions** → `docs/decisions/` — Architecture Decision Records (ADRs)

### Conventions

- All apps live in `apps/` as separate packages
- Shared libraries go in `packages/`
- Each agent has a `.md` file in its directory defining its role, responsibilities, and tools
- Agents should read the backlog and relevant docs before starting work
- When an agent completes work, it updates the backlog and notifies downstream agents via docs

## Target Domain

The platform serves **consulting teams** who need tools for:
- Client engagement tracking and CRM
- Time tracking and billing
- Project management and resource allocation
- Knowledge management and reusable deliverables
- Proposal generation and scoping
- Reporting and analytics dashboards

## Tech Preferences

- TypeScript / Node.js for backend services
- React + Next.js for web frontends
- PostgreSQL for relational data
- Keep it simple — prefer proven libraries over custom solutions
- Monorepo structure with shared packages
