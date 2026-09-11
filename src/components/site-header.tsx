"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Braces, Github, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allLessons } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { projects } from "@/content/projects";
import { useProgress } from "./providers";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Learn", "/learn"],
  ["Roadmap", "/roadmap"],
  ["Practice", "/practice"],
  ["Projects", "/projects"],
  ["Playground", "/playground"],
  ["Dashboard", "/dashboard"],
  ["Cheatsheets", "/resources/cheatsheets"],
];
export function SiteHeader() {
  const path = usePathname();
  const router = useRouter();
  const { progress } = useProgress();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch(true);
      }
      if (event.key === "Escape") setSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      ...allLessons
        .filter((x) => `${x.title} ${x.description}`.toLowerCase().includes(q))
        .slice(0, 5)
        .map((x) => ({
          title: x.title,
          label: `Week ${x.week.number} lesson`,
          href: `/learn/week/${x.week.number}/${x.slug}`,
        })),
      ...challenges
        .filter((x) => `${x.title} ${x.category}`.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          title: x.title,
          label: "Challenge",
          href: `/practice/challenge/${x.slug}`,
        })),
      ...projects
        .filter((x) => `${x.title} ${x.summary}`.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          title: x.title,
          label: "Project",
          href: `/projects/${x.slug}`,
        })),
    ].slice(0, 8);
  }, [query]);
  const current =
    allLessons.find((x) => x.id === progress.currentLesson) ?? allLessons[0];
  const go = (href: string) => {
    setSearch(false);
    setQuery("");
    router.push(href);
  };
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--bg)]/90 backdrop-blur-xl">
        <div className="shell flex h-16 items-center gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-ink)]">
              <Braces size={18} />
            </span>
            <span className="hidden sm:inline">JS 0 → Hero</span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            {links.map(([label, href]) => (
              <Link
                className={`rounded-lg px-3 py-2 text-sm ${path.startsWith(href) ? "bg-[var(--surface)] font-semibold" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setSearch(true)}
            className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-[var(--line)] px-3 text-sm text-[var(--muted)]"
            aria-label="Search curriculum"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-[var(--line)] px-1.5 text-xs md:inline">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <Link
            href={`/learn/week/${current.week.number}/${current.slug}`}
            className="button button-primary hidden text-sm md:inline-flex"
          >
            Continue
          </Link>
          <a
            href="https://github.com/Arungharami/Java_script_0-hero"
            aria-label="GitHub repository"
            className="hidden lg:block"
          >
            <Github size={20} />
          </a>
          <button
            className="lg:hidden"
            onClick={() => setMobile(!mobile)}
            aria-label="Toggle menu"
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
        {mobile && (
          <nav className="shell grid gap-1 pb-4 lg:hidden">
            {links.map(([label, href]) => (
              <Link
                onClick={() => setMobile(false)}
                className="rounded-lg px-3 py-2 text-sm"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      {search && (
        <div
          className="fixed inset-0 z-50 bg-black/55 p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--line)] p-4">
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Search lessons, challenges, projects…"
                aria-label="Search query"
              />
              <button
                onClick={() => setSearch(false)}
                aria-label="Close search"
              >
                <X />
              </button>
            </div>
            <div className="max-h-96 p-2">
              {query && results.length === 0 ? (
                <p className="p-8 text-center text-sm text-[var(--muted)]">
                  No results yet. Try a concept such as arrays or async.
                </p>
              ) : (
                results.map((result) => (
                  <button
                    key={result.href}
                    onClick={() => go(result.href)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-[var(--bg)]"
                  >
                    <span className="font-medium">{result.title}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {result.label}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
