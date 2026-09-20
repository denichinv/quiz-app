import { test, expect } from "@playwright/test";
import { mockQuizQuestions } from "./mocks/quizQuestions";

for (const width of [390, 1280]) {
  test(`reviews and retries missed answers at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    let requests = 0;
    await page.route("**/.netlify/functions/questions**", async (route) => {
      requests++;
      await route.fulfill({ json: mockQuizQuestions.slice(0, 2) });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Start Quiz" }).click();
    await page.getByRole("button", { name: "A JavaScript library", exact: true }).click();
    await page.getByRole("button", { name: /Next Question/ }).click();
    await page.getByRole("button", { name: "Computer Style Syntax", exact: true }).click();
    await page.getByRole("button", { name: "Finish Quiz" }).click();
    await expect(page.getByText("Final Score: 1 / 2")).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(2);
    await expect(page.getByRole("heading", { name: /Quiz Complete/ })).toBeFocused();
    await page.screenshot({ path: `/tmp/quiz-review-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Retry missed questions (1)" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Question 1 of 1")).toBeVisible();
    await page.getByRole("button", { name: "Cascading Style Sheets", exact: true }).click();
    await page.getByRole("button", { name: "Finish Quiz" }).click();
    await expect(page.getByText("Final Score: 1 / 1")).toBeVisible();
    await expect(page.getByRole("button", { name: /Retry missed/ })).toHaveCount(0);
    expect(requests).toBe(1);
  });
}
