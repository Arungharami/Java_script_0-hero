"use client";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/components/providers";
import { allLessons } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { debugLab } from "@/content/debug-lab";
import { quizzes } from "@/content/quizzes";
import { computeSkillMastery, overallMastery } from "@/lib/mastery";
import { Award } from "lucide-react";

export default function SkillsPage() {
  const { progress, hydrated } = useProgress();
  const mastery = hydrated
    ? computeSkillMastery(progress, allLessons, challenges, debugLab, quizzes)
    : [];
  const overall = hydrated ? overallMastery(mastery) : 0;
  const withData = mastery.filter((m) => m.hasData);
  const needsReview = [...withData]
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  return (
    <AppShell>
      <section className="shell max-w-4xl py-14">
        <p className="eyebrow">Skill mastery</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          What you actually know.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          Mastery combines lesson completion, challenge and debugging test
          results, and weekly quiz performance — never lesson completion alone.
          A skill you haven&apos;t practiced shows &quot;No data yet,&quot; not
          a fabricated score.
        </p>

        {!hydrated ? (
          <div className="card mt-8 h-40 animate-pulse" />
        ) : (
          <>
            <div className="card mt-8 flex items-center gap-6 p-6">
              <Award size={32} className="text-[var(--accent)]" />
              <div>
                <p className="text-sm text-[var(--muted)]">Overall mastery</p>
                <p className="text-3xl font-semibold">{overall}%</p>
              </div>
              <p className="ml-auto max-w-xs text-sm text-[var(--muted)]">
                Based on {withData.length} of {mastery.length} skills with
                recorded activity.
              </p>
            </div>

            {needsReview.length > 0 && needsReview[0].value < 70 && (
              <div className="card mt-6 border-amber-500/30 bg-amber-500/5 p-6">
                <p className="eyebrow text-amber-700">Needs review</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {needsReview
                    .filter((m) => m.value < 70)
                    .map((m) => (
                      <div
                        key={m.skill}
                        className="rounded-xl bg-[var(--bg)] p-3 text-sm"
                      >
                        <p className="font-medium">{m.label}</p>
                        <p className="text-[var(--muted)]">{m.value}%</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="card mt-6 p-6">
              <p className="eyebrow">All skills</p>
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
                        className={`h-full ${m.hasData && m.value < 70 ? "bg-amber-500" : "bg-[var(--accent)]"}`}
                        style={{ width: `${m.hasData ? m.value : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
