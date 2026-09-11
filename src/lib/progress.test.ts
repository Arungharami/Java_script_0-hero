import { describe, expect, it } from "vitest";
import {
  calculateStreak,
  completionPercent,
  emptyProgress,
  readProgress,
  recordChallengeResult,
  recordQuizResult,
  toggleMilestone,
} from "./progress";

describe("progress utilities", () => {
  it("calculates bounded completion", () => {
    expect(completionPercent(3, 8)).toBe(38);
    expect(completionPercent(2, 0)).toBe(0);
    expect(completionPercent(9, 8)).toBe(100);
  });
  it("falls back safely for corrupted or unrecognized storage", () => {
    expect(readProgress("not-json")).toEqual(emptyProgress);
    expect(readProgress(JSON.stringify({ version: 0 }))).toEqual(emptyProgress);
  });
  it("calculates a real consecutive-day streak", () => {
    expect(
      calculateStreak(
        ["2026-09-08", "2026-09-09", "2026-09-10"],
        new Date("2026-09-10T12:00:00"),
      ),
    ).toBe(3);
  });

  describe("v1 -> v2 migration", () => {
    it("never silently wipes recognizable v1 progress", () => {
      const v1 = {
        version: 1,
        completedLessons: ["w1-l1", "w1-l2"],
        completedChallenges: ["reverse-a-string"],
        quizScores: { "w1-l1": 100 },
        projects: { calculator: 50 },
        currentLesson: "w1-l3",
        activityDates: ["2026-09-01"],
        xp: 275,
        preferences: { mode: "fast", theme: "dark" },
      };
      const migrated = readProgress(JSON.stringify(v1));
      expect(migrated.version).toBe(2);
      expect(migrated.completedLessons).toEqual(["w1-l1", "w1-l2"]);
      expect(migrated.currentLesson).toBe("w1-l3");
      expect(migrated.xp).toBe(275);
      expect(migrated.preferences).toEqual({ mode: "fast", theme: "dark" });
      expect(migrated.challengeProgress["reverse-a-string"]).toEqual({
        completed: true,
        attempts: 1,
        bestPassedTests: 1,
        totalTests: 1,
      });
      expect(migrated.quizAttempts["w1-l1"]).toMatchObject({
        attempts: 1,
        bestScore: 100,
        lastScore: 100,
      });
      expect(migrated.projectProgress.calculator).toEqual({ completedMilestones: [] });
    });
  });

  describe("recordChallengeResult", () => {
    it("marks a challenge completed only when every test passes", () => {
      const first = recordChallengeResult(undefined, 3, 5);
      expect(first).toMatchObject({ completed: false, attempts: 1, bestPassedTests: 3, totalTests: 5 });
      const second = recordChallengeResult(first, 5, 5);
      expect(second).toMatchObject({ completed: true, attempts: 2, bestPassedTests: 5, totalTests: 5 });
    });
    it("keeps the best pass count across attempts, even after a worse retry", () => {
      const passed = recordChallengeResult(undefined, 5, 5);
      const regressed = recordChallengeResult(passed, 2, 5);
      expect(regressed.completed).toBe(true);
      expect(regressed.bestPassedTests).toBe(5);
    });
  });

  describe("recordQuizResult", () => {
    it("tracks best and last score independently", () => {
      const first = recordQuizResult(undefined, 60, {});
      const second = recordQuizResult(first, 90, { arrays: 90 });
      const third = recordQuizResult(second, 70, { arrays: 70 });
      expect(third.bestScore).toBe(90);
      expect(third.lastScore).toBe(70);
      expect(third.attempts).toBe(3);
    });
  });

  describe("toggleMilestone", () => {
    it("adds then removes a milestone", () => {
      const added = toggleMilestone(undefined, "Plan the data model");
      expect(added.completedMilestones).toEqual(["Plan the data model"]);
      const removed = toggleMilestone(added, "Plan the data model");
      expect(removed.completedMilestones).toEqual([]);
    });
  });
});
