"use client";

import {
  CheckCircle2,
  Clipboard,
  ListChecks,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TestCase } from "@/types/learning";

export type ConsoleEntry = { type: "log" | "error"; text: string };
export type TestOutcome = {
  description: string;
  hidden: boolean;
  passed: boolean;
  expected?: string;
  received?: string;
  error?: string;
};
export type RunOutcome = {
  console: ConsoleEntry[];
  tests?: TestOutcome[];
  runtimeError?: string;
};

/**
 * Runs untrusted learner code inside a dedicated Web Worker: no DOM/window
 * access, its own thread, and a hard wall-clock timeout that terminates the
 * worker outright (so `while (true) {}` cannot hang the page). Sandbox
 * limitations are documented in the README security section.
 */
const WORKER_SOURCE = `
self.onmessage = async (event) => {
  const { code, tests, mode } = event.data;
  const consoleOut = [];
  function format(value) {
    if (typeof value === "string") return value;
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "function") return value.toString().slice(0, 120);
    if (typeof value === "number" && Number.isNaN(value)) return "NaN";
    try { return JSON.stringify(value); } catch (e) { return String(value); }
  }
  const console = {
    log: (...args) => consoleOut.push({ type: "log", text: args.map(format).join(" ") }),
    warn: (...args) => consoleOut.push({ type: "log", text: args.map(format).join(" ") }),
    info: (...args) => consoleOut.push({ type: "log", text: args.map(format).join(" ") }),
    table: (...args) => consoleOut.push({ type: "log", text: args.map(format).join(" ") }),
    error: (...args) => consoleOut.push({ type: "error", text: args.map(format).join(" ") }),
  };
  function delay(ms, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), Math.min(ms, 400)));
  }
  function AssertionError(expected, actual) {
    this.name = "AssertionError";
    this.expected = expected;
    this.actual = actual;
  }
  function deepEqual(a, b) {
    if (Object.is(a, b)) return true;
    try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; }
  }
  function expect(actual) {
    return {
      toBe(expected) {
        if (!Object.is(actual, expected)) throw new AssertionError(expected, actual);
      },
      toEqual(expected) {
        if (!deepEqual(actual, expected)) throw new AssertionError(expected, actual);
      },
      toBeCloseTo(expected, precision) {
        const tolerance = Math.pow(10, -(precision ?? 2));
        if (typeof actual !== "number" || Math.abs(actual - expected) > tolerance) {
          throw new AssertionError(expected, actual);
        }
      },
      toBeTruthy() {
        if (!actual) throw new AssertionError("a truthy value", actual);
      },
      toBeFalsy() {
        if (actual) throw new AssertionError("a falsy value", actual);
      },
      toContain(item) {
        const ok = (Array.isArray(actual) || typeof actual === "string") && actual.includes(item);
        if (!ok) throw new AssertionError("contains " + format(item), actual);
      },
      toHaveLength(length) {
        if (!actual || actual.length !== length) {
          throw new AssertionError("length " + length, actual && actual.length);
        }
      },
      toBeInstanceOf(ctor) {
        if (!(actual instanceof ctor)) throw new AssertionError(ctor.name, typeof actual);
      },
    };
  }
  function expectAsync(promise) {
    return {
      async toBe(expected) {
        const actual = await promise;
        if (!Object.is(actual, expected)) throw new AssertionError(expected, actual);
      },
      async toEqual(expected) {
        const actual = await promise;
        if (!deepEqual(actual, expected)) throw new AssertionError(expected, actual);
      },
    };
  }
  function expectFn(fn) {
    return {
      toThrow() {
        try {
          fn();
        } catch (error) {
          return;
        }
        throw new AssertionError("a thrown error", "no error was thrown");
      },
      notToThrow() {
        try {
          fn();
        } catch (error) {
          throw new AssertionError("no error", error && error.message);
        }
      },
    };
  }
  try {
    eval(code);
  } catch (error) {
    self.postMessage({ console: consoleOut, runtimeError: error.name + ": " + error.message });
    return;
  }
  if (mode !== "test" || !tests || tests.length === 0) {
    self.postMessage({ console: consoleOut });
    return;
  }
  const results = [];
  for (const t of tests) {
    try {
      await eval(t.assertion);
      results.push({ description: t.description, hidden: !!t.hidden, passed: true });
    } catch (error) {
      if (error && error.name === "AssertionError") {
        results.push({
          description: t.description,
          hidden: !!t.hidden,
          passed: false,
          expected: t.hidden ? undefined : format(error.expected),
          received: t.hidden ? undefined : format(error.actual),
        });
      } else {
        results.push({
          description: t.description,
          hidden: !!t.hidden,
          passed: false,
          error: t.hidden ? "Threw an unexpected error" : (error.name + ": " + (error.message || "")),
        });
      }
    }
  }
  self.postMessage({ console: consoleOut, tests: results });
};
`;

function runInWorker(
  code: string,
  tests: TestCase[] | undefined,
  mode: "run" | "test",
): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(
      new Blob([WORKER_SOURCE], { type: "text/javascript" }),
    );
    const worker = new Worker(url);
    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        console: [
          {
            type: "error",
            text: "Execution stopped after 3 seconds. Check for an infinite loop.",
          },
        ],
      });
    }, 3000);
    worker.onmessage = (event) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(event.data as RunOutcome);
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({ console: [{ type: "error", text: "The sandbox crashed. Check your syntax." }] });
    };
    worker.postMessage({ code, tests, mode });
  });
}

type Tab = "code" | "console" | "tests";

export function CodeRunner({
  initialCode,
  tests,
  onTestResult,
  title = "JavaScript editor",
}: {
  initialCode: string;
  tests?: TestCase[];
  onTestResult?: (outcome: { passed: number; total: number; results: TestOutcome[] }) => void;
  title?: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<ConsoleEntry[]>([]);
  const [testResults, setTestResults] = useState<TestOutcome[] | null>(null);
  const [runtimeError, setRuntimeError] = useState<string>();
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<Tab>("code");
  const area = useRef<HTMLTextAreaElement>(null);
  const hasTests = Boolean(tests && tests.length > 0);

  useEffect(() => setCode(initialCode), [initialCode]);

  const run = useCallback(
    async (mode: "run" | "test") => {
      setRunning(true);
      const outcome = await runInWorker(code, tests, mode);
      setOutput(outcome.console);
      setRuntimeError(outcome.runtimeError);
      setRunning(false);
      if (mode === "test") {
        setTestResults(outcome.tests ?? []);
        setTab("tests");
        if (outcome.tests) {
          const passed = outcome.tests.filter((t) => t.passed).length;
          onTestResult?.({ passed, total: outcome.tests.length, results: outcome.tests });
        }
      } else {
        setTab("console");
      }
    },
    [code, tests, onTestResult],
  );

  useEffect(() => {
    const node = area.current;
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void run(hasTests ? "test" : "run");
      }
    };
    node?.addEventListener("keydown", key);
    return () => node?.removeEventListener("keydown", key);
  }, [run, hasTests]);

  const reset = () => {
    setCode(initialCode);
    setOutput([]);
    setTestResults(null);
    setRuntimeError(undefined);
  };

  const passedCount = testResults?.filter((t) => t.passed).length ?? 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0d100d] text-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <strong className="mr-auto text-sm">{title}</strong>
        <button
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="Copy code"
          onClick={() => void navigator.clipboard.writeText(code)}
        >
          <Clipboard size={16} />
        </button>
        <button
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="Reset code"
          onClick={reset}
        >
          <RotateCcw size={16} />
        </button>
        <button
          disabled={running}
          className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={() => void run("run")}
        >
          <Play size={15} fill="currentColor" />
          Run Code
        </button>
        {hasTests && (
          <button
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-ink)] disabled:opacity-60"
            onClick={() => void run("test")}
          >
            <ListChecks size={15} />
            {running ? "Running…" : "Run Tests"}
          </button>
        )}
      </div>
      <div className="flex border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:hidden">
        {(["code", "console", ...(hasTests ? (["tests"] as const) : [])] as Tab[]).map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 border-b-2 px-3 py-2.5 ${tab === t ? "border-[var(--accent)] text-white" : "border-transparent"}`}
            >
              {t === "code" ? "Code" : t === "console" ? "Output" : "Tests"}
            </button>
          ),
        )}
      </div>
      <div className="grid lg:grid-cols-2">
        <textarea
          ref={area}
          spellCheck={false}
          aria-label={title}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`min-h-72 resize-y border-0 bg-[#0d100d] p-5 font-mono text-[13px] leading-6 text-slate-100 outline-none lg:border-r lg:border-white/10 ${tab === "code" ? "block" : "hidden"} lg:block`}
        />
        <div className={`min-h-40 bg-black/40 ${tab === "code" ? "hidden" : "block"} lg:block`}>
          <div
            className={`${hasTests && tab !== "console" ? "hidden lg:block" : ""}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <Terminal size={13} /> Console
              </span>
              <button onClick={() => setOutput([])} aria-label="Clear console">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="space-y-2 p-4 font-mono text-sm" aria-live="polite">
              {runtimeError ? (
                <div className="flex gap-2 text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{runtimeError}</span>
                </div>
              ) : output.length === 0 ? (
                <span className="text-slate-500">
                  Run your code · Ctrl/⌘ + Enter
                </span>
              ) : (
                output.map((result, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${result.type === "error" ? "text-red-300" : "text-slate-200"}`}
                  >
                    {result.type === "error" ? (
                      <XCircle size={16} className="mt-0.5 shrink-0" />
                    ) : (
                      <span className="text-lime-300">›</span>
                    )}
                    <span className="whitespace-pre-wrap">{result.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {hasTests && (
            <div
              className={`border-t border-white/10 ${tab !== "tests" ? "hidden lg:block" : ""}`}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-2">
                  <ListChecks size={13} /> Tests
                </span>
                {testResults && (
                  <span aria-live="polite">
                    {passedCount} / {testResults.length} passed
                  </span>
                )}
              </div>
              <div className="space-y-3 p-4 text-sm" aria-live="polite">
                {!testResults ? (
                  <span className="font-mono text-slate-500">
                    Run Tests to check your solution.
                  </span>
                ) : (
                  testResults.map((t, i) => (
                    <div key={i} className="rounded-lg bg-white/[0.03] p-3">
                      <div
                        className={`flex items-center gap-2 font-mono ${t.passed ? "text-lime-300" : "text-red-300"}`}
                      >
                        {t.passed ? (
                          <CheckCircle2 size={15} className="shrink-0" />
                        ) : (
                          <XCircle size={15} className="shrink-0" />
                        )}
                        <span>{t.hidden ? `Hidden test: ${t.description}` : t.description}</span>
                      </div>
                      {!t.passed && (t.expected !== undefined || t.error) && (
                        <div className="mt-2 space-y-1 pl-6 font-mono text-xs text-slate-300">
                          {t.expected !== undefined ? (
                            <>
                              <p>
                                <span className="text-slate-500">Expected: </span>
                                {t.expected}
                              </p>
                              <p>
                                <span className="text-slate-500">Received: </span>
                                {t.received}
                              </p>
                            </>
                          ) : (
                            <p>{t.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
