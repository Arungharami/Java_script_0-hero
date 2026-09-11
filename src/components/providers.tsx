"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { emptyProgress, PROGRESS_KEY, readProgress } from "@/lib/progress";
import type { LearningProgress } from "@/types/learning";

type ProgressContextValue = {
  progress: LearningProgress;
  hydrated: boolean;
  completeLesson(id: string): void;
  completeChallenge(id: string): void;
  saveQuiz(id: string, score: number): void;
  setCurrentLesson(id: string): void;
  toggleMode(): void;
};
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setProgress(readProgress(window.localStorage.getItem(PROGRESS_KEY)));
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
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
              activityDates: [
                ...new Set([
                  ...p.activityDates,
                  new Date().toISOString().slice(0, 10),
                ]),
              ],
              xp: p.xp + 50,
            },
      ),
    [update],
  );
  const completeChallenge = useCallback(
    (id: string) =>
      update((p) =>
        p.completedChallenges.includes(id)
          ? p
          : {
              ...p,
              completedChallenges: [...p.completedChallenges, id],
              activityDates: [
                ...new Set([
                  ...p.activityDates,
                  new Date().toISOString().slice(0, 10),
                ]),
              ],
              xp: p.xp + 75,
            },
      ),
    [update],
  );
  const saveQuiz = useCallback(
    (id: string, score: number) =>
      update((p) => ({
        ...p,
        quizScores: {
          ...p.quizScores,
          [id]: Math.max(score, p.quizScores[id] ?? 0),
        },
        xp: p.xp + (score >= 70 ? 25 : 0),
      })),
    [update],
  );
  const setCurrentLesson = useCallback(
    (id: string) =>
      update((p) => (p.currentLesson === id ? p : { ...p, currentLesson: id })),
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
  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      completeLesson,
      completeChallenge,
      saveQuiz,
      setCurrentLesson,
      toggleMode,
    }),
    [
      progress,
      hydrated,
      completeLesson,
      completeChallenge,
      saveQuiz,
      setCurrentLesson,
      toggleMode,
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
