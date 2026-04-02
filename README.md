# RCM ClawTown — Consulting Support Platform

A **ClawTown** of coordinated AI agents that operate as product and development teams to build applications supporting a consulting team.

## What is This?

This repo contains a multi-agent system organized like a small software company. Each agent has a specialized role, and they collaborate through shared documents and structured workflows to ideate, design, build, and ship consulting support tools.

```
                    ┌─────────────────┐
                    │   Orchestrator   │
                    │  (coordination)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌─────────────┐ ┌────────────┐ ┌────────────┐
     │ Product Team │ │  Dev Team  │ │  QA Team   │
     ├─────────────┤ ├────────────┤ ├────────────┤
     │ PM          │ │ Architect  │ │ QA Engineer│
     │ Researcher  │ │ Developer  │ │            │
     │ Analyst     │ │            │ │            │
     └─────────────┘ └────────────┘ └────────────┘
```

## Teams & Agents

### Product Team (`agents/product/`)
| Agent | Role |
|-------|------|
| **Product Manager** | Owns backlog, writes specs, prioritizes by consultant impact |
| **User Researcher** | Understands consultant needs, validates ideas, reviews usability |
| **Business Analyst** | Maps workflows, defines requirements, models the domain |

### Development Team (`agents/development/`)
| Agent | Role |
|-------|------|
| **Architect** | System design, tech stack decisions, code review |
| **Developer** | Full-stack implementation across all apps |
| **QA Engineer** | Test strategy, quality gates, bug triage |

### Coordination (`agents/coordination/`)
| Agent | Role |
|-------|------|
| **Orchestrator** | Routes work between teams, manages dependencies, resolves blockers |

## Target Applications

Tools for consulting teams, built as a monorepo:

| App | Purpose |
|-----|---------|
| **Client Hub** | Client & engagement tracking, contacts, CRM |
| **Time Tracker** | Time entry, weekly views, submission workflows |
| **Knowledge Base** | Reusable deliverables, templates, best practices |
| **Project Board** | Task management, milestones, resource allocation |
| **Proposal Builder** | Proposal generation with scoping calculator |

## Repo Structure

```
├── CLAUDE.md               # Agent coordination protocol
├── agents/
│   ├── product/            # Product team agent definitions
│   ├── development/        # Dev team agent definitions
│   └── coordination/       # Orchestrator agent definition
├── docs/
│   ├── backlog.md          # Prioritized work items
│   ├── domain-model.md     # Core business entities
│   ├── specs/              # Feature specifications
│   ├── architecture/       # Technical design docs
│   ├── decisions/          # Architecture Decision Records
│   ├── research/           # User research & findings
│   └── testing/            # Test plans & strategies
├── apps/                   # Application code (monorepo)
└── packages/               # Shared libraries
```

## How It Works

1. **Product team** identifies consultant pain points and writes specs
2. **Orchestrator** routes specs to the dev team
3. **Architect** creates technical designs
4. **Developer** implements features
5. **QA Engineer** validates quality
6. **User Researcher** confirms it solves the real problem
7. Feedback loops back to step 1

See [CLAUDE.md](./CLAUDE.md) for the full coordination protocol.

## Tech Stack

- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Node.js + TypeScript
- **Database**: PostgreSQL + Prisma
- **Testing**: Vitest + Playwright
- **Monorepo**: Turborepo

## Getting Started

To engage the ClawTown, start with the **Orchestrator** agent. It will assess the current state of the backlog and route work to the appropriate team members.

```
Start with: agents/coordination/orchestrator.md
Backlog:    docs/backlog.md
Domain:     docs/domain-model.md
```
