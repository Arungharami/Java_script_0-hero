"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/components/providers";
import { allLessons } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { debugLab } from "@/content/debug-lab";
import { quizzes } from "@/content/quizzes";
import { projects } from "@/content/projects";
import { calculateStreak, completionPercent } from "@/lib/progress";
import { computeSkillMastery, overallMastery } from "@/lib/mastery";
import { buildRecommendations } from "@/lib/recommendations";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bug,
  Download,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Upload,
} from "lucide-react";

export default function DashboardPage() {
  const { progress, hydrated, importProgress } = useProgress();
  const [importMessage, setImportMessage] = useState<string>();
  const [confirmFile, setConfirmFile] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  const pct = completionPercent(
    progress.completedLessons.length,
    allLessons.length,
  );
  const current =
    allLessons.find((x) => x.id === progress.currentLesson) ?? allLessons[0];
  const streak = calculateStreak(progress.activityDates);

  const challengesCompleted = challenges.filter(
    (c) => progress.challengeProgress[c.slug]?.completed,
  ).length;
  const debugCompleted = debugLab.filter(
    (d) => progress.debugProgress[d.slug]?.completed,
  ).length;
  const quizScores = Object.values(progress.quizAttempts).map(
    (q) => q.bestScore,
  );
  const quizAverage = quizScores.length
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;
  const projectsWithProgress = projects.filter(
    (p) =>
      (progress.projectProgress[p.slug]?.completedMilestones.length ?? 0) > 0,
  ).length;

  const mastery = useMemo(
    () =>
      computeSkillMastery(progress, allLessons, challenges, debugLab, quizzes),
    [progress],
  );
  const overall = overallMastery(mastery);
  const weakAreas = [...mastery]
    .filter((m) => m.hasData && m.value < 70)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);
  const recommendations = useMemo(
    () => buildRecommendations(progress, allLessons, challenges, mastery),
    [progress, mastery],
  );

  const recentActivity = useMemo(() => {
    type Entry = { label: string; when: string; kind: string };
    const entries: Entry[] = [];
    for (const [slug, record] of Object.entries(progress.challengeProgress)) {
      if (!record.lastAttemptAt) continue;
      const c = challenges.find((x) => x.slug === slug);
      if (c)
        entries.push({
          label: `Challenge: ${c.title}`,
          when: record.lastAttemptAt,
          kind: record.completed ? "Passed" : "Attempted",
        });
    }
    for (const [slug, record] of Object.entries(progress.debugProgress)) {
      if (!record.lastAttemptAt) continue;
      const d = debugLab.find((x) => x.slug === slug);
      if (d)
        entries.push({
          label: `Debug: ${d.title}`,
          when: record.lastAttemptAt,
          kind: record.completed ? "Fixed" : "Attempted",
        });
    }
    for (const [id, record] of Object.entries(progress.quizAttempts)) {
      if (!record.lastAttemptAt) continue;
      entries.push({
        label: `Quiz: ${id}`,
        when: record.lastAttemptAt,
        kind: `${record.lastScore}%`,
      });
    }
    return entries.sort((a, b) => b.when.localeCompare(a.when)).slice(0, 6);
  }, [progress]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "js0hero-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFileChosen = (file: File) => {
    file.text().then((text) => setConfirmFile(text));
  };

  const confirmImport = () => {
    if (!confirmFile) return;
    const result = importProgress(confirmFile);
    setImportMessage(
      result.success ? "Progress imported successfully." : result.error,
    );
    setConfirmFile(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <AppShell>
      <section className="shell py-12">
        <p className="eyebrow">Your learning dashboard</p>
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-.05em]">
              Keep the momentum.
            </h1>
            <p className="mt-4 text-[var(--muted)]">
              Every number below comes from activity saved on this device.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
              {progress.xp} XP earned
            </span>
            <button className="button text-sm" onClick={exportData}>
              <Download size={15} /> Export
            </button>
            <button
              className="button text-sm"
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={15} /> Import
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && onFileChosen(e.target.files[0])
              }
            />
          </div>
        </div>
        {importMessage && (
          <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 text-sm">
            {importMessage}
          </p>
        )}
        {confirmFile && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <p>
              Importing will <strong>overwrite</strong> your current progress on
              this device. This cannot be undone. Continue?
            </p>
            <div className="mt-3 flex gap-3">
              <button
                className="button button-primary text-sm"
                onClick={confirmImport}
              >
                Overwrite and import
              </button>
              <button
                className="button text-sm"
                onClick={() => setConfirmFile(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {!hydrated ? (
          <div className="card mt-8 h-40 animate-pulse" />
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Target, "Course progress", `${pct}%`],
                [
                  Trophy,
                  "Lessons",
                  `${progress.completedLessons.length} / ${allLessons.length}`,
                ],
                [
                  Award,
                  "Challenges",
                  `${challengesCompleted} / ${challenges.length}`,
                ],
                [Bug, "Debug fixes", `${debugCompleted} / ${debugLab.length}`],
                [
                  Sparkles,
                  "Quiz average",
                  quizScores.length ? `${quizAverage}%` : "—",
                ],
                [
                  BookOpen,
                  "Projects started",
                  `${projectsWithProgress} / ${projects.length}`,
                ],
                [
                  Flame,
                  "Current streak",
                  `${streak} day${streak === 1 ? "" : "s"}`,
                ],
                [Award, "Overall mastery", `${overall}%`],
              ].map(([Icon, label, value]) => {
                const IconComponent = Icon as React.ComponentType<{
                  size?: number;
                  className?: string;
                }>;
                return (
                  <div className="card p-5" key={String(label)}>
                    <IconComponent size={20} className="text-[var(--muted)]" />
                    <p className="mt-8 text-sm text-[var(--muted)]">
                      {String(label)}
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
              <section className="card p-7">
                <p className="eyebrow">Continue learning</p>
                <h2 className="mt-5 text-2xl font-semibold">{current.title}</h2>
                <p className="mt-2 text-[var(--muted)]">
                  Week {current.week.number} · {current.description}
                </p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Link
                  href={`/learn/week/${current.week.number}/${current.slug}`}
                  className="button button-primary mt-6"
                >
                  Continue lesson <ArrowRight size={17} />
                </Link>

                <p className="eyebrow mt-8">Recommended next</p>
                <div className="mt-4 space-y-3">
                  {recommendations.map((rec) => (
                    <Link
                      key={rec.title}
                      href={rec.href}
                      className="block rounded-xl border border-[var(--line)] p-4 hover:bg-[var(--surface)]"
                    >
                      <p className="font-semibold">{rec.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {rec.reason}
                      </p>
                    </Link>
                  ))}
                </div>

                {recentActivity.length > 0 && (
                  <>
                    <p className="eyebrow mt-8">Recent activity</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {recentActivity.map((entry, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between border-b border-[var(--line)] pb-2 last:border-0"
                        >
                          <span>{entry.label}</span>
                          <span className="text-[var(--muted)]">
                            {entry.kind}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>

              <section className="space-y-6">
                <div className="card p-7">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Skill mastery</p>
                    <Link
                      href="/skills"
                      className="text-xs text-[var(--accent)]"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="mt-5 space-y-4">
                    {mastery.slice(0, 6).map((s) => (
                      <div key={s.skill}>
                        <div className="mb-1.5 flex justify-between text-sm">
                          <span>{s.label}</span>
                          <span className="text-[var(--muted)]">
                            {s.hasData ? `${s.value}%` : "—"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
                          <div
                            className="h-full bg-[var(--accent)]"
                            style={{ width: `${s.hasData ? s.value : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {weakAreas.length > 0 && (
                  <div className="card border-amber-500/30 bg-amber-500/5 p-7">
                    <p className="eyebrow text-amber-700">Needs review</p>
                    <div className="mt-4 space-y-3">
                      {weakAreas.map((area) => (
                        <div
                          key={area.skill}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{area.label}</span>
                          <span className="font-semibold">{area.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {progress.completedLessons.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--line)] p-6 text-center">
                <h2 className="font-semibold">No completed lessons yet</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Finish your first lesson to begin building a real activity
                  history.
                </p>
                <Link href="/learn/week/1" className="button mt-4">
                  Start Week 1
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}
