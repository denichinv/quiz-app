import type { Handler, HandlerResponse } from "@netlify/functions";

const jsonResponse = (statusCode: number, body: unknown): HandlerResponse => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
    api_key: apiKey,
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
          "X-Api-Key": apiKey,
        },
      },
    );

    const data = await response.json();

    return jsonResponse(response.status, data);
  } catch (error) {
    console.error("QuizAPI request failed:", error);

    return jsonResponse(500, {
      error: "Failed to fetch quiz questions",
    });
  }
};
