import { describe, expect, it } from "vitest";
import { hasPassedQuiz, scoreQuiz } from "./quiz";
describe("quiz scoring", () => {
  it("scores answers as a percentage", () =>
    expect(scoreQuiz([1, 0, 2], [1, 2, 2])).toBe(67));
  it("uses the passing threshold", () => {
    expect(hasPassedQuiz(70)).toBe(true);
    expect(hasPassedQuiz(69)).toBe(false);
  });
});
