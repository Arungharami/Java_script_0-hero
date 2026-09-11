import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProjectMilestones } from "@/components/project-milestones";
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
  const isCapstone = project.slug === "javascript-productivity-dashboard";
  return (
    <AppShell>
      <section className="shell max-w-5xl py-14">
        <Link href="/projects" className="eyebrow">
          ← All projects
        </Link>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <p className="eyebrow">{project.level} project{project.week ? ` · Week ${project.week}` : ""}</p>
          {isCapstone && (
            <span className="rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-[var(--accent-ink)]">
              Capstone
            </span>
          )}
        </div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {project.summary}
        </p>

        <section className="mt-10 card p-6">
          <h2 className="text-xl font-semibold">The problem</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">{project.problem}</p>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-xl font-semibold">User stories</h2>
            <ul className="mt-4 space-y-3">
              {project.userStories.map((story) => (
                <li className="flex gap-3 text-sm leading-6" key={story}>
                  <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                  {story}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6">
            <h2 className="text-xl font-semibold">Planning checklist</h2>
            <ul className="mt-4 space-y-3">
              {project.planningChecklist.map((item) => (
                <li className="flex gap-3 text-sm leading-6" key={item}>
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--muted)]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="card overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold">Suggested data structure</h2>
            </div>
            <pre className="code mt-4 overflow-x-auto bg-black p-5 text-sm text-white">
              <code>{project.dataStructure}</code>
            </pre>
          </section>
          <section className="card p-6">
            <h2 className="text-xl font-semibold">UI requirements</h2>
            <ul className="mt-4 space-y-3">
              {project.uiRequirements.map((item) => (
                <li className="flex gap-3 text-sm leading-6" key={item}>
                  <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            {isCapstone ? "Milestones" : "Build milestones"}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Check off each milestone as you complete it — saved to this
            device.
          </p>
          <div className="mt-5">
            <ProjectMilestones slug={project.slug} milestones={project.milestones} />
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Testing checklist</h2>
            <ul className="mt-4 space-y-3">
              {project.testingChecklist.map((item) => (
                <li className="flex gap-3 text-sm leading-6" key={item}>
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--muted)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">
              {isCapstone ? "Final checklist" : "Completion criteria"}
            </h2>
            <div className="mt-4">
              <ProjectMilestones
                slug={`${project.slug}-criteria`}
                milestones={project.completionCriteria}
              />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="font-semibold">Progressive support</h2>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium">
            {["Requirements", "Planning", "Starter", "Hints", "Reference Solution"].map(
              (label, index, arr) => (
                <span className="contents" key={label}>
                  <span className="rounded-lg bg-[var(--bg)] px-3 py-2">{label}</span>
                  {index < arr.length - 1 && (
                    <span className="text-[var(--muted)]" aria-hidden>
                      →
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer font-medium">
              Bonus features
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              {project.bonuses.map((bonus) => (
                <li key={bonus}>{bonus}</li>
              ))}
            </ul>
          </details>
        </section>

        {isCapstone && (
          <section className="mt-10 rounded-2xl border border-dashed border-[var(--line)] p-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              Once every milestone and the final checklist are complete, add
              this project to your portfolio.
            </p>
            <Link href="/career" className="button button-primary mt-4">
              Portfolio readiness guide
            </Link>
          </section>
        )}
      </section>
    </AppShell>
  );
}
