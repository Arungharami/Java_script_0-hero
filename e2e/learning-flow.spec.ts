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
  await page
    .getByRole("button", { name: "Run Code", exact: true })
    .first()
    .click();
  await expect(page.getByText("Hello").last()).toBeVisible();
  await page.getByRole("button", { name: /Mark lesson complete/i }).click();
  await expect(
    page.getByRole("button", { name: /Lesson completed/i }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText("1 / 64")).toBeVisible();
});

test("learner can pass a practice challenge and see it marked complete", async ({
  page,
}) => {
  await page.goto("/practice/challenge/sum-two-numbers");
  await expect(
    page.getByRole("heading", { name: "Sum Two Numbers" }),
  ).toBeVisible();
  const editor = page.getByLabel("Sum Two Numbers · editor");
  await editor.fill("function sumTwoNumbers(a, b) {\n  return a + b;\n}");
  await page.getByRole("button", { name: "Run Tests" }).click();
  await expect(page.getByText(/4 \/ 4 passed/)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Challenge complete/)).toBeVisible();
});

test("learner can take a weekly checkpoint quiz", async ({ page }) => {
  await page.goto("/learn/week/1/quiz");
  await expect(
    page.getByRole("heading", { name: "Checkpoint quiz" }),
  ).toBeVisible();
  for (let i = 0; i < 10; i++) {
    const options = page.locator(".card button").first();
    await options.click();
    await page.getByRole("button", { name: /Check answer/i }).click();
    const next = page.getByRole("button", {
      name: /Next question|See results/i,
    });
    await next.click();
  }
  await expect(
    page.getByRole("heading", { name: /Checkpoint passed|Keep practicing/i }),
  ).toBeVisible();
});
