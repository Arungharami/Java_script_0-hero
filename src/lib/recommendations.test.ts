import { describe, expect, it } from "vitest";
import { buildRecommendations } from "./recommendations";
import { emptyProgress } from "./progress";
import type { Challenge, CourseWeek, Lesson, LearningProgress } from "@/types/learning";
import type { SkillMastery } from "./mastery";

type LessonWithWeek = Lesson & { week: CourseWeek };

const week = (number: number) => ({ number, title: "Test Week" }) as unknown as CourseWeek;
const lessonWithWeek = (id: string, slug: string, weekNumber: number): LessonWithWeek =>
  ({ id, slug, title: id, week: week(weekNumber) }) as unknown as LessonWithWeek;
const challenge = (slug: string, category: string, relatedConcepts: string[] = []) =>
  ({ slug, title: slug, category, relatedConcepts }) as unknown as Challenge;

describe("buildRecommendations", () => {
  const lessons = [lessonWithWeek("w1-l1", "l1", 1)];

  it("recommends reviewing a challenge failed multiple times without passing", () => {
    const progress: LearningProgress = {
      ...emptyProgress,
      challengeProgress: {
        "hard-one": { completed: false, attempts: 4, bestPassedTests: 2, totalTests: 5 },
      },
    };
    const challenges = [challenge("hard-one", "Arrays", ["Array mutation"])];
    const recs = buildRecommendations(progress, lessons, challenges, []);
    expect(recs.some((r) => r.kind === "review" && r.href.includes("hard-one"))).toBe(true);
  });

  it("recommends practice when many lessons are done but few challenges attempted", () => {
    const progress: LearningProgress = {
      ...emptyProgress,
      completedLessons: ["a", "b", "c", "d", "e", "f"],
      challengeProgress: {},
    };
    const recs = buildRecommendations(progress, lessons, [], []);
    expect(recs.some((r) => r.kind === "practice")).toBe(true);
  });

  it("flags the weakest skill with recorded data below 70%", () => {
    const mastery: SkillMastery[] = [
      { skill: "promises", label: "Promises", value: 40, hasData: true },
      { skill: "arrays", label: "Arrays", value: 90, hasData: true },
    ];
    const recs = buildRecommendations(emptyProgress, lessons, [], mastery);
    expect(recs.some((r) => r.title.includes("Promises"))).toBe(true);
  });

  it("always includes a next-lesson recommendation as a fallback", () => {
    const recs = buildRecommendations(emptyProgress, lessons, [], []);
    expect(recs.some((r) => r.kind === "next")).toBe(true);
  });

  it("never returns more than four recommendations", () => {
    const progress: LearningProgress = {
      ...emptyProgress,
      completedLessons: ["a", "b", "c", "d", "e", "f"],
      challengeProgress: {
        "hard-one": { completed: false, attempts: 5, bestPassedTests: 1, totalTests: 5 },
      },
    };
    const mastery: SkillMastery[] = [{ skill: "promises", label: "Promises", value: 10, hasData: true }];
    const challenges = [challenge("hard-one", "Arrays")];
    const recs = buildRecommendations(progress, lessons, challenges, mastery);
    expect(recs.length).toBeLessThanOrEqual(4);
  });
});
