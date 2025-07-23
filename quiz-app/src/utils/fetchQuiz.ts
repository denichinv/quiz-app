import { QuizQuestionWithAnswers } from "../types/Quiz";
import { shuffleArray } from "./shuffleArray";

export const fetchQuizQuestions = async (): Promise<
  QuizQuestionWithAnswers[]
> => {
  const API_KEY = process.env.REACT_APP_QUIZ_API_KEY;

  if (!API_KEY) {
    console.error("API key is missing");
    return [];
  }

  const res = await fetch("https://quizapi.io/api/v1/questions?limit=5", {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  const data = await res.json();
  console.log("API Response:", data);

  if (!Array.isArray(data)) {
    console.error("Invalid API response:", data);
    return [];
  }

  return data.map((q: any) => ({
    question: q.question,
    correct_answer: q.correct_answer,
    incorrect_answers: Object.values(q.answers).filter(
      (a): a is string => a !== null && a !== q.correct_answer
    ),
    answers: shuffleArray(
      Object.values(q.answers).filter((a): a is string => a !== null)
    ),
  }));
};
