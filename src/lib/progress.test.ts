import { describe, expect, it } from "vitest";
import {
  calculateStreak,
  completionPercent,
  emptyProgress,
  readProgress,
} from "./progress";

describe("progress utilities", () => {
  it("calculates bounded completion", () => {
    expect(completionPercent(3, 8)).toBe(38);
    expect(completionPercent(2, 0)).toBe(0);
    expect(completionPercent(9, 8)).toBe(100);
  });
  it("falls back safely for corrupted or old storage", () => {
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
});
