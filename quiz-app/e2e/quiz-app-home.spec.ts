import { test, expect } from "@playwright/test";

test.describe("home page and start quiz", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://dev-quiz-v.netlify.app/");
  });
  test("home page loads", async ({ page }) => {
    await expect(page.getByText(/quiz setup/i)).toBeVisible();
    await expect(page.getByText(/category:/i)).toBeVisible();
    await expect(page.getByText(/difficulty:/i)).toBeVisible();
    await expect(page.getByText(/number of questions:/i)).toBeVisible();
    await expect(page.getByRole("button")).toContainText(/start quiz/i);
  });
  test("start quiz shows first question", async ({ page }) => {
    const button = page.getByRole("button", { name: "Start Quiz" });
    await button.click();
    await expect(page.getByText(/Score:/i)).toBeVisible();
  });
});
