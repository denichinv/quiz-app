import { shuffleArray } from "./shuffleArray";
import { describe, it, expect } from "vitest";

describe("shuffleArray", () => {
  it("should return an array with the same length", () => {
    const input = [1, 2, 3, 4, 5];

    const result = shuffleArray(input);

    expect(result).toHaveLength(5);
  });

  it("should contain all original elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    input.forEach((el) => {
      expect(result).toContain(el);
    });
  });

  it("should not modify the original array", () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];

    shuffleArray(input);

    expect(input).toEqual(original);
  });

  it("should shuffle the array (result different from input)", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffleArray(input);
    expect(result).not.toEqual(input);
  });
});
