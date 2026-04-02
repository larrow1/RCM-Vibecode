# ClawTown: Assessment Consultant Platform

## Overview

This repo is a **ClawTown** — a coordinated multi-agent system where specialized AI agents operate as product and development teams to build applications that support **assessment consultants** — professionals who evaluate organizations by analyzing their financials, organizational structure, contracts, and operations to produce actionable recommendations.

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

The platform serves **assessment consultants** who need tools for:

### Core Assessment Workflows
- **Financial Analysis** — Ingest, normalize, and analyze financial statements (P&L, balance sheet, cash flow) across entities and time periods. Ratio analysis, trend identification, benchmarking against industry standards.
- **Organizational Assessment** — Map org structures, analyze reporting lines, identify span-of-control issues, assess role clarity, flag duplications and gaps. Headcount and labor cost analysis.
- **Contract Review & Tracking** — Catalog active contracts, extract key terms (duration, value, renewal clauses, termination provisions, SLAs), identify risks and obligations, track expirations.
- **Recommendation Engine** — Synthesize findings from financial, org, and contract analysis into structured recommendations with impact estimates, effort levels, and prioritization.

### Supporting Workflows
- **Engagement Management** — Track assessment engagements, scope, timelines, and deliverables
- **Document Management** — Organize and tag source documents (financials, org charts, contracts, policies)
- **Deliverable Generation** — Produce assessment reports, executive summaries, and presentation decks from structured findings
- **Benchmarking** — Compare metrics against industry standards and peer organizations

## Tech Preferences

- TypeScript / Node.js for backend services
- React + Next.js for web frontends
- PostgreSQL for relational data
- Keep it simple — prefer proven libraries over custom solutions
- Monorepo structure with shared packages
