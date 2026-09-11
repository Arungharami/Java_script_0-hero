import { emptyProgress, PROGRESS_KEY, readProgress } from "./progress";
import type { LearningProgress, ProgressRepository } from "@/types/learning";

/**
 * The current, device-local implementation of ProgressRepository. A future
 * authenticated Supabase/PostgreSQL-backed repository can implement the same
 * interface and swap in here without any curriculum or UI component change.
 */
export class LocalProgressRepository implements ProgressRepository {
  async load(): Promise<LearningProgress> {
    if (typeof window === "undefined") return emptyProgress;
    return readProgress(window.localStorage.getItem(PROGRESS_KEY));
  }

  async save(progress: LearningProgress): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

export const localProgressRepository = new LocalProgressRepository();
