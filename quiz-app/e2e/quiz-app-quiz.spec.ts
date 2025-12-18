import { test, expect } from "@playwright/test";

test.describe("Quiz App – Quiz flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://dev-quiz-v.netlify.app/");
    await page.getByRole("button", { name: /start quiz/i }).click();
    await expect(page.getByTestId("quiz-question")).toBeVisible();
  });

  test("answer -> feedback -> next question", async ({ page }) => {
    const firstQuestion = await page.getByTestId("quiz-question").textContent();
    const answersCount = await page.getByRole("button").count();
    await page.getByTestId("answer-0").click();

    for (let i = 0; i < answersCount; i++) {
      await expect(page.getByTestId(`answer-${i}`)).toBeDisabled();
    }

    await expect(page.getByText(/correct|incorrect/i)).toBeVisible();
    await page.getByRole("button", { name: /next question/i }).click();

    await expect(page.getByTestId("quiz-question")).not.toHaveText(
      firstQuestion ?? ""
    );
  });
});
