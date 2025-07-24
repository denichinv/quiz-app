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

  return data.map((q: any) => {
    const allAnswers = Object.entries(q.answers)
      .filter(([_, value]) => value !== null)
      .map(([_, value]) => value as string);

    const correctKey = Object.entries(q.correct_answers).find(
      ([_, isCorrect]) => isCorrect === "true"
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
};
