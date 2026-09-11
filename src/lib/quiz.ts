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
