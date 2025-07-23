export type APIAnswerObject = {
  answer_a: string | null;
  answer_b: string | null;
  answer_c: string | null;
  answer_d: string | null;
  answer_e: string | null;
  answer_f: string | null;
};

export type QuizQuestion = {
  question: string;
  correct_answer: string;
  answers: APIAnswerObject;
};

export type QuizQuestionWithAnswers = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
};
