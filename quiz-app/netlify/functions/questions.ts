import type { Handler, HandlerResponse } from "@netlify/functions";

type QuizApiAnswer = {
  text: string;
  isCorrect: boolean;
};

type QuizApiQuestion = {
  text: string;
  answers: QuizApiAnswer[];
};

type QuizApiResponse = {
  success: boolean;
  data?: QuizApiQuestion[];
  error?: string;
};

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
  const apiKey = process.env.QUIZ_API_KEY?.trim();

  if (!apiKey) {
    return jsonResponse(500, { error: "Quiz API key is missing" });
  }

  const category = event.queryStringParameters?.category;
  const difficulty = event.queryStringParameters?.difficulty;
  const limit = event.queryStringParameters?.limit ?? "5";

  const params = new URLSearchParams({
    limit,
  });

  if (category) {
    params.set("category", category);
  }

  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const data = (await response.json()) as QuizApiResponse;

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: data.error ?? "Failed to fetch quiz questions",
      });
    }

    if (!Array.isArray(data.data)) {
      return jsonResponse(502, {
        error: "Unexpected QuizAPI response format",
      });
    }

    const normalizedQuestions = data.data.map(normalizeQuestion);

    return jsonResponse(200, normalizedQuestions);
  } catch (error) {
    console.error("QuizAPI request failed:", error);

    return jsonResponse(500, {
      error: "Failed to fetch quiz questions",
    });
  }
};
