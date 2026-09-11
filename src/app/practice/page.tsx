import { AppShell } from "@/components/app-shell";
import { challenges } from "@/content/challenges";
import Link from "next/link";
import { ArrowRight, Bug } from "lucide-react";
const categories = [
  "Variables",
  "Strings",
  "Numbers",
  "Conditions",
  "Loops",
  "Functions",
  "Arrays",
  "Objects",
  "DOM",
  "Async",
  "Algorithms",
  "Debugging",
];
export default function PracticePage() {
  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">Deliberate practice</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Turn concepts into instincts.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          Solve focused problems, run automated checks, inspect failures, and
          compare approaches after you have tried.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((x) => (
            <span
              className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)]"
              key={x}
            >
              {x}
            </span>
          ))}
        </div>
        <Link
          href="/practice/debug"
          className="mt-8 flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-red-500/10 text-red-600">
            <Bug />
          </span>
          <div>
            <strong>Debugging Lab</strong>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Repair syntax, reference, type, logic, and asynchronous bugs.
            </p>
          </div>
          <ArrowRight className="ml-auto" />
        </Link>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <Link
              href={`/practice/challenge/${challenge.slug}`}
              className="card group p-6"
              key={challenge.slug}
            >
              <div className="flex justify-between text-xs">
                <span className="eyebrow">{challenge.category}</span>
                <span className="capitalize text-[var(--muted)]">
                  {challenge.difficulty}
                </span>
              </div>
              <h2 className="mt-8 text-xl font-semibold">{challenge.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {challenge.description}
              </p>
              <ArrowRight
                className="mt-6 transition group-hover:translate-x-1"
                size={18}
              />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
