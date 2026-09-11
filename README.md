# JavaScript 0 → Hero

**Master JavaScript in 8 Weeks — Learn. Code. Build. Ship.**

JavaScript 0 → Hero is an interactive, portfolio-grade learning platform for complete beginners. It replaces passive tutorial reading with a repeatable loop: learn the mental model, run an example, experiment, solve a challenge, debug, review, and build.

> Screenshot: run the project locally and capture the responsive homepage or lesson workspace for your portfolio.

## Product highlights

- 8-week structured curriculum with 64 lessons and eight weekly projects
- Guided and Fast Track learning modes
- Browser-isolated JavaScript runner with a two-second safety timeout
- Automated practice checks, progressive hints, and hidden solutions
- Dedicated debugging lab and reusable quiz engine
- Device-local, versioned learning progress with XP and legitimate streaks
- Roadmap, learner dashboard, global `Ctrl/Cmd + K` search, and cheat sheets
- Light/dark themes, responsive layouts, keyboard support, and visible focus states
- Static metadata, sitemap, robots configuration, deliberate error states, and Vercel-ready output

## Curriculum

| Week | Focus                                                                        | Project                          |
| ---- | ---------------------------------------------------------------------------- | -------------------------------- |
| 1    | Foundations: runtime, values, variables, types, operators, coercion          | Personal Profile Generator       |
| 2    | Logic, functions, scope, loops, and problem solving                          | Smart Calculator + Guessing Game |
| 3    | Arrays, objects, methods, destructuring, and immutable transformations       | Expense Tracker Data Engine      |
| 4    | DOM, events, forms, timers, and browser storage                              | Professional Task Manager        |
| 5    | Modules, closures, `this`, execution, classes, and prototypes                | Library Inventory System         |
| 6    | Event loop, promises, async/await, HTTP, Fetch, and resilient UI states      | GitHub Profile Explorer          |
| 7    | Architecture, errors, performance, data structures, tests, npm, and Git      | Product Dashboard                |
| 8    | Security, accessibility, performance, deployment, interviews, and next steps | Productivity Dashboard Capstone  |

## Architecture

The project uses Next.js App Router and strict TypeScript. Curriculum, challenges, and projects are typed records under `src/content`; route components resolve those records rather than duplicating content. Server Components render content-first pages. Client Components are limited to interaction boundaries: search, progress, quizzes, code execution, theme switching, and dashboard state.

Progress is accessed through a small service boundary and persisted as a versioned JSON record in `localStorage`. The browser code runner creates a dedicated Web Worker per execution, captures console output, terminates after two seconds, and never sends learner code to the server. This structure can later replace local persistence with an authenticated Supabase/PostgreSQL adapter without changing curriculum components.

```text
src/
  app/             routes, metadata, sitemap, and error states
  components/      learning, editor, quiz, dashboard, and layout UI
  content/         typed curriculum, challenges, and project records
  lib/             progress and quiz utilities
  types/           domain contracts
  tests/           shared test setup
e2e/               Playwright critical flows
```

## Routes

- `/` — product homepage and eight-week overview
- `/learn` — full curriculum
- `/learn/week/[week]` — weekly plan and project
- `/learn/week/[week]/[lesson]` — interactive lesson workspace
- `/learn/week/[week]/quiz` — weekly checkpoint
- `/roadmap` — progress-aware journey
- `/practice` and `/practice/challenge/[slug]` — coding challenges
- `/practice/debug` — debugging lab
- `/projects` and `/projects/[slug]` — progressive project briefs
- `/playground` — open JavaScript sandbox
- `/dashboard` — activity-backed learner analytics
- `/resources/cheatsheets` — searchable quick reference

## Local development

Requirements: Node.js 20.9+ and npm.

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
```

## Testing

Vitest covers progress calculations, persistence recovery, quiz scoring, curriculum integrity, challenge contracts, and quiz interaction. Playwright covers the homepage-to-lesson-to-dashboard learning flow and representative core routes.

Install the Playwright browser once before the E2E suite:

```bash
npx playwright install chromium
npm run test:e2e
```

## Deploying to Vercel

Import `Arungharami/Java_script_0-hero` into Vercel and keep the default Next.js settings, or run `vercel` from the repository. No secrets or external infrastructure are required. A clean project name is `javascript-0-hero`.

## Contributing

Create a focused branch, keep curriculum records typed, add tests for changed behavior, and verify lint, typecheck, tests, and production build before opening a pull request. Content contributions should answer why a concept exists and include executable practice—not only syntax definitions.

## Roadmap

- Expand the practice bank and debugging scenarios
- Add richer visualizers for execution context and the event loop
- Add optional Supabase authentication and cross-device sync
- Add instructor-authored capstone review rubrics
- Add more robust JavaScript parsing and test isolation

## Author

**Arun Kumar Gharami** · [GitHub](https://github.com/Arungharami)

## License

MIT — see [LICENSE](LICENSE).
