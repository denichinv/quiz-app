import type { QuizQuestionWithAnswers } from "../types/Quiz";

import { shuffleArray } from "./shuffleArray";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// This quiz supports exactly one correct, non-empty, distinct answer.
const parseQuestion = (value: unknown): QuizQuestionWithAnswers | null => {
  if (
    !isRecord(value) ||
    typeof value.question !== "string" ||
    !value.question.trim() ||
    !isRecord(value.answers) ||
    !isRecord(value.correct_answers)
  ) return null;

  const answers: string[] = [];
  const correctAnswers: string[] = [];
  const answerKeys = [
    "answer_a", "answer_b", "answer_c", "answer_d", "answer_e", "answer_f",
  ];
  for (const key of answerKeys) {
    const answer = value.answers[key];
    const flag = value.correct_answers[`${key}_correct`];
    if (answer === null || answer === undefined) {
      if (flag !== undefined && flag !== "false") return null;
      continue;
    }
    if (
      typeof answer !== "string" ||
      !answer.trim() ||
      (flag !== "true" && flag !== "false")
    ) return null;
    answers.push(answer);
    if (flag === "true") correctAnswers.push(answer);
  }

  if (
    answers.length < 2 ||
    correctAnswers.length !== 1 ||
    new Set(answers.map((answer) => answer.trim())).size !== answers.length
  ) return null;

  const correctAnswer = correctAnswers[0];
  return {
    question: value.question,
    correct_answer: correctAnswer,
    incorrect_answers: answers.filter((answer) => answer !== correctAnswer),
    answers: shuffleArray(answers),
  };
};

export const fetchQuizQuestions = async (
  category: string,
  difficulty: string,
  limit: number,
  signal?: AbortSignal,
): Promise<QuizQuestionWithAnswers[]> => {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  if (category) {
    params.set("category", category);
  }

  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort(signal?.reason);
  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });

  // Keep the deadline active through response-body reading, not just headers.
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15_000);

  try {
    controller.signal.throwIfAborted();
    let res: Response;
    try {
      res = await fetch(`/.netlify/functions/questions?${params.toString()}`, {
        signal: controller.signal,
      });
    } catch {
      controller.signal.throwIfAborted();
      throw new Error("Couldn't connect. Check your internet connection and try again.");
    }

    if (!res.ok) {
      throw new Error(res.status === 429
        ? "Too many quiz requests. Please wait a moment and retry."
        : "The quiz service is unavailable. Please try again.");
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      controller.signal.throwIfAborted();
      throw new Error("The quiz service returned an invalid response. Please try again.");
    }
    controller.signal.throwIfAborted();
    if (!Array.isArray(data)) {
      throw new Error("The quiz service returned an invalid response. Please try again.");
    }

    const questions = data.flatMap((question: unknown) => {
      const parsed = parseQuestion(question);
      return parsed ? [parsed] : [];
    });
    if (data.length > 0 && questions.length === 0) {
      throw new Error("No supported single-answer questions were returned. Try again or change your settings.");
    }
    return questions;
  } catch (error) {
    if (timedOut) {
      throw new Error("Loading questions took too long. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
};
