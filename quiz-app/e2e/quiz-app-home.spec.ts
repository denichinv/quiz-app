import { test, expect } from "@playwright/test";
import { mockQuizQuestions } from "./mocks/quizQuestions";

test.describe("Quiz App – Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/.netlify/functions/questions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockQuizQuestions),
      });
    });

    await page.goto("/");
  });

  test("home page loads", async ({ page }) => {
    await expect(page.getByText(/quiz setup/i)).toBeVisible();
    await expect(page.getByText(/category:/i)).toBeVisible();
    await expect(page.getByText(/difficulty:/i)).toBeVisible();
    await expect(page.getByText(/number of questions:/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /start quiz/i }),
    ).toBeVisible();
  });

  test("start quiz shows question and answers", async ({ page }) => {
    await page.getByRole("button", { name: /start quiz/i }).click();

    await expect(page.getByTestId("quiz-question")).toBeVisible();

    await expect(page.getByTestId("answer-0")).toBeVisible();
    await expect(page.getByTestId("answer-1")).toBeVisible();

    const answers = page.getByRole("button");
    const count = await answers.count();

    expect(count).toBe(2);
  });
});
