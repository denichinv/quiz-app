import QuizComplete from "./QuizComplete";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("QuizComplete component tests ", () => {
  const mockFn = vi.fn();
  test("Render without crashing", () => {
    render(<QuizComplete correct={1} questionsCount={5} onChangeSettings={mockFn} onPlayAgain={vi.fn()} review={[]} onRetryMissed={vi.fn()} />);
  });
  test("Displays the correct score", () => {
    render(<QuizComplete correct={1} questionsCount={5} onChangeSettings={mockFn} onPlayAgain={vi.fn()} review={[]} onRetryMissed={vi.fn()} />);

    expect(screen.getByText("Final Score: 1 / 5")).toBeInTheDocument();
  });
  test("Displays the quiz complete heading", () => {
    render(<QuizComplete correct={1} questionsCount={5} onChangeSettings={mockFn} onPlayAgain={vi.fn()} review={[]} onRetryMissed={vi.fn()} />);

    expect(screen.getByText("🎉 Quiz Complete!")).toBeInTheDocument();
  });
  test("It has a restart button", () => {
    render(<QuizComplete correct={1} questionsCount={5} onChangeSettings={mockFn} onPlayAgain={vi.fn()} review={[]} onRetryMissed={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Change settings" })).toBeInTheDocument();
    expect(screen.getByText("Change settings")).toBeInTheDocument();
  });
  test(" Calls onRestart function when the button is clicked", () => {
    render(<QuizComplete correct={1} questionsCount={5} onChangeSettings={mockFn} onPlayAgain={vi.fn()} review={[]} onRetryMissed={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Change settings" });
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledOnce();
  });
});
