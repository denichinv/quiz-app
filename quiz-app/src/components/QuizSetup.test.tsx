import QuizSetup from "./QuizSetup";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("QuizSetup component tests", () => {
  const mockSetCategory = vi.fn();
  const mockSetDifficulty = vi.fn();
  const mockSetLimit = vi.fn();
  const mockOnStart = vi.fn();

  const renderQuizSetup = (props = {}) => {
    return render(
      <QuizSetup
        categories={["SQL", "PHP", "JSX"]}
        category=""
        difficulty=""
        limit={5}
        onStart={mockOnStart}
        setCategory={mockSetCategory}
        setDifficulty={mockSetDifficulty}
        setLimit={mockSetLimit}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render without crashing", () => {
    renderQuizSetup();
  });

  test("should display all category options", () => {
    renderQuizSetup();

    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.getByText("PHP")).toBeInTheDocument();
    expect(screen.getByText("JSX")).toBeInTheDocument();
  });

  test("should display all difficulty options", () => {
    renderQuizSetup();

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  test("should display all number of questions options", () => {
    renderQuizSetup();

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  test("should render all form labels", () => {
    renderQuizSetup();

    expect(screen.getByText("Category:")).toBeInTheDocument();
    expect(screen.getByText("Difficulty:")).toBeInTheDocument();
    expect(screen.getByText("Number of Questions:")).toBeInTheDocument();
  });

  test("should display the Start Quiz button", () => {
    renderQuizSetup();

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    expect(startButton).toBeInTheDocument();
  });

  test("should call setCategory when category is changed", () => {
    renderQuizSetup();

    const categorySelect = screen.getByLabelText("Category:");
    fireEvent.change(categorySelect, { target: { value: "SQL" } });

    expect(mockSetCategory).toHaveBeenCalledWith("SQL");
  });

  test("should call setDifficulty when difficulty is changed", () => {
    renderQuizSetup();

    const difficultySelect = screen.getByLabelText("Difficulty:");
    fireEvent.change(difficultySelect, { target: { value: "hard" } });

    expect(mockSetDifficulty).toHaveBeenCalledWith("hard");
  });

  test("should call setLimit when question limit is changed", () => {
    renderQuizSetup();

    const limitSelect = screen.getByLabelText("Number of Questions:");
    fireEvent.change(limitSelect, { target: { value: "10" } });

    expect(mockSetLimit).toHaveBeenCalledWith(10);
  });

  test("should call onStart when Start Quiz button is clicked", () => {
    renderQuizSetup();

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalled();
  });

  test("should display selected category value", () => {
    renderQuizSetup({ category: "PHP" });

    const categorySelect = screen.getByLabelText("Category:");
    expect(categorySelect).toHaveValue("PHP");
  });

  test("should display selected difficulty value", () => {
    renderQuizSetup({ difficulty: "medium" });

    const difficultySelect = screen.getByLabelText("Difficulty:");
    expect(difficultySelect).toHaveValue("medium");
  });

  test("should display selected limit value", () => {
    renderQuizSetup({ limit: 15 });

    const limitSelect = screen.getByLabelText("Number of Questions:");
    expect(limitSelect).toHaveValue("15");
  });
});
