// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { HandlerContext, HandlerEvent } from "@netlify/functions";
import { handler } from "../functions/questions";
import { QUIZ_CATEGORIES, QUIZ_DIFFICULTIES, QUIZ_LIMITS } from "../../src/constants/quizOptions";

const question = {
  text: "What is React?",
  answers: [{ text: "A library", isCorrect: true }, { text: "A database", isCorrect: false }],
};
const fetchMock = vi.fn();
const invoke = async (queryStringParameters: Record<string, string | undefined> | null = null, httpMethod = "GET") => {
  const response = await handler(
    { httpMethod, queryStringParameters } as HandlerEvent,
    {} as HandlerContext,
    vi.fn(),
  );
  if (!response) throw new Error("Handler did not return a response");
  return response;
};

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ data: [question] }) });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("QUIZ_API_KEY", " test-key ");
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("request validation", () => {
  test.each(["POST", "PUT", "DELETE", "OPTIONS", "HEAD"])("rejects %s without calling QuizAPI", async (method) => {
    const result = await invoke(null, method);
    expect(result.statusCode).toBe(405);
    expect(result.headers?.Allow).toBe("GET");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(["", "0", "-1", "1", "21", "1000", "5.0", "5abc", " 5", "05"])("rejects invalid limit %j", async (limit) => {
    expect((await invoke({ limit })).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([{ category: "Unknown" }, { difficulty: "expert" }, { difficulty: "EASY" }])("rejects unsupported settings %j", async (query) => {
    expect((await invoke(query)).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(QUIZ_LIMITS)("accepts question count %s", async (limit) => {
    expect((await invoke({ limit: String(limit) })).statusCode).toBe(200);
  });
  test.each(QUIZ_CATEGORIES)("accepts category %s", async (category) => {
    expect((await invoke({ category })).statusCode).toBe(200);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("category")).toBe(category);
  });
  test.each(QUIZ_DIFFICULTIES)("accepts difficulty %s", async (difficulty) => {
    expect((await invoke({ difficulty })).statusCode).toBe(200);
  });

  test("defaults to five questions and omits Any filters", async () => {
    await invoke({ category: "", difficulty: "" });
    expect(fetchMock).toHaveBeenCalledWith("https://quizapi.io/api/v1/questions?limit=5", {
      headers: { Authorization: "Bearer test-key" }, signal: expect.any(AbortSignal),
    });
  });

  test.each(["", "   "])("handles a missing API key", async (key) => {
    vi.stubEnv("QUIZ_API_KEY", key);
    expect((await invoke()).statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("upstream responses", () => {
  test("normalizes answers without exposing the API key", async () => {
    const result = await invoke();
    expect(result.statusCode).toBe(200);
    expect(result.headers?.["Content-Type"]).toBe("application/json");
    expect(JSON.parse(result.body ?? "")).toEqual([{
      question: "What is React?",
      answers: { answer_a: "A library", answer_b: "A database", answer_c: null, answer_d: null, answer_e: null, answer_f: null },
      correct_answers: { answer_a_correct: "true", answer_b_correct: "false", answer_c_correct: "false", answer_d_correct: "false", answer_e_correct: "false", answer_f_correct: "false" },
    }]);
    expect(result.body).not.toContain("test-key");
  });

  test("preserves an empty result", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    expect((await invoke()).body).toBe("[]");
  });

  test.each([null, [], {}, { data: [null] }, { data: [{}] },
    { data: [{ ...question, answers: [{ text: "Yes", isCorrect: "false" }, question.answers[1]] }] },
    { data: [{ ...question, answers: Array(7).fill(question.answers[0]) }] },
  ])("rejects malformed upstream data %#", async (data) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => data });
    expect((await invoke()).statusCode).toBe(502);
  });

  test.each([401, 403, 500, 502, 429])("handles HTTP %s without reading or exposing its body", async (status) => {
    const json = vi.fn().mockRejectedValue(new Error("Secret upstream details: test-key"));
    fetchMock.mockResolvedValue({ ok: false, status, json });
    const result = await invoke();
    expect(result.statusCode).toBe(status === 429 ? 429 : 502);
    expect(json).not.toHaveBeenCalled();
    expect(result.body).not.toContain("test-key");
  });

  test("handles malformed JSON", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError("Invalid JSON"); } });
    expect((await invoke()).statusCode).toBe(502);
  });
  test("handles network failure without returning internal details", async () => {
    fetchMock.mockRejectedValue(new Error("Secret: test-key"));
    const result = await invoke();
    expect(result.statusCode).toBe(502);
    expect(result.body).not.toContain("test-key");
  });

  test.each(["headers", "body"])("times out stalled %s and clears its timer", async (stage) => {
    vi.useFakeTimers();
    let signal!: AbortSignal;
    fetchMock.mockImplementation((_url: string, options: RequestInit) => {
      signal = options.signal as AbortSignal;
      const pending = () => new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
      return stage === "headers" ? pending() : Promise.resolve({ ok: true, json: pending });
    });
    const request = invoke();
    await vi.advanceTimersByTimeAsync(10_000);
    expect((await request).statusCode).toBe(504);
    expect(signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("clears its timeout after success", async () => {
    vi.useFakeTimers();
    await invoke();
    expect(vi.getTimerCount()).toBe(0);
  });
});
