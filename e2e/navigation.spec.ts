import { test, expect } from "@playwright/test";
test("core routes render", async ({ page }) => {
  for (const route of [
    "/roadmap",
    "/practice",
    "/practice/debug",
    "/projects",
    "/playground",
    "/dashboard",
    "/skills",
    "/interview",
    "/career",
    "/resources/cheatsheets",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
  }
});
