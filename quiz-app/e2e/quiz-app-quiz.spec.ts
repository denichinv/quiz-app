import { test, expect } from "@playwright/test";

test.describe("Quiz App - Quiz flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://dev-quiz-v.netlify.app/");
    const startButton = page.getByRole("button", { name: "Start Quiz" });
    await startButton.click();
  });

  test("should select an answer moves to the next question", async ({
    page,
  }) => {
    await expect(page.getByRole("button")).toHaveCount(4);

    await page.getByRole("button")[0].click();

    await expect(page.getByTestId(`answer-1`)).toBeDisabled();
    await expect(page.getByTestId(`answer-2`)).toBeDisabled();
    await expect(page.getByTestId(`answer-3`)).toBeDisabled();
    await expect(page.getByTestId(`answer-4`)).toBeDisabled();

    await expect(page.getByRole("button")).toHaveCount(6);
  });
});
