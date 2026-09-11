"use client";

import {
  CheckCircle2,
  Clipboard,
  Play,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Result = { type: "log" | "error" | "success"; text: string };
function runInWorker(code: string, tests?: string): Promise<Result[]> {
  return new Promise((resolve) => {
    const workerSource = `self.onmessage=async(e)=>{const out=[];const format=(v)=>typeof v==='string'?v:JSON.stringify(v);const console={log:(...a)=>out.push({type:'log',text:a.map(format).join(' ')}),error:(...a)=>out.push({type:'error',text:a.map(format).join(' ')})};try{await (async()=>{eval(e.data.code);if(e.data.tests){eval(e.data.tests);out.push({type:'success',text:'All tests passed'});}})();self.postMessage(out)}catch(error){out.push({type:'error',text:error.name+': '+error.message});self.postMessage(out)}}`;
    const url = URL.createObjectURL(
      new Blob([workerSource], { type: "text/javascript" }),
    );
    const worker = new Worker(url);
    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve([
        {
          type: "error",
          text: "Execution stopped after 2 seconds. Check for an infinite loop.",
        },
      ]);
    }, 2000);
    worker.onmessage = (event) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(event.data as Result[]);
    };
    worker.postMessage({ code, tests });
  });
}

export function CodeRunner({
  initialCode,
  tests,
  onPass,
  title = "JavaScript editor",
}: {
  initialCode: string;
  tests?: string;
  onPass?: () => void;
  title?: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const run = useCallback(async () => {
    setRunning(true);
    const next = await runInWorker(code, tests);
    setResults(next);
    setRunning(false);
    if (next.some((x) => x.type === "success")) onPass?.();
  }, [code, tests, onPass]);
  useEffect(() => {
    const node = area.current;
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void run();
      }
    };
    node?.addEventListener("keydown", key);
    return () => node?.removeEventListener("keydown", key);
  }, [run]);
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0d100d] text-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <strong className="mr-auto text-sm">{title}</strong>
        <button
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="Copy code"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <Clipboard size={16} />
        </button>
        <button
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="Reset code"
          onClick={() => {
            setCode(initialCode);
            setResults([]);
          }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          disabled={running}
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-ink)] disabled:opacity-60"
          onClick={() => void run()}
        >
          <Play size={15} fill="currentColor" />
          {running ? "Running…" : "Run"}
        </button>
      </div>
      <div className="grid lg:grid-cols-2">
        <textarea
          ref={area}
          spellCheck={false}
          aria-label={title}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-72 resize-y border-0 bg-[#0d100d] p-5 font-mono text-[13px] leading-6 text-slate-100 outline-none lg:border-r lg:border-white/10"
        />
        <div className="min-h-40 bg-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Console</span>
            <button onClick={() => setResults([])} aria-label="Clear console">
              <Trash2 size={15} />
            </button>
          </div>
          <div className="space-y-2 p-4 font-mono text-sm" aria-live="polite">
            {results.length === 0 ? (
              <span className="text-slate-500">
                Run your code · Ctrl/⌘ + Enter
              </span>
            ) : (
              results.map((result, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${result.type === "error" ? "text-red-300" : result.type === "success" ? "text-lime-300" : "text-slate-200"}`}
                >
                  {result.type === "error" ? (
                    <XCircle size={16} />
                  ) : result.type === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <span className="text-lime-300">›</span>
                  )}
                  <span>{result.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
