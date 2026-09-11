"use client";

import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseWeek, Lesson } from "@/types/learning";
import { CodeRunner } from "./code-runner";
import { ConceptVisual } from "./concept-visual";
import { useProgress } from "./providers";

export function LessonExperience({
  week,
  lesson,
  previous,
  next,
}: {
  week: CourseWeek;
  lesson: Lesson;
  previous?: Lesson;
  next?: Lesson;
}) {
  const { progress, completeLesson, awardXp, setCurrentLesson, toggleMode } =
    useProgress();
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [choice, setChoice] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const complete = progress.completedLessons.includes(lesson.id);
  const fast = progress.preferences.mode === "fast";
  useEffect(() => setCurrentLesson(lesson.id), [lesson.id, setCurrentLesson]);
  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[260px_minmax(0,760px)_220px] lg:justify-center">
      <aside className="border-r border-[var(--line)] p-5 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
        <Link href={`/learn/week/${week.number}`} className="eyebrow">
          Week {week.number}
        </Link>
        <h2 className="mt-3 font-semibold">{week.title}</h2>
        <ol className="mt-6 space-y-1">
          {week.lessons.map((item, i) => (
            <li key={item.id}>
              <Link
                href={`/learn/week/${week.number}/${item.slug}`}
                className={`flex gap-3 rounded-lg p-2.5 text-sm ${item.id === lesson.id ? "bg-[var(--surface)] font-semibold" : "text-[var(--muted)]"}`}
              >
                <span className="code text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item.title}</span>
                {progress.completedLessons.includes(item.id) && (
                  <Check className="ml-auto text-green-600" size={15} />
                )}
              </Link>
            </li>
          ))}
        </ol>
      </aside>
      <article className="min-w-0 px-5 py-10 sm:px-10 lg:py-14">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Clock size={15} />
            {lesson.estimatedMinutes} min
          </span>
          <span>·</span>
          <span className="capitalize">{lesson.difficulty}</span>
          <button
            onClick={toggleMode}
            className="ml-auto rounded-full border border-[var(--line)] px-3 py-1.5 font-medium"
          >
            {fast ? "Fast Track" : "Guided Mode"}
          </button>
        </div>
        <p className="eyebrow mt-8">Lesson {lesson.id.split("l")[1]}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          {lesson.description}
        </p>
        <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="font-semibold">By the end, you will be able to…</h2>
          <ul className="mt-4 space-y-3">
            {lesson.objectives.map((x) => (
              <li className="flex gap-3 text-sm" key={x}>
                <Check className="mt-0.5 shrink-0 text-green-600" size={16} />
                {x}
              </li>
            ))}
          </ul>
        </section>
        {!fast && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Build the mental model</h2>
            {lesson.explanation.map((x) => (
              <p className="mt-4 leading-8 text-[var(--muted)]" key={x}>
                {x}
              </p>
            ))}
            {lesson.mentalModel && <ConceptVisual kind={lesson.mentalModel} />}
          </section>
        )}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Syntax and working example</h2>
          <p className="mt-3 text-[var(--muted)]">
            Read the code from inputs to output. Predict what it prints, then
            run it and change one value.
          </p>
          <div className="mt-5">
            <CodeRunner initialCode={lesson.example} title="Working example" />
          </div>
          <div className="mt-4 rounded-xl border border-[var(--line)] p-4 text-sm">
            <strong>Expected output:</strong>{" "}
            <span className="code text-[var(--muted)]">
              {lesson.expectedOutput}
            </span>
          </div>
        </section>
        {!fast && (
          <>
            <section className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <h2 className="font-semibold">Why this matters</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {lesson.whyItMatters}
                </p>
              </div>
              <div className="card p-5">
                <h2 className="font-semibold">Real-world example</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {lesson.realWorldExample}
                </p>
              </div>
            </section>
            <section className="mt-6">
              <div className="card p-5">
                <h2 className="font-semibold">Common mistakes</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
                  {lesson.mistakes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
        <section className="mt-12">
          <p className="eyebrow">Try it yourself</p>
          <h2 className="mt-3 text-2xl font-semibold">Challenge</h2>
          <p className="mt-3 text-[var(--muted)]">{lesson.challenge.prompt}</p>
          <div className="mt-5">
            <CodeRunner
              initialCode={lesson.challenge.starterCode}
              title="Practice"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="button text-sm" onClick={() => setHint(!hint)}>
              <Lightbulb size={16} /> {hint ? "Hide hint" : "Reveal hint"}
            </button>
            <button
              className="button text-sm"
              onClick={() => setSolution(!solution)}
            >
              {solution ? "Hide solution" : "View solution"}
            </button>
          </div>
          {hint && (
            <p className="mt-4 rounded-xl bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
              {lesson.challenge.hint}
            </p>
          )}
          {solution && (
            <pre className="code mt-4 overflow-x-auto rounded-xl bg-black p-4 text-sm text-white">
              <code>{lesson.challenge.solution}</code>
            </pre>
          )}
        </section>
        <section className="card mt-12 p-6">
          <p className="eyebrow">Knowledge check</p>
          <h2 className="mt-4 text-xl font-semibold">{lesson.quiz.question}</h2>
          <div className="mt-5 grid gap-2">
            {lesson.quiz.options.map((option, i) => (
              <button
                disabled={submitted}
                onClick={() => setChoice(i)}
                key={option}
                className={`rounded-xl border p-3 text-left text-sm ${choice === i ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)]"}`}
              >
                {String.fromCharCode(65 + i)}. {option}
              </button>
            ))}
          </div>
          <button
            disabled={choice === undefined || submitted}
            className="button button-primary mt-5 disabled:opacity-50"
            onClick={() => {
              setSubmitted(true);
              if (choice === lesson.quiz.answer) awardXp(10);
            }}
          >
            Check answer
          </button>
          {submitted && (
            <p
              className={`mt-4 rounded-xl p-4 text-sm ${choice === lesson.quiz.answer ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"}`}
            >
              <strong>
                {choice === lesson.quiz.answer ? "Correct." : "Not quite."}
              </strong>{" "}
              {lesson.quiz.explanation}
            </p>
          )}
        </section>
        <section className="mt-10 rounded-2xl border border-dashed border-[var(--line)] p-6">
          <p className="eyebrow">Summary</p>
          <p className="mt-3 leading-7 text-[var(--muted)]">{lesson.summary}</p>
        </section>
        <button
          onClick={() => completeLesson(lesson.id)}
          className={`button mt-10 w-full ${complete ? "" : "button-primary"}`}
        >
          {complete ? (
            <>
              <Check size={17} />
              Lesson completed
            </>
          ) : (
            "Mark lesson complete"
          )}
        </button>
        <nav className="mt-10 flex justify-between border-t border-[var(--line)] pt-6">
          {previous ? (
            <Link
              className="button"
              href={`/learn/week/${week.number}/${previous.slug}`}
            >
              <ChevronLeft size={17} />
              Previous
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className="button button-primary"
              href={`/learn/week/${week.number}/${next.slug}`}
            >
              Next
              <ChevronRight size={17} />
            </Link>
          ) : (
            <Link
              className="button button-primary"
              href={`/learn/week/${Math.min(8, week.number + 1)}`}
            >
              Week review
              <ChevronRight size={17} />
            </Link>
          )}
        </nav>
      </article>
      <aside className="hidden border-l border-[var(--line)] p-6 lg:block">
        <div className="sticky top-24">
          <p className="eyebrow">On this page</p>
          <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>Objectives</li>
            <li>Mental model</li>
            <li>Working example</li>
            <li>Challenge</li>
            <li>Knowledge check</li>
            <li>Summary</li>
          </ol>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full bg-[var(--accent)]"
              style={{
                width: `${((week.lessons.findIndex((x) => x.id === lesson.id) + 1) / week.lessons.length) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Lesson {week.lessons.findIndex((x) => x.id === lesson.id) + 1} of{" "}
            {week.lessons.length}
          </p>
        </div>
      </aside>
    </div>
  );
}
