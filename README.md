# JavaScript 0 → Hero

**Master JavaScript in 8 Weeks — Learn. Code. Build. Ship.**

JavaScript 0 → Hero is an interactive, portfolio-grade learning platform for complete beginners. It replaces passive tutorial reading with a repeatable loop: **Learn → Practice → Test → Debug → Build → Review → Master.**

> Screenshot: run the project locally and capture the responsive homepage, lesson workspace, or dashboard for your portfolio.

## Version 1.1

Version 1.1 is a substantial depth upgrade on top of the original 8-week platform, focused on practice quality, assessment, and learner analytics:

- **Challenge bank grew from 12 to 76** hand-authored problems across Fundamentals, Strings, Arrays, Objects, Functions, Algorithms, Modern JavaScript, Async, DOM, and Debugging — each with visible **and hidden** tests, hints, a reference solution, and related concepts.
- **A real test-grading engine**: named test cases, a Jest-like `expect().toBe()/.toEqual()/.toBeCloseTo()/.toContain()` assertion API, separate **Run Code** / **Run Tests** actions, a per-test pass/fail breakdown with Expected/Received on failure (hidden tests never reveal their assertion), Ctrl/Cmd+Enter, and mobile Code/Output/Tests tabs.
- **A 21-exercise Debugging Lab** covering SyntaxError, ReferenceError, TypeError, scope, loop, array, object, DOM, async, Promise, API, off-by-one, mutation, comparison, and event-listener bugs — broken code, observed vs. expected behavior, console output, hints, and a corrected version with an explanation.
- **Richer weekly assessments**: 80 mixed-format questions (10/week) — multiple choice, true/false, predict-the-output, identify-the-error, select-the-code, and scenario — scored with a per-skill breakdown, unlimited retries, and a 70% pass threshold.
- **A 19-skill mastery system** (`/skills`, and on `/dashboard`) computed from real lesson completion, challenge/debug test results, and quiz performance — a skill nobody has touched shows "no data," never a fabricated score.
- **Daily learning plans and a distraction-reduced Learning Session mode** (`/session/[week]/[day]`): Today's Goal → Lesson → Exercise → Challenge → Knowledge Check → Session Complete, with a live step counter.
- **A JavaScript Interview Center** (`/interview`) with 56 questions across 13 categories, each with a short answer, deep explanation, code example, common wrong answer, interview trap, and follow-up question.
- **A Career readiness section** (`/career`) covering GitHub repository standards, README structure, and a copyable portfolio README template.
- **Progress data model v2** with automatic, non-destructive migration from v1, per-item attempt tracking, and **JSON export/import** validated with Zod before ever overwriting local data.
- **A deterministic recommendation engine** (no AI calls) surfacing a "Recommended next" action and "Needs review" weak areas from real activity.
- **Interactive mental-model visuals** for the call stack, scope, closures, reference vs. value, the event loop, and the prototype chain, embedded in the relevant lessons.
- **20 expanded cheat sheets**, richer project briefs (problem, user stories, planning checklist, data structure, UI requirements, testing checklist, completion criteria) for all 13 projects, and a 10-milestone capstone with a persisted final checklist.
- Search now spans lessons, challenges, the debugging lab, projects, cheat sheets, and interview questions, grouped by type.

The App Router architecture, the Web Worker sandbox, and the local-first progress model from v1 were already sound — v1.1 extends them rather than replacing them.

## Product highlights

- 8-week structured curriculum with 64 in-depth lessons (what/why/syntax/mental model/example/real-world example/common mistake/practice/challenge/summary) and eight weekly projects
- 76 coding challenges and 21 debugging exercises with automated, hidden-test-aware grading
- 80 weekly assessment questions and a 19-skill mastery system
- A 56-question Interview Center and a Career/portfolio-readiness section
- Guided and Fast Track learning modes, plus a distraction-reduced Learning Session mode
- Browser-isolated JavaScript runner: a dedicated Web Worker per run, a hard timeout, and no DOM access for learner code
- Device-local, versioned (v2) learning progress with XP, streaks, and JSON export/import
- Roadmap, learner dashboard with recommendations and weak-area detection, global `Ctrl/Cmd + K` search, and 20 cheat sheets
- Light/dark themes, responsive layouts, keyboard support, and visible focus states
- Static metadata, sitemap, robots configuration, deliberate error states, and Vercel-ready output

## Curriculum

| Week | Focus                                                                        | Project                                      |
| ---- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| 1    | Foundations: runtime, values, variables, types, operators, coercion          | Personal Profile Generator                   |
| 2    | Logic, functions, scope, loops, and problem solving                          | Smart Calculator + Guessing Game             |
| 3    | Arrays, objects, methods, destructuring, and immutable transformations       | Expense Tracker Data Engine                  |
| 4    | DOM, events, forms, timers, and browser storage                              | Professional Task Manager                    |
| 5    | Modules, closures, `this`, execution, classes, and prototypes                | Library Inventory System                     |
| 6    | Event loop, promises, async/await, HTTP, Fetch, and resilient UI states      | API Explorer                                 |
| 7    | Architecture, errors, performance, data structures, tests, npm, and Git      | Product Search Dashboard                     |
| 8    | Security, accessibility, performance, deployment, interviews, and next steps | JavaScript Productivity Dashboard (capstone) |

## Architecture

The project uses Next.js App Router and strict TypeScript. Curriculum, challenges, debugging exercises, quizzes, interview questions, and projects are typed records under `src/content`; route components resolve those records rather than duplicating content. Server Components render content-first pages. Client Components are limited to interaction boundaries: search, progress, quizzes, code execution, theme switching, and dashboard state.

Progress is accessed through a small service boundary (`ProgressRepository`) and persisted as a versioned JSON record in `localStorage`, with automatic, non-destructive migration from v1. That interface is deliberately shaped so a future authenticated Supabase/PostgreSQL-backed repository can replace `LocalProgressRepository` without changing any curriculum or UI components — see `src/types/learning.ts`.

The browser code runner creates a dedicated Web Worker per execution, captures console output, terminates the worker after a fixed timeout, and never sends learner code to the server or gives it DOM/window access. See **Security** below for exactly what that sandbox does and does not guarantee.

```text
src/
  app/             routes, metadata, sitemap, and error states
  components/      learning, editor, quiz, dashboard, and layout UI
  content/         typed curriculum, challenges, debug lab, quizzes, interview Qs, projects
  lib/             progress, migration, mastery, recommendations, and quiz scoring
  types/           domain contracts
  tests/           shared test setup
e2e/               Playwright critical flows
```

## Routes

- `/` — product homepage and eight-week overview
- `/learn` — full curriculum
- `/learn/week/[week]` — weekly plan, daily study plan, project, and mastery
- `/learn/week/[week]/[lesson]` — interactive lesson workspace
- `/learn/week/[week]/quiz` — 10-question mixed-format weekly checkpoint
- `/session/[week]/[day]` — distraction-reduced daily Learning Session mode
- `/roadmap` — progress-aware journey
- `/practice` — filterable, searchable, sortable challenge bank
- `/practice/challenge/[slug]` — a single graded challenge
- `/practice/debug` — the 21-exercise debugging lab
- `/projects` and `/projects/[slug]` — full project briefs and the capstone
- `/playground` — open JavaScript sandbox
- `/dashboard` — activity-backed analytics, mastery, recommendations, export/import
- `/skills` — the full 19-skill mastery breakdown
- `/interview` — the JavaScript Interview Center
- `/career` — portfolio and GitHub readiness guide
- `/resources/cheatsheets` — 20 searchable quick references

## Local development

Requirements: Node.js 22.12+ and npm.

```bash
git clone https://github.com/Arungharami/Java_script_0-hero.git
cd Java_script_0-hero
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev          # local development
npm run lint         # ESLint
npm run typecheck    # strict TypeScript
npm run test         # Vitest unit/component suite
npm run test:e2e     # Playwright critical flows
npm run build        # production build
npm run format:check # Prettier verification
npm run format       # Prettier write
```

## Testing

Vitest covers progress calculations, v1→v2 migration, skill mastery, recommendations, import validation, quiz scoring, curriculum/content integrity, the quiz engine (including retries), and the challenge test runner's pass/fail/expected/received rendering. Playwright covers the homepage → lesson → run code → complete → dashboard flow, a full challenge run-tests-to-completion flow, a full weekly quiz attempt, an export → clear → import → restore flow, and representative core routes.

Install the Playwright browser once before the E2E suite:

```bash
npx playwright install chromium
npm run test:e2e
```

## Security

User-submitted JavaScript is never executed on the server. Each **Run** or **Run Tests** click spins up a dedicated Web Worker (its own thread, its own global scope, no `document`/`window`), posts the code and test cases to it, and terminates the worker outright if it doesn't respond within a fixed wall-clock timeout — this is what stops `while (true) {}` from ever hanging the page. Console output is captured and serialized, never passed through unsanitized.

**What this sandbox is, and isn't:** it reliably contains runaway loops and prevents learner code from touching the DOM, other tabs, or the network beyond what a Worker's own `fetch` allows. It is a pedagogical safety net, not a security boundary suitable for adversarial, untrusted multi-tenant code execution — it does not defend against browser engine vulnerabilities or side-channel attacks. DOM-manipulation practice challenges are modeled as pure-JavaScript logic problems (the underlying reasoning, auto-gradable in a Worker) rather than executed against a real DOM; real DOM work happens in the Playground and the weekly projects, in the actual page.

## Dependency security

`npm audit` reports **0 vulnerabilities** as of this release. The two moderate advisories present in the prior version (`vitest`/`@vitest/mocker`, GHSA-82fw-gwwq-j7x9, a dev-only path-traversal issue in a mocking feature this project doesn't use) were resolved by upgrading `vitest` to `^5.0.0`, which the full test suite passes against without changes.

## Deploying to Vercel

Import `Arungharami/Java_script_0-hero` into Vercel and keep the default Next.js settings, or run `vercel` from the repository. No secrets or external infrastructure are required. A clean project name is `javascript-0-hero`.

## Contributing

Create a focused branch, keep content records typed, add tests for changed behavior, and verify lint, typecheck, format, tests, and production build before opening a pull request. Content contributions should answer why a concept exists and include executable, auto-gradable practice — not only syntax definitions.

## Roadmap

- Add optional Supabase authentication and cross-device sync behind the existing `ProgressRepository` interface
- Add instructor-authored capstone review rubrics
- Expand the mental-model visualizations to more concepts
- Add more debugging exercises and a second, harder algorithms track

## Author

**Arun Kumar Gharami** · [GitHub](https://github.com/Arungharami)

## License

MIT — see [LICENSE](LICENSE).
