"use client";
import { allLessons } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { debugLab } from "@/content/debug-lab";
import { quizzes } from "@/content/quizzes";
import { computeSkillMastery, overallMastery } from "@/lib/mastery";
import { useProgress } from "./providers";
import type { CourseWeek } from "@/types/learning";

export function WeeklyMastery({ week }: { week: CourseWeek }) {
  const { progress, hydrated } = useProgress();
  if (!hydrated) return <div className="card h-40 animate-pulse" />;
  const mastery = computeSkillMastery(
    progress,
    allLessons,
    challenges,
    debugLab,
    quizzes,
  ).filter((m) => week.skills.includes(m.skill));
  const overall = overallMastery(mastery);
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Week {week.number} mastery</p>
        <span className="text-2xl font-semibold">{overall}%</span>
      </div>
      <div className="mt-5 space-y-4">
        {mastery.map((m) => (
          <div key={m.skill}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>{m.label}</span>
              <span className="text-[var(--muted)]">
                {m.hasData ? `${m.value}%` : "No data yet"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: `${m.hasData ? m.value : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Calculated from your lesson completion, challenge/debug test results,
        and this week&apos;s quiz — never fabricated.
      </p>
    </div>
  );
}
