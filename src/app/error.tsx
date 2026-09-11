"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="shell grid min-h-screen place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">Unexpected application error</p>
        <h1 className="mt-4 text-4xl font-semibold">The page hit a problem.</h1>
        <p className="mt-4 text-[var(--muted)]">
          Your saved learning progress is still on this device.
        </p>
        <button className="button button-primary mt-7" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
