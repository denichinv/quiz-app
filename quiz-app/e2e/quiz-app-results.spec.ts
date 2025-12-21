import { test, expect } from "@playwright/test";

test.describe("Quiz App - Results", () => {
  test("Completes the quiz and shows final score", async ({ page }) => {
    await page.goto("https://dev-quiz-v.netlify.app/");

    const startButton = page.getByRole("button", { name: /start quiz/i });

    await startButton.click();

    const quizButton = page.getByTestId("answer-1");
    const nextQuestionButton = page.getByRole("button", {
      name: /next question/i,
    });
    const finishButton = page.getByRole("button", { name: /finish quiz/i });

    for (let i = 0; i < 4; i++) {
      await quizButton.click();
      await nextQuestionButton.click();
    }

    await quizButton.click();
    await finishButton.click();

    await expect(
      page.getByRole("heading", { name: /quiz complete/i })
    ).toBeVisible();
    await expect(page.getByText(/final score:/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /restart quiz/i })
    ).toBeVisible();
  });
});
