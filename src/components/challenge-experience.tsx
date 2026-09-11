"use client";
import { useCallback, useState } from "react";
import type { Challenge } from "@/types/learning";
import { CodeRunner } from "./code-runner";
import { useProgress } from "./providers";
import { Lightbulb } from "lucide-react";
export function ChallengeExperience({ challenge }: { challenge: Challenge }) {
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const { progress, completeChallenge } = useProgress();
  const passed = progress.completedChallenges.includes(challenge.slug);
  const onPass = useCallback(
    () => completeChallenge(challenge.slug),
    [completeChallenge, challenge.slug],
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
            <li>Keep the required function name</li>
            <li>Return a value instead of only logging it</li>
            <li>Do not mutate inputs unless requested</li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <CodeRunner
          title={`${challenge.title} solution`}
          initialCode={challenge.starterCode}
          tests={challenge.testCode}
          onPass={onPass}
        />
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Automated checks run in an isolated browser worker and stop long-running
        code.
      </p>
      <div className="mt-5 flex gap-3">
        <button className="button" onClick={() => setHint(!hint)}>
          <Lightbulb size={16} />
          Hint
        </button>
        <button className="button" onClick={() => setSolution(!solution)}>
          Reference solution
        </button>
      </div>
      {hint && (
        <div className="card mt-4 p-5 text-sm text-[var(--muted)]">
          {challenge.hint}
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
        </div>
      )}
      {passed && (
        <div className="mt-6 rounded-xl bg-green-500/10 p-4 font-semibold text-green-700">
          Challenge complete · +75 XP
        </div>
      )}
    </>
  );
}
