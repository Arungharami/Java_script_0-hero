"use client";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/components/providers";
import { allLessons, curriculum } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { calculateStreak, completionPercent } from "@/lib/progress";
import { ArrowRight, Award, Flame, Target, Trophy } from "lucide-react";
export default function DashboardPage() {
  const { progress, hydrated } = useProgress();
  const pct = completionPercent(
    progress.completedLessons.length,
    allLessons.length,
  );
  const current =
    allLessons.find((x) => x.id === progress.currentLesson) ?? allLessons[0];
  const streak = calculateStreak(progress.activityDates);
  const skills = curriculum.map((w) => ({
    name: w.title.split(" &")[0],
    value: completionPercent(
      w.lessons.filter((l) => progress.completedLessons.includes(l.id)).length,
      w.lessons.length,
    ),
  }));
  return (
    <AppShell>
      <section className="shell py-12">
        <p className="eyebrow">Your learning dashboard</p>
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-.05em]">
              Keep the momentum.
            </h1>
            <p className="mt-4 text-[var(--muted)]">
              Every number below comes from activity saved on this device.
            </p>
          </div>
          <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
            {progress.xp} XP earned
          </span>
        </div>
        {!hydrated ? (
          <div className="card mt-8 h-40 animate-pulse" />
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Target, "Course progress", `${pct}%`],
                [
                  Trophy,
                  "Lessons",
                  `${progress.completedLessons.length} / ${allLessons.length}`,
                ],
                [
                  Award,
                  "Challenges",
                  `${progress.completedChallenges.length} / ${challenges.length}`,
                ],
                [
                  Flame,
                  "Current streak",
                  `${streak} day${streak === 1 ? "" : "s"}`,
                ],
              ].map(([Icon, label, value]) => (
                <div className="card p-5" key={String(label)}>
                  <Icon size={20} className="text-[var(--muted)]" />
                  <p className="mt-8 text-sm text-[var(--muted)]">
                    {String(label)}
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
              <section className="card p-7">
                <p className="eyebrow">Continue learning</p>
                <h2 className="mt-5 text-2xl font-semibold">{current.title}</h2>
                <p className="mt-2 text-[var(--muted)]">
                  Week {current.week.number} · {current.description}
                </p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Link
                  href={`/learn/week/${current.week.number}/${current.slug}`}
                  className="button button-primary mt-6"
                >
                  Continue lesson <ArrowRight size={17} />
                </Link>
              </section>
              <section className="card p-7">
                <p className="eyebrow">Skill mastery</p>
                <div className="mt-5 space-y-4">
                  {skills.slice(0, 5).map((s) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="text-[var(--muted)]">{s.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
                        <div
                          className="h-full bg-[var(--accent)]"
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            {progress.completedLessons.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--line)] p-6 text-center">
                <h2 className="font-semibold">No completed lessons yet</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Finish your first lesson to begin building a real activity
                  history.
                </p>
                <Link href="/learn/week/1" className="button mt-4">
                  Start Week 1
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}
