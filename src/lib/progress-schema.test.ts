import { describe, expect, it } from "vitest";
import { validateImportedProgress } from "./progress-schema";
import { emptyProgress } from "./progress";

describe("validateImportedProgress", () => {
  it("accepts a well-formed exported progress file", () => {
    const result = validateImportedProgress(JSON.stringify(emptyProgress));
    expect(result.success).toBe(true);
    if (result.success) expect(result.progress.version).toBe(2);
  });

  it("rejects invalid JSON", () => {
    const result = validateImportedProgress("not json at all");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("valid JSON");
  });

  it("rejects a v1-shaped file without silently coercing it", () => {
    const v1 = {
      version: 1,
      completedLessons: [],
      completedChallenges: [],
      quizScores: {},
      projects: {},
      currentLesson: "w1-l1",
      activityDates: [],
      xp: 0,
      preferences: { mode: "guided", theme: "system" },
    };
    const result = validateImportedProgress(JSON.stringify(v1));
    expect(result.success).toBe(false);
  });

  it("rejects a payload with the wrong field types", () => {
    const malformed = { ...emptyProgress, xp: "a lot" };
    const result = validateImportedProgress(JSON.stringify(malformed));
    expect(result.success).toBe(false);
  });
});
