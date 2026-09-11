export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ChallengeDifficulty = "easy" | "medium" | "hard";

export type ChallengeCategory =
  | "Fundamentals"
  | "Strings"
  | "Arrays"
  | "Objects"
  | "Functions"
  | "Algorithms"
  | "Modern JavaScript"
  | "Async"
  | "DOM"
  | "Debugging";

/** The 19-skill mastery taxonomy used to score real learner ability. */
export const SKILLS = [
  "fundamentals",
  "variables",
  "data-types",
  "conditions",
  "loops",
  "functions",
  "scope",
  "strings",
  "arrays",
  "objects",
  "dom",
  "events",
  "async",
  "promises",
  "apis",
  "debugging",
  "algorithms",
  "testing",
  "architecture",
] as const;
export type SkillId = (typeof SKILLS)[number];

export type MentalModel =
  | "scope"
  | "call-stack"
  | "closures"
  | "reference-vs-value"
  | "event-loop"
  | "prototype-chain";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  skills: SkillId[];
  objectives: string[];
  explanation: string[];
  syntax: string;
  example: string;
  expectedOutput: string;
  whyItMatters: string;
  realWorldExample: string;
  mistakes: string[];
  summary: string;
  mentalModel?: MentalModel;
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

export interface DayPlan {
  day: number;
  title: string;
  lessonSlugs: string[];
  estimatedMinutes: number;
  recommendedChallengeSlug?: string;
  checkpoint: string;
}

export interface CourseWeek {
  number: number;
  slug: string;
  title: string;
  theme: string;
  description: string;
  studyHours: string;
  topics: string[];
  skills: SkillId[];
  lessons: Lesson[];
  days: DayPlan[];
  project: { title: string; summary: string; slug: string };
}

export interface TestCase {
  /** Shown to the learner in the results list, e.g. "handles empty strings". */
  description: string;
  /** Hidden tests never reveal their assertion or expected/received values. */
  hidden?: boolean;
  /** A JS statement evaluated against the learner's code, e.g. expect(fn(1)).toBe(2) */
  assertion: string;
}

export interface Challenge {
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  skills: SkillId[];
  description: string;
  examples: string[];
  constraints: string[];
  starterCode: string;
  tests: TestCase[];
  hints: string[];
  solution: string;
  explanation: string;
  relatedConcepts: string[];
  xp: number;
}

export type DebugCategory =
  | "SyntaxError"
  | "ReferenceError"
  | "TypeError"
  | "Scope"
  | "Loops"
  | "Arrays"
  | "Objects"
  | "DOM"
  | "Async"
  | "Promises"
  | "API"
  | "Off-by-one"
  | "Mutation"
  | "Comparison"
  | "Events";

export interface DebugExercise {
  slug: string;
  title: string;
  category: DebugCategory;
  difficulty: ChallengeDifficulty;
  skills: SkillId[];
  brokenCode: string;
  observedBehavior: string;
  expectedBehavior: string;
  consoleOutput: string;
  hints: string[];
  tests: TestCase[];
  correctedCode: string;
  explanation: string;
  xp: number;
}

export type InterviewCategory =
  | "Fundamentals"
  | "Functions"
  | "Scope"
  | "Arrays"
  | "Objects"
  | "DOM"
  | "Async"
  | "Event Loop"
  | "Closures"
  | "this"
  | "Prototypes"
  | "Performance"
  | "Algorithms";

export interface InterviewQuestion {
  slug: string;
  question: string;
  category: InterviewCategory;
  difficulty: ChallengeDifficulty;
  shortAnswer: string;
  deepExplanation: string;
  codeExample: string;
  commonWrongAnswer: string;
  interviewTrap: string;
  followUp: string;
}

export type QuizQuestionType =
  | "multiple-choice"
  | "true-false"
  | "predict-output"
  | "identify-error"
  | "select-code"
  | "scenario";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  skill: SkillId;
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface WeeklyQuiz {
  week: number;
  questions: QuizQuestion[];
}

export interface ProjectBrief {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  week: number;
  summary: string;
  problem: string;
  userStories: string[];
  planningChecklist: string[];
  dataStructure: string;
  uiRequirements: string[];
  milestones: string[];
  bonuses: string[];
  testingChecklist: string[];
  completionCriteria: string[];
  requirements: string[];
}

// ---------------------------------------------------------------------------
// Progress data model
// ---------------------------------------------------------------------------

/** @deprecated superseded by LearningProgressV2, kept only for migration. */
export interface LearningProgressV1 {
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

export interface ChallengeAttemptRecord {
  completed: boolean;
  attempts: number;
  bestPassedTests: number;
  totalTests: number;
  lastAttemptAt?: string;
}

export interface QuizAttemptRecord {
  attempts: number;
  bestScore: number;
  lastScore: number;
  lastAttemptAt?: string;
  /** Per-skill correctness in the most recent attempt, 0-100. */
  weakSkills: Partial<Record<SkillId, number>>;
}

export interface ProjectProgressRecord {
  completedMilestones: string[];
}

export interface CurrentPath {
  week: number;
  day?: number;
  lesson?: string;
}

export interface LearningProgressV2 {
  version: 2;
  completedLessons: string[];
  challengeProgress: Record<string, ChallengeAttemptRecord>;
  debugProgress: Record<string, ChallengeAttemptRecord>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  projectProgress: Record<string, ProjectProgressRecord>;
  activityDates: string[];
  currentLesson: string;
  currentPath: CurrentPath;
  xp: number;
  preferences: { mode: "guided" | "fast"; theme: "light" | "dark" | "system" };
}

export type LearningProgress = LearningProgressV2;

/** Interface future cloud sync (Supabase/Postgres) implements alongside LocalProgressRepository. */
export interface ProgressRepository {
  load(): Promise<LearningProgress>;
  save(progress: LearningProgress): Promise<void>;
}
