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

  try {
    const res = await fetch(
      `/.netlify/functions/questions?${params.toString()}`,
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch quiz questions:", data);
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("Invalid API response:", data);
      return [];
    }

    return data.flatMap((question: unknown) => {
      const parsed = parseQuestion(question);
      return parsed ? [parsed] : [];
    });
  } catch (error) {
    console.error("Quiz request failed:", error);
    return [];
  }
};
