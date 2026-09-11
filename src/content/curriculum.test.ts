import { describe, expect, it } from "vitest";
import { allLessons, curriculum, getLesson, getWeek } from "./curriculum";
import { challenges } from "./challenges";
import { debugLab } from "./debug-lab";
import { quizzes } from "./quizzes";
import { interviewQuestions } from "./interview-questions";

describe("curriculum data", () => {
  it("provides eight weeks and sixty-four lessons", () => {
    expect(curriculum).toHaveLength(8);
    expect(allLessons).toHaveLength(64);
  });
  it("resolves canonical weeks and lessons", () => {
    expect(getWeek(1)?.title).toContain("Foundations");
    expect(getLesson(1, "primitive-data-types")?.id).toBe("w1-l4");
  });
  it("gives every week a five-day plan and at least one skill", () => {
    for (const week of curriculum) {
      expect(week.days).toHaveLength(5);
      expect(week.skills.length).toBeGreaterThan(0);
    }
  });
  it("gives every challenge executable starter code and tests", () => {
    expect(challenges.length).toBeGreaterThanOrEqual(60);
    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(10);
      expect(challenge.tests.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });
  it("provides at least twenty debugging exercises", () => {
    expect(debugLab.length).toBeGreaterThanOrEqual(20);
    for (const exercise of debugLab) {
      expect(exercise.tests.length).toBeGreaterThan(0);
      expect(exercise.correctedCode.length).toBeGreaterThan(0);
    }
  });
  it("provides 8-15 weekly quiz questions per week", () => {
    expect(quizzes).toHaveLength(8);
    for (const quiz of quizzes) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(8);
      expect(quiz.questions.length).toBeLessThanOrEqual(15);
    }
  });
  it("provides at least fifty interview questions", () => {
    expect(interviewQuestions.length).toBeGreaterThanOrEqual(50);
  });
});
