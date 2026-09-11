import { AppShell } from "@/components/app-shell";
import { projects } from "@/content/projects";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function ProjectsPage() {
  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">Build to understand</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Projects with increasing independence.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          Requirements come first. Hints unlock progressively. Reference
          solutions stay out of the way until you have a real attempt.
        </p>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <section className="mt-12" key={level}>
            <h2 className="text-2xl font-semibold">{level}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.level === level)
                .map((project) => (
                  <Link
                    className="card group p-6"
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                  >
                    <span className="eyebrow">{project.level} project</span>
                    <h3 className="mt-8 text-xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {project.summary}
                    </p>
                    <ArrowRight
                      className="mt-6 transition group-hover:translate-x-1"
                      size={18}
                    />
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </section>
    </AppShell>
  );
}
