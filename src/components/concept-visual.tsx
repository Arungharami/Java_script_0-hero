import { ArrowDown, ArrowRight } from "lucide-react";
import type { MentalModel } from "@/types/learning";

const TITLES: Record<MentalModel, string> = {
  scope: "Scope: global → function → block",
  "call-stack": "The call stack",
  closures: "A closure retains its outer scope",
  "reference-vs-value": "Reference vs. value",
  "event-loop": "The event loop",
  "prototype-chain": "The prototype chain",
};

function Box({
  children,
  tone = "surface",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "surface" | "accent" | "bg";
  className?: string;
}) {
  const bg =
    tone === "accent"
      ? "bg-[color:var(--accent)]/10 border-[var(--accent)]"
      : tone === "bg"
        ? "bg-[var(--bg)] border-[var(--line)]"
        : "bg-[var(--surface)] border-[var(--line)]";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${bg} ${className}`}>
      {children}
    </div>
  );
}

function ScopeDiagram() {
  return (
    <Box tone="bg" className="p-6">
      <p className="text-center">Global scope</p>
      <div className="mx-auto mt-3 max-w-sm rounded-xl border border-dashed border-[var(--line)] p-4">
        <p className="text-center">Function scope</p>
        <div className="mx-auto mt-3 max-w-[220px] rounded-xl border border-dashed border-[var(--accent)] bg-[color:var(--accent)]/10 p-4 text-center">
          Block scope <span className="text-[var(--muted)]">{"{ }"}</span>
        </div>
      </div>
    </Box>
  );
}

function CallStackDiagram() {
  const frames = ["main()", "calculateOrder()", "applyTax()"];
  return (
    <Box tone="bg" className="flex flex-col items-center gap-2 p-6">
      {frames.map((frame, i) => (
        <div key={frame} className="flex flex-col items-center gap-2">
          <Box tone={i === frames.length - 1 ? "accent" : "surface"} className="w-56 text-center">
            {frame}
          </Box>
          {i < frames.length - 1 && <ArrowDown size={16} className="text-[var(--muted)]" aria-hidden />}
        </div>
      ))}
      <p className="mt-2 text-xs text-[var(--muted)]">
        Newest call on top · pops off when it returns
      </p>
    </Box>
  );
}

function ClosuresDiagram() {
  return (
    <Box tone="bg" className="p-6">
      <div className="mx-auto max-w-sm rounded-xl border border-dashed border-[var(--line)] p-4 text-center">
        <p className="text-xs text-[var(--muted)]">makeCounter() scope</p>
        <p className="mt-1 code">let count = 0</p>
        <ArrowDown size={16} className="mx-auto my-3 text-[var(--muted)]" aria-hidden />
        <Box tone="accent" className="text-center">
          returned function — still reads &amp; updates count
        </Box>
      </div>
    </Box>
  );
}

function ReferenceDiagram() {
  return (
    <Box tone="bg" className="flex items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-end gap-8">
        <Box className="text-center">userA</Box>
        <Box className="text-center">userB</Box>
      </div>
      <div className="flex flex-col items-center gap-1 text-[var(--muted)]" aria-hidden>
        <ArrowRight size={16} className="-rotate-12" />
        <ArrowRight size={16} className="rotate-12" />
      </div>
      <Box tone="accent" className="text-center">
        {"{ name: \"Ada\" }"}
      </Box>
    </Box>
  );
}

function EventLoopDiagram() {
  const steps = ["Call Stack", "Web APIs", "Microtask Queue", "Task Queue", "Event Loop"];
  return (
    <Box tone="bg" className="flex flex-wrap items-center justify-center gap-2 p-6">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <Box tone={step === "Microtask Queue" ? "accent" : "surface"}>{step}</Box>
          {i < steps.length - 1 && <ArrowRight size={16} className="text-[var(--muted)]" aria-hidden />}
        </span>
      ))}
    </Box>
  );
}

function PrototypeDiagram() {
  const chain = ["your object", "prototype", "Object.prototype", "null"];
  return (
    <Box tone="bg" className="flex flex-col items-center gap-2 p-6">
      {chain.map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <Box tone={i === chain.length - 1 ? "surface" : i === 0 ? "accent" : "surface"} className="w-48 text-center">
            {step}
          </Box>
          {i < chain.length - 1 && <ArrowDown size={16} className="text-[var(--muted)]" aria-hidden />}
        </div>
      ))}
    </Box>
  );
}

const DIAGRAMS: Record<MentalModel, () => React.ReactElement> = {
  scope: ScopeDiagram,
  "call-stack": CallStackDiagram,
  closures: ClosuresDiagram,
  "reference-vs-value": ReferenceDiagram,
  "event-loop": EventLoopDiagram,
  "prototype-chain": PrototypeDiagram,
};

export function ConceptVisual({ kind }: { kind: MentalModel }) {
  const Diagram = DIAGRAMS[kind];
  return (
    <figure className="mt-6">
      <Diagram />
      <figcaption className="mt-3 text-center text-sm text-[var(--muted)]">
        {TITLES[kind]}
      </figcaption>
    </figure>
  );
}
