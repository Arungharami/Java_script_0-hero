import { test, expect } from "@playwright/test";
test("core routes render", async ({ page }) => {
  for (const route of [
    "/roadmap",
    "/practice",
    "/projects",
    "/playground",
    "/resources/cheatsheets",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
  }
});
