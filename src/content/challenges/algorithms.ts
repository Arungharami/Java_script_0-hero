import type { ChallengeSeed } from "./shared";

export const algorithms: ChallengeSeed[] = [
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    category: "Algorithms",
    difficulty: "easy",
    skills: ["algorithms", "conditions"],
    description:
      'Return "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, else the number.',
    examples: ['fizzBuzz(15) → "FizzBuzz"', 'fizzBuzz(3) → "Fizz"'],
    starterCode: `function fizzBuzz(n) {\n  // your code\n}`,
    tests: [
      {
        description: "returns FizzBuzz for multiples of 15",
        assertion: 'expect(fizzBuzz(15)).toBe("FizzBuzz")',
      },
      {
        description: "returns Fizz for multiples of 3",
        assertion: 'expect(fizzBuzz(3)).toBe("Fizz")',
      },
      {
        description: "returns Buzz for multiples of 5",
        assertion: 'expect(fizzBuzz(5)).toBe("Buzz")',
      },
      {
        hidden: true,
        description: "returns the number itself otherwise",
        assertion: "expect(fizzBuzz(7)).toBe(7)",
      },
    ],
    hints: [
      "Check divisibility by 15 first, since it's the most specific condition.",
    ],
    solution: `function fizzBuzz(n) {\n  return n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : n;\n}`,
    explanation:
      "Checking the most specific condition (divisible by both) first avoids ever needing to combine strings.",
    relatedConcepts: ["Conditions & branching", "Operators & comparisons"],
  },
  {
    slug: "factorial",
    title: "Factorial",
    category: "Algorithms",
    difficulty: "easy",
    skills: ["algorithms"],
    description:
      "Return n! (the product of all positive integers up to n). 0! is 1.",
    examples: ["factorial(5) → 120", "factorial(0) → 1"],
    starterCode: `function factorial(n) {\n  // your code\n}`,
    tests: [
      {
        description: "computes 5!",
        assertion: "expect(factorial(5)).toBe(120)",
      },
      {
        description: "returns 1 for 0!",
        assertion: "expect(factorial(0)).toBe(1)",
      },
      {
        hidden: true,
        description: "computes 1!",
        assertion: "expect(factorial(1)).toBe(1)",
      },
    ],
    hints: [
      "A loop multiplying an accumulator from 1 to n is simpler to reason about than recursion here.",
    ],
    solution: `function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}`,
    explanation:
      "Starting the loop at 2 (not 1) is a small optimization since multiplying by 1 does nothing.",
    relatedConcepts: ["Loops & iteration"],
  },
  {
    slug: "fibonacci",
    title: "Fibonacci",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms"],
    description:
      "Return the nth Fibonacci number (0-indexed: fib(0) = 0, fib(1) = 1).",
    examples: ["fibonacci(6) → 8"],
    starterCode: `function fibonacci(n) {\n  // your code\n}`,
    tests: [
      {
        description: "computes fib(6)",
        assertion: "expect(fibonacci(6)).toBe(8)",
      },
      {
        description: "computes fib(0)",
        assertion: "expect(fibonacci(0)).toBe(0)",
      },
      {
        description: "computes fib(1)",
        assertion: "expect(fibonacci(1)).toBe(1)",
      },
      {
        hidden: true,
        description: "computes fib(10) efficiently",
        assertion: "expect(fibonacci(10)).toBe(55)",
      },
    ],
    hints: [
      "An iterative approach tracking the previous two values avoids the exponential blowup of naive recursion.",
    ],
    solution: `function fibonacci(n) {\n  let [prev, curr] = [0, 1];\n  for (let i = 0; i < n; i++) {\n    [prev, curr] = [curr, prev + curr];\n  }\n  return prev;\n}`,
    explanation:
      "Naive recursive Fibonacci is O(2^n); this iterative version is O(n) and never recomputes a value.",
    relatedConcepts: ["Big O fundamentals", "Memoization & performance"],
  },
  {
    slug: "prime-checker",
    title: "Prime Checker",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms"],
    description: "Return true if a number is prime.",
    examples: ["isPrime(7) → true", "isPrime(8) → false"],
    starterCode: `function isPrime(n) {\n  // your code\n}`,
    tests: [
      {
        description: "identifies a prime number",
        assertion: "expect(isPrime(7)).toBe(true)",
      },
      {
        description: "identifies a non-prime number",
        assertion: "expect(isPrime(8)).toBe(false)",
      },
      {
        description: "treats 1 as not prime",
        assertion: "expect(isPrime(1)).toBe(false)",
      },
      {
        hidden: true,
        description: "treats 2 as prime",
        assertion: "expect(isPrime(2)).toBe(true)",
      },
    ],
    hints: ["You only need to check divisors up to Math.sqrt(n)."],
    solution: `function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}`,
    explanation:
      "If n has a factor larger than its square root, it must also have a matching factor smaller than it, so checking up to sqrt(n) is sufficient.",
    relatedConcepts: ["Big O fundamentals", "Loops & iteration"],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    category: "Algorithms",
    difficulty: "hard",
    skills: ["algorithms"],
    description:
      "Return the index of a target in a sorted array, or -1 if not found, using binary search.",
    examples: ["binarySearch([1,3,5,7,9], 7) → 3"],
    starterCode: `function binarySearch(sorted, target) {\n  // your code\n}`,
    tests: [
      {
        description: "finds a middle value",
        assertion: "expect(binarySearch([1, 3, 5, 7, 9], 7)).toBe(3)",
      },
      {
        description: "returns -1 when not found",
        assertion: "expect(binarySearch([1, 3, 5], 4)).toBe(-1)",
      },
      {
        hidden: true,
        description: "finds the first element",
        assertion: "expect(binarySearch([2, 4, 6], 2)).toBe(0)",
      },
    ],
    hints: [
      "Track low/high pointers; compare the middle element and discard half the search space each step.",
    ],
    solution: `function binarySearch(sorted, target) {\n  let low = 0;\n  let high = sorted.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (sorted[mid] === target) return mid;\n    if (sorted[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`,
    explanation:
      "Binary search is O(log n) because each comparison eliminates half of the remaining candidates.",
    relatedConcepts: ["Big O fundamentals", "Linear Search"],
  },
  {
    slug: "linear-search",
    title: "Linear Search",
    category: "Algorithms",
    difficulty: "easy",
    skills: ["algorithms"],
    description:
      "Return the index of the first occurrence of a target value, or -1 if not found.",
    examples: ["linearSearch([4,2,7], 2) → 1"],
    starterCode: `function linearSearch(values, target) {\n  // your code\n}`,
    tests: [
      {
        description: "finds a value in the middle",
        assertion: "expect(linearSearch([4, 2, 7], 2)).toBe(1)",
      },
      {
        description: "returns -1 when not found",
        assertion: "expect(linearSearch([1, 2], 9)).toBe(-1)",
      },
      {
        hidden: true,
        description: "finds the first of multiple matches",
        assertion: "expect(linearSearch([5, 5, 5], 5)).toBe(0)",
      },
    ],
    hints: ["Loop with an index, returning as soon as you find a match."],
    solution: `function linearSearch(values, target) {\n  for (let i = 0; i < values.length; i++) {\n    if (values[i] === target) return i;\n  }\n  return -1;\n}`,
    explanation:
      "Unlike binary search, linear search needs no sorted input, but is O(n) rather than O(log n).",
    relatedConcepts: ["Binary Search", "Big O fundamentals"],
  },
  {
    slug: "bubble-sort",
    title: "Bubble Sort",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms", "arrays"],
    description:
      "Implement bubble sort: repeatedly swap adjacent out-of-order elements until the array is sorted ascending.",
    examples: ["bubbleSort([5,3,1,4]) → [1,3,4,5]"],
    starterCode: `function bubbleSort(values) {\n  // your code — return a new sorted array\n}`,
    tests: [
      {
        description: "sorts an unsorted array",
        assertion: "expect(bubbleSort([5, 3, 1, 4])).toEqual([1, 3, 4, 5])",
      },
      {
        description: "leaves a sorted array unchanged",
        assertion: "expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3])",
      },
      {
        hidden: true,
        description: "does not mutate the input",
        assertion:
          "const input = [3, 1, 2]; bubbleSort(input); expect(input).toEqual([3, 1, 2])",
      },
    ],
    hints: [
      "Copy the array first. Then repeatedly scan, swapping any adjacent pair that's out of order, until a full pass makes no swaps.",
    ],
    solution: `function bubbleSort(values) {\n  const arr = [...values];\n  let swapped = true;\n  while (swapped) {\n    swapped = false;\n    for (let i = 0; i < arr.length - 1; i++) {\n      if (arr[i] > arr[i + 1]) {\n        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];\n        swapped = true;\n      }\n    }\n  }\n  return arr;\n}`,
    explanation:
      "Bubble sort is O(n²) but its simplicity makes it a common first sorting algorithm to implement by hand.",
    relatedConcepts: ["Big O fundamentals", "Array mutation"],
  },
  {
    slug: "frequency-counter",
    title: "Frequency Counter Pattern",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms", "arrays"],
    description:
      "Using the frequency counter pattern (not nested loops), return true if two arrays contain the same values with the same frequency, regardless of order.",
    examples: ["sameFrequency([1,2,3], [3,2,1]) → true"],
    starterCode: `function sameFrequency(a, b) {\n  // your code — avoid nested loops\n}`,
    tests: [
      {
        description: "detects same values in different order",
        assertion: "expect(sameFrequency([1, 2, 3], [3, 2, 1])).toBe(true)",
      },
      {
        description: "detects different lengths as unequal",
        assertion: "expect(sameFrequency([1, 2], [1, 2, 3])).toBe(false)",
      },
      {
        hidden: true,
        description: "detects a differing count of a repeated value",
        assertion: "expect(sameFrequency([1, 1, 2], [1, 2, 2])).toBe(false)",
      },
    ],
    hints: [
      "Build a count map for each array with reduce, then compare the two maps' entries.",
    ],
    solution: `function sameFrequency(a, b) {\n  if (a.length !== b.length) return false;\n  const countOf = (arr) => arr.reduce((counts, v) => ((counts[v] = (counts[v] ?? 0) + 1), counts), {});\n  const countsA = countOf(a);\n  const countsB = countOf(b);\n  return Object.keys(countsA).every((key) => countsA[key] === countsB[key]);\n}`,
    explanation:
      "Counting each array once (O(n)) and comparing counts avoids the O(n²) cost of comparing every pair directly.",
    relatedConcepts: ["Big O fundamentals", "Character Frequency"],
  },
  {
    slug: "two-sum",
    title: "Two Sum",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms", "arrays"],
    description:
      "Return the indices of the two numbers that add up to a target, using a single pass (not nested loops).",
    examples: ["twoSum([2,7,11,15], 9) → [0,1]"],
    starterCode: `function twoSum(numbers, target) {\n  // your code — aim for O(n)\n}`,
    tests: [
      {
        description: "finds the first matching pair",
        assertion: "expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])",
      },
      {
        description: "finds a pair not at the start",
        assertion: "expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])",
      },
      {
        hidden: true,
        description: "returns an empty array when no pair matches",
        assertion: "expect(twoSum([1, 2], 10)).toEqual([])",
      },
    ],
    hints: [
      "Track values you've already seen in a Map from value to index; check target - current before adding the current value.",
    ],
    solution: `function twoSum(numbers, target) {\n  const seen = new Map();\n  for (let i = 0; i < numbers.length; i++) {\n    const complement = target - numbers[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(numbers[i], i);\n  }\n  return [];\n}`,
    explanation:
      "This is the canonical interview question demonstrating trading O(n) extra space (a Map) for O(n) instead of O(n²) time.",
    relatedConcepts: ["Big O fundamentals", "Stacks, queues, maps & sets"],
  },
  {
    slug: "missing-number",
    title: "Missing Number",
    category: "Algorithms",
    difficulty: "medium",
    skills: ["algorithms"],
    description:
      "Given an array containing n distinct numbers from 0 to n, return the one number missing from the range.",
    examples: ["missingNumber([3,0,1]) → 2"],
    starterCode: `function missingNumber(numbers) {\n  // your code\n}`,
    tests: [
      {
        description: "finds a missing middle number",
        assertion: "expect(missingNumber([3, 0, 1])).toBe(2)",
      },
      {
        description: "finds a missing number at the end of the range",
        assertion: "expect(missingNumber([0, 1])).toBe(2)",
      },
      {
        hidden: true,
        description: "finds a missing number at the start of the range",
        assertion: "expect(missingNumber([1, 2])).toBe(0)",
      },
    ],
    hints: [
      "The sum of 0..n is n*(n+1)/2; subtract the actual sum of the array from it.",
    ],
    solution: `function missingNumber(numbers) {\n  const n = numbers.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = numbers.reduce((sum, x) => sum + x, 0);\n  return expectedSum - actualSum;\n}`,
    explanation:
      "Using the closed-form sum formula avoids sorting or building a lookup set entirely — O(n) time, O(1) extra space.",
    relatedConcepts: ["Sum Array", "Big O fundamentals"],
  },
];
