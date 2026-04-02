# Test Plan: Client Hub

> Author: QA Engineer
> Date: 2026-04-02
> Feature: Client Hub MVP
> Status: Tests Passing (44/44)

## Test Coverage Summary

### Unit Tests (Vitest)

#### Validation Schemas (`tests/validations.test.ts`) -- 20 tests
- **createClientSchema**: Required name, optional fields, status enum validation, max length
- **createContactSchema**: Required name, email format validation, empty email allowed, isPrimary default
- **createEngagementSchema**: Required clientId + name, type/status enum validation, negative budget rejection

#### Utility Functions (`tests/utils.test.ts`) -- 14 tests
- **formatDate**: Date objects, date strings, null/undefined handling
- **formatCurrency**: USD formatting, null/undefined, zero value
- **cn**: Class name joining, falsy value filtering
- **Constants**: Status color mapping completeness, type label accuracy

#### Component Tests (`tests/components.test.tsx`) -- 10 tests
- **StatusBadge**: Renders correct text, applies correct color classes per status, graceful fallback
- **TypeBadge**: Renders human-readable labels (TM -> T&M, FixedFee -> Fixed Fee)
- **StatsCard**: Renders title, value, and optional subtitle
- **EmptyState**: Renders title, description, optional action link with correct href

## Test Scenarios Not Yet Automated (Future)

### API Integration Tests (Recommended Next)
- [ ] POST /api/clients -- creates client, returns 201
- [ ] POST /api/clients -- rejects invalid data, returns 400
- [ ] GET /api/clients -- returns list, respects status filter
- [ ] GET /api/clients/[id] -- returns client with contacts and engagements
- [ ] PUT /api/clients/[id] -- updates client fields
- [ ] DELETE /api/clients/[id] -- soft-deletes (sets archivedAt)
- [ ] Contact CRUD -- create, update, delete, primary flag management
- [ ] Engagement CRUD -- create with client link, update, delete
- [ ] Search API -- returns grouped results across entity types

### E2E Tests (Playwright, Recommended for V2)
- [ ] Create a new client through the UI form
- [ ] Search for a client and navigate to detail page
- [ ] Add a contact to a client
- [ ] Create an engagement for a client
- [ ] Filter engagements by status
- [ ] Edit a client and verify changes persist
- [ ] Dashboard shows correct summary stats

## Quality Assessment

**Build**: Compiles and builds successfully (next build)
**Data**: Seed script creates 5 realistic clients with contacts and engagements
**Tests**: 44/44 passing -- validation logic, utility functions, and presentational components
**Coverage Areas**: Input validation, data formatting, UI rendering correctness
**Known Gaps**: API integration tests and E2E tests deferred to next iteration
