"use client";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Check, Clipboard, Github } from "lucide-react";

const README_TEMPLATE = `# Project Name

One sentence describing what this project does and who it's for.

![screenshot](./docs/screenshot.png)

**Live demo:** https://your-deployment-url.vercel.app

## Features

- Feature one
- Feature two
- Feature three

## Technologies

- JavaScript (ES6+)
- (Add your actual stack: HTML/CSS, a framework, an API, etc.)

## Getting started

\`\`\`bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
\`\`\`

## Challenges solved

Briefly describe one or two real problems you solved and how — this is
what interviewers and hiring managers actually read.

## Lessons learned

What you would do differently next time, or what you learned building it.

## License

MIT
`;

const readinessChecklist = [
  "A focused, descriptive repository name (not \"project1\")",
  "A meaningful commit history — small, well-labeled commits, not one giant commit",
  "A README with a live demo link, screenshots, setup steps, and technologies used",
  "No secrets, API keys, or node_modules committed",
  "A LICENSE file (MIT is a safe default for portfolio projects)",
  "The app actually deployed and reachable at a public URL",
];

export default function CareerPage() {
  const [copied, setCopied] = useState(false);
  return (
    <AppShell>
      <section className="shell max-w-4xl py-14">
        <p className="eyebrow">Career readiness</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          Turn a course project into a portfolio project.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          A working project and a portfolio-ready project are not the same
          thing. This is the gap most learners never close — here&apos;s
          exactly how to close it.
        </p>

        <div className="mt-10 card p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Github size={20} /> GitHub repository standards
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <h2 className="font-semibold">README structure that actually gets read</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Name and one-sentence pitch → screenshot → live demo link →
              features → technologies → setup steps → a challenge you solved
              → lessons learned → license. Put the demo link near the top —
              reviewers rarely scroll far.
            </p>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold">Commit history as a signal</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              A history of small, clearly labeled commits (feat:, fix:,
              docs:) reads as someone who works in a professional, reviewable
              way — the same workflow used throughout this course.
            </p>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold">Screenshots and a live demo</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              A reviewer often decides whether to read further within
              seconds. A real screenshot and a working deployed link do more
              than paragraphs of description.
            </p>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold">Challenges solved &amp; lessons learned</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Naming one real bug you hunted down, or one tradeoff you made
              and why, demonstrates judgment — the thing a finished feature
              alone can&apos;t show.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Reusable README template</h2>
            <button
              className="button text-sm"
              onClick={() => {
                void navigator.clipboard.writeText(README_TEMPLATE);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check size={16} /> : <Clipboard size={16} />}
              {copied ? "Copied" : "Copy template"}
            </button>
          </div>
          <pre className="code mt-4 overflow-x-auto rounded-2xl bg-black p-6 text-sm leading-6 text-white">
            <code>{README_TEMPLATE}</code>
          </pre>
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] p-6 text-sm text-[var(--muted)]">
          This platform does not track or claim job placement outcomes for
          any learner. Portfolio readiness is about presenting real, working
          projects honestly and clearly.
        </div>
      </section>
    </AppShell>
  );
}
