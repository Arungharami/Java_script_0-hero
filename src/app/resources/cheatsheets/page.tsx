"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Search } from "lucide-react";
const sheets = [
  [
    "Variables",
    "Use const by default; use let when the binding must change.",
    `const name = "Ada";\nlet score = 0;\nscore += 10;`,
  ],
  [
    "Strings",
    "Template literals interpolate values and support multiple lines.",
    "const greeting = `Hello, ${name}`;\nconst upper = greeting.toUpperCase();",
  ],
  [
    "Arrays",
    "Transform collections with methods that communicate intent.",
    `const doubled = numbers.map(n => n * 2);\nconst adults = users.filter(user => user.age >= 18);\nconst total = prices.reduce((sum, price) => sum + price, 0);`,
  ],
  [
    "Objects",
    "Use destructuring and spread to read and update records clearly.",
    `const { name, role = "learner" } = user;\nconst updated = { ...user, role: "developer" };`,
  ],
  [
    "Functions",
    "Keep inputs explicit and return a result the caller can use.",
    `function add(a, b) { return a + b; }\nconst square = value => value ** 2;`,
  ],
  [
    "DOM",
    "Select narrowly, listen for events, and update accessible UI state.",
    `const form = document.querySelector("form");\nform?.addEventListener("submit", event => {\n  event.preventDefault();\n});`,
  ],
  [
    "Async",
    "Await promises inside try/catch and validate HTTP responses.",
    `try {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error("Request failed");\n  const data = await response.json();\n} catch (error) {\n  console.error(error);\n}`,
  ],
  [
    "Modules",
    "Export small public APIs and keep implementation details private.",
    `export function formatPrice(value) {\n  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);\n}`,
  ],
  [
    "Debugging",
    "Reproduce, read the first error, isolate, repair, and rerun.",
    `console.table(records);\nconsole.assert(total >= 0, "Total must be positive");\ndebugger;`,
  ],
  [
    "Array methods",
    "Choose by intent: find one, filter many, map each, reduce to one.",
    `const item = items.find(item => item.id === id);\nconst active = items.filter(item => item.active);`,
  ],
] as const;
export default function CheatSheetsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      sheets.filter((x) =>
        `${x[0]} ${x[1]} ${x[2]}`.toLowerCase().includes(query.toLowerCase()),
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
          {filtered.map(([title, description, code]) => (
            <article className="card overflow-hidden" key={title}>
              <div className="p-6">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {description}
                </p>
              </div>
              <pre className="code overflow-x-auto border-t border-[var(--line)] bg-black p-5 text-sm leading-6 text-white">
                <code>{code}</code>
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
