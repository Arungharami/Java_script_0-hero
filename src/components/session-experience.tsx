"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  Lightbulb,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CodeRunner } from "@/components/code-runner";
import { useProgress } from "@/components/providers";
import { challenges } from "@/content/challenges";
import type { CourseWeek, DayPlan, Lesson } from "@/types/learning";

type Activity =
  | { kind: "goal" }
  | { kind: "lesson"; lesson: Lesson }
  | { kind: "exercise"; lesson: Lesson }
  | { kind: "check"; lesson: Lesson }
  | { kind: "challenge"; slug: string; title: string }
  | { kind: "practice-lab"; slugs: string[] }
  | { kind: "project" }
  | { kind: "complete" };

export function SessionExperience({
  week,
  day,
}: {
  week: CourseWeek;
  day: DayPlan;
}) {
  const { progress, completeLesson, awardXp, setCurrentPath } = useProgress();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [checked, setChecked] = useState(false);

  const dayLessons = day.lessonSlugs
    .map((slug) => week.lessons.find((l) => l.slug === slug))
    .filter((l): l is Lesson => Boolean(l));

  const recommendedSlugs = useMemo(() => {
    return challenges
      .filter((c) => c.skills.some((s) => week.skills.includes(s)))
      .filter((c) => !progress.challengeProgress[c.slug]?.completed)
      .slice(0, 3)
      .map((c) => c.slug);
  }, [week.skills, progress.challengeProgress]);

  const activities: Activity[] = useMemo(() => {
    if (dayLessons.length > 0) {
      return [
        { kind: "goal" },
        ...dayLessons.map((lesson): Activity => ({ kind: "lesson", lesson })),
        ...dayLessons.map((lesson): Activity => ({ kind: "exercise", lesson })),
        ...(recommendedSlugs[0]
          ? ([
              {
                kind: "challenge",
                slug: recommendedSlugs[0],
                title: challenges.find((c) => c.slug === recommendedSlugs[0])!
                  .title,
              },
            ] as Activity[])
          : []),
        ...dayLessons.map((lesson): Activity => ({ kind: "check", lesson })),
        { kind: "complete" },
      ];
    }
    if (day.title.toLowerCase().includes("practice")) {
      return [
        { kind: "goal" },
        { kind: "practice-lab", slugs: recommendedSlugs },
        { kind: "complete" },
      ];
    }
    return [{ kind: "goal" }, { kind: "project" }, { kind: "complete" }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day.day]);

  const total = activities.length - 1;
  const current = activities[step];

  const goNext = () => {
    setChoice(undefined);
    setChecked(false);
    setStep((s) => Math.min(activities.length - 1, s + 1));
  };

  return (
    <AppShell>
      <section className="shell max-w-3xl py-12">
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <Link href={`/learn/week/${week.number}`} className="eyebrow">
            ← Week {week.number}
          </Link>
          {current.kind !== "complete" && (
            <span>
              Step {step + 1} of {total}
            </span>
          )}
        </div>
        {current.kind !== "complete" && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{ width: `${(step / total) * 100}%` }}
            />
          </div>
        )}

        {current.kind === "goal" && (
          <div className="card mt-8 p-8 text-center">
            <Target className="mx-auto text-[var(--accent)]" size={36} />
            <p className="eyebrow mt-4">Today&apos;s goal</p>
            <h1 className="mt-3 text-3xl font-semibold">{day.title}</h1>
            <p className="mt-3 text-[var(--muted)]">{day.checkpoint}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              About {day.estimatedMinutes} minutes · {total} activities
            </p>
            <button className="button button-primary mt-6" onClick={goNext}>
              Start session <ArrowRight size={16} />
            </button>
          </div>
        )}

        {current.kind === "lesson" && (
          <div className="mt-8">
            <p className="eyebrow">Lesson</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {current.lesson.title}
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              {current.lesson.description}
            </p>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              {current.lesson.explanation[0]}
            </p>
            <div className="mt-5">
              <CodeRunner
                key={current.lesson.id}
                initialCode={current.lesson.example}
                title="Working example"
              />
            </div>
            <button className="button button-primary mt-6" onClick={goNext}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {current.kind === "exercise" && (
          <div className="mt-8">
            <p className="eyebrow">Exercise</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {current.lesson.title}
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              {current.lesson.challenge.prompt}
            </p>
            <div className="mt-5">
              <CodeRunner
                key={current.lesson.id}
                initialCode={current.lesson.challenge.starterCode}
                title="Exercise"
              />
            </div>
            <button
              className="button button-primary mt-6"
              onClick={() => {
                completeLesson(current.lesson.id);
                goNext();
              }}
            >
              Mark done & continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {current.kind === "challenge" && (
          <div className="card mt-8 p-8 text-center">
            <p className="eyebrow">Recommended challenge</p>
            <h1 className="mt-3 text-2xl font-semibold">{current.title}</h1>
            <p className="mt-3 text-[var(--muted)]">
              Open this challenge in Practice, pass its tests, then return here
              to continue your session.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/practice/challenge/${current.slug}`}
                className="button button-primary"
              >
                Open challenge <ArrowRight size={16} />
              </Link>
              <button className="button" onClick={goNext}>
                Continue session
              </button>
            </div>
          </div>
        )}

        {current.kind === "practice-lab" && (
          <div className="mt-8">
            <p className="eyebrow">Practice lab</p>
            <h1 className="mt-2 text-3xl font-semibold">
              Solve two or more challenges
            </h1>
            <p className="mt-3 text-[var(--muted)]">{day.checkpoint}</p>
            <div className="mt-5 space-y-3">
              {current.slugs.length === 0 && (
                <p className="text-sm text-[var(--muted)]">
                  You&apos;ve completed every recommended challenge for this
                  week already — browse Practice for more.
                </p>
              )}
              {current.slugs.map((slug) => {
                const c = challenges.find((x) => x.slug === slug)!;
                return (
                  <Link
                    key={slug}
                    href={`/practice/challenge/${slug}`}
                    className="card flex items-center gap-3 p-4"
                  >
                    <span className="flex-1 font-medium">{c.title}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {c.category}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                );
              })}
            </div>
            <button className="button button-primary mt-6" onClick={goNext}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {current.kind === "project" && (
          <div className="card mt-8 p-8 text-center">
            <p className="eyebrow">Project + assessment</p>
            <h1 className="mt-3 text-2xl font-semibold">
              {week.project.title}
            </h1>
            <p className="mt-3 text-[var(--muted)]">{day.checkpoint}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/projects/${week.project.slug}`}
                className="button button-primary"
              >
                Open project <ArrowRight size={16} />
              </Link>
              <Link href={`/learn/week/${week.number}/quiz`} className="button">
                Take checkpoint quiz
              </Link>
            </div>
            <button className="button mt-4" onClick={goNext}>
              Mark session reviewed
            </button>
          </div>
        )}

        {current.kind === "check" && (
          <div className="card mt-8 p-8">
            <p className="eyebrow">Knowledge check</p>
            <h1 className="mt-3 text-xl font-semibold">
              {current.lesson.quiz.question}
            </h1>
            <div className="mt-5 grid gap-2">
              {current.lesson.quiz.options.map((option, i) => (
                <button
                  disabled={checked}
                  onClick={() => setChoice(i)}
                  key={option}
                  className={`rounded-xl border p-3 text-left text-sm ${choice === i ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)]"}`}
                >
                  {String.fromCharCode(65 + i)}. {option}
                </button>
              ))}
            </div>
            {checked && (
              <p
                className={`mt-4 rounded-xl p-4 text-sm ${choice === current.lesson.quiz.answer ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"}`}
              >
                {current.lesson.quiz.explanation}
              </p>
            )}
            <button
              disabled={choice === undefined}
              className="button button-primary mt-5 disabled:opacity-50"
              onClick={() => {
                if (!checked) {
                  setChecked(true);
                  if (choice === current.lesson.quiz.answer) awardXp(10);
                } else {
                  goNext();
                }
              }}
            >
              {checked ? (
                <>
                  Continue <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Lightbulb size={16} /> Check answer
                </>
              )}
            </button>
          </div>
        )}

        {current.kind === "complete" && (
          <div className="card mt-8 p-10 text-center">
            <Flag className="mx-auto text-green-600" size={40} />
            <h1 className="mt-4 text-3xl font-semibold">Session complete</h1>
            <p className="mt-3 text-[var(--muted)]">
              You finished {day.title} for Week {week.number}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {week.days.find((d) => d.day === day.day + 1) ? (
                <Link
                  href={`/session/${week.number}/${day.day + 1}`}
                  className="button button-primary"
                  onClick={() =>
                    setCurrentPath({ week: week.number, day: day.day + 1 })
                  }
                >
                  Start next session <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  href={`/learn/week/${week.number + 1 <= 8 ? week.number + 1 : week.number}`}
                  className="button button-primary"
                >
                  Continue to Week {Math.min(8, week.number + 1)}
                </Link>
              )}
              <Link href={`/learn/week/${week.number}`} className="button">
                <CheckCircle2 size={16} /> Back to week overview
              </Link>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
