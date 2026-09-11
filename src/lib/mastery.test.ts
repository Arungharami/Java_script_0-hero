import { describe, expect, it } from "vitest";
import { computeSkillMastery, overallMastery } from "./mastery";
import { emptyProgress } from "./progress";
import type {
  Challenge,
  DebugExercise,
  Lesson,
  LearningProgress,
  WeeklyQuiz,
} from "@/types/learning";

const lesson = (id: string, skills: Lesson["skills"]) =>
  ({ id, skills }) as unknown as Lesson;
const challenge = (slug: string, skills: Challenge["skills"]) =>
  ({ slug, skills }) as unknown as Challenge;
const debugExercise = (slug: string, skills: DebugExercise["skills"]) =>
  ({ slug, skills }) as unknown as DebugExercise;

describe("computeSkillMastery", () => {
  const lessons = [lesson("w1-l1", ["arrays"]), lesson("w1-l2", ["arrays"])];
  const challenges = [challenge("sum-array", ["arrays"])];
  const debugExercises: DebugExercise[] = [];
  const quizzes: WeeklyQuiz[] = [];

  it("reports no data for a skill with zero recorded activity", () => {
    const mastery = computeSkillMastery(
      emptyProgress,
      lessons,
      challenges,
      debugExercises,
      quizzes,
    );
    const arrays = mastery.find((m) => m.skill === "arrays")!;
    expect(arrays.hasData).toBe(false);
    expect(arrays.value).toBe(0);
    const untouchedSkill = mastery.find((m) => m.skill === "dom")!;
    expect(untouchedSkill.hasData).toBe(false);
  });

  it("blends lesson completion and challenge pass rate for a skill", () => {
    const progress: LearningProgress = {
      ...emptyProgress,
      completedLessons: ["w1-l1"], // 1 of 2 lessons -> 50%
      challengeProgress: {
        "sum-array": {
          completed: true,
          attempts: 1,
          bestPassedTests: 4,
          totalTests: 4, // 100%
        },
      },
    };
    const mastery = computeSkillMastery(
      progress,
      lessons,
      challenges,
      debugExercises,
      quizzes,
    );
    const arrays = mastery.find((m) => m.skill === "arrays")!;
    expect(arrays.hasData).toBe(true);
    expect(arrays.value).toBe(75); // average of 50% (lessons) and 100% (challenge)
  });

  it("never fabricates mastery for skills with no lessons, challenges, or quizzes", () => {
    const mastery = computeSkillMastery(
      emptyProgress,
      [],
      [],
      [],
      [],
    );
    expect(mastery.every((m) => !m.hasData && m.value === 0)).toBe(true);
  });
});

describe("overallMastery", () => {
  it("averages only skills that have recorded data", () => {
    const mastery = [
      { skill: "arrays" as const, label: "Arrays", value: 80, hasData: true },
      { skill: "dom" as const, label: "DOM", value: 0, hasData: false },
      { skill: "objects" as const, label: "Objects", value: 40, hasData: true },
    ];
    expect(overallMastery(mastery)).toBe(60);
  });
  it("returns 0 when nothing has data yet", () => {
    expect(
      overallMastery([{ skill: "arrays" as const, label: "Arrays", value: 0, hasData: false }]),
    ).toBe(0);
  });
});
