import type { ChallengeSeed } from "./shared";

export const asyncChallenges: ChallengeSeed[] = [
  {
    slug: "promise-chain",
    title: "Promise Chain",
    category: "Async",
    difficulty: "easy",
    skills: ["promises"],
    description:
      "Write doubleThenAddOne(value) that wraps value in a Promise, doubles it, then adds one, using .then() chaining.",
    examples: ["doubleThenAddOne(3) resolves to 7"],
    starterCode: `function doubleThenAddOne(value) {\n  // your code — return a Promise chain\n}`,
    tests: [
      {
        description: "resolves to the chained result",
        assertion: "await expectAsync(doubleThenAddOne(3)).toBe(7)",
      },
      {
        description: "handles zero",
        assertion: "await expectAsync(doubleThenAddOne(0)).toBe(1)",
      },
      {
        hidden: true,
        description: "handles a negative number",
        assertion: "await expectAsync(doubleThenAddOne(-5)).toBe(-9)",
      },
    ],
    hints: ["Start with Promise.resolve(value), then chain two .then() calls."],
    solution: `function doubleThenAddOne(value) {\n  return Promise.resolve(value)\n    .then((v) => v * 2)\n    .then((v) => v + 1);\n}`,
    explanation:
      "Each .then() receives the previous step's resolved value, building a readable, flat pipeline.",
    relatedConcepts: ["Promises"],
  },
  {
    slug: "promise-all-challenge",
    title: "Promise.all Aggregation",
    category: "Async",
    difficulty: "medium",
    skills: ["promises", "async"],
    description:
      "Write sumResolved(promises) that awaits every Promise in the array concurrently and returns their sum.",
    examples: [
      "sumResolved([Promise.resolve(1), Promise.resolve(2)]) resolves to 3",
    ],
    starterCode: `async function sumResolved(promises) {\n  // your code\n}`,
    tests: [
      {
        description: "sums two resolved promises",
        assertion:
          "await expectAsync(sumResolved([Promise.resolve(1), Promise.resolve(2)])).toBe(3)",
      },
      {
        description: "sums a single promise",
        assertion:
          "await expectAsync(sumResolved([Promise.resolve(10)])).toBe(10)",
      },
      {
        hidden: true,
        description: "sums an empty array to zero",
        assertion: "await expectAsync(sumResolved([])).toBe(0)",
      },
    ],
    hints: [
      "await Promise.all(promises) gives you a plain array of resolved values to reduce over.",
    ],
    solution: `async function sumResolved(promises) {\n  const values = await Promise.all(promises);\n  return values.reduce((sum, v) => sum + v, 0);\n}`,
    explanation:
      "Promise.all resolves once every input Promise has resolved, handing back their values in the original order.",
    relatedConcepts: ["Concurrency with Promise.all"],
  },
  {
    slug: "sequential-fetching",
    title: "Sequential Fetching",
    category: "Async",
    difficulty: "medium",
    skills: ["async", "promises"],
    description:
      "Write fetchSequential(ids, fetcher) that awaits fetcher(id) for each id one at a time, in order, returning the results array.",
    examples: [
      "fetchSequential([1,2], fetcher) awaits fetcher(1) fully before calling fetcher(2)",
    ],
    starterCode: `async function fetchSequential(ids, fetcher) {\n  // your code — do not use Promise.all here\n}`,
    tests: [
      {
        description: "returns results in order",
        assertion:
          "await expectAsync(fetchSequential([1, 2, 3], (id) => Promise.resolve(id * 2))).toEqual([2, 4, 6])",
      },
      {
        hidden: true,
        description: "never runs two fetches concurrently",
        assertion:
          "await expectAsync((async () => { let current = 0; let maxConcurrent = 0; const fetcher = (id) => new Promise((resolve) => { current++; maxConcurrent = Math.max(maxConcurrent, current); setTimeout(() => { current--; resolve(id); }, 15); }); await fetchSequential([1, 2, 3], fetcher); return maxConcurrent; })()).toBe(1)",
      },
    ],
    hints: [
      "Use a for...of loop with await inside it, pushing each result before moving to the next id.",
    ],
    solution: `async function fetchSequential(ids, fetcher) {\n  const results = [];\n  for (const id of ids) {\n    results.push(await fetcher(id));\n  }\n  return results;\n}`,
    explanation:
      "Awaiting inside the loop forces each fetch to fully finish before the next one starts — useful when order or rate matters.",
    relatedConcepts: ["async and await", "Parallel Fetching"],
  },
  {
    slug: "parallel-fetching",
    title: "Parallel Fetching",
    category: "Async",
    difficulty: "hard",
    skills: ["async", "promises"],
    description:
      "Write fetchParallel(ids, fetcher) that starts every fetcher(id) call concurrently and returns results in the original id order.",
    examples: [
      "fetchParallel([1,2], fetcher) starts both fetcher calls immediately",
    ],
    starterCode: `function fetchParallel(ids, fetcher) {\n  // your code\n}`,
    tests: [
      {
        description: "returns results in the original order",
        assertion:
          "await expectAsync(fetchParallel([1, 2, 3], (id) => Promise.resolve(id * 2))).toEqual([2, 4, 6])",
      },
      {
        hidden: true,
        description: "runs fetches concurrently, not sequentially",
        assertion:
          "await expectAsync((async () => { let current = 0; let maxConcurrent = 0; const fetcher = (id) => new Promise((resolve) => { current++; maxConcurrent = Math.max(maxConcurrent, current); setTimeout(() => { current--; resolve(id); }, 15); }); await fetchParallel([1, 2, 3], fetcher); return maxConcurrent; })()).toBe(3)",
      },
    ],
    hints: [
      "Map every id to fetcher(id) first (starting all of them), then wrap the resulting array of promises in Promise.all.",
    ],
    solution: `function fetchParallel(ids, fetcher) {\n  return Promise.all(ids.map((id) => fetcher(id)));\n}`,
    explanation:
      "Calling fetcher for every id before awaiting anything is what lets all the requests run concurrently.",
    relatedConcepts: ["Concurrency with Promise.all", "Sequential Fetching"],
  },
  {
    slug: "async-retry",
    title: "Async Retry",
    category: "Async",
    difficulty: "hard",
    skills: ["async", "promises"],
    description:
      "Write retry(fn, attempts) that calls fn() (which returns a Promise), retrying on rejection up to `attempts` total tries before finally rejecting.",
    examples: [
      "retry(flakyFn, 3) tries flakyFn up to 3 times before giving up",
    ],
    starterCode: `async function retry(fn, attempts) {\n  // your code\n}`,
    tests: [
      {
        description: "succeeds once the underlying function succeeds",
        assertion:
          'let calls = 0; const flaky = () => { calls++; return calls < 3 ? Promise.reject(new Error("fail")) : Promise.resolve("ok"); }; await expectAsync(retry(flaky, 5)).toBe("ok")',
      },
      {
        description: "throws after exhausting all attempts",
        assertion:
          'const alwaysFails = () => Promise.reject(new Error("nope")); let threw = false; try { await retry(alwaysFails, 2); } catch { threw = true; } expect(threw).toBe(true)',
      },
      {
        hidden: true,
        description: "stops retrying immediately after success",
        assertion:
          'let calls = 0; const succeedsSecondTry = () => { calls++; return calls < 2 ? Promise.reject(new Error("fail")) : Promise.resolve(calls); }; await expectAsync(retry(succeedsSecondTry, 5)).toBe(2)',
      },
    ],
    hints: [
      "Loop up to `attempts` times, awaiting fn() in a try/catch; return immediately on success, and rethrow only after the last attempt fails.",
    ],
    solution: `async function retry(fn, attempts) {\n  let lastError;\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (error) {\n      lastError = error;\n    }\n  }\n  throw lastError;\n}`,
    explanation:
      "Retrying is a loop around a try/catch: swallow failures until either a success returns early or attempts run out.",
    relatedConcepts: ["Errors & try/catch", "async and await"],
  },
  {
    slug: "fetch-error-handling",
    title: "Fetch Error Handling",
    category: "Async",
    difficulty: "medium",
    skills: ["apis", "async"],
    description:
      "Write safeFetchJSON(fetchImpl, url) that awaits fetchImpl(url), throws if response.ok is false, and otherwise returns the parsed JSON.",
    examples: ['safeFetchJSON(fetcher, "/user") rejects on a non-ok response'],
    starterCode: `async function safeFetchJSON(fetchImpl, url) {\n  // your code\n}`,
    tests: [
      {
        description: "returns parsed JSON on success",
        assertion:
          'await expectAsync(safeFetchJSON((u) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) }), "/x")).toEqual({ id: 1 })',
      },
      {
        description: "throws on a non-ok response",
        assertion:
          'let threw = false; try { await safeFetchJSON((u) => Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve(null) }), "/x"); } catch { threw = true; } expect(threw).toBe(true)',
      },
      {
        hidden: true,
        description: "passes the url through to fetchImpl",
        assertion:
          'let seenUrl; await safeFetchJSON((u) => { seenUrl = u; return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); }, "/orders"); expect(seenUrl).toBe("/orders")',
      },
    ],
    hints: [
      "Check response.ok before calling response.json() — fetch never rejects on its own for HTTP error statuses.",
    ],
    solution: `async function safeFetchJSON(fetchImpl, url) {\n  const response = await fetchImpl(url);\n  if (!response.ok) throw new Error(\`Request failed: ${"${response.status}"}\`);\n  return response.json();\n}`,
    explanation:
      "This mirrors real fetch() usage: the network call succeeding is not the same thing as the request succeeding.",
    relatedConcepts: ["Errors & try/catch", "HTTP, JSON & REST"],
  },
  {
    slug: "timeout-wrapper",
    title: "Timeout Wrapper",
    category: "Async",
    difficulty: "hard",
    skills: ["async", "promises"],
    description:
      "Write withTimeout(promise, ms) that resolves/rejects with the original promise, or rejects with an Error if it takes longer than ms.",
    examples: [
      "withTimeout(slowPromise, 100) rejects if slowPromise takes over 100ms",
    ],
    starterCode: `function withTimeout(promise, ms) {\n  // your code\n}`,
    tests: [
      {
        description: "resolves normally when the promise is fast enough",
        assertion:
          'await expectAsync(withTimeout(new Promise((resolve) => setTimeout(() => resolve("done"), 5)), 60)).toBe("done")',
      },
      {
        description: "rejects when the promise takes too long",
        assertion:
          'let threw = false; try { await withTimeout(new Promise((resolve) => setTimeout(() => resolve("late"), 100)), 15); } catch { threw = true; } expect(threw).toBe(true)',
      },
      {
        hidden: true,
        description: "propagates the original rejection when it happens first",
        assertion:
          'let message; try { await withTimeout(Promise.reject(new Error("boom")), 100); } catch (e) { message = e.message; } expect(message).toBe("boom")',
      },
    ],
    hints: [
      "Promise.race the original promise against a second Promise that rejects after ms via setTimeout.",
    ],
    solution: `function withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) => {\n    setTimeout(() => reject(new Error("Timed out")), ms);\n  });\n  return Promise.race([promise, timeout]);\n}`,
    explanation:
      "Promise.race settles as soon as the first of its inputs settles — whichever is faster, the real result or the timeout, wins.",
    relatedConcepts: ["Promises", "Concurrency with Promise.all"],
  },
];
