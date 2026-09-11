import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChallengeExperience } from "@/components/challenge-experience";
import { challenges } from "@/content/challenges";
import Link from "next/link";
import { Clock, Zap } from "lucide-react";
export function generateStaticParams() {
  return challenges.map((x) => ({ slug: x.slug }));
}
export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const index = challenges.findIndex((x) => x.slug === slug);
  const challenge = challenges[index];
  if (!challenge) notFound();
  const next = challenges[index + 1] ?? challenges[0];
  return (
    <AppShell>
      <section className="shell max-w-5xl py-12">
        <Link href="/practice" className="eyebrow">
          ← Practice
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span>{challenge.category}</span>
          <span>·</span>
          <span className="capitalize">{challenge.difficulty}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {challenge.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Zap size={14} /> {challenge.xp} XP
          </span>
        </div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          {challenge.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {challenge.description}
        </p>
        <ChallengeExperience
          challenge={challenge}
          next={{ slug: next.slug, title: next.title }}
        />
      </section>
    </AppShell>
  );
}
