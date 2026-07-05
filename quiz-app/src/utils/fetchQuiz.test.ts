import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchQuizQuestions } from "./fetchQuiz";

describe("FetchQuiz testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("should call the Netlify function with the correct query params", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await fetchQuizQuestions("SQL", "easy", 5);

    expect(fetchMock).toHaveBeenCalledWith(
      "/.netlify/functions/questions?limit=5&category=SQL&difficulty=easy",
    );
  });

  test("should return empty array when request fails", async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error("Network error")));

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchQuizQuestions("SQL", "easy", 5);

    expect(result).toEqual([]);
  });

  test("should return empty array when API response is not ok", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Something went wrong" }),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchQuizQuestions("SQL", "easy", 5);

    expect(result).toEqual([]);
  });

  test("should return empty array when API response is invalid", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ error: "Invalid response" }),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchQuizQuestions("SQL", "easy", 5);

    expect(result).toEqual([]);
  });

  test("should successfully fetch and transform quiz data", async () => {
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

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchQuizQuestions("SQL", "easy", 5);

    expect(result).toHaveLength(1);
    expect(result[0].question).toBe("What is React?");
    expect(result[0].correct_answer).toBe("A library");
    expect(result[0].incorrect_answers).toEqual(["A framework"]);
    expect(result[0].answers).toHaveLength(2);
    expect(result[0].answers).toContain("A framework");
    expect(result[0].answers).toContain("A library");
  });
});
