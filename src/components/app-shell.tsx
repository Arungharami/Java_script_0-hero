import { SiteHeader } from "./site-header";
import { ThemeToggle } from "./theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <footer className="mt-20 border-t border-[var(--line)] py-8">
        <div className="shell flex flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>JavaScript 0 → Hero · Learn. Code. Build. Ship.</span>
          <div className="flex items-center gap-4">
            <span>Created by Arun Kumar Gharami</span>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </>
  );
}
