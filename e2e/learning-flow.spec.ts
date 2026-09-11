import { test, expect } from "@playwright/test";
test("learner can open week one, run code, and complete a lesson", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /JavaScript from Zero to Hero/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Start Week 1/i }).click();
  await expect(
    page.getByRole("heading", { name: "JavaScript Foundations" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /How JavaScript runs/i })
    .first()
    .click();
  await page.getByRole("button", { name: "Run", exact: true }).first().click();
  await expect(page.getByText(/Learning JavaScript/).last()).toBeVisible();
  await page.getByRole("button", { name: /Mark lesson complete/i }).click();
  await expect(
    page.getByRole("button", { name: /Lesson completed/i }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText("1 / 64")).toBeVisible();
});
