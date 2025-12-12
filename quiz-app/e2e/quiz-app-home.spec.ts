import { test, expect } from "@playwright/test";

test.describe("should render home page", () => {
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
});
