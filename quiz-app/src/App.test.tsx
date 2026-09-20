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
      () => new Promise(() => {}),
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
  test("should show an empty-state message when no questions are returned", async () => {
    vi.mocked(fetchQuizQuestions).mockResolvedValue([]);

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Start Quiz" }));

    await waitFor(() => {
      expect(screen.getByText("Could not load quiz")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "No questions found for this selection. Try another category or choose Any.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Back to setup" }),
    ).toBeInTheDocument();
  });
});

describe("request recovery", () => {
  beforeEach(() => vi.mocked(fetchQuizQuestions).mockReset());

  test("retries using the same settings and recovers from a failed request", async () => {
    vi.mocked(fetchQuizQuestions).mockRejectedValueOnce(new Error("Couldn't connect."))
      .mockResolvedValueOnce([{ question: "Recovered question", correct_answer: "Yes", incorrect_answers: ["No"], answers: ["Yes", "No"] }]);
    render(<App />);
    fireEvent.change(screen.getByLabelText("Category:"), { target: { value: "React" } });
    fireEvent.change(screen.getByLabelText("Difficulty:"), { target: { value: "hard" } });
    fireEvent.change(screen.getByLabelText("Number of Questions:"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: "Start Quiz" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't connect.");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Recovered question")).toBeInTheDocument();
    expect(fetchQuizQuestions).toHaveBeenNthCalledWith(1, "React", "hard", 10);
    expect(fetchQuizQuestions).toHaveBeenNthCalledWith(2, "React", "hard", 10);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("shows loading during retry and allows setup after another failure", async () => {
    let rejectRetry!: (error: Error) => void;
    vi.mocked(fetchQuizQuestions).mockResolvedValueOnce([]).mockImplementationOnce(
      () => new Promise((_resolve, reject) => { rejectRetry = reject; }),
    );
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start Quiz" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No questions found");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByText("Loading questions...")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
    rejectRetry(new Error("Service unavailable"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Service unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Back to setup" }));
    expect(screen.getByRole("button", { name: "Start Quiz" })).toBeInTheDocument();
  });
});

test("reviews answers and retries only missed questions without fetching again", async () => {
  vi.mocked(fetchQuizQuestions).mockReset().mockResolvedValue([
    { question: "First question", answers: ["First right", "First wrong"], correct_answer: "First right", incorrect_answers: ["First wrong"] },
    { question: "Second question", answers: ["Second right", "Second wrong"], correct_answer: "Second right", incorrect_answers: ["Second wrong"] },
  ]);
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Start Quiz" }));
  fireEvent.click(await screen.findByRole("button", { name: "First right" }));
  fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
  fireEvent.click(screen.getByRole("button", { name: "Second wrong" }));
  fireEvent.click(screen.getByRole("button", { name: "Finish Quiz" }));
  expect(screen.getByText("Final Score: 1 / 2")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Second wrong", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Second right", { exact: false })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry missed questions (1)" }));
  expect(screen.getByText("Second question")).toBeInTheDocument();
  expect(screen.getByText("Score: 0 / 1")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Second wrong" }));
  fireEvent.click(screen.getByRole("button", { name: "Finish Quiz" }));
  fireEvent.click(screen.getByRole("button", { name: "Retry missed questions (1)" }));
  fireEvent.click(screen.getByRole("button", { name: "Second right" }));
  fireEvent.click(screen.getByRole("button", { name: "Finish Quiz" }));
  expect(screen.getByText("Final Score: 1 / 1")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Retry missed/ })).not.toBeInTheDocument();
  expect(fetchQuizQuestions).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /Restart Quiz/ }));
  expect(screen.getByRole("button", { name: "Start Quiz" })).toBeInTheDocument();
});
