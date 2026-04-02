import { test, expect } from "@playwright/test";

test.describe("App Library — Page Load", () => {
  test("displays the page title and subtitle", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("page-title")).toHaveText("Assessment Platform");
    await expect(page.locator("p.text-lg")).toContainText("consultants who evaluate organizations");
  });

  test("renders platform stats", async ({ page }) => {
    await page.goto("/");
    const stats = page.getByTestId("platform-stats");
    await expect(stats).toBeVisible();
    // Should show at least 4 stat cards
    await expect(stats.locator("> div")).toHaveCount(4);
  });

  test("displays the correct total apps count", async ({ page }) => {
    await page.goto("/");
    const totalApps = page.getByTestId("stat-total-apps");
    await expect(totalApps).toHaveText("7");
  });

  test("displays the correct live apps count", async ({ page }) => {
    await page.goto("/");
    const liveCount = page.getByTestId("stat-live");
    await expect(liveCount).toHaveText("4");
  });

  test("displays the correct test count", async ({ page }) => {
    await page.goto("/");
    const testCount = page.getByTestId("stat-tests-passing");
    await expect(testCount).toHaveText("174");
  });
});

test.describe("App Library — App Cards", () => {
  test("renders all app cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[data-testid^='app-card-']");
    await expect(cards).toHaveCount(7);
  });

  test("shows Financial Analyzer as live", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("app-card-financial-analyzer");
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-status", "live");
    const badge = page.getByTestId("status-badge-financial-analyzer");
    await expect(badge).toHaveText("Live");
  });

  test("shows Org Mapper as coming soon", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("app-card-org-mapper");
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-status", "coming-soon");
    const badge = page.getByTestId("status-badge-org-mapper");
    await expect(badge).toHaveText("Coming Soon");
  });

  test("live apps have launch buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("launch-btn-financial-analyzer")).toBeVisible();
    await expect(page.getByTestId("launch-btn-engagement-workspace")).toBeVisible();
    await expect(page.getByTestId("launch-btn-findings-recommendations")).toBeVisible();
  });

  test("coming soon apps do not have launch buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-testid='launch-btn-org-mapper']")).toHaveCount(0);
    await expect(page.locator("[data-testid='launch-btn-contract-tracker']")).toHaveCount(0);
  });

  test("displays feature lists in app cards", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("app-card-financial-analyzer");
    await expect(card).toContainText("CSV/Excel financial statement import");
    await expect(card).toContainText("EBITDA normalization");
  });

  test("displays tech stack pills", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("app-card-financial-analyzer");
    await expect(card).toContainText("Next.js 14");
    await expect(card).toContainText("Prisma");
    await expect(card).toContainText("Recharts");
  });

  test("displays test counts for live apps", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("app-card-financial-analyzer");
    await expect(card).toContainText("74 tests");
  });
});

test.describe("App Library — Categories", () => {
  test("renders all three categories", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("category-core-analysis")).toBeVisible();
    await expect(page.getByTestId("category-workflow")).toBeVisible();
    await expect(page.getByTestId("category-infrastructure")).toBeVisible();
  });

  test("core analysis category has Financial Analyzer and coming-soon apps", async ({ page }) => {
    await page.goto("/");
    const section = page.getByTestId("category-core-analysis");
    await expect(section).toContainText("Financial Analyzer");
    await expect(section).toContainText("Org Mapper");
    await expect(section).toContainText("Contract Tracker");
  });

  test("workflow category has Engagement Workspace and Findings", async ({ page }) => {
    await page.goto("/");
    const section = page.getByTestId("category-workflow");
    await expect(section).toContainText("Engagement Workspace");
    await expect(section).toContainText("Findings & Recommendations");
  });
});

test.describe("App Library — Search & Filter", () => {
  test("search input is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("search-input")).toBeVisible();
  });

  test("searching filters app cards", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-input").fill("financial");
    // Should show Financial Analyzer, maybe others with "financial" in description
    const cards = page.locator("[data-testid^='app-card-']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThan(7);
    await expect(page.getByTestId("app-card-financial-analyzer")).toBeVisible();
  });

  test("searching for nonexistent term shows no results", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-input").fill("xyznonexistent");
    await expect(page.getByTestId("no-results")).toBeVisible();
    await expect(page.getByTestId("no-results")).toContainText("No apps match");
  });

  test("filter by Live status", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("filter-live").click();
    const cards = page.locator("[data-testid^='app-card-']");
    const count = await cards.count();
    expect(count).toBe(4); // 4 live apps
    // All visible cards should be live
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute("data-status", "live");
    }
  });

  test("filter by Coming Soon status", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("filter-coming-soon").click();
    const cards = page.locator("[data-testid^='app-card-']");
    const count = await cards.count();
    expect(count).toBe(3); // 3 coming-soon apps
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute("data-status", "coming-soon");
    }
  });

  test("filter All shows everything", async ({ page }) => {
    await page.goto("/");
    // First filter to live
    await page.getByTestId("filter-live").click();
    const liveCount = await page.locator("[data-testid^='app-card-']").count();
    expect(liveCount).toBe(4);
    // Then click All
    await page.getByTestId("filter-all").click();
    const allCount = await page.locator("[data-testid^='app-card-']").count();
    expect(allCount).toBe(7);
  });

  test("search and filter work together", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("filter-live").click();
    await page.getByTestId("search-input").fill("engagement");
    const cards = page.locator("[data-testid^='app-card-']");
    await expect(cards).toHaveCount(1);
    await expect(page.getByTestId("app-card-engagement-workspace")).toBeVisible();
  });

  test("clearing search shows all filtered results", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-input").fill("xyz");
    await expect(page.getByTestId("no-results")).toBeVisible();
    await page.getByTestId("search-input").clear();
    const cards = page.locator("[data-testid^='app-card-']");
    await expect(cards).toHaveCount(7);
  });
});

test.describe("App Library — Responsive & Accessibility", () => {
  test("page has proper title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/App Library/);
  });

  test("app icons have aria labels", async ({ page }) => {
    await page.goto("/");
    const icons = page.locator("[role='img']");
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
