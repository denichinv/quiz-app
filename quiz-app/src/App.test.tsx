import { describe, vi, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { fetchQuizQuestions } from "./utils/fetchQuiz";

vi.mock("./utils/fetchQuiz", () => ({
  fetchQuizQuestions: vi.fn(),
}));

describe("App integration test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render QuizSetup initially", () => {
    render(<App />);
    expect(screen.getByText("Quiz Setup")).toBeInTheDocument();
  });

  test("should show loading when Start Quiz is clicked", () => {
    vi.mocked(fetchQuizQuestions).mockImplementation(
      () => new Promise(() => {})
    );

    render(<App />);

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    fireEvent.click(startButton);

    expect(screen.getByText("Loading questions...")).toBeInTheDocument();
  });

  test("should show QuestionCard when questions load", async () => {
    vi.mocked(fetchQuizQuestions).mockResolvedValue([
      {
        question: "What is React?",
        correct_answer: "A library",
        incorrect_answers: ["A framework"],
        answers: ["A library", "A framework"],
      },
    ]);

    render(<App />);

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText("What is React?")).toBeInTheDocument();
    });

    expect(screen.getByText("A library")).toBeInTheDocument();
    expect(screen.getByText("A framework")).toBeInTheDocument();
  });
  test("should increment score when correct answer is selected", async () => {
    vi.mocked(fetchQuizQuestions).mockResolvedValue([
      {
        question: "What is React?",
        correct_answer: "A library",
        incorrect_answers: ["A framework"],
        answers: ["A library", "A framework"],
      },
    ]);

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Start Quiz" }));

    await waitFor(() => {
      expect(screen.getByText("What is React?")).toBeInTheDocument();
    });

    expect(screen.getByText("Score: 0 / 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("A library"));

    expect(screen.getByText("Score: 1 / 1")).toBeInTheDocument();
  });
});
