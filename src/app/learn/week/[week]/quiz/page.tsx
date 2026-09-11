import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QuizEngine } from "@/components/quiz-engine";
import { curriculum, getWeek } from "@/content/curriculum";
import { getWeeklyQuiz } from "@/content/quizzes";
export function generateStaticParams() {
  return curriculum.map((w) => ({ week: String(w.number) }));
}
export default async function WeekQuizPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const week = getWeek(Number((await params).week));
  const quiz = week ? getWeeklyQuiz(week.number) : undefined;
  if (!week || !quiz) notFound();
  return (
    <AppShell>
      <section className="shell max-w-3xl py-14">
        <p className="eyebrow">Week {week.number} assessment</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Checkpoint quiz
        </h1>
        <p className="mt-5 text-lg text-[var(--muted)]">
          {quiz.questions.length} mixed-format questions — multiple choice,
          true/false, predict-the-output, identify-the-error, select-the-code,
          and scenarios. Review each explanation, score at least 70%, and
          retry as many times as you like.
        </p>
        <div className="mt-8">
          <QuizEngine id={`week-${week.number}`} questions={quiz.questions} />
        </div>
      </section>
    </AppShell>
  );
}
