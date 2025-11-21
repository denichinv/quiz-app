import { fetchQuizQuestions } from "./fetchQuiz";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

describe("FetchQuiz testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("should return empty array when api key is missing", async () => {
    vi.stubEnv("VITE_QUIZ_API_KEY", "");
    const result = await fetchQuizQuestions("SQL", "easy", 5);
    expect(result).toEqual([]);
  });

  test("should return empty array when API response is invalid", async () => {
    vi.stubEnv("VITE_QUIZ_API_KEY", "test-key-123");

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: "Something went wrong" }),
      })
    ) as any;

    const result = await fetchQuizQuestions("SQL", "easy", 5);
    expect(result).toEqual([]);
  });

  test("should successfully fetch and transform quiz data", async () => {
    vi.stubEnv("VITE_QUIZ_API_KEY", "test-key-123");

    const mockApiResponse = [
      {
        question: "What is React?",
        answers: {
          answer_a: "A library",
          answer_b: "A framework",
          answer_c: null,
          answer_d: null,
          answer_e: null,
          answer_f: null,
        },
        correct_answers: {
          answer_a_correct: "true",
          answer_b_correct: "false",
        },
      },
    ];

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as any;

    const result = await fetchQuizQuestions("SQL", "easy", 5);

    expect(result).toHaveLength(1);
    expect(result[0].question).toBe("What is React?");
    expect(result[0].correct_answer).toBe("A library");
    expect(result[0].answers).toHaveLength(2);
    expect(result[0].answers).toContain("A framework");
    expect(result[0].answers).toContain("A library");
  });
});
