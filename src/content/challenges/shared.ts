import type {
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
  SkillId,
  TestCase,
} from "@/types/learning";

export interface ChallengeSeed {
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  skills: SkillId[];
  description: string;
  examples: string[];
  constraints?: string[];
  starterCode: string;
  tests: TestCase[];
  hints: string[];
  solution: string;
  explanation: string;
  relatedConcepts: string[];
}

const XP: Record<ChallengeDifficulty, number> = { easy: 50, medium: 75, hard: 120 };
const MINUTES: Record<ChallengeDifficulty, number> = { easy: 10, medium: 18, hard: 30 };
const DEFAULT_CONSTRAINTS = [
  "Keep the required function name so the tests can find it",
  "Return a value instead of only logging it",
  "Do not mutate inputs unless the challenge asks you to",
];

export function build(seeds: ChallengeSeed[]): Challenge[] {
  return seeds.map((seed) => ({
    ...seed,
    constraints: seed.constraints ?? DEFAULT_CONSTRAINTS,
    estimatedMinutes: MINUTES[seed.difficulty],
    xp: XP[seed.difficulty],
  }));
}
