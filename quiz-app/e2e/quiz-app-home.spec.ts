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
  test("start quiz show questions", async ({ page }) => {
    const button = page.getByRole("button", { name: "Start Quiz" });
    await button.click();
    await expect(page.getByText(/Score:/i)).toBeVisible();
    await expect(page.getByTestId("quiz-question")).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await expect(page.getByTestId(`answer-${i}`)).toBeVisible();
    }
  });
});
