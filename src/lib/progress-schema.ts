import { z } from "zod";
import type { LearningProgress } from "@/types/learning";

const challengeAttemptSchema = z.object({
  completed: z.boolean(),
  attempts: z.number().int().nonnegative(),
  bestPassedTests: z.number().int().nonnegative(),
  totalTests: z.number().int().nonnegative(),
  lastAttemptAt: z.string().optional(),
});

const quizAttemptSchema = z.object({
  attempts: z.number().int().nonnegative(),
  bestScore: z.number().min(0).max(100),
  lastScore: z.number().min(0).max(100),
  lastAttemptAt: z.string().optional(),
  weakSkills: z.record(z.string(), z.number()),
});

const projectProgressSchema = z.object({
  completedMilestones: z.array(z.string()),
});

export const learningProgressSchema = z.object({
  version: z.literal(2),
  completedLessons: z.array(z.string()),
  challengeProgress: z.record(z.string(), challengeAttemptSchema),
  debugProgress: z.record(z.string(), challengeAttemptSchema),
  quizAttempts: z.record(z.string(), quizAttemptSchema),
  projectProgress: z.record(z.string(), projectProgressSchema),
  activityDates: z.array(z.string()),
  currentLesson: z.string(),
  currentPath: z.object({
    week: z.number(),
    day: z.number().optional(),
    lesson: z.string().optional(),
  }),
  xp: z.number().nonnegative(),
  preferences: z.object({
    mode: z.enum(["guided", "fast"]),
    theme: z.enum(["light", "dark", "system"]),
  }),
});

export type ImportResult =
  | { success: true; progress: LearningProgress }
  | { success: false; error: string };

/** Validates an exported progress file before it ever touches localStorage. */
export function validateImportedProgress(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: "That file is not valid JSON." };
  }
  const result = learningProgressSchema.safeParse(parsed);
  if (!result.success) {
    return {
      success: false,
      error:
        "That file doesn't match the expected progress format. Export a fresh backup and try again.",
    };
  }
  return { success: true, progress: result.data };
}
