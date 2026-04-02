# Test Plan: Financial Analyzer

> Author: QA Engineer
> Date: 2026-04-02
> Spec: `docs/specs/financial-analyzer.md`
> App: `apps/financial-analyzer/`

---

## Test Strategy

### Unit Tests (Vitest) -- Implemented
Located in `apps/financial-analyzer/tests/`

| Test File | Coverage Area | Tests |
|-----------|--------------|-------|
| `financial-utils.test.ts` | Ratio calculations, aggregation, formatting, anomaly detection | 30 |
| `taxonomy.test.ts` | Category suggestion, label lookup, taxonomy structure | 16 |
| `validations.test.ts` | Zod schemas for all API inputs | 16 |
| `import-parser.test.ts` | CSV parsing, column detection | 12 |
| **Total** | | **74** |

### Test Categories

#### 1. Financial Ratio Calculations (Critical)
- **Gross margin**: Revenue minus COGS divided by revenue
- **Operating margin**: Operating income divided by revenue
- **EBITDA margin**: EBITDA divided by revenue
- **Net margin**: Net income divided by revenue
- **Revenue growth**: Period-over-period change
- **Edge cases**: Zero revenue (returns null), missing prior period, negative values
- **Rating logic**: Traffic-light indicators vs. benchmarks (green/yellow/red)

#### 2. Line Item Aggregation (Critical)
- Revenue rollup from multiple line items
- Gross profit computed as revenue - COGS
- Operating expenses aggregated across SGA + SM + RD + DA
- EBITDA computed as operating income + D&A
- Net income computed correctly through full P&L cascade
- Empty input handling
- Null category handling (items are ignored)

#### 3. Data Validation (High)
- Engagement creation: required fields, valid types, date handling
- Finding creation: valid categories and severities, evidence linking
- Import confirmation: valid statement types, period mappings, row data
- Bulk line item updates: null category allowed
- EBITDA adjustments: valid classifications, negative amounts allowed

#### 4. Import/Parsing (High)
- CSV parsing: header extraction, numeric type detection, empty line skipping
- Column detection: account name/code columns, amount columns (year patterns, month names, keywords)
- Fallback behavior: first column used when no match found
- Edge cases: empty CSV, empty headers

#### 5. Taxonomy Mapping (Medium)
- Keyword matching for all 11 categories (Revenue through NetIncome)
- Case-insensitivity
- Longest-match-wins logic for ambiguous terms
- Null return for unrecognized accounts
- Label lookup for display

---

## Manual Testing Scenarios

### Happy Path: Full Workflow
1. Open dashboard at `/` -- see seed engagement card
2. Click into engagement -- see financial overview with 36 statements
3. Navigate to Analysis -- see ratio cards, trend charts, EBITDA bridge
4. Navigate to Findings -- see 5 seed findings with severity badges
5. Click a finding -- see detail with linked evidence

### Import Flow
1. Navigate to Import page for an engagement
2. Upload a CSV file with account names and monthly amounts
3. Verify preview shows parsed data correctly
4. Confirm import
5. Verify new statements appear on engagement detail page
6. Verify taxonomy auto-mapping populated standardCategory

### Edge Cases to Test Manually
- Upload a file > 10MB -- should show error
- Upload a .pdf file -- should show error
- Upload Excel with empty sheet -- should show error
- Create finding without description -- form should prevent submission
- View analysis with no imported data -- should show "no data" message

---

## Regression Risks

| Risk | Test Coverage |
|------|--------------|
| Ratio calculations change when more categories added | Unit tests pin all formulas |
| Taxonomy keywords overlap causing wrong mappings | Tests verify specific accounts map correctly |
| Import parser breaks with unusual CSV formatting | Tests cover edge cases (empty, numeric types) |
| Validation schemas reject valid input | Tests cover all valid enum values |

---

## Future Test Additions (v2)
- Integration tests for API endpoints (POST/GET/PATCH/DELETE)
- Component tests for charts and interactive elements (React Testing Library)
- E2E tests for full import-to-analysis flow (Playwright)
- Performance tests for large datasets (1000+ line items)
- Excel (.xlsx) parsing tests (requires test fixture files)
