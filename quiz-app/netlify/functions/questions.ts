import type { Handler, HandlerResponse } from "@netlify/functions";
import { QUIZ_CATEGORIES, QUIZ_DIFFICULTIES, QUIZ_LIMITS } from "../../src/constants/quizOptions";

type QuizApiAnswer = {
  text: string;
  isCorrect: boolean;
};

type QuizApiQuestion = {
  text: string;
  answers: QuizApiAnswer[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isQuestion = (value: unknown): value is QuizApiQuestion =>
  isRecord(value) && typeof value.text === "string" && value.text.trim().length > 0 &&
  Array.isArray(value.answers) && value.answers.length >= 2 && value.answers.length <= 6 &&
  value.answers.every((answer: unknown) =>
    isRecord(answer) && typeof answer.text === "string" && answer.text.trim().length > 0 &&
    typeof answer.isCorrect === "boolean");

const jsonResponse = (statusCode: number, body: unknown): HandlerResponse => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

const answerKeys = [
  "answer_a",
  "answer_b",
  "answer_c",
  "answer_d",
  "answer_e",
  "answer_f",
] as const;

const normalizeQuestion = (question: QuizApiQuestion) => {
  const answers = Object.fromEntries(
    answerKeys.map((key, index) => [
      key,
      question.answers[index]?.text ?? null,
    ]),
  );

  const correctAnswers = Object.fromEntries(
    answerKeys.map((key, index) => [
      `${key}_correct`,
      question.answers[index]?.isCorrect ? "true" : "false",
    ]),
  );

  return {
    question: question.text,
    answers,
    correct_answers: correctAnswers,
  };
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = jsonResponse(405, { error: "Only GET requests are supported" });
    return { ...response, headers: { ...response.headers, Allow: "GET" } };
  }

  const category = event.queryStringParameters?.category;
  const difficulty = event.queryStringParameters?.difficulty;
  const limit = event.queryStringParameters?.limit ?? "5";

  if (!QUIZ_LIMITS.some((count) => String(count) === limit)) {
    return jsonResponse(400, { error: "Question count must be 5, 10, 15, or 20" });
  }
  if (category && !QUIZ_CATEGORIES.includes(category)) {
    return jsonResponse(400, { error: "Unsupported quiz category" });
  }
  if (difficulty && !QUIZ_DIFFICULTIES.includes(difficulty)) {
    return jsonResponse(400, { error: "Difficulty must be easy, medium, or hard" });
  }

  const apiKey = process.env.QUIZ_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse(500, { error: "Quiz service is not configured" });
  }

  const params = new URLSearchParams({
    limit,
  });

  if (category) {
    params.set("category", category);
  }

  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?${params.toString()}`,
      {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      return jsonResponse(response.status === 429 ? 429 : 502, {
        error: response.status === 429 ? "Too many quiz requests" : "Failed to fetch quiz questions",
      });
    }

    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.data) || !data.data.every(isQuestion)) {
      return jsonResponse(502, { error: "Unexpected QuizAPI response format" });
    }

    return jsonResponse(200, data.data.map(normalizeQuestion));
  } catch {
    return jsonResponse(controller.signal.aborted ? 504 : 502, {
      error: controller.signal.aborted ? "Quiz request timed out" : "Failed to fetch quiz questions",
    });
  } finally {
    clearTimeout(timeout);
  }
};
