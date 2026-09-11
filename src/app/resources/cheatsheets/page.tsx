"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { cheatsheets } from "@/content/cheatsheets";
import { Search } from "lucide-react";

export default function CheatSheetsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      cheatsheets.filter((sheet) =>
        `${sheet.title} ${sheet.description} ${sheet.code}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <AppShell>
      <section className="shell py-14">
        <p className="eyebrow">Quick reference</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">
          JavaScript cheat sheets.
        </h1>
        <p className="mt-4 text-[var(--muted)]">{cheatsheets.length} topics, searchable instantly.</p>
        <div className="mt-7 flex max-w-xl items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full bg-transparent outline-none"
            placeholder="Search syntax, arrays, DOM, async…"
            aria-label="Search cheat sheets"
          />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filtered.map((sheet) => (
            <article className="card overflow-hidden" key={sheet.title}>
              <div className="p-6">
                <h2 className="text-xl font-semibold">{sheet.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {sheet.description}
                </p>
              </div>
              <pre className="code overflow-x-auto border-t border-[var(--line)] bg-black p-5 text-sm leading-6 text-white">
                <code>{sheet.code}</code>
              </pre>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-center text-[var(--muted)]">
            No matching reference. Try a broader term.
          </p>
        )}
      </section>
    </AppShell>
  );
}
