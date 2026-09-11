import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <AppShell>
      <section className="shell max-w-5xl py-14">
        <Link href="/projects" className="eyebrow">
          ← All projects
        </Link>
        <p className="eyebrow mt-10">{project.level} project</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {project.summary}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-xl font-semibold">
              User stories & requirements
            </h2>
            <ul className="mt-5 space-y-3">
              {project.requirements.map((requirement) => (
                <li className="flex gap-3 text-sm" key={requirement}>
                  <Check size={16} className="text-green-600" />
                  {requirement}
                </li>
              ))}
            </ul>
          </section>
          <section className="card overflow-hidden p-5">
            <p className="eyebrow">UI planning canvas</p>
            <div className="mt-5 grid h-52 grid-cols-[90px_1fr] gap-3 rounded-xl bg-[var(--bg)] p-4">
              <div className="rounded-lg bg-[var(--line)]" />
              <div className="grid grid-rows-[40px_1fr] gap-3">
                <div className="rounded-lg bg-[var(--line)]" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-dashed border-[var(--line)]" />
                  <div className="rounded-lg border border-dashed border-[var(--line)]" />
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Build milestones</h2>
          <div className="mt-5 grid gap-3">
            {project.milestones.map((milestone, index) => (
              <div className="card flex items-center gap-4 p-5" key={milestone}>
                <span className="code text-sm text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{milestone}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="font-semibold">Progressive support</h2>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium">
            {[
              "Requirements",
              "Planning",
              "Starter",
              "Hints",
              "Reference Solution",
            ].map((label, index) => (
              <span className="contents" key={label}>
                <span className="rounded-lg bg-[var(--bg)] px-3 py-2">
                  {label}
                </span>
                {index < 4 && (
                  <ArrowDown
                    className="rotate-[-90deg] text-[var(--muted)]"
                    size={15}
                  />
                )}
              </span>
            ))}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer font-medium">
              Bonus challenges
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              {project.bonuses.map((bonus) => (
                <li key={bonus}>{bonus}</li>
              ))}
            </ul>
          </details>
        </section>
      </section>
    </AppShell>
  );
}
