export interface CheatSheet {
  title: string;
  description: string;
  code: string;
}

export const cheatsheets: CheatSheet[] = [
  {
    title: "Variables",
    description: "Use const by default; use let when the binding must change.",
    code: `const name = "Ada";\nlet score = 0;\nscore += 10;`,
  },
  {
    title: "Strings",
    description:
      "Template literals interpolate values and support multiple lines.",
    code: "const greeting = `Hello, ${name}`;\nconst upper = greeting.toUpperCase();",
  },
  {
    title: "Arrays",
    description: "Transform collections with methods that communicate intent.",
    code: `const doubled = numbers.map(n => n * 2);\nconst adults = users.filter(user => user.age >= 18);\nconst total = prices.reduce((sum, price) => sum + price, 0);`,
  },
  {
    title: "Objects",
    description:
      "Use destructuring and spread to read and update records clearly.",
    code: `const { name, role = "learner" } = user;\nconst updated = { ...user, role: "developer" };`,
  },
  {
    title: "Functions",
    description: "Keep inputs explicit and return a result the caller can use.",
    code: `function add(a, b) { return a + b; }\nconst square = value => value ** 2;`,
  },
  {
    title: "DOM",
    description:
      "Select narrowly, listen for events, and update accessible UI state.",
    code: `const form = document.querySelector("form");\nform?.addEventListener("submit", event => {\n  event.preventDefault();\n});`,
  },
  {
    title: "Async",
    description: "Await promises inside try/catch and validate HTTP responses.",
    code: `try {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error("Request failed");\n  const data = await response.json();\n} catch (error) {\n  console.error(error);\n}`,
  },
  {
    title: "Modules",
    description:
      "Export small public APIs and keep implementation details private.",
    code: `export function formatPrice(value) {\n  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);\n}`,
  },
  {
    title: "Debugging",
    description: "Reproduce, read the first error, isolate, repair, and rerun.",
    code: `console.table(records);\nconsole.assert(total >= 0, "Total must be positive");\ndebugger;`,
  },
  {
    title: "Array methods",
    description:
      "Choose by intent: find one, filter many, map each, reduce to one.",
    code: `const item = items.find(item => item.id === id);\nconst active = items.filter(item => item.active);`,
  },
  {
    title: "Numbers",
    description:
      "Use Number.isInteger/isFinite over global isFinite, and toFixed for display only.",
    code: `Number.isInteger(4);        // true\nNumber((9.005).toFixed(2)); // 9\nMath.max(1, 5, 3);          // 5`,
  },
  {
    title: "Loops",
    description:
      "Reach for the loop that expresses intent: index, value, or key.",
    code: `for (let i = 0; i < n; i++) {}\nfor (const value of list) {}\nfor (const key in obj) {}`,
  },
  {
    title: "Events",
    description: "Delegate to a shared parent when a list can grow or shrink.",
    code: `list.addEventListener("click", (e) => {\n  const item = e.target.closest("li");\n  if (item) select(item.dataset.id);\n});`,
  },
  {
    title: "Promises",
    description:
      "A Promise settles once, to fulfilled or rejected — chain with .then/.catch.",
    code: `Promise.resolve(1)\n  .then((n) => n + 1)\n  .catch((error) => console.error(error));`,
  },
  {
    title: "Fetch",
    description:
      "Always await the response, then check response.ok before parsing.",
    code: `const response = await fetch(url);\nif (!response.ok) throw new Error("Request failed");\nconst data = await response.json();`,
  },
  {
    title: "Classes",
    description:
      "Use # for true private fields; call super() before using this in a subclass.",
    code: `class Account {\n  #balance = 0;\n  deposit(n) { this.#balance += n; }\n}`,
  },
  {
    title: "Error handling",
    description:
      "Throw specific Error objects; catch narrowly and recover or rethrow.",
    code: `try {\n  risky();\n} catch (error) {\n  console.error(error.message);\n}`,
  },
  {
    title: "ES6+",
    description:
      "Destructuring, spread/rest, optional chaining, and nullish coalescing in one glance.",
    code: `const { a, ...rest } = obj;\nconst value = user?.profile?.name ?? "Guest";`,
  },
  {
    title: "Git basics",
    description:
      "Branch, commit small and often, push, and open a pull request.",
    code: `git checkout -b feat/my-change\ngit add .\ngit commit -m "feat: add my change"\ngit push origin feat/my-change`,
  },
  {
    title: "npm basics",
    description: "Install, run scripts, and keep dependencies audited.",
    code: `npm install\nnpm run dev\nnpm audit`,
  },
];
