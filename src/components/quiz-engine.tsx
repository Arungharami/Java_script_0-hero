"use client";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useProgress } from "./providers";
type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};
export function QuizEngine({
  id,
  questions,
}: {
  id: string;
  questions: Question[];
}) {
  const { saveQuiz } = useProgress();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [checked, setChecked] = useState(false);
  const finished = index === questions.length;
  const score = Math.round(
    (answers.filter(Boolean).length / questions.length) * 100,
  );
  if (finished)
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={40} />
        <h2 className="mt-5 text-3xl font-semibold">
          {score >= 70 ? "Checkpoint passed" : "Keep practicing"}
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          You scored {score}%. A score of 70% or higher passes.
        </p>
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
  const current = questions[index];
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex justify-between text-sm text-[var(--muted)]">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span>{answers.filter(Boolean).length} correct</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--accent)]"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>
      <h2 className="mt-8 text-2xl font-semibold">{current.question}</h2>
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
            setAnswers([...answers, choice === current.answer]);
          } else {
            const next = index + 1;
            if (next === questions.length) {
              const final = [...answers, choice === current.answer];
              saveQuiz(
                id,
                Math.round(
                  (final.filter(Boolean).length / questions.length) * 100,
                ),
              );
            }
            setIndex(next);
            setChoice(undefined);
            setChecked(false);
          }
        }}
      >
        {checked ? "Next question" : "Check answer"}
      </button>
    </div>
  );
}
