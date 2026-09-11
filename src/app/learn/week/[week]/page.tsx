import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { curriculum, getWeek } from "@/content/curriculum";
import { ArrowRight, CheckCircle2 } from "lucide-react";
export function generateStaticParams() {
  return curriculum.map((w) => ({ week: String(w.number) }));
}
export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const number = Number((await params).week);
  const week = getWeek(number);
  if (!week) notFound();
  return (
    <AppShell>
      <section className="shell py-14">
        <Link href="/learn" className="eyebrow">
          ← All weeks
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="eyebrow">
              Week {week.number} · {week.studyHours}
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
              {week.title}
            </h1>
            <p className="mt-4 text-xl text-[var(--muted)]">{week.theme}</p>
            <p className="mt-6 max-w-2xl leading-8 text-[var(--muted)]">
              {week.description}
            </p>
            <div className="mt-10 space-y-3">
              {week.lessons.map((lesson, i) => (
                <Link
                  className="card group flex items-center gap-4 p-5"
                  key={lesson.id}
                  href={`/learn/week/${week.number}/${lesson.slug}`}
                >
                  <span className="code grid size-10 shrink-0 place-items-center rounded-full bg-[var(--bg)] text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-semibold">{lesson.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {lesson.estimatedMinutes} min · {lesson.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="ml-auto shrink-0 transition group-hover:translate-x-1"
                    size={18}
                  />
                </Link>
              ))}
            </div>
          </div>
          <aside>
            <div className="card sticky top-24 p-6">
              <p className="eyebrow">Weekly project</p>
              <h2 className="mt-4 text-2xl font-semibold">
                {week.project.title}
              </h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {week.project.summary}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Plan the data and states",
                  "Build the core interaction",
                  "Handle errors and edge cases",
                  "Review and document",
                ].map((x) => (
                  <li className="flex gap-2" key={x}>
                    <CheckCircle2 size={17} className="text-green-600" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link
                className="button button-primary mt-6 w-full"
                href={`/projects/${week.number === 8 ? "final-capstone" : ["calculator", "guessing-game", "expense-tracker", "todo-app", "notes-app", "github-profile-explorer", "product-explorer"][week.number - 1]}`}
              >
                Open project
              </Link>
              <Link
                className="button mt-3 w-full"
                href={`/learn/week/${week.number}/quiz`}
              >
                Take checkpoint quiz
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
