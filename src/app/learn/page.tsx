import { AppShell } from "@/components/app-shell";
import { curriculum } from "@/content/curriculum";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function LearnPage() {
  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">64 actionable lessons</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Learn by building a clear mental model.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Each week combines concise explanations, executable examples,
          exercises, debugging, a quiz, and a project milestone.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {curriculum.map((week) => (
            <Link
              href={`/learn/week/${week.number}`}
              key={week.number}
              className="card group p-6"
            >
              <span className="eyebrow">
                Week {week.number} · {week.studyHours}
              </span>
              <h2 className="mt-5 text-2xl font-semibold">{week.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{week.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span>{week.lessons.length} lessons · 1 project</span>
                <ArrowRight className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
