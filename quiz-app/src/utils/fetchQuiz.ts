import { QuizQuestion, QuizQuestionWithAnswers } from "../types/Quiz";
import { shuffleArray } from "./shuffleArray";

export const fetchQuizQuestions = async (): Promise<
  QuizQuestionWithAnswers[]
> => {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();
  console.log("API Data:", data);
  if (!data.results) {
    return [];
  }
  return data.results.map((q: QuizQuestion) => ({
    ...q,
    answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
  }));
};
