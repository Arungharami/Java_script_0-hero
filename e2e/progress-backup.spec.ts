import { test, expect } from "@playwright/test";

test("learner can export progress, clear local data, and restore it via import", async ({
  page,
}) => {
  await page.goto("/learn/week/1/how-javascript-runs");
  await page.getByRole("button", { name: /Mark lesson complete/i }).click();

  await page.goto("/dashboard");
  await expect(page.getByText("1 / 64")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByText("0 / 64")).toBeVisible();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath!);
  await page.getByRole("button", { name: /Overwrite and import/i }).click();

  await expect(page.getByText(/imported successfully/i)).toBeVisible();
  await expect(page.getByText("1 / 64")).toBeVisible();
});
