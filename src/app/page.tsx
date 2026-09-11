import Link from "next/link";
import { ArrowRight, Check, Play, Terminal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const weeks = [
  ["01", "Foundations", "Values, variables & operators"],
  ["02", "Logic & functions", "Decisions, scope & loops"],
  ["03", "Arrays & objects", "Transform real data"],
  ["04", "DOM & browser", "Build interactive interfaces"],
  ["05", "Modern JavaScript", "Closures, classes & internals"],
  ["06", "Async & APIs", "Fetch and coordinate data"],
  ["07", "Professional JS", "Architecture, testing & tools"],
  ["08", "Build & ship", "Capstone and career readiness"],
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="shell grid gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
        <div>
          <p className="eyebrow mb-5">The practical 8-week curriculum</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl">
            JavaScript from{" "}
            <span className="text-[var(--muted)]">Zero to Hero</span> in 8 Weeks
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Read less. Code more. Build often. Learn the language by
            experimenting, solving real problems, debugging broken code, and
            shipping useful applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button button-primary" href="/learn/week/1">
              <Play size={17} fill="currentColor" />
              Start Week 1
            </Link>
            <Link className="button" href="/roadmap">
              Explore roadmap <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            {[
              "No sign-up required",
              "Progress saved locally",
              "Learn at your pace",
            ].map((x) => (
              <span key={x} className="flex items-center gap-2">
                <Check size={15} className="text-green-600" />
                {x}
              </span>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Terminal size={16} />
              profile.js
            </span>
            <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
              RUN
            </span>
          </div>
          <pre className="code overflow-x-auto p-6 text-[13px] leading-7">
            <code>
              <span className="text-violet-500">const</span> learner = {`{\n  `}
              name: <span className="text-emerald-500">&quot;You&quot;</span>,
              {`\n  `}level:{" "}
              <span className="text-emerald-500">&quot;Beginner&quot;</span>,
              {`\n  `}goal:{" "}
              <span className="text-emerald-500">
                &quot;JavaScript Hero&quot;
              </span>
              {`\n};\n\n`}
              <span className="text-violet-500">const</span> learn = (
              {`{ goal }`}) ={`>`}
              {`\n  `}
              <span className="text-emerald-500">
                `Building toward: ${`{goal}`}`
              </span>
              ;{`\n\n`}console.log(learn(learner));
            </code>
          </pre>
          <div className="border-t border-[var(--line)] bg-black p-4 font-mono text-sm text-white">
            <span className="text-[var(--accent)]">›</span> Building toward:
            JavaScript Hero
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20">
        <div className="shell">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">Your complete path</p>
              <h2 className="text-4xl font-semibold tracking-[-.04em]">
                Eight weeks. Eight real projects.
              </h2>
            </div>
            <p className="max-w-md text-[var(--muted)]">
              A deliberate progression from your first variable to a
              portfolio-ready productivity dashboard.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {weeks.map(([n, title, desc], i) => (
              <Link
                key={n}
                href={`/learn/week/${i + 1}`}
                className="group bg-[var(--surface)] p-6 transition hover:bg-[var(--bg)]"
              >
                <span className="code text-xs text-[var(--muted)]">
                  WEEK {n}
                </span>
                <h3 className="mt-8 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>
                <ArrowRight
                  className="mt-5 transition group-hover:translate-x-1"
                  size={17}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "01",
              "Learn the idea",
              "Clear explanations answer why a concept exists—not only what to type.",
            ],
            [
              "02",
              "Work the code",
              "Run examples, change inputs, and get immediate browser-safe output.",
            ],
            [
              "03",
              "Prove mastery",
              "Solve tests, debug failures, build a project, then review intelligently.",
            ],
          ].map(([n, t, d]) => (
            <article className="card p-7" key={n}>
              <span className="code text-sm text-[var(--muted)]">{n}</span>
              <h3 className="mt-10 text-xl font-semibold">{t}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Why JavaScript?</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">
              One language. An enormous surface area.
            </h2>
            <p className="mt-5 leading-8 text-[var(--muted)]">
              JavaScript powers browser interfaces, servers, developer tools,
              mobile applications, and the frameworks employers use every day.
              Learning the language first gives React, TypeScript, Next.js, and
              Node.js somewhere solid to land.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Modern syntax",
                "DOM",
                "APIs",
                "Async",
                "Testing",
                "npm",
                "Git",
                "Accessibility",
              ].map((skill) => (
                <span
                  className="rounded-full border border-[var(--line)] px-3 py-2 text-sm"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-7">
            <p className="eyebrow">Skill progression</p>
            <div className="mt-6 space-y-5">
              {[
                ["Understand", 25],
                ["Solve", 45],
                ["Build", 70],
                ["Ship", 100],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="code text-[var(--muted)]">
                      Week {Math.max(1, Math.ceil(Number(value) / 13))}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--line)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <div className="rounded-3xl bg-[#111511] p-8 text-white sm:p-12">
          <p className="eyebrow !text-lime-300">Final capstone</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-.04em]">
                Build a productivity dashboard worth showing.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Combine tasks, notes, local persistence, search, an API-powered
                widget, analytics, responsive behavior, error states,
                accessibility, modular code, and tests.
              </p>
            </div>
            <Link
              className="button button-primary"
              href="/projects/final-capstone"
            >
              Explore capstone <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell pb-20 text-center">
        <p className="eyebrow">Your first program is minutes away</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-.04em]">
          Stop collecting tutorials. Start building fluency.
        </h2>
        <Link className="button button-primary mt-7" href="/learn/week/1">
          Start learning free <ArrowRight size={17} />
        </Link>
      </section>
      <footer className="border-t border-[var(--line)] py-10">
        <div className="shell flex flex-col justify-between gap-4 text-sm text-[var(--muted)] sm:flex-row">
          <span>© 2026 JavaScript 0 → Hero</span>
          <span>Built for learners who want to ship.</span>
        </div>
      </footer>
    </main>
  );
}
