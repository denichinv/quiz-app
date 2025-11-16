import QuizLoading from "./QuizLoading";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("QuizLoading component tests", () => {
  it("should render without crashing ", () => {
    render(<QuizLoading />);
  });
  it("should display loading text", () => {
    render(<QuizLoading />);
    expect(screen.getByText("Loading questions...")).toBeInTheDocument();
  });
  it("should have the loading-screen class", () => {
    render(<QuizLoading />);

    expect(screen.getByText("Loading questions...").parentElement).toHaveClass(
      "loading-screen"
    );
  });
});
