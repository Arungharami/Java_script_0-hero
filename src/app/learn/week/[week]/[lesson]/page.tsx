import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { curriculum, getLesson, getWeek } from "@/content/curriculum";
import { LessonExperience } from "@/components/lesson-experience";
export function generateStaticParams() {
  return curriculum.flatMap((w) =>
    w.lessons.map((l) => ({ week: String(w.number), lesson: l.slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string; lesson: string }>;
}): Promise<Metadata> {
  const p = await params;
  const lesson = getLesson(Number(p.week), p.lesson);
  return lesson ? { title: lesson.title, description: lesson.description } : {};
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ week: string; lesson: string }>;
}) {
  const p = await params;
  const week = getWeek(Number(p.week));
  const lesson = getLesson(Number(p.week), p.lesson);
  if (!week || !lesson) notFound();
  const i = week.lessons.indexOf(lesson);
  return (
    <LessonExperience
      week={week}
      lesson={lesson}
      previous={week.lessons[i - 1]}
      next={week.lessons[i + 1]}
    />
  );
}
