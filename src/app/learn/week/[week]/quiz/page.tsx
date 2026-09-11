import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QuizEngine } from "@/components/quiz-engine";
import { curriculum, getWeek } from "@/content/curriculum";
export function generateStaticParams() {
  return curriculum.map((w) => ({ week: String(w.number) }));
}
export default async function WeekQuizPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const week = getWeek(Number((await params).week));
  if (!week) notFound();
  const questions = week.lessons.slice(0, 5).map((l) => l.quiz);
  return (
    <AppShell>
      <section className="shell max-w-3xl py-14">
        <p className="eyebrow">Week {week.number} assessment</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Checkpoint quiz
        </h1>
        <p className="mt-5 text-lg text-[var(--muted)]">
          Answer five questions, review each explanation, and score at least
          70%. You can retry whenever you like.
        </p>
        <div className="mt-8">
          <QuizEngine
            id={`week-${week.number}-checkpoint`}
            questions={questions}
          />
        </div>
      </section>
    </AppShell>
  );
}
