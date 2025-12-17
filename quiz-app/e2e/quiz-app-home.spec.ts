import { test, expect } from "@playwright/test";

test.describe("Quiz App – Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://dev-quiz-v.netlify.app/");
  });
  test("home page loads", async ({ page }) => {
    await expect(page.getByText(/quiz setup/i)).toBeVisible();
    await expect(page.getByText(/category:/i)).toBeVisible();
    await expect(page.getByText(/difficulty:/i)).toBeVisible();
    await expect(page.getByText(/number of questions:/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /start quiz/i })
    ).toBeVisible();
  });
  test("start quiz shows question and answers", async ({ page }) => {
    await page.getByRole("button", { name: /start quiz/i }).click();

    await expect(page.getByTestId("quiz-question")).toBeVisible();

    const answers = page.getByRole("button");
    await expect(answers.first()).toBeVisible();

    const count = await answers.count();
    expect(count).toBeGreaterThan(2);
  });
});
