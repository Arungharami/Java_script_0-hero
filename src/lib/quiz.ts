import type { QuizQuestion, SkillId } from "@/types/learning";

export function scoreQuiz(answers: number[], correctAnswers: number[]) {
  if (correctAnswers.length === 0) return 0;
  const correct = correctAnswers.filter(
    (answer, index) => answers[index] === answer,
  ).length;
  return Math.round((correct / correctAnswers.length) * 100);
}

export function hasPassedQuiz(score: number, passingScore = 70) {
  return score >= passingScore;
}

export interface WeightedQuizResult {
  score: number;
  correctCount: number;
  weakSkills: Partial<Record<SkillId, number>>;
}

/** Scores a mixed-format weekly quiz and reports per-skill correctness. */
export function scoreWeightedQuiz(
  questions: QuizQuestion[],
  answers: (number | undefined)[],
): WeightedQuizResult {
  const bySkill = new Map<SkillId, { correct: number; total: number }>();
  let correctCount = 0;
  questions.forEach((question, index) => {
    const bucket = bySkill.get(question.skill) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (answers[index] === question.answer) {
      bucket.correct += 1;
      correctCount += 1;
    }
    bySkill.set(question.skill, bucket);
  });
  const weakSkills: Partial<Record<SkillId, number>> = {};
  for (const [skill, { correct, total }] of bySkill) {
    weakSkills[skill] = Math.round((correct / total) * 100);
  }
  return {
    score: questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0,
    correctCount,
    weakSkills,
  };
}
