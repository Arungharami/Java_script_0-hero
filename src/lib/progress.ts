import type {
  ChallengeAttemptRecord,
  CurrentPath,
  LearningProgress,
  LearningProgressV1,
  ProjectProgressRecord,
  QuizAttemptRecord,
} from "@/types/learning";

export const PROGRESS_KEY = "js0hero:progress";
export const PROGRESS_VERSION = 2;

export const emptyProgress: LearningProgress = {
  version: 2,
  completedLessons: [],
  challengeProgress: {},
  debugProgress: {},
  quizAttempts: {},
  projectProgress: {},
  activityDates: [],
  currentLesson: "w1-l1",
  currentPath: { week: 1 },
  xp: 0,
  preferences: { mode: "guided", theme: "system" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function withActivityToday(dates: string[]): string[] {
  return [...new Set([...dates, todayISO()])];
}

/** Migrates a v1 flat progress record forward. Never drops recognizable data. */
function migrateV1(value: Partial<LearningProgressV1>): LearningProgress {
  const challengeProgress: Record<string, ChallengeAttemptRecord> = {};
  for (const slug of value.completedChallenges ?? []) {
    challengeProgress[slug] = {
      completed: true,
      attempts: 1,
      bestPassedTests: 1,
      totalTests: 1,
    };
  }
  const quizAttempts: Record<string, QuizAttemptRecord> = {};
  for (const [id, score] of Object.entries(value.quizScores ?? {})) {
    quizAttempts[id] = {
      attempts: 1,
      bestScore: score,
      lastScore: score,
      weakSkills: {},
    };
  }
  const projectProgress: Record<string, ProjectProgressRecord> = {};
  for (const slug of Object.keys(value.projects ?? {})) {
    projectProgress[slug] = { completedMilestones: [] };
  }
  return {
    version: 2,
    completedLessons: value.completedLessons ?? [],
    challengeProgress,
    debugProgress: {},
    quizAttempts,
    projectProgress,
    activityDates: value.activityDates ?? [],
    currentLesson: value.currentLesson ?? emptyProgress.currentLesson,
    currentPath: { week: 1 },
    xp: value.xp ?? 0,
    preferences: {
      ...emptyProgress.preferences,
      ...value.preferences,
    },
  };
}

function mergeV2(value: Partial<LearningProgress>): LearningProgress {
  return {
    ...emptyProgress,
    ...value,
    challengeProgress: {
      ...emptyProgress.challengeProgress,
      ...value.challengeProgress,
    },
    debugProgress: { ...emptyProgress.debugProgress, ...value.debugProgress },
    quizAttempts: { ...emptyProgress.quizAttempts, ...value.quizAttempts },
    projectProgress: {
      ...emptyProgress.projectProgress,
      ...value.projectProgress,
    },
    currentPath: { ...emptyProgress.currentPath, ...value.currentPath },
    preferences: { ...emptyProgress.preferences, ...value.preferences },
  };
}

/**
 * Reads and migrates whatever is in storage. Corrupted or unrecognized JSON
 * falls back to an empty record instead of throwing; a recognizable v1
 * payload is upgraded in place rather than discarded.
 */
export function readProgress(raw: string | null): LearningProgress {
  if (!raw) return emptyProgress;
  try {
    const value = JSON.parse(raw) as unknown;
    if (!isRecord(value)) return emptyProgress;
    if (value.version === 2) return mergeV2(value as Partial<LearningProgress>);
    if (value.version === 1 && Array.isArray(value.completedLessons)) {
      return migrateV1(value as Partial<LearningProgressV1>);
    }
    return emptyProgress;
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

export function recordChallengeResult(
  existing: ChallengeAttemptRecord | undefined,
  passedTests: number,
  totalTests: number,
): ChallengeAttemptRecord {
  const passed = totalTests > 0 && passedTests === totalTests;
  return {
    completed: existing?.completed || passed,
    attempts: (existing?.attempts ?? 0) + 1,
    bestPassedTests: Math.max(existing?.bestPassedTests ?? 0, passedTests),
    totalTests,
    lastAttemptAt: new Date().toISOString(),
  };
}

export function recordQuizResult(
  existing: QuizAttemptRecord | undefined,
  score: number,
  weakSkills: QuizAttemptRecord["weakSkills"],
): QuizAttemptRecord {
  return {
    attempts: (existing?.attempts ?? 0) + 1,
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    lastScore: score,
    lastAttemptAt: new Date().toISOString(),
    weakSkills,
  };
}

export function toggleMilestone(
  existing: ProjectProgressRecord | undefined,
  milestone: string,
): ProjectProgressRecord {
  const current = existing?.completedMilestones ?? [];
  return {
    completedMilestones: current.includes(milestone)
      ? current.filter((m) => m !== milestone)
      : [...current, milestone],
  };
}

export function nextCurrentPath(
  current: CurrentPath,
  update: Partial<CurrentPath>,
): CurrentPath {
  return { ...current, ...update };
}
