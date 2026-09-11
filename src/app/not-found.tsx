import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell grid min-h-screen place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404 · Off the roadmap</p>
        <h1 className="mt-4 text-5xl font-semibold">
          This lesson does not exist.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Return to the curriculum and choose your next step.
        </p>
        <Link className="button button-primary mt-7" href="/learn">
          Open curriculum
        </Link>
      </div>
    </main>
  );
}
