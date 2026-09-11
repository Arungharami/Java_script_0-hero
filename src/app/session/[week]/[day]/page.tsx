import { notFound } from "next/navigation";
import { SessionExperience } from "@/components/session-experience";
import { getDay, getWeek } from "@/content/curriculum";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ week: string; day: string }>;
}) {
  const { week: weekParam, day: dayParam } = await params;
  const week = getWeek(Number(weekParam));
  const day = week ? getDay(week.number, Number(dayParam)) : undefined;
  if (!week || !day) notFound();
  return <SessionExperience week={week} day={day} />;
}
