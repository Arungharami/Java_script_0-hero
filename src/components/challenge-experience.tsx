"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import type { Challenge } from "@/types/learning";
import { CodeRunner, type TestOutcome } from "./code-runner";
import { useProgress } from "./providers";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";

export function ChallengeExperience({
  challenge,
  next,
}: {
  challenge: Challenge;
  next?: { slug: string; title: string };
}) {
  const [hintsShown, setHintsShown] = useState(0);
  const [solution, setSolution] = useState(false);
  const { progress, recordChallenge } = useProgress();
  const record = progress.challengeProgress[challenge.slug];
  const passed = record?.completed ?? false;

  const onTestResult = useCallback(
    ({
      passed: p,
      total,
    }: {
      passed: number;
      total: number;
      results: TestOutcome[];
    }) => recordChallenge(challenge.slug, p, total),
    [recordChallenge, challenge.slug],
  );

  return (
    <>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Examples</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-[var(--muted)]">
            {challenge.examples.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Constraints</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-[var(--muted)]">
            {challenge.constraints.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <CodeRunner
          title={`${challenge.title} · editor`}
          initialCode={challenge.starterCode}
          tests={challenge.tests}
          onTestResult={onTestResult}
        />
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Code runs in an isolated Web Worker with a 3-second timeout — no DOM
        access, and it can never hang the page.
      </p>
      {record && !passed && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Best result so far: {record.bestPassedTests} / {record.totalTests}{" "}
          tests passed across {record.attempts} attempt
          {record.attempts === 1 ? "" : "s"}.
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="button text-sm"
          onClick={() =>
            setHintsShown((n) => Math.min(challenge.hints.length, n + 1))
          }
          disabled={hintsShown >= challenge.hints.length}
        >
          <Lightbulb size={16} />
          {hintsShown === 0 ? "Show hint" : "Show another hint"}
        </button>
        <button
          className="button text-sm"
          onClick={() => setSolution(!solution)}
        >
          <Sparkles size={16} />
          {solution ? "Hide solution" : "Reveal solution"}
        </button>
      </div>
      {hintsShown > 0 && (
        <div className="mt-4 space-y-3">
          {challenge.hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="card p-4 text-sm text-[var(--muted)]">
              <strong className="text-[var(--ink)]">Hint {i + 1}.</strong>{" "}
              {hint}
            </div>
          ))}
        </div>
      )}
      {solution && (
        <div className="mt-4">
          <pre className="code overflow-x-auto rounded-xl bg-black p-5 text-sm text-white">
            <code>{challenge.solution}</code>
          </pre>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {challenge.explanation}
          </p>
          {challenge.relatedConcepts.length > 0 && (
            <p className="mt-3 text-sm">
              <span className="text-[var(--muted)]">Related concepts: </span>
              {challenge.relatedConcepts.join(", ")}
            </p>
          )}
        </div>
      )}
      {passed && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-green-500/10 p-4 font-semibold text-green-700">
          <span>Challenge complete · +{challenge.xp} XP</span>
          {next && (
            <Link
              href={`/practice/challenge/${next.slug}`}
              className="button button-primary ml-auto text-sm font-semibold"
            >
              Next challenge: {next.title}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
