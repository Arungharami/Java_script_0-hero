"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { interviewQuestions } from "@/content/interview-questions";
import { Search } from "lucide-react";
import type { ChallengeDifficulty, InterviewCategory } from "@/types/learning";

const CATEGORIES: (InterviewCategory | "All")[] = [
  "All",
  "Fundamentals",
  "Functions",
  "Scope",
  "Arrays",
  "Objects",
  "DOM",
  "Async",
  "Event Loop",
  "Closures",
  "this",
  "Prototypes",
  "Performance",
  "Algorithms",
];
const DIFFICULTIES: (ChallengeDifficulty | "All")[] = [
  "All",
  "easy",
  "medium",
  "hard",
];

export default function InterviewPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [difficulty, setDifficulty] =
    useState<(typeof DIFFICULTIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (difficulty !== "All" && item.difficulty !== difficulty) return false;
      if (
        q &&
        !`${item.question} ${item.shortAnswer}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [category, difficulty, query]);

  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">JavaScript Interview Center</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Prepare for the questions that actually get asked.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          {interviewQuestions.length} questions across 13 categories, each with
          a short answer, a deep explanation, a code example, a common wrong
          answer, an interview trap, and a follow-up question.
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4">
          <Search size={16} className="text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search interview questions"
            className="h-12 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
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
        <div className="mt-3 flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${difficulty === d ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)] text-[var(--muted)]"}`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {filtered.map((item) => {
            const expanded = open === item.slug;
            return (
              <div key={item.slug} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(expanded ? null : item.slug)}
                  className="flex w-full items-center gap-3 p-5 text-left"
                  aria-expanded={expanded}
                >
                  <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                    {item.category}
                  </span>
                  <span className="capitalize text-xs text-[var(--muted)]">
                    {item.difficulty}
                  </span>
                  <strong className="ml-1 flex-1">{item.question}</strong>
                  <span className="text-[var(--muted)]">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
                {expanded && (
                  <div className="space-y-5 border-t border-[var(--line)] p-5 text-sm leading-6">
                    <div>
                      <p className="eyebrow">Short answer</p>
                      <p className="mt-2 font-medium">{item.shortAnswer}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Deep explanation</p>
                      <p className="mt-2 text-[var(--muted)]">
                        {item.deepExplanation}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Code example</p>
                      <pre className="code mt-2 overflow-x-auto rounded-xl bg-black p-4 text-white">
                        <code>{item.codeExample}</code>
                      </pre>
                    </div>
                    <div className="rounded-xl bg-red-500/5 p-4">
                      <p className="eyebrow text-red-600">
                        Common wrong answer
                      </p>
                      <p className="mt-2 text-[var(--muted)]">
                        {item.commonWrongAnswer}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-500/5 p-4">
                      <p className="eyebrow text-amber-600">Interview trap</p>
                      <p className="mt-2 text-[var(--muted)]">
                        {item.interviewTrap}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Follow-up question</p>
                      <p className="mt-2 text-[var(--muted)]">
                        {item.followUp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="mt-12 text-center text-[var(--muted)]">
            No questions match these filters.
          </p>
        )}
      </section>
    </AppShell>
  );
}
