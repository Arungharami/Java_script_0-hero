"use client";
import Link from "next/link";
import { Check, Clock, Play } from "lucide-react";
import type { CourseWeek } from "@/types/learning";
import { useProgress } from "./providers";

export function DailyPlan({ week }: { week: CourseWeek }) {
  const { progress, hydrated } = useProgress();
  return (
    <div className="mt-5 space-y-3">
      {week.days.map((day) => {
        const total = day.lessonSlugs.length;
        const done = day.lessonSlugs.filter((slug) => {
          const lesson = week.lessons.find((l) => l.slug === slug);
          return lesson ? progress.completedLessons.includes(lesson.id) : false;
        }).length;
        const complete = total > 0 && done === total;
        const started = done > 0;
        return (
          <div key={day.day} className="card flex items-center gap-4 p-4">
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${complete ? "bg-green-500/15 text-green-700" : "bg-[var(--bg)]"}`}
            >
              {complete ? <Check size={16} /> : day.day}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{day.title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <Clock size={12} /> {day.estimatedMinutes} min
                {total > 0 && hydrated && ` · ${done}/${total} lessons`}
              </p>
            </div>
            <Link
              href={`/session/${week.number}/${day.day}`}
              className="button text-sm shrink-0"
            >
              <Play size={14} />
              {hydrated && started && !complete ? "Continue" : "Start"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
