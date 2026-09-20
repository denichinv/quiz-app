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
      { signal: expect.any(AbortSignal) },
    );
  });

  test("reports connection failures", async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error("Network error")));

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchQuizQuestions("SQL", "easy", 5)).rejects.toThrow("Couldn't connect");
  });

  test("reports service failures", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Something went wrong" }),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchQuizQuestions("SQL", "easy", 5)).rejects.toThrow("quiz service is unavailable");
  });

  test("reports invalid responses", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ error: "Invalid response" }),
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchQuizQuestions("SQL", "easy", 5)).rejects.toThrow("invalid response");
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

describe("single-answer validation", () => {
  const valid = {
    question: "Question?",
    answers: { answer_a: "Yes", answer_b: "No" },
    correct_answers: { answer_a_correct: "true", answer_b_correct: "false" },
  };
  afterEach(() => vi.unstubAllGlobals());

  test.each([
    null,
    {},
    { ...valid, question: " " },
    { ...valid, correct_answers: { answer_a_correct: "true", answer_b_correct: "true" } },
    { ...valid, correct_answers: { answer_a_correct: "false", answer_b_correct: "false" } },
    { ...valid, correct_answers: {} },
    { ...valid, answers: { answer_a: null, answer_b: "No" } },
    { ...valid, answers: { answer_a: " ", answer_b: "No" } },
    { ...valid, answers: { answer_a: "Yes", answer_b: " Yes " } },
    { ...valid, answers: { answer_a: "Yes" } },
  ])("skips invalid question %# and preserves valid questions", async (invalid) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => [invalid, valid],
    }));
    const result = await fetchQuizQuestions("", "", 5);
    expect(result).toHaveLength(1);
    expect(result[0].correct_answer).toBe("Yes");
    expect(result[0].answers).toEqual(expect.arrayContaining(["Yes", "No"]));
  });

  test("reports when all questions are unsupported", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => [null, {}],
    }));
    await expect(fetchQuizQuestions("", "", 5)).rejects.toThrow("No supported single-answer questions");
  });
});

 test("reports rate limits even when the response body is not JSON", async () => {
   vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
   try {
     await expect(fetchQuizQuestions("", "", 5)).rejects.toThrow("Too many quiz requests");
   } finally { vi.unstubAllGlobals(); }
 });
 test("reports malformed JSON", async () => {
   vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
     ok: true, json: async () => { throw new SyntaxError("Invalid JSON"); },
   }));
   try {
     await expect(fetchQuizQuestions("", "", 5)).rejects.toThrow("invalid response");
   } finally { vi.unstubAllGlobals(); }
 });

describe("request deadlines and cancellation", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const waitForAbort = (signal: AbortSignal) => new Promise<never>((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });

  test.each(["headers", "body"])("times out stalled %s and allows a fresh retry", async (stage) => {
    let requestSignal!: AbortSignal;
    const fetchMock = vi.fn((_url: string, options: RequestInit) => {
      requestSignal = options.signal as AbortSignal;
      return stage === "headers"
        ? waitForAbort(requestSignal)
        : Promise.resolve({ ok: true, json: () => waitForAbort(requestSignal) });
    });
    vi.stubGlobal("fetch", fetchMock);
    const request = fetchQuizQuestions("", "", 5);
    const assertion = expect(request).rejects.toThrow("Loading questions took too long");
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
    expect(requestSignal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    await expect(fetchQuizQuestions("", "", 5)).resolves.toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("cancels an obsolete request without reporting a timeout", async () => {
    const caller = new AbortController();
    let requestSignal!: AbortSignal;
    vi.stubGlobal("fetch", vi.fn((_url: string, options: RequestInit) => {
      requestSignal = options.signal as AbortSignal;
      return waitForAbort(requestSignal);
    }));
    const request = fetchQuizQuestions("", "", 5, caller.signal);
    const assertion = expect(request).rejects.toMatchObject({ name: "AbortError" });
    caller.abort();
    await assertion;
    expect(requestSignal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("does not send an already-cancelled request", async () => {
    const caller = new AbortController();
    caller.abort();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchQuizQuestions("", "", 5, caller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});

test("shows the retryable timeout message when the proxy returns 504", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 504 }));
  try {
    await expect(fetchQuizQuestions("", "", 5)).rejects.toThrow("Loading questions took too long. Please try again.");
  } finally {
    vi.unstubAllGlobals();
  }
});
