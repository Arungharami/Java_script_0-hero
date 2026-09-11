"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CodeRunner } from "@/components/code-runner";

const templates = {
  "Hello JavaScript":
    'const learner = { name: "Hero", streak: 1 };\nconsole.log(`Hello, ${learner.name}!`);',
  "Array workshop":
    "const scores = [72, 91, 84, 65];\nconst strongScores = scores.filter(score => score >= 80);\nconsole.log(strongScores);",
  "Async timer":
    'const wait = ms => new Promise(resolve => setTimeout(resolve, ms));\nconsole.log("Starting...");\nawait wait(300);\nconsole.log("Done!");',
};

export default function PlaygroundPage() {
  const [template, setTemplate] =
    useState<keyof typeof templates>("Hello JavaScript");
  return (
    <AppShell>
      <section className="shell py-12">
        <p className="eyebrow">Safe browser sandbox</p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-.05em]">
              JavaScript Playground
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              Experiment freely. Console output and runtime errors stay inside a
              time-limited browser worker.
            </p>
          </div>
          <label className="text-sm font-medium">
            Starter template
            <select
              className="ml-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2"
              value={template}
              onChange={(event) =>
                setTemplate(event.target.value as keyof typeof templates)
              }
            >
              {Object.keys(templates).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-8" key={template}>
          <CodeRunner initialCode={templates[template]} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Run quickly", "Use Ctrl/Cmd + Enter from the editor."],
            [
              "Read the first error",
              "Later errors are often consequences of the first one.",
            ],
            [
              "Change one thing",
              "Small experiments make cause and effect visible.",
            ],
          ].map(([title, description]) => (
            <div className="card p-5" key={title}>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
