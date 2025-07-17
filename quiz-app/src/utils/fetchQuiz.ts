import { QuizQuestion } from "../types/Quiz";

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();
  return data.results;
};
