import type { ChallengeSeed } from "./shared";

export const debugging: ChallengeSeed[] = [
  {
    slug: "debug-total",
    title: "Repair the Total",
    category: "Debugging",
    difficulty: "easy",
    skills: ["debugging"],
    description:
      "Fix the misspelled identifiers so the function returns a total.",
    examples: ["calculateTotal(8, 3) → 24"],
    starterCode: `function calculateTotal(price, quantity) {\n  const total = price * quantiy;\n  return totals;\n}`,
    tests: [
      {
        description: "computes the correct total",
        assertion: "expect(calculateTotal(8, 3)).toBe(24)",
      },
      {
        hidden: true,
        description: "computes a total with decimals",
        assertion: "expect(calculateTotal(2.5, 4)).toBe(10)",
      },
    ],
    hints: [
      "The console will name the exact misspelled identifier — search the function for it.",
    ],
    solution: `function calculateTotal(price, quantity) {\n  const total = price * quantity;\n  return total;\n}`,
    explanation:
      "Two separate typos (quantiy, totals) both trigger ReferenceError — read the first error, fix it, rerun, repeat.",
    relatedConcepts: ["Debugging foundations"],
  },
];
