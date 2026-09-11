"use client";
import { useCallback, useState } from "react";
import { AlertTriangle, Eye, Lightbulb, Terminal } from "lucide-react";
import type { DebugExercise } from "@/types/learning";
import { CodeRunner, type TestOutcome } from "./code-runner";
import { useProgress } from "./providers";

export function DebugExperience({ exercise }: { exercise: DebugExercise }) {
  const [hintsShown, setHintsShown] = useState(0);
  const [corrected, setCorrected] = useState(false);
  const { progress, recordDebug } = useProgress();
  const record = progress.debugProgress[exercise.slug];
  const solved = record?.completed ?? false;

  const onTestResult = useCallback(
    ({
      passed,
      total,
    }: {
      passed: number;
      total: number;
      results: TestOutcome[];
    }) => recordDebug(exercise.slug, passed, total),
    [recordDebug, exercise.slug],
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold text-red-600">
            <AlertTriangle size={16} /> Observed behavior
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {exercise.observedBehavior}
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-green-600">Expected behavior</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {exercise.expectedBehavior}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-[var(--line)] bg-black p-4 font-mono text-sm text-red-300">
        <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
          <Terminal size={13} /> Console / error output
        </span>
        {exercise.consoleOutput}
      </div>
      <div className="mt-6">
        <CodeRunner
          key={exercise.slug}
          title={`${exercise.title} · fix the bug`}
          initialCode={exercise.brokenCode}
          tests={exercise.tests}
          onTestResult={onTestResult}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="button text-sm"
          onClick={() =>
            setHintsShown((n) => Math.min(exercise.hints.length, n + 1))
          }
          disabled={hintsShown >= exercise.hints.length}
        >
          <Lightbulb size={16} />
          {hintsShown === 0 ? "Show hint" : "Show another hint"}
        </button>
        <button
          className="button text-sm"
          onClick={() => setCorrected(!corrected)}
        >
          <Eye size={16} />
          {corrected ? "Hide corrected version" : "Reveal corrected version"}
        </button>
      </div>
      {hintsShown > 0 && (
        <div className="mt-4 space-y-3">
          {exercise.hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="card p-4 text-sm text-[var(--muted)]">
              <strong className="text-[var(--ink)]">Hint {i + 1}.</strong>{" "}
              {hint}
            </div>
          ))}
        </div>
      )}
      {corrected && (
        <div className="mt-4">
          <pre className="code overflow-x-auto rounded-xl bg-black p-5 text-sm text-white">
            <code>{exercise.correctedCode}</code>
          </pre>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {exercise.explanation}
          </p>
        </div>
      )}
      {solved && (
        <div className="mt-6 rounded-xl bg-green-500/10 p-4 font-semibold text-green-700">
          Bug fixed · +{exercise.xp} XP
        </div>
      )}
    </div>
  );
}
