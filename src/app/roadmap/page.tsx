"use client";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/components/providers";
import { curriculum } from "@/content/curriculum";
import { completionPercent } from "@/lib/progress";
import { ArrowRight, Flag } from "lucide-react";
export default function RoadmapPage() {
  const { progress } = useProgress();
  return (
    <AppShell>
      <section className="shell max-w-5xl py-14">
        <p className="eyebrow">Start → JavaScript Hero</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Your eight-week learning journey.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          The path is ordered, not locked. Move at your pace and revisit any
          concept when a project exposes a gap.
        </p>
        <div className="relative mt-12 space-y-5 before:absolute before:bottom-12 before:left-6 before:top-12 before:w-px before:bg-[var(--line)] sm:before:left-10">
          {curriculum.map((week) => {
            const done = week.lessons.filter((l) =>
              progress.completedLessons.includes(l.id),
            ).length;
            const pct = completionPercent(done, week.lessons.length);
            return (
              <Link
                href={`/learn/week/${week.number}`}
                className="card relative flex gap-5 p-5 transition hover:-translate-y-0.5 sm:gap-7 sm:p-7"
                key={week.number}
              >
                <span className="code z-10 grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] font-semibold sm:size-16">
                  {String(week.number).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <p className="eyebrow">{week.theme}</p>
                      <h2 className="mt-2 text-xl font-semibold">
                        {week.title}
                      </h2>
                    </div>
                    <span className="text-sm text-[var(--muted)]">
                      {week.studyHours}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Project: {week.project.title}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
                      <div
                        className="h-full bg-[var(--accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="code text-xs">{pct}%</span>
                    <ArrowRight size={17} />
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="relative flex items-center gap-5 p-5 sm:gap-7">
            <span className="z-10 grid size-12 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] sm:size-16">
              <Flag />
            </span>
            <div>
              <p className="eyebrow">Finish</p>
              <strong>JavaScript Hero</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
