export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  objectives: string[];
  explanation: string[];
  syntax: string;
  example: string;
  expectedOutput: string;
  whyItMatters: string;
  mistakes: string[];
  challenge: {
    prompt: string;
    starterCode: string;
    hint: string;
    solution: string;
  };
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export interface CourseWeek {
  number: number;
  slug: string;
  title: string;
  theme: string;
  description: string;
  studyHours: string;
  topics: string[];
  lessons: Lesson[];
  project: { title: string; summary: string };
}

export interface Challenge {
  slug: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  examples: string[];
  starterCode: string;
  testCode: string;
  hint: string;
  solution: string;
  explanation: string;
}

export interface LearningProgress {
  version: 1;
  completedLessons: string[];
  completedChallenges: string[];
  quizScores: Record<string, number>;
  projects: Record<string, number>;
  currentLesson: string;
  activityDates: string[];
  xp: number;
  preferences: { mode: "guided" | "fast"; theme: "light" | "dark" | "system" };
}
