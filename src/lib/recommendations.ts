import type {
  Challenge,
  CourseWeek,
  Lesson,
  LearningProgress,
} from "@/types/learning";
import type { SkillMastery } from "./mastery";

export interface Recommendation {
  kind: "next" | "practice" | "review";
  title: string;
  reason: string;
  href: string;
}

type LessonWithWeek = Lesson & { week: CourseWeek };

/**
 * Deterministic, transparent rules — no AI calls. Every recommendation
 * traces back to a specific piece of recorded activity so a learner (or a
 * reviewer) can see exactly why it was suggested.
 */
export function buildRecommendations(
  progress: LearningProgress,
  allLessons: LessonWithWeek[],
  challenges: Challenge[],
  mastery: SkillMastery[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  const strugglingEntry = Object.entries(progress.challengeProgress).find(
    ([, record]) => !record.completed && record.attempts >= 3,
  );
  if (strugglingEntry) {
    const [slug, record] = strugglingEntry;
    const challenge = challenges.find((c) => c.slug === slug);
    if (challenge) {
      recs.push({
        kind: "review",
        title: `Review ${challenge.relatedConcepts[0] ?? challenge.category}`,
        reason: `You've attempted "${challenge.title}" ${record.attempts} times without passing every test. Revisit the related concept before trying again.`,
        href: `/practice/challenge/${slug}`,
      });
    }
  }

  const weakest = [...mastery]
    .filter((m) => m.hasData)
    .sort((a, b) => a.value - b.value)[0];
  if (weakest && weakest.value < 70) {
    recs.push({
      kind: "review",
      title: `Needs review: ${weakest.label}`,
      reason: `Your ${weakest.label} mastery is ${weakest.value}% from quiz and challenge activity. Complete two ${weakest.label}-tagged challenges to raise it.`,
      href: "/practice",
    });
  }

  const lessonsDone = progress.completedLessons.length;
  const challengesAttempted = Object.keys(progress.challengeProgress).length;
  if (lessonsDone >= 5 && challengesAttempted < Math.floor(lessonsDone / 3)) {
    recs.push({
      kind: "practice",
      title: "Practice before continuing",
      reason: `You've completed ${lessonsDone} lessons but only attempted ${challengesAttempted} challenges. Solve a few before starting the next week.`,
      href: "/practice",
    });
  }

  const current =
    allLessons.find((l) => l.id === progress.currentLesson) ?? allLessons[0];
  if (current) {
    const isDone = progress.completedLessons.includes(current.id);
    recs.push({
      kind: "next",
      title: isDone ? `Continue Week ${current.week.number}` : current.title,
      reason: isDone
        ? `You finished "${current.title}". Keep moving through Week ${current.week.number}: ${current.week.title}.`
        : `Next in your path — Week ${current.week.number}: ${current.week.title}.`,
      href: `/learn/week/${current.week.number}/${current.slug}`,
    });
  }

  return recs.slice(0, 4);
}
