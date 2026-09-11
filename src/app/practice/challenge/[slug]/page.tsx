import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChallengeExperience } from "@/components/challenge-experience";
import { challenges } from "@/content/challenges";
import Link from "next/link";
export function generateStaticParams() {
  return challenges.map((x) => ({ slug: x.slug }));
}
export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const challenge = challenges.find((x) => x.slug === slug);
  if (!challenge) notFound();
  return (
    <AppShell>
      <section className="shell max-w-5xl py-12">
        <Link href="/practice" className="eyebrow">
          ← Practice
        </Link>
        <div className="mt-8 flex items-center gap-3 text-sm text-[var(--muted)]">
          <span>{challenge.category}</span>
          <span>·</span>
          <span className="capitalize">{challenge.difficulty}</span>
        </div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          {challenge.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {challenge.description}
        </p>
        <ChallengeExperience challenge={challenge} />
      </section>
    </AppShell>
  );
}
