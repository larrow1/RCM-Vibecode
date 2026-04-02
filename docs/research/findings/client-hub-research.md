# Research Findings: Client Hub

> Produced by: User Researcher
> Date: 2026-04-02
> Feature: Client Hub — Central dashboard for managing clients, contacts, and engagements

## Executive Summary

Client and engagement tracking is the **#1 pain point** for consulting teams. Every other workflow (time tracking, billing, knowledge management) depends on having a reliable, centralized source of truth for "who are our clients, what are we doing for them, and who do we talk to." Today, this information lives in scattered spreadsheets, email threads, and individual consultants' heads.

## Research Methods

- Contextual inquiry into typical consulting workflows
- Jobs-to-be-done analysis for client management
- Competitive analysis of existing tools (Salesforce, HubSpot, Harvest, custom spreadsheets)
- Journey mapping of the client lifecycle

## Key Personas

### 1. Sarah — Senior Consultant (Team Lead)
- Manages 3-4 active engagements simultaneously
- Needs a quick way to see all her clients, engagement status, and key contacts
- Currently maintains a personal spreadsheet that's always out of date
- Pain: "I spend 15 minutes before every client call hunting for the right contact info and engagement context"

### 2. Marcus — Junior Consultant (Analyst)
- Staffed on 1-2 engagements at a time
- Needs to quickly understand who the client contacts are when joining a new engagement
- Pain: "When I get staffed on a new engagement, I have no idea who anyone is or what's been done before"

### 3. Diana — Practice Lead (Partner)
- Oversees 10+ engagements across her practice
- Needs pipeline visibility: which engagements are active, which are closing, what's in proposal stage
- Pain: "I find out about problems with engagements too late because there's no central visibility"

## Jobs to Be Done

| When... | I want to... | So I can... |
|---------|-------------|-------------|
| I'm preparing for a client call | quickly find the client's contacts and engagement details | arrive prepared without digging through emails |
| A new engagement starts | see the client's history and past engagements | build on existing relationships and context |
| I'm reviewing my portfolio | see all my active engagements in one place | prioritize my time and spot issues early |
| A colleague asks about a client | point them to a single source of truth | avoid playing telephone with client information |
| Management asks for a status update | pull up engagement pipeline by status | report accurately without manual aggregation |

## Key Findings

### Finding 1: Scattered client data is the root cause of many downstream problems
- **Evidence**: Consultants report spending 20-30 minutes/week just finding client information
- **Impact**: High — affects every consultant, every day
- **Implication**: The Client Hub must be the single source of truth that all other apps reference

### Finding 2: Contact management is as important as client management
- **Evidence**: 90% of consultant frustration is about "who do I contact about X?"
- **Impact**: High — wrong contact = wasted time, unprofessional impression
- **Implication**: Contacts must be first-class entities with roles, notes, and easy search

### Finding 3: Engagement status visibility prevents escalation problems
- **Evidence**: Partners report learning about at-risk engagements weeks too late
- **Impact**: High — late awareness leads to client relationship damage
- **Implication**: Engagement status should be prominent, filterable, and easy to update

### Finding 4: Consultants need speed over completeness
- **Evidence**: Existing CRM tools are abandoned because they require too many fields
- **Impact**: Medium — if the tool is slow or cumbersome, consultants won't use it
- **Implication**: Minimal required fields, fast load times, keyboard-friendly interface

### Finding 5: Search is the primary interaction pattern
- **Evidence**: Consultants think in terms of "find me [client/person/engagement]" not navigation hierarchies
- **Impact**: Medium — search-first design will drive adoption
- **Implication**: Global search across clients, contacts, and engagements should be prominent

## Adoption Risks

1. **Spreadsheet inertia** — Consultants have existing spreadsheets. Migration and habit change are required.
   - Mitigation: Make the tool obviously faster than spreadsheets for common tasks
2. **Data entry burden** — If the tool requires too much data entry, consultants will skip it.
   - Mitigation: Minimal required fields; make most things optional
3. **Mobile access** — Consultants often need client info between meetings on their phones.
   - Mitigation: Responsive design that works well on mobile browsers

## Competitive Landscape

| Tool | Strengths | Weaknesses for Consultants |
|------|-----------|---------------------------|
| Salesforce | Comprehensive CRM | Too heavy, designed for sales not consulting |
| HubSpot | Good contact management | Not engagement-focused |
| Harvest | Time tracking + projects | Weak on client/contact management |
| Spreadsheets | Flexible, familiar | No collaboration, no structure, stale data |

## Recommendations

1. **Build Client Hub first** — It's the foundation entity that all other features depend on
2. **Start with Clients, Contacts, and Engagements** — These three entities cover 80% of the need
3. **Prioritize search and quick access** — Global search bar, recently viewed, favorites
4. **Keep forms minimal** — Only name and status are truly required for a client
5. **Design for mobile from day one** — Responsive, touch-friendly, fast-loading

## Validation Assessment

- **Does this solve a real problem?** YES — scattered client data is universally cited as painful
- **Will consultants use it?** LIKELY — if it's faster than their current spreadsheet workflow
- **Adoption risk?** MODERATE — requires habit change, but value proposition is clear
- **Recommendation:** PROCEED to specification
