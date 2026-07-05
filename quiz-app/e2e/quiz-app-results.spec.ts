import { test, expect } from "@playwright/test";
import { mockQuizQuestions } from "./mocks/quizQuestions";

test.describe("Quiz App - Results", () => {
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

  test("Completes the quiz and shows final score", async ({ page }) => {
    await page.getByRole("button", { name: /start quiz/i }).click();

    for (let i = 0; i < mockQuizQuestions.length - 1; i++) {
      await expect(page.getByTestId("quiz-question")).toBeVisible();
      await page.getByTestId("answer-0").click();
      await page.getByRole("button", { name: /next question/i }).click();
    }

    await expect(page.getByTestId("quiz-question")).toBeVisible();
    await page.getByTestId("answer-0").click();
    await page.getByRole("button", { name: /finish quiz/i }).click();

    await expect(
      page.getByRole("heading", { name: /quiz complete/i }),
    ).toBeVisible();

    await expect(page.getByText(/final score:/i)).toBeVisible();

    await expect(
      page.getByRole("button", { name: /restart quiz/i }),
    ).toBeVisible();
  });
});
