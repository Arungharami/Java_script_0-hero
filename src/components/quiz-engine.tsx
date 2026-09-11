"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useProgress } from "./providers";
import { scoreWeightedQuiz } from "@/lib/quiz";
import { SKILL_LABELS } from "@/lib/mastery";
import type { QuizQuestion } from "@/types/learning";

const TYPE_LABELS: Record<QuizQuestion["type"], string> = {
  "multiple-choice": "Multiple choice",
  "true-false": "True or false",
  "predict-output": "Predict the output",
  "identify-error": "Identify the error",
  "select-code": "Select the correct code",
  scenario: "Scenario",
};

export function QuizEngine({
  id,
  questions,
}: {
  id: string;
  questions: QuizQuestion[];
}) {
  const { progress, recordQuiz } = useProgress();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [checked, setChecked] = useState(false);
  const previousAttempt = progress.quizAttempts[id];
  const finished = index === questions.length;
  const result = useMemo(
    () => (finished ? scoreWeightedQuiz(questions, answers) : undefined),
    [finished, questions, answers],
  );

  if (finished && result) {
    const passed = result.score >= 70;
    const weakEntries = Object.entries(result.weakSkills) as [string, number][];
    return (
      <div className="card p-8 text-center">
        <CheckCircle2
          className={`mx-auto ${passed ? "text-green-600" : "text-[var(--muted)]"}`}
          size={40}
        />
        <h2 className="mt-5 text-3xl font-semibold">
          {passed ? "Checkpoint passed" : "Keep practicing"}
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          You scored {result.score}% ({result.correctCount} / {questions.length}{" "}
          correct). A score of 70% or higher passes. Unlimited retries.
        </p>
        {previousAttempt && (
          <p className="mt-1 text-sm text-[var(--muted)]">
            Best score: {previousAttempt.bestScore}% · Attempt{" "}
            {previousAttempt.attempts}
          </p>
        )}
        <div className="mx-auto mt-6 grid max-w-md gap-3 text-left">
          {weakEntries.map(([skill, value]) => (
            <div key={skill}>
              <div className="mb-1 flex justify-between text-sm">
                <span>
                  {SKILL_LABELS[skill as keyof typeof SKILL_LABELS] ?? skill}
                </span>
                <span className="text-[var(--muted)]">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className={`h-full ${value < 70 ? "bg-amber-500" : "bg-[var(--accent)]"}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="button mt-6"
          onClick={() => {
            setIndex(0);
            setChoice(undefined);
            setAnswers([]);
            setChecked(false);
          }}
        >
          <RotateCcw size={16} />
          Retry quiz
        </button>
      </div>
    );
  }

  const current = questions[index];
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex justify-between text-sm text-[var(--muted)]">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs font-medium">
          {TYPE_LABELS[current.type]}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--accent)]"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>
      <h2 className="mt-8 text-2xl font-semibold">{current.question}</h2>
      {current.code && (
        <pre className="code mt-4 overflow-x-auto rounded-xl bg-black p-4 text-sm text-white">
          <code>{current.code}</code>
        </pre>
      )}
      <div className="mt-6 grid gap-3">
        {current.options.map((option, i) => (
          <button
            disabled={checked}
            onClick={() => setChoice(i)}
            className={`rounded-xl border p-4 text-left ${choice === i ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)]"}`}
            key={option}
          >
            {String.fromCharCode(65 + i)}. {option}
          </button>
        ))}
      </div>
      {checked && (
        <p
          className={`mt-5 rounded-xl p-4 text-sm ${choice === current.answer ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"}`}
        >
          {current.explanation}
        </p>
      )}
      <button
        disabled={choice === undefined}
        className="button button-primary mt-6 disabled:opacity-50"
        onClick={() => {
          if (!checked) {
            setChecked(true);
          } else {
            const nextAnswers = [...answers];
            nextAnswers[index] = choice;
            const next = index + 1;
            if (next === questions.length) {
              const final = scoreWeightedQuiz(questions, nextAnswers);
              recordQuiz(id, final.score, final.weakSkills);
            }
            setAnswers(nextAnswers);
            setIndex(next);
            setChoice(undefined);
            setChecked(false);
          }
        }}
      >
        {checked
          ? index + 1 === questions.length
            ? "See results"
            : "Next question"
          : "Check answer"}
      </button>
    </div>
  );
}
