"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { challenges } from "@/content/challenges";
import { useProgress } from "@/components/providers";
import Link from "next/link";
import { ArrowRight, Bug, Clock, Search, Zap } from "lucide-react";
import type { ChallengeCategory, ChallengeDifficulty } from "@/types/learning";

const TOPICS: (ChallengeCategory | "All")[] = [
  "All",
  "Fundamentals",
  "Strings",
  "Arrays",
  "Objects",
  "Functions",
  "Algorithms",
  "Modern JavaScript",
  "Async",
  "DOM",
  "Debugging",
];
const DIFFICULTIES: (ChallengeDifficulty | "All")[] = [
  "All",
  "easy",
  "medium",
  "hard",
];
const STATUSES = ["All", "Not Started", "In Progress", "Completed"] as const;
const SORTS = [
  "recommended",
  "difficulty",
  "shortest",
  "newest",
  "completion",
] as const;
const DIFFICULTY_RANK: Record<ChallengeDifficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

export default function PracticePage() {
  const { progress, hydrated } = useProgress();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const [difficulty, setDifficulty] =
    useState<(typeof DIFFICULTIES)[number]>("All");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("recommended");
  const [query, setQuery] = useState("");

  const statusOf = (slug: string) => {
    const record = progress.challengeProgress[slug];
    if (!record) return "Not Started" as const;
    return record.completed ? ("Completed" as const) : ("In Progress" as const);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = challenges.filter((c) => {
      if (topic !== "All" && c.category !== topic) return false;
      if (difficulty !== "All" && c.difficulty !== difficulty) return false;
      if (status !== "All" && statusOf(c.slug) !== status) return false;
      if (
        q &&
        !`${c.title} ${c.category} ${c.relatedConcepts.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
    list = [...list];
    if (sort === "difficulty")
      list.sort(
        (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty],
      );
    else if (sort === "shortest")
      list.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    else if (sort === "newest") list.reverse();
    else if (sort === "completion")
      list.sort(
        (a, b) =>
          (statusOf(a.slug) === "Completed" ? 1 : 0) -
          (statusOf(b.slug) === "Completed" ? 1 : 0),
      );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, difficulty, status, query, sort, progress.challengeProgress]);

  const completedCount = challenges.filter(
    (c) => progress.challengeProgress[c.slug]?.completed,
  ).length;

  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">Deliberate practice</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Turn concepts into instincts.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          {challenges.length} challenges across 10 topics. Solve, run automated
          checks, inspect failures, and compare approaches after you&apos;ve
          tried.
          {hydrated && ` ${completedCount} / ${challenges.length} completed.`}
        </p>
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
              21 broken-code exercises covering syntax, reference, type, scope,
              async, and mutation bugs.
            </p>
          </div>
          <ArrowRight className="ml-auto" />
        </Link>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4">
            <Search size={16} className="text-[var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or concept…"
              aria-label="Search challenges"
              className="h-11 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${topic === t ? "border-[var(--accent)] bg-[color:var(--accent)]/10" : "border-[var(--line)] text-[var(--muted)]"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              Difficulty
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as typeof difficulty)
                }
                className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 capitalize"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="ml-auto flex items-center gap-2">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 capitalize"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((challenge) => {
            const s = statusOf(challenge.slug);
            return (
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
                <h2 className="mt-8 text-xl font-semibold">
                  {challenge.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {challenge.description}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {challenge.estimatedMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={13} /> {challenge.xp}
                    </span>
                  </span>
                  {hydrated && s !== "Not Started" && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${s === "Completed" ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"}`}
                    >
                      {s}
                    </span>
                  )}
                  <ArrowRight
                    className="transition group-hover:translate-x-1"
                    size={16}
                  />
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="mt-12 text-center text-[var(--muted)]">
            No challenges match these filters. Try a broader search or reset a
            filter.
          </p>
        )}
      </section>
    </AppShell>
  );
}
