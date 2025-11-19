import QuestionCard from "./QuestionCard";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("QuestionCard component tests", () => {
  const onAnswerClick = vi.fn();
  const onNextQuestion = vi.fn();
  const onRestartQuestion = vi.fn();

  const QuestionCardRender = (props = {}) => {
    return render(
      <QuestionCard
        question="This is Question ... "
        answers={["a", "b", "c", "d"]}
        correctAnswer={"a"}
        selectedAnswer={null}
        onAnswerClick={onAnswerClick}
        onNextQuestion={onNextQuestion}
        onRestartQuestion={onRestartQuestion}
        isLastQuestion={false}
        score={0}
        total={5}
        {...props}
      />
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

    expect(screen.getByText("Restart Quiz")).toBeInTheDocument();
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
  test("should calls onRestartQuestion when an answer button is clicked", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    const button = screen.getByText("Restart Quiz");

    fireEvent.click(button);

    expect(onRestartQuestion).toHaveBeenCalled();
  });
  test("should shows correct message when correct answer is selected", () => {
    QuestionCardRender({ selectedAnswer: "a" });

    expect(screen.getByText("✅ Correct!")).toBeInTheDocument();
  });
  test("should shows incorrect message when correct answer is selected", () => {
    QuestionCardRender({ selectedAnswer: "b" });

    expect(
      screen.getByText("❌ Incorrect. Correct answer: a")
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
});
