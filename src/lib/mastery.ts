import { SKILLS } from "@/types/learning";
import type {
  Challenge,
  DebugExercise,
  Lesson,
  LearningProgress,
  SkillId,
  WeeklyQuiz,
} from "@/types/learning";

export const SKILL_LABELS: Record<SkillId, string> = {
  fundamentals: "Fundamentals",
  variables: "Variables",
  "data-types": "Data Types",
  conditions: "Conditions",
  loops: "Loops",
  functions: "Functions",
  scope: "Scope",
  strings: "Strings",
  arrays: "Arrays",
  objects: "Objects",
  dom: "DOM",
  events: "Events",
  async: "Async",
  promises: "Promises",
  apis: "APIs",
  debugging: "Debugging",
  algorithms: "Algorithms",
  testing: "Testing",
  architecture: "Architecture",
};

export interface SkillMastery {
  skill: SkillId;
  label: string;
  value: number;
  hasData: boolean;
}

/**
 * Combines lesson completion, challenge/debug pass rates, and quiz
 * performance per skill. A skill with no recorded activity reports 0 with
 * hasData:false so the UI never implies mastery that was never earned.
 */
export function computeSkillMastery(
  progress: LearningProgress,
  lessons: Lesson[],
  challenges: Challenge[],
  debugExercises: DebugExercise[],
  quizzes: WeeklyQuiz[],
): SkillMastery[] {
  return SKILLS.map((skill) => {
    const parts: number[] = [];

    const skillLessons = lessons.filter((l) => l.skills.includes(skill));
    if (skillLessons.length > 0) {
      const done = skillLessons.filter((l) =>
        progress.completedLessons.includes(l.id),
      ).length;
      parts.push((done / skillLessons.length) * 100);
    }

    const skillChallenges = challenges.filter((c) => c.skills.includes(skill));
    const skillDebug = debugExercises.filter((d) => d.skills.includes(skill));
    const graded = [
      ...skillChallenges.map((c) => progress.challengeProgress[c.slug]),
      ...skillDebug.map((d) => progress.debugProgress[d.slug]),
    ].filter((record) => record !== undefined && record.totalTests > 0);
    if (graded.length > 0) {
      const avg =
        graded.reduce(
          (sum, record) =>
            sum + (record!.bestPassedTests / record!.totalTests) * 100,
          0,
        ) / graded.length;
      parts.push(avg);
    }

    const quizScores: number[] = [];
    for (const quiz of quizzes) {
      if (!quiz.questions.some((q) => q.skill === skill)) continue;
      const attempt = progress.quizAttempts[`week-${quiz.week}`];
      const value = attempt?.weakSkills[skill];
      if (typeof value === "number") quizScores.push(value);
    }
    if (quizScores.length > 0) {
      parts.push(quizScores.reduce((a, b) => a + b, 0) / quizScores.length);
    }

    const hasData = parts.length > 0;
    const value = hasData
      ? Math.round(parts.reduce((a, b) => a + b, 0) / parts.length)
      : 0;
    return { skill, label: SKILL_LABELS[skill], value, hasData };
  });
}

export function overallMastery(mastery: SkillMastery[]) {
  const withData = mastery.filter((m) => m.hasData);
  if (withData.length === 0) return 0;
  return Math.round(
    withData.reduce((sum, m) => sum + m.value, 0) / withData.length,
  );
}
