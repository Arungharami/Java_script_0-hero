import { AppShell } from "@/components/app-shell";
import { ChallengeExperience } from "@/components/challenge-experience";
import { challenges } from "@/content/challenges";
export default function DebugPage() {
  const challenge = challenges.find((x) => x.slug === "debug-total")!;
  return (
    <AppShell>
      <section className="shell max-w-5xl py-12">
        <p className="eyebrow">Bug Hunter · Lab 01</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Follow the error, not the guess.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          The function below contains two reference errors. Run it first, read
          the earliest error, repair one identifier, and repeat.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            ["SyntaxError", "The code cannot be parsed"],
            ["ReferenceError", "A name cannot be found"],
            ["TypeError", "A value cannot do that operation"],
            ["Logic bug", "Code runs, result is wrong"],
          ].map(([t, d]) => (
            <div className="card p-4" key={t}>
              <strong className="text-sm">{t}</strong>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{d}</p>
            </div>
          ))}
        </div>
        <ChallengeExperience challenge={challenge} />
      </section>
    </AppShell>
  );
}
