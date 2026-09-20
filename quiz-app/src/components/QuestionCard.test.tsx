import QuestionCard from "./QuestionCard";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("QuestionCard component tests", () => {
  const onAnswerClick = vi.fn();
  const onNextQuestion = vi.fn();
  const onBackToSetup = vi.fn();

  const QuestionCardRender = (props = {}) => {
    return render(
      <QuestionCard
        question="This is Question ... "
        answers={["a", "b", "c", "d"]}
        correctAnswer={"a"}
        selectedAnswer={null}
        onAnswerClick={onAnswerClick}
        onNextQuestion={onNextQuestion}
        onBackToSetup={onBackToSetup}
        isLastQuestion={false}
        currentQuestionIndex={0}
        score={0}
        total={5}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render without crashing", () => {
    QuestionCardRender();
  });
  test("should display the question text", () => {
    QuestionCardRender();
    expect(screen.getByText("This is Question ...")).toBeInTheDocument();
  });

  test("should display the current score", () => {
    QuestionCardRender();
    expect(screen.getByText("Score: 0 / 5")).toBeInTheDocument();
  });

  test("should display the current question progress", () => {
    QuestionCardRender();
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
  });

  test("should render a visual progress bar for the current quiz position", () => {
    QuestionCardRender({ currentQuestionIndex: 1, total: 5 });

    const progressBar = screen.getByRole("progressbar", {
      name: /quiz progress/i,
    });

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "40");
  });

  test("should render all test buttons ", () => {
    QuestionCardRender();
    const buttons = screen.getAllByRole("button");

    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });
  test("should calls onAnswerClick when an answer button is clicked", () => {
    QuestionCardRender();

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);

    expect(onAnswerClick).toHaveBeenCalled();
  });
  test("should disables all answer buttons after an answer is selected", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    const buttons = screen.getAllByRole("button");
    const answerButtons = buttons.slice(0, 4);

    answerButtons.forEach((button) => {
      expect(button).toHaveAttribute("disabled");
    });
  });
  test("should shows Restart button after answer selection", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    expect(screen.getByText("Back to setup")).toBeInTheDocument();
  });
  test("should shows Show next button after answer selection", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    expect(screen.getByText("Next Question →")).toBeInTheDocument();
  });
  test("should shows finish button after answer selection", () => {
    QuestionCardRender({ selectedAnswer: "a", isLastQuestion: true });

    expect(screen.getByText("Finish Quiz")).toBeInTheDocument();
  });

  test("should calls onNextQuestion when an answer button is clicked", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    const button = screen.getByText("Next Question →");

    fireEvent.click(button);

    expect(onNextQuestion).toHaveBeenCalled();
  });
  test("should calls onBackToSetup when an answer button is clicked", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    const button = screen.getByText("Back to setup");

    fireEvent.click(button);

    expect(onBackToSetup).toHaveBeenCalled();
  });
  test("should shows correct message when correct answer is selected", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    expect(screen.getByText("✅ Correct!")).toBeInTheDocument();
  });
  test("should shows incorrect message when correct answer is selected", () => {
    QuestionCardRender({ selectedAnswer: "b" });

    expect(
      screen.getByText("❌ Incorrect. Correct answer: a"),
    ).toBeInTheDocument();
  });
  test('should apply the "correct" class to the correct button', () => {
    QuestionCardRender({ selectedAnswer: "a" });

    const correctButton = screen.getAllByRole("button")[0];

    expect(correctButton).toHaveClass("correct");
  });
  test('should apply the "incorrect" class to the incorrect button', () => {
    QuestionCardRender({ selectedAnswer: "b" });

    const incorrectButton = screen.getAllByRole("button")[1];

    expect(incorrectButton).toHaveClass("incorrect");
  });
  test("allows returning to setup before answering", () => {
    QuestionCardRender();
    fireEvent.click(screen.getByRole("button", { name: "Back to setup" }));
    expect(onBackToSetup).toHaveBeenCalledOnce();
    expect(onAnswerClick).not.toHaveBeenCalled();
  });

  test("reveals the correct option alongside an incorrect selection", () => {
    QuestionCardRender({ selectedAnswer: "b" });
    expect(screen.getByTestId("answer-0")).toHaveClass("correct");
    expect(screen.getByTestId("answer-0")).toHaveTextContent("Correct answer");
    expect(screen.getByTestId("answer-1")).toHaveClass("incorrect");
    expect(screen.getByRole("status")).toHaveTextContent("Incorrect. Correct answer: a");
  });

});
