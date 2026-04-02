# QA Bug Report -- All Apps Audit

**Date:** 2026-04-02
**Auditor:** QA Engineer
**Scope:** financial-analyzer, engagement-workspace, findings-recommendations, app-library

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3     |
| High     | 7     |
| Medium   | 10    |
| Low      | 6     |
| **Total** | **26** |

---

## App: financial-analyzer

### BUG-FA-001 -- Build fails with stale Prisma client cache
- **Severity:** Critical
- **File:** `apps/financial-analyzer/app/api/analysis/ratios/route.ts` (and all routes using Prisma)
- **Description:** `npx next build` fails with `Property 'financialStatement' does not exist on type 'PrismaClient'`. The root cause is a monorepo Prisma client conflict: all three apps (financial-analyzer, engagement-workspace, findings-recommendations) share a single hoisted `@prisma/client` at `node_modules/@prisma/client`. Whichever app runs `prisma generate` last wins, and the other two apps get type errors. The build succeeds only after clearing `.next` cache and ensuring the correct schema was the last one generated.
- **Suggested Fix:** Each app should have its own Prisma client output. Add `output = "../node_modules/.prisma/client-financial"` (etc.) to each `schema.prisma` generator block, and update `lib/prisma.ts` to import from the app-specific output path. Alternatively, add a monorepo-level script that generates all clients in sequence before building.

### BUG-FA-002 -- GET routes lack try/catch error handling
- **Severity:** High
- **Files:**
  - `apps/financial-analyzer/app/api/engagements/route.ts` (GET)
  - `apps/financial-analyzer/app/api/engagements/[id]/route.ts` (GET)
  - `apps/financial-analyzer/app/api/findings/route.ts` (GET)
  - `apps/financial-analyzer/app/api/findings/[id]/route.ts` (GET)
  - `apps/financial-analyzer/app/api/financial-statements/route.ts` (GET)
  - `apps/financial-analyzer/app/api/financial-statements/[id]/route.ts` (GET, DELETE)
  - `apps/financial-analyzer/app/api/line-items/route.ts` (GET)
  - `apps/financial-analyzer/app/api/analysis/ratios/route.ts` (GET)
  - `apps/financial-analyzer/app/api/analysis/trends/route.ts` (GET)
- **Description:** Most GET handlers and several DELETE handlers have no try/catch around database calls. If the database is unreachable or a query fails, the server will return an unhandled exception (500 with stack trace in development, opaque error in production). Compare with engagement-workspace, which wraps all handlers in try/catch.
- **Suggested Fix:** Wrap all Prisma calls in try/catch blocks and return `NextResponse.json({ error: "..." }, { status: 500 })`.

### BUG-FA-003 -- DELETE finding does not handle non-existent record
- **Severity:** Medium
- **File:** `apps/financial-analyzer/app/api/findings/[id]/route.ts` (line 53)
- **Description:** The DELETE handler calls `prisma.finding.delete()` directly without first checking if the record exists. If the finding ID doesn't exist, Prisma throws a `P2025` error which is unhandled (no try/catch). This returns a raw error to the client.
- **Suggested Fix:** Add a try/catch, or check for existence first. Return 404 if not found.

### BUG-FA-004 -- DELETE financial statement does not handle non-existent record
- **Severity:** Medium
- **File:** `apps/financial-analyzer/app/api/financial-statements/[id]/route.ts` (line 24)
- **Description:** Same issue as BUG-FA-003. The DELETE handler has no error handling and will crash on non-existent IDs.
- **Suggested Fix:** Add try/catch with proper 404/500 responses.

### BUG-FA-005 -- Engagement model missing onDelete cascade
- **Severity:** Medium
- **File:** `apps/financial-analyzer/prisma/schema.prisma` (lines 41, 81, 113, 128)
- **Description:** The `FinancialStatement`, `Finding`, `Benchmark`, and `EbitdaAdjustment` relations to `Engagement` do not specify `onDelete: Cascade`. If an engagement is deleted via direct DB access or a future DELETE endpoint, these child records become orphaned (or the delete fails with a foreign key constraint error on SQLite). Only `FinancialLineItem -> FinancialStatement` and `FindingEvidence -> Finding` have cascade deletes.
- **Suggested Fix:** Add `onDelete: Cascade` to all relations pointing to `Engagement`.

### BUG-FA-006 -- FindingEvidence lacks onDelete cascade for lineItem relation
- **Severity:** Low
- **File:** `apps/financial-analyzer/prisma/schema.prisma` (line 96)
- **Description:** `FindingEvidence.lineItem` relation does not have `onDelete: Cascade`. If a `FinancialLineItem` is deleted (e.g., when a statement is re-imported), the `FindingEvidence` record becomes orphaned with a dangling reference.
- **Suggested Fix:** Add `onDelete: Cascade` to the lineItem relation in FindingEvidence, or add `onDelete: SetNull` and make lineItemId nullable.

### BUG-FA-007 -- No DELETE endpoint for engagements
- **Severity:** Low
- **File:** `apps/financial-analyzer/app/api/engagements/[id]/route.ts`
- **Description:** The engagements API supports GET and PATCH but not DELETE. There is no way to remove an engagement through the API.
- **Suggested Fix:** Add a DELETE handler (after fixing BUG-FA-005 cascade rules).

### BUG-FA-008 -- Dashboard page fetches all line items for all engagements
- **Severity:** Medium
- **File:** `apps/financial-analyzer/app/page.tsx` (line 11)
- **Description:** The dashboard fetches `financialStatements: { include: { lineItems: true } }` for ALL engagements. With the seed data alone, this loads 864 line items into server memory on every page load. This will not scale -- if there are 10 engagements with 36 periods each, it loads ~8,640 line items just to calculate a revenue number.
- **Suggested Fix:** Use a Prisma aggregate query or a separate API endpoint to compute summary metrics without loading all line items.

---

## App: engagement-workspace

### BUG-EW-001 -- Hardcoded localhost URL in sidebar
- **Severity:** High
- **File:** `apps/engagement-workspace/components/layout/sidebar.tsx` (line 30)
- **Description:** The sidebar contains a hardcoded `http://localhost:3002` link to the Financial Analyzer. This will break in any non-local deployment.
- **Suggested Fix:** Use an environment variable (e.g., `NEXT_PUBLIC_FINANCIAL_ANALYZER_URL`) or make the URL configurable.

### BUG-EW-002 -- Hardcoded localhost URL in workstream cards
- **Severity:** High
- **File:** `apps/engagement-workspace/components/engagements/workstream-cards.tsx` (line 17)
- **Description:** The Financial workstream card has a hardcoded `http://localhost:3002` link. Same issue as BUG-EW-001.
- **Suggested Fix:** Use an environment variable.

### BUG-EW-003 -- Wrong activity type logged when removing team member
- **Severity:** Medium
- **File:** `apps/engagement-workspace/app/api/engagements/[id]/team/[memberId]/route.ts` (line 27)
- **Description:** When a team member is removed (DELETE), the activity log records the type as `"team_member_added"` instead of `"team_member_removed"`. The description text says "removed from team" but the type field is wrong, which would break any filtering or reporting based on activity type.
- **Suggested Fix:** Change `type: "team_member_added"` to `type: "team_member_removed"`.

### BUG-EW-004 -- Document PUT endpoint passes unvalidated data to Prisma
- **Severity:** Medium
- **File:** `apps/engagement-workspace/app/api/engagements/[id]/documents/[docId]/route.ts` (line 24)
- **Description:** The document update handler passes `data: validated` directly to Prisma. While Zod validates the shape, the `updateDocumentSchema` is `createDocumentSchema.partial()`, which includes `fileSize` as an optional field. If a client sends `{ fileSize: -1 }`, it would be accepted (Zod only has `default(0)`, no `min(0)` constraint). Also, passing fields like `fileName` and `fileType` in an update could break data consistency if the actual file hasn't changed.
- **Suggested Fix:** Add a `min(0)` constraint to `fileSize` in the schema. Consider restricting which fields can be updated.

### BUG-EW-005 -- Activities endpoint limit parameter not validated
- **Severity:** Low
- **File:** `apps/engagement-workspace/app/api/engagements/[id]/activities/route.ts` (line 10)
- **Description:** The `limit` query parameter is parsed with `parseInt` but never validated. A client could pass `limit=-1` or `limit=999999999`, potentially causing unexpected behavior or loading excessive data.
- **Suggested Fix:** Clamp the limit to a reasonable range (e.g., 1-200).

### BUG-EW-006 -- Priority sorting treats string values alphabetically
- **Severity:** Low
- **File:** `apps/engagement-workspace/app/api/engagements/[id]/data-requests/route.ts` (line 25)
- **Description:** Data requests are sorted by `{ priority: "asc" }`. Since priority is stored as a string ("Critical", "High", "Medium", "Low"), alphabetical sorting produces: Critical, High, Low, Medium -- which is incorrect. "Low" sorts before "Medium" alphabetically.
- **Suggested Fix:** Sort in application code using a custom priority order, or add a numeric priority column.

---

## App: findings-recommendations

### BUG-FR-001 -- Build fails with stale Prisma client (same root cause as BUG-FA-001)
- **Severity:** Critical
- **File:** `apps/findings-recommendations/app/api/findings/[id]/links/[linkId]/route.ts`
- **Description:** Same monorepo Prisma client conflict as BUG-FA-001. The build error references `Property 'findingLink' does not exist on type 'PrismaClient'` when another app's schema was generated last. Builds succeed after running `prisma generate` from this app's directory and clearing `.next` cache.
- **Suggested Fix:** Same as BUG-FA-001 -- isolate Prisma client outputs per app.

### BUG-FR-002 -- Hardcoded engagement ID in New Finding form
- **Severity:** Critical
- **File:** `apps/findings-recommendations/app/findings/new/page.tsx` (line 86)
- **Description:** The "New Finding" form has a hardcoded `<input type="hidden" name="engagementId" value="engagement-1" />`. This means all new findings created through the UI will be assigned to an engagement with ID "engagement-1", which may not exist. The seed data creates an engagement with a cuid (not "engagement-1"), so this form will fail with a foreign key constraint error on the actual seeded database.
- **Suggested Fix:** Make the engagement ID dynamic -- either select from available engagements in the form, or pass it as a query parameter.

### BUG-FR-003 -- Hardcoded engagement ID in New Recommendation form
- **Severity:** High
- **File:** `apps/findings-recommendations/app/recommendations/new/page.tsx` (line 60)
- **Description:** Same issue as BUG-FR-002. The "New Recommendation" form hardcodes `engagementId: "engagement-1"`.
- **Suggested Fix:** Same as BUG-FR-002.

### BUG-FR-004 -- Impact API getQuadrant always classifies as "Quick Win" or "Fill-in"
- **Severity:** High
- **File:** `apps/findings-recommendations/app/api/impact/route.ts` (lines 17-21)
- **Description:** The impact API passes `result.weightedImpact` as the `impactThreshold` parameter to `getQuadrant()`. Since the threshold equals the value being compared, `weightedImpact >= impactThreshold` is always true. This means the quadrant will never be "Fill-in" or "Deprioritize" -- it will always be "Quick Win" (low effort) or "Strategic Initiative" (high effort). The threshold should be computed from the median of all recommendations' weighted impacts, not from the single item being evaluated.
- **Suggested Fix:** Either compute the threshold from all recommendations in the database, or accept `impactThreshold` as a parameter from the client.

### BUG-FR-005 -- Themes GET endpoint returns all themes without engagement filter
- **Severity:** Medium
- **File:** `apps/findings-recommendations/app/api/themes/route.ts` (GET handler)
- **Description:** The themes GET endpoint returns ALL themes across all engagements with no filtering capability. Unlike the findings and recommendations endpoints which accept `engagementId` as a query parameter, themes cannot be filtered by engagement.
- **Suggested Fix:** Add `engagementId` query parameter support to the GET handler.

### BUG-FR-006 -- Theme findings POST does not validate findingId type
- **Severity:** Low
- **File:** `apps/findings-recommendations/app/api/themes/[id]/findings/route.ts` (line 10)
- **Description:** The POST handler reads `findingId` directly from the request body without Zod validation. While there is a basic `if (!findingId)` check, it doesn't verify that findingId is a string or that the theme referenced by `params.id` exists before attempting the create.
- **Suggested Fix:** Use Zod validation for the request body and verify the theme exists before creating the link.

### BUG-FR-007 -- Finding links DELETE does not verify ownership
- **Severity:** Medium
- **File:** `apps/findings-recommendations/app/api/findings/[id]/links/[linkId]/route.ts`
- **Description:** The DELETE handler deletes a finding link by `linkId` without verifying that the link actually belongs to the finding identified by `params.id`. A client could delete any link by guessing its ID, regardless of which finding URL they use.
- **Suggested Fix:** Add a where clause that also checks `fromFindingId: params.id` or verify ownership before deleting.

### BUG-FR-008 -- Engagement model missing onDelete cascade
- **Severity:** Medium
- **File:** `apps/findings-recommendations/prisma/schema.prisma` (lines 41, 97, 127)
- **Description:** The `Finding`, `Recommendation`, and `Theme` relations to `Engagement` do not specify `onDelete: Cascade`. Deleting an engagement would fail with foreign key constraints.
- **Suggested Fix:** Add `onDelete: Cascade` to all Engagement child relations.

---

## App: app-library

### BUG-AL-001 -- Vitest fails due to Playwright version conflict
- **Severity:** High
- **File:** `apps/app-library/e2e/app-library.spec.ts`
- **Description:** Running `npx vitest run` fails with: "You have two different versions of @playwright/test." The e2e spec file uses `@playwright/test` which conflicts with another version in the dependency tree. Vitest picks up the Playwright spec file and tries to run it, but Playwright specs should only run via `npx playwright test`.
- **Suggested Fix:** Configure vitest to exclude e2e tests. In `vitest.config.ts` (or create one), add `exclude: ['e2e/**', 'node_modules/**']`. Alternatively, move e2e tests outside the vitest test pattern.

### BUG-AL-002 -- Hardcoded localhost URLs in app cards
- **Severity:** High
- **File:** `apps/app-library/components/app-card.tsx` (line 91)
- **Description:** The "Open App" button links to `http://localhost:${app.port}`. This will not work in any deployment other than local development.
- **Suggested Fix:** Use environment variables for app URLs, or make the links relative if apps share a domain. At minimum, only show these links in development mode.

### BUG-AL-003 -- No vitest config file prevents proper test setup
- **Severity:** Low
- **File:** `apps/app-library/` (missing `vitest.config.ts`)
- **Description:** The app-library has `vitest` in devDependencies and a `test` script, but no `vitest.config.ts` file. Combined with BUG-AL-001, this means there is no working test setup for this app.
- **Suggested Fix:** Add a `vitest.config.ts` that excludes e2e tests and configures the test environment properly.

---

## Cross-App Issues

### BUG-CROSS-001 -- Monorepo Prisma client conflict (umbrella for BUG-FA-001 / BUG-FR-001)
- **Severity:** Critical
- **File:** All three Prisma-backed apps' `prisma/schema.prisma` files
- **Description:** All three database apps generate their Prisma client to the same hoisted `node_modules/@prisma/client` path. Only one schema can be active at a time. This makes it impossible to build or run multiple apps simultaneously without careful ordering of `prisma generate` commands and cache management.
- **Suggested Fix:** Configure each app to generate to a unique output directory. See BUG-FA-001 for details.

### BUG-CROSS-002 -- No test coverage for API routes in any app
- **Severity:** High
- **File:** All apps
- **Description:** Tests exist for utility/library code (financial-utils, validations, import-parser, taxonomy, impact-calculator, schemas), but there are zero tests for any API route handler. API routes contain critical business logic (data creation, evidence linking, bulk updates, import confirmation) that is completely untested. Unit tests for API routes would catch issues like BUG-FA-002 (missing error handling), BUG-EW-003 (wrong activity type), and BUG-FR-004 (broken quadrant logic).
- **Suggested Fix:** Add API route tests using vitest with mocked Prisma calls. Prioritize the POST/PUT/DELETE handlers that mutate data.

---

## Test Results Summary

| App | Tests | Result |
|-----|-------|--------|
| financial-analyzer | 74 tests (4 files) | All pass |
| engagement-workspace | 31 tests (1 file) | All pass |
| findings-recommendations | 43 tests (2 files) | All pass |
| app-library | 0 tests (1 file fails to load) | FAIL -- Playwright version conflict |

---

## Priority Recommendations

1. **Fix the Prisma monorepo conflict** (BUG-CROSS-001) -- this blocks simultaneous development and deployment
2. **Fix hardcoded engagement IDs** (BUG-FR-002, BUG-FR-003) -- the create forms are non-functional
3. **Fix the impact API quadrant logic** (BUG-FR-004) -- produces incorrect priority classifications
4. **Add error handling to financial-analyzer GET routes** (BUG-FA-002) -- prevents unhandled crashes
5. **Fix hardcoded localhost URLs** (BUG-EW-001, BUG-EW-002, BUG-AL-002) -- blocks deployment
6. **Fix the wrong activity type** (BUG-EW-003) -- data integrity issue
7. **Add API route test coverage** (BUG-CROSS-002) -- highest-impact test gap
