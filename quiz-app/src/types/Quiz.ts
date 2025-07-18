export type QuizQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type QuizQuestionWithAnswers = QuizQuestion & {
  answers: string[];
};
