"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DebugExperience } from "@/components/debug-experience";
import { debugLab } from "@/content/debug-lab";
import { useProgress } from "@/components/providers";
import { CheckCircle2 } from "lucide-react";
import type { DebugCategory } from "@/types/learning";

const CATEGORIES: (DebugCategory | "All")[] = [
  "All",
  "SyntaxError",
  "ReferenceError",
  "TypeError",
  "Scope",
  "Loops",
  "Arrays",
  "Objects",
  "DOM",
  "Async",
  "Promises",
  "API",
  "Off-by-one",
  "Mutation",
  "Comparison",
  "Events",
];

export default function DebugPage() {
  const { progress, hydrated } = useProgress();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [slug, setSlug] = useState(debugLab[0].slug);

  const filtered = useMemo(
    () => debugLab.filter((x) => category === "All" || x.category === category),
    [category],
  );
  const exercise = debugLab.find((x) => x.slug === slug) ?? debugLab[0];
  const solvedCount = debugLab.filter(
    (x) => progress.debugProgress[x.slug]?.completed,
  ).length;

  return (
    <AppShell>
      <section className="shell max-w-6xl py-12">
        <p className="eyebrow">Bug Hunter Lab</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Follow the error, not the guess.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {debugLab.length} broken programs across syntax, reference, type,
          scope, loop, array, object, DOM, async, and mutation bugs. Read the
          observed behavior, form a hypothesis, fix the code yourself, then
          reveal the corrected version.
          {hydrated && ` ${solvedCount} / ${debugLab.length} fixed.`}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${category === c ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)] text-[var(--muted)]"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] lg:overflow-y-auto">
            <ol className="space-y-1.5">
              {filtered.map((x) => {
                const solved = progress.debugProgress[x.slug]?.completed;
                return (
                  <li key={x.slug}>
                    <button
                      onClick={() => setSlug(x.slug)}
                      className={`flex w-full items-center gap-2 rounded-lg p-2.5 text-left text-sm ${x.slug === slug ? "bg-[var(--surface)] font-semibold" : "text-[var(--muted)]"}`}
                    >
                      <span className="flex-1">{x.title}</span>
                      {hydrated && solved && (
                        <CheckCircle2
                          size={15}
                          className="shrink-0 text-green-600"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 font-medium">
                {exercise.category}
              </span>
              <span className="capitalize">{exercise.difficulty}</span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.03em]">
              {exercise.title}
            </h2>
            <div className="mt-6">
              <DebugExperience key={exercise.slug} exercise={exercise} />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
