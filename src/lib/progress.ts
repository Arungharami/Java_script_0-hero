import type { LearningProgress } from "@/types/learning";

export const PROGRESS_KEY = "js0hero:progress";
export const emptyProgress: LearningProgress = {
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
export function readProgress(raw: string | null): LearningProgress {
  if (!raw) return emptyProgress;
  try {
    const value = JSON.parse(raw) as Partial<LearningProgress>;
    if (value.version !== 1 || !Array.isArray(value.completedLessons))
      return emptyProgress;
    return {
      ...emptyProgress,
      ...value,
      preferences: { ...emptyProgress.preferences, ...value.preferences },
    };
  } catch {
    return emptyProgress;
  }
}
export function completionPercent(completed: number, total: number) {
  return total <= 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));
}
export function calculateStreak(dates: string[], today = new Date()) {
  const unique = new Set(dates);
  let streak = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  while (unique.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
