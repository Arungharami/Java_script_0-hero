import { describe, expect, it } from "vitest";
import { allLessons, curriculum, getLesson, getWeek } from "./curriculum";
import { challenges } from "./challenges";
describe("curriculum data", () => {
  it("provides eight weeks and sixty-four lessons", () => {
    expect(curriculum).toHaveLength(8);
    expect(allLessons).toHaveLength(64);
  });
  it("resolves canonical weeks and lessons", () => {
    expect(getWeek(1)?.title).toContain("Foundations");
    expect(getLesson(1, "primitive-data-types")?.id).toBe("w1-l4");
  });
  it("gives every challenge executable starter and tests", () => {
    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(20);
      expect(challenge.testCode).toContain("throw new Error");
    }
  });
});
