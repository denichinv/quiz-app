import QuizComplete from "./QuizComplete";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("QuizComplete component tests ", () => {
  const mockFn = vi.fn();
  test("Render without crashing", () => {
    render(<QuizComplete correct={1} questionsCount={5} onRestart={mockFn} />);
  });
  test("Displays the correct score", () => {
    render(<QuizComplete correct={1} questionsCount={5} onRestart={mockFn} />);

    expect(screen.getByText("Final Score: 1 / 5")).toBeInTheDocument();
  });
  test("Displays the quiz complete heading", () => {
    render(<QuizComplete correct={1} questionsCount={5} onRestart={mockFn} />);

    expect(screen.getByText("🎉 Quiz Complete!")).toBeInTheDocument();
  });
  test("It has a restart button", () => {
    render(<QuizComplete correct={1} questionsCount={5} onRestart={mockFn} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("🔄 Restart Quiz")).toBeInTheDocument();
  });
  test(" Calls onRestart function when the button is clicked", () => {
    render(<QuizComplete correct={1} questionsCount={5} onRestart={mockFn} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledOnce();
  });
});
