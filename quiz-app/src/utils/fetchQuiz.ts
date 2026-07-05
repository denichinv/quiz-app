import type { QuizQuestionWithAnswers } from "../types/Quiz";

import { shuffleArray } from "./shuffleArray";

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

    return data.map((q: any) => {
      const allAnswers = Object.entries(q.answers)
        .filter(([_, value]) => value !== null)
        .map(([_, value]) => value as string);

      const correctKey = Object.entries(q.correct_answers).find(
        ([_, isCorrect]) => isCorrect === "true",
      )?.[0];

      const correctAnswerKey = correctKey?.replace("_correct", "");
      const correctAnswer = correctAnswerKey ? q.answers[correctAnswerKey] : "";

      return {
        question: q.question,
        correct_answer: correctAnswer,
        incorrect_answers: allAnswers.filter((a) => a !== correctAnswer),
        answers: shuffleArray(allAnswers),
      };
    });
  } catch (error) {
    console.error("Quiz request failed:", error);
    return [];
  }
};
