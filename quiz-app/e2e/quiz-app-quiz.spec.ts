import { test, expect } from "@playwright/test";
import { mockQuizQuestions } from "./mocks/quizQuestions";

test.describe("Quiz App – Quiz flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/.netlify/functions/questions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockQuizQuestions),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: /start quiz/i }).click();
    await expect(page.getByTestId("quiz-question")).toBeVisible();
  });

  test("answer -> feedback -> next question", async ({ page }) => {
    const firstQuestion = await page.getByTestId("quiz-question").textContent();

    await page.getByTestId("answer-0").click();

    await expect(page.getByTestId("answer-0")).toBeDisabled();
    await expect(page.getByTestId("answer-1")).toBeDisabled();

    await expect(page.getByText(/correct|incorrect/i)).toBeVisible();

    await page.getByRole("button", { name: /next question/i }).click();

    await expect(page.getByTestId("quiz-question")).not.toHaveText(
      firstQuestion ?? "",
    );
  });
});
