import type { CourseWeek, Difficulty, Lesson } from "@/types/learning";

type WeekSeed = Omit<CourseWeek, "lessons" | "slug" | "topics"> & {
  topics: string[];
};

const seeds: WeekSeed[] = [
  {
    number: 1,
    title: "JavaScript Foundations",
    theme: "Understand the language",
    description:
      "Learn how JavaScript represents values, evaluates expressions, and communicates through the console.",
    studyHours: "6–8 hours",
    topics: [
      "How JavaScript runs",
      "Console & statements",
      "let, const & var",
      "Primitive data types",
      "Operators & comparisons",
      "Strings & template literals",
      "Conversion & coercion",
      "Debugging foundations",
    ],
    project: {
      title: "Interactive Personal Profile Generator",
      summary:
        "Turn profile inputs into a polished, validated summary using values, operators, and strings.",
    },
  },
  {
    number: 2,
    title: "Logic, Functions & Problem Solving",
    theme: "Teach JavaScript to make decisions",
    description:
      "Break problems apart, express decisions, package behavior, and repeat work safely.",
    studyHours: "7–9 hours",
    topics: [
      "Conditions & branching",
      "Truthy and falsy",
      "Function declarations",
      "Expressions & arrow functions",
      "Parameters & returns",
      "Scope & purity",
      "Loops & iteration",
      "Problem-solving workflow",
    ],
    project: {
      title: "Smart Calculator + Guessing Game",
      summary:
        "Build two logic-driven programs with reusable functions and defensive input handling.",
    },
  },
  {
    number: 3,
    title: "Arrays, Objects & Data",
    theme: "Work with real application data",
    description:
      "Model collections and records, then transform them without losing clarity or correctness.",
    studyHours: "8–10 hours",
    topics: [
      "Arrays & indexing",
      "Array mutation",
      "Objects & methods",
      "Nested data",
      "Destructuring",
      "Spread, rest & immutability",
      "map, filter & find",
      "reduce, sort & analysis",
    ],
    project: {
      title: "Expense Tracker Data Engine",
      summary:
        "Model transactions, calculate totals, group categories, and generate useful summaries.",
    },
  },
  {
    number: 4,
    title: "DOM, Events & Browser Apps",
    theme: "Turn JavaScript into interactive applications",
    description:
      "Connect program state to accessible interfaces through the DOM, events, forms, and storage.",
    studyHours: "9–11 hours",
    topics: [
      "The DOM tree",
      "Selecting & changing elements",
      "Creating UI",
      "Events & the event object",
      "Forms & validation",
      "Bubbling & delegation",
      "Timers",
      "Browser storage",
    ],
    project: {
      title: "Professional Task Manager",
      summary:
        "Create, edit, filter, search, prioritize, and persist accessible tasks.",
    },
  },
  {
    number: 5,
    title: "Modern JavaScript & Internals",
    theme: "Think like a JavaScript developer",
    description:
      "Develop an accurate mental model of scope, execution, objects, and modern module design.",
    studyHours: "9–11 hours",
    topics: [
      "Modules",
      "Closures",
      "Higher-order functions",
      "this & execution context",
      "Hoisting & the TDZ",
      "Reference, value & copying",
      "Classes & inheritance",
      "Prototypes & private state",
    ],
    project: {
      title: "Library Inventory System",
      summary:
        "Design a maintainable domain model with classes, encapsulation, and modules.",
    },
  },
  {
    number: 6,
    title: "Async JavaScript & APIs",
    theme: "Connect JavaScript to the real world",
    description:
      "Coordinate delayed work, call HTTP APIs, and build resilient loading and error states.",
    studyHours: "9–12 hours",
    topics: [
      "Sync vs async",
      "Event loop",
      "Promises",
      "async and await",
      "Errors & try/catch",
      "HTTP, JSON & REST",
      "Fetch & UI states",
      "Concurrency with Promise.all",
    ],
    project: {
      title: "GitHub Profile Explorer",
      summary:
        "Fetch public GitHub data with loading, empty, success, retry, and error states.",
    },
  },
  {
    number: 7,
    title: "Architecture, Testing & Tools",
    theme: "Write professional JavaScript",
    description:
      "Structure medium-sized programs, test behavior, measure tradeoffs, and collaborate with Git.",
    studyHours: "10–12 hours",
    topics: [
      "Clean code & modules",
      "Errors & defensive code",
      "Debounce & throttle",
      "Memoization & performance",
      "Big O fundamentals",
      "Stacks, queues, maps & sets",
      "Testing & DevTools",
      "npm, Git & GitHub",
    ],
    project: {
      title: "Searchable Product Dashboard",
      summary:
        "Combine API data, debounced search, filters, sorting, pagination, modules, and tests.",
    },
  },
  {
    number: 8,
    title: "Professional JavaScript & Capstone",
    theme: "Build and ship",
    description:
      "Plan, secure, test, document, deploy, and confidently present a complete JavaScript product.",
    studyHours: "12–16 hours",
    topics: [
      "Project architecture",
      "State & environment variables",
      "Security & validation",
      "Accessibility & responsive UI",
      "Performance & Lighthouse",
      "Deployment & Git workflow",
      "Interview preparation",
      "The path to TS, React & Node",
    ],
    project: {
      title: "JavaScript Productivity Dashboard",
      summary:
        "Ship tasks, notes, search, an API widget, persistence, analytics, accessibility, and tests.",
    },
  },
];

const examples: Record<number, { syntax: string; output: string }> = {
  1: {
    syntax: `const topic = "JavaScript";\nconsole.log(\`Learning ${"${topic}"}\`);`,
    output: "Learning JavaScript",
  },
  2: {
    syntax: `function canShip(testsPass) {\n  return testsPass ? "Ship it" : "Keep testing";\n}\nconsole.log(canShip(true));`,
    output: "Ship it",
  },
  3: {
    syntax: `const prices = [12, 8, 5];\nconst total = prices.reduce((sum, price) => sum + price, 0);\nconsole.log(total);`,
    output: "25",
  },
  4: {
    syntax: `const button = document.querySelector("button");\nbutton?.addEventListener("click", () => {\n  button.textContent = "Done";\n});`,
    output: "Button text changes to Done after a click",
  },
  5: {
    syntax: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nconsole.log(next(), next());`,
    output: "1 2",
  },
  6: {
    syntax: `async function loadUser() {\n  const response = await fetch("https://api.github.com/users/octocat");\n  if (!response.ok) throw new Error("Request failed");\n  return response.json();\n}`,
    output: "A Promise that resolves to a GitHub user object",
  },
  7: {
    syntax: `export function unique(values) {\n  return [...new Set(values)];\n}\nconsole.log(unique([1, 1, 2]));`,
    output: "[1, 2]",
  },
  8: {
    syntax: `const state = { tasks: [], notes: [] };\nconst nextState = { ...state, tasks: [...state.tasks, "Ship app"] };\nconsole.log(nextState.tasks.length);`,
    output: "1",
  },
};

function createLesson(week: WeekSeed, topic: string, index: number): Lesson {
  const difficulty: Difficulty =
    week.number < 3
      ? "beginner"
      : week.number < 7
        ? "intermediate"
        : "advanced";
  const slug = topic
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sample = examples[week.number];
  return {
    id: `w${week.number}-l${index + 1}`,
    slug,
    title: topic,
    description: `Build a practical mental model for ${topic.toLowerCase()} and use it in working JavaScript.`,
    estimatedMinutes: 25 + (index % 3) * 5,
    difficulty,
    objectives: [
      `Explain ${topic.toLowerCase()} in your own words`,
      `Use ${topic.toLowerCase()} in a small program`,
      "Recognize and debug a common failure mode",
    ],
    explanation: [
      `${topic} is part of the toolkit JavaScript uses to turn intent into reliable behavior. This lesson starts with the problem it solves, then makes the mechanics visible through code.`,
      `Professional code is not code that looks clever. It makes inputs, transformations, and outputs easy to follow. As you experiment, predict the result before running each change.`,
    ],
    syntax: sample.syntax,
    example: sample.syntax,
    expectedOutput: sample.output,
    whyItMatters: `You will use ${topic.toLowerCase()} to make application behavior explicit, testable, and easier to change.`,
    mistakes: [
      "Changing several things before rerunning the program",
      "Copying syntax without predicting its result",
      "Ignoring the first error in the console",
    ],
    challenge: {
      prompt: `Modify the example so it produces a second meaningful result related to ${topic.toLowerCase()}.`,
      starterCode: sample.syntax,
      hint: "Identify the input, the transformation, and the output. Change only one at a time.",
      solution: `${sample.syntax}\n// Add another input, then log the transformed result.`,
    },
    quiz: {
      question: `What is the best way to learn ${topic.toLowerCase()} from this example?`,
      options: [
        "Memorize every character",
        "Predict, run, change one input, and explain the result",
        "Skip errors",
        "Rewrite it in another language",
      ],
      answer: 1,
      explanation:
        "Prediction and controlled experimentation connect syntax to a reliable mental model.",
    },
  };
}

export const curriculum: CourseWeek[] = seeds.map((week) => ({
  ...week,
  slug: `week-${week.number}`,
  lessons: week.topics.map((topic, index) => createLesson(week, topic, index)),
}));
export const allLessons = curriculum.flatMap((week) =>
  week.lessons.map((lesson) => ({ ...lesson, week })),
);
export function getWeek(number: number) {
  return curriculum.find((week) => week.number === number);
}
export function getLesson(weekNumber: number, slug: string) {
  return getWeek(weekNumber)?.lessons.find((lesson) => lesson.slug === slug);
}
