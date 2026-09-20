import { test, expect } from "@playwright/test";
import { mockQuizQuestions } from "./mocks/quizQuestions";

test("recovers from a request timeout using Retry", async ({ page }) => {
  await page.clock.install();
  let requests = 0;
  await page.route("**/.netlify/functions/questions**", async (route) => {
    requests++;
    // Leave the first request pending to exercise the actual browser deadline.
    if (requests === 1) return;
    await route.fulfill({ json: mockQuizQuestions });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start Quiz" }).click();
  await expect.poll(() => requests).toBe(1);
  await expect(page.getByText("Loading questions...")).toBeVisible();
  await page.clock.fastForward(15_000);
  await expect(page.getByRole("alert")).toHaveText("Loading questions took too long. Please try again.");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByTestId("quiz-question")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(requests).toBe(2);
});
