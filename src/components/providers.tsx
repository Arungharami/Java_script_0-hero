"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  emptyProgress,
  recordChallengeResult,
  recordQuizResult,
  toggleMilestone,
  withActivityToday,
} from "@/lib/progress";
import { localProgressRepository } from "@/lib/progress-repository";
import { validateImportedProgress } from "@/lib/progress-schema";
import type {
  CurrentPath,
  LearningProgress,
  QuizAttemptRecord,
} from "@/types/learning";

type ProgressContextValue = {
  progress: LearningProgress;
  hydrated: boolean;
  completeLesson(id: string): void;
  awardXp(amount: number): void;
  recordChallenge(slug: string, passedTests: number, totalTests: number): void;
  recordDebug(slug: string, passedTests: number, totalTests: number): void;
  recordQuiz(
    id: string,
    score: number,
    weakSkills: QuizAttemptRecord["weakSkills"],
  ): void;
  toggleProjectMilestone(slug: string, milestone: string): void;
  setCurrentLesson(id: string): void;
  setCurrentPath(path: Partial<CurrentPath>): void;
  toggleMode(): void;
  exportProgress(): string;
  importProgress(json: string): { success: boolean; error?: string };
  resetProgress(): void;
};
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void localProgressRepository.load().then((loaded) => {
        setProgress(loaded);
        setHydrated(true);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (hydrated) void localProgressRepository.save(progress);
  }, [progress, hydrated]);
  const update = useCallback(
    (fn: (p: LearningProgress) => LearningProgress) => setProgress(fn),
    [],
  );

  const completeLesson = useCallback(
    (id: string) =>
      update((p) =>
        p.completedLessons.includes(id)
          ? p
          : {
              ...p,
              completedLessons: [...p.completedLessons, id],
              activityDates: withActivityToday(p.activityDates),
              xp: p.xp + 50,
            },
      ),
    [update],
  );

  const awardXp = useCallback(
    (amount: number) =>
      update((p) => ({
        ...p,
        xp: p.xp + amount,
        activityDates: withActivityToday(p.activityDates),
      })),
    [update],
  );

  const recordChallenge = useCallback(
    (slug: string, passedTests: number, totalTests: number) =>
      update((p) => {
        const existing = p.challengeProgress[slug];
        const wasCompleted = existing?.completed ?? false;
        const next = recordChallengeResult(existing, passedTests, totalTests);
        return {
          ...p,
          challengeProgress: { ...p.challengeProgress, [slug]: next },
          activityDates: withActivityToday(p.activityDates),
          xp: p.xp + (next.completed && !wasCompleted ? 75 : 0),
        };
      }),
    [update],
  );

  const recordDebug = useCallback(
    (slug: string, passedTests: number, totalTests: number) =>
      update((p) => {
        const existing = p.debugProgress[slug];
        const wasCompleted = existing?.completed ?? false;
        const next = recordChallengeResult(existing, passedTests, totalTests);
        return {
          ...p,
          debugProgress: { ...p.debugProgress, [slug]: next },
          activityDates: withActivityToday(p.activityDates),
          xp: p.xp + (next.completed && !wasCompleted ? 60 : 0),
        };
      }),
    [update],
  );

  const recordQuiz = useCallback(
    (id: string, score: number, weakSkills: QuizAttemptRecord["weakSkills"]) =>
      update((p) => {
        const existing = p.quizAttempts[id];
        const wasPassed = (existing?.bestScore ?? 0) >= 70;
        const next = recordQuizResult(existing, score, weakSkills);
        return {
          ...p,
          quizAttempts: { ...p.quizAttempts, [id]: next },
          activityDates: withActivityToday(p.activityDates),
          xp: p.xp + (score >= 70 && !wasPassed ? 100 : 0),
        };
      }),
    [update],
  );

  const toggleProjectMilestone = useCallback(
    (slug: string, milestone: string) =>
      update((p) => ({
        ...p,
        projectProgress: {
          ...p.projectProgress,
          [slug]: toggleMilestone(p.projectProgress[slug], milestone),
        },
        activityDates: withActivityToday(p.activityDates),
      })),
    [update],
  );

  const setCurrentLesson = useCallback(
    (id: string) =>
      update((p) => (p.currentLesson === id ? p : { ...p, currentLesson: id })),
    [update],
  );

  const setCurrentPath = useCallback(
    (path: Partial<CurrentPath>) =>
      update((p) => ({ ...p, currentPath: { ...p.currentPath, ...path } })),
    [update],
  );

  const toggleMode = useCallback(
    () =>
      update((p) => ({
        ...p,
        preferences: {
          ...p.preferences,
          mode: p.preferences.mode === "guided" ? "fast" : "guided",
        },
      })),
    [update],
  );

  const exportProgress = useCallback(
    () => JSON.stringify(progress, null, 2),
    [progress],
  );

  const importProgress = useCallback((json: string) => {
    const result = validateImportedProgress(json);
    if (!result.success) return { success: false, error: result.error };
    setProgress(result.progress);
    return { success: true };
  }, []);

  const resetProgress = useCallback(() => setProgress(emptyProgress), []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      completeLesson,
      awardXp,
      recordChallenge,
      recordDebug,
      recordQuiz,
      toggleProjectMilestone,
      setCurrentLesson,
      setCurrentPath,
      toggleMode,
      exportProgress,
      importProgress,
      resetProgress,
    }),
    [
      progress,
      hydrated,
      completeLesson,
      awardXp,
      recordChallenge,
      recordDebug,
      recordQuiz,
      toggleProjectMilestone,
      setCurrentLesson,
      setCurrentPath,
      toggleMode,
      exportProgress,
      importProgress,
      resetProgress,
    ],
  );
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside Providers");
  return value;
}
