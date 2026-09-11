"use client";
import { Check } from "lucide-react";
import { useProgress } from "./providers";
import { completionPercent } from "@/lib/progress";

export function ProjectMilestones({
  slug,
  milestones,
}: {
  slug: string;
  milestones: string[];
}) {
  const { progress, hydrated, toggleProjectMilestone } = useProgress();
  const done = progress.projectProgress[slug]?.completedMilestones ?? [];
  const pct = completionPercent(done.length, milestones.length);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {hydrated ? `${done.length} / ${milestones.length} complete` : "…"}
        </p>
        <span className="code text-sm">{hydrated ? pct : 0}%</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${hydrated ? pct : 0}%` }} />
      </div>
      <div className="grid gap-3">
        {milestones.map((milestone, index) => {
          const checked = done.includes(milestone);
          return (
            <button
              key={milestone}
              onClick={() => toggleProjectMilestone(slug, milestone)}
              className="card flex items-center gap-4 p-5 text-left"
              aria-pressed={checked}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full border ${checked ? "border-green-600 bg-green-600 text-white" : "border-[var(--line)]"}`}
              >
                {checked ? <Check size={14} /> : <span className="code text-xs">{String(index + 1).padStart(2, "0")}</span>}
              </span>
              <span className={checked ? "text-[var(--muted)] line-through" : ""}>{milestone}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
