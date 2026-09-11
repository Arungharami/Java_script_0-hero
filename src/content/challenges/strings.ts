import type { ChallengeSeed } from "./shared";

export const strings: ChallengeSeed[] = [
  {
    slug: "reverse-a-string",
    title: "Reverse a String",
    category: "Strings",
    difficulty: "easy",
    skills: ["strings"],
    description: "Return the supplied text in reverse order.",
    examples: ['reverseString("hero") → "oreh"'],
    starterCode: `function reverseString(text) {\n  // your code\n}`,
    tests: [
      {
        description: "reverses a normal word",
        assertion: 'expect(reverseString("hero")).toBe("oreh")',
      },
      {
        description: "handles an empty string",
        assertion: 'expect(reverseString("")).toBe("")',
      },
      {
        description: "handles a string with spaces",
        assertion: 'expect(reverseString("go go")).toBe("og og")',
      },
      {
        hidden: true,
        description: "handles a single character",
        assertion: 'expect(reverseString("x")).toBe("x")',
      },
    ],
    hints: ["Split into characters, reverse the array, then join them back."],
    solution: `function reverseString(text) {\n  return text.split("").reverse().join("");\n}`,
    explanation:
      "split/reverse/join is the idiomatic three-step pipeline for reversing a string in JavaScript.",
    relatedConcepts: ["Strings & template literals"],
  },
  {
    slug: "count-characters",
    title: "Count Characters",
    category: "Strings",
    difficulty: "easy",
    skills: ["strings"],
    description:
      "Return the number of characters in a string, including spaces.",
    examples: ['countCharacters("hi there") → 8'],
    starterCode: `function countCharacters(text) {\n  // your code\n}`,
    tests: [
      {
        description: "counts a normal string",
        assertion: 'expect(countCharacters("hi there")).toBe(8)',
      },
      {
        description: "counts an empty string as zero",
        assertion: 'expect(countCharacters("")).toBe(0)',
      },
      {
        hidden: true,
        description: "counts a string with only spaces",
        assertion: 'expect(countCharacters("   ")).toBe(3)',
      },
    ],
    hints: ["Strings expose their length as a property, not a method."],
    solution: `function countCharacters(text) {\n  return text.length;\n}`,
    explanation:
      "The .length property already tracks character count — no loop needed.",
    relatedConcepts: ["Strings & template literals"],
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    category: "Strings",
    difficulty: "easy",
    skills: ["strings"],
    description: "Count vowels (a, e, i, o, u) regardless of letter case.",
    examples: ['countVowels("JavaScript") → 3'],
    starterCode: `function countVowels(text) {\n  // your code\n}`,
    tests: [
      {
        description: "counts vowels in a mixed-case word",
        assertion: 'expect(countVowels("JavaScript")).toBe(3)',
      },
      {
        description: "counts zero vowels",
        assertion: 'expect(countVowels("xyz")).toBe(0)',
      },
      {
        hidden: true,
        description: "counts vowels in an all-uppercase word",
        assertion: 'expect(countVowels("AEIOU")).toBe(5)',
      },
    ],
    hints: [
      "A case-insensitive regex like /[aeiou]/gi matched against the string gives you every vowel.",
    ],
    solution: `function countVowels(text) {\n  return (text.match(/[aeiou]/gi) ?? []).length;\n}`,
    explanation:
      "match() with a global, case-insensitive regex returns every vowel found, or null if none — the ?? [] guards that case.",
    relatedConcepts: ["Strings & template literals"],
  },
  {
    slug: "palindrome",
    title: "Palindrome Check",
    category: "Strings",
    difficulty: "medium",
    skills: ["strings", "algorithms"],
    description:
      "Ignore case and non-alphanumeric characters, then detect whether the text is a palindrome.",
    examples: [
      'isPalindrome("Never odd or even") → true',
      'isPalindrome("hello") → false',
    ],
    starterCode: `function isPalindrome(text) {\n  // your code\n}`,
    tests: [
      {
        description: "detects a palindrome phrase with spaces and case",
        assertion: 'expect(isPalindrome("Never odd or even")).toBe(true)',
      },
      {
        description: "rejects a non-palindrome",
        assertion: 'expect(isPalindrome("hello")).toBe(false)',
      },
      {
        description: "handles punctuation",
        assertion:
          'expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true)',
      },
      {
        hidden: true,
        description: "treats an empty string as a palindrome",
        assertion: 'expect(isPalindrome("")).toBe(true)',
      },
    ],
    hints: [
      "Strip non-alphanumeric characters and lowercase everything first, then compare it to its own reverse.",
    ],
    solution: `function isPalindrome(text) {\n  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === [...clean].reverse().join("");\n}`,
    explanation:
      "Normalizing before comparing (lowercase, strip punctuation) is the key step most naive attempts skip.",
    relatedConcepts: ["Strings & template literals", "Reverse a String"],
  },
  {
    slug: "capitalize-words",
    title: "Capitalize Words",
    category: "Strings",
    difficulty: "easy",
    skills: ["strings"],
    description: "Capitalize the first letter of every word in a sentence.",
    examples: ['capitalizeWords("hello there world") → "Hello There World"'],
    starterCode: `function capitalizeWords(text) {\n  // your code\n}`,
    tests: [
      {
        description: "capitalizes each word",
        assertion:
          'expect(capitalizeWords("hello there world")).toBe("Hello There World")',
      },
      {
        description: "handles a single word",
        assertion: 'expect(capitalizeWords("hero")).toBe("Hero")',
      },
      {
        hidden: true,
        description: "handles an already-capitalized word",
        assertion:
          'expect(capitalizeWords("JavaScript rocks")).toBe("JavaScript Rocks")',
      },
    ],
    hints: [
      "Split on spaces, map each word to its first letter uppercased plus the rest, then join with a space.",
    ],
    solution: `function capitalizeWords(text) {\n  return text\n    .split(" ")\n    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))\n    .join(" ");\n}`,
    explanation:
      "Each word is rebuilt from an uppercased first character plus the untouched remainder.",
    relatedConcepts: ["Strings & template literals", "map, filter & find"],
  },
  {
    slug: "remove-spaces",
    title: "Remove Spaces",
    category: "Strings",
    difficulty: "easy",
    skills: ["strings"],
    description: "Remove all whitespace from a string.",
    examples: ['removeSpaces("a b  c") → "abc"'],
    starterCode: `function removeSpaces(text) {\n  // your code\n}`,
    tests: [
      {
        description: "removes single spaces",
        assertion: 'expect(removeSpaces("a b c")).toBe("abc")',
      },
      {
        description: "removes multiple consecutive spaces",
        assertion: 'expect(removeSpaces("a  b")).toBe("ab")',
      },
      {
        hidden: true,
        description: "removes tabs and newlines too",
        assertion: 'expect(removeSpaces("a\\tb\\nc")).toBe("abc")',
      },
    ],
    hints: [
      "A global whitespace regex, /\\s+/g, replaced with an empty string removes every run of whitespace.",
    ],
    solution: `function removeSpaces(text) {\n  return text.replace(/\\s+/g, "");\n}`,
    explanation:
      "\\s matches any whitespace character; the g flag ensures every occurrence is replaced, not just the first.",
    relatedConcepts: ["Strings & template literals"],
  },
  {
    slug: "character-frequency",
    title: "Character Frequency",
    category: "Strings",
    difficulty: "medium",
    skills: ["strings", "objects"],
    description:
      "Return an object counting how many times each character appears in a string.",
    examples: ['characterFrequency("aab") → { a: 2, b: 1 }'],
    starterCode: `function characterFrequency(text) {\n  // your code\n}`,
    tests: [
      {
        description: "counts repeated characters",
        assertion: 'expect(characterFrequency("aab")).toEqual({ a: 2, b: 1 })',
      },
      {
        description: "counts every character once when unique",
        assertion:
          'expect(characterFrequency("abc")).toEqual({ a: 1, b: 1, c: 1 })',
      },
      {
        hidden: true,
        description: "handles an empty string",
        assertion: 'expect(characterFrequency("")).toEqual({})',
      },
    ],
    hints: [
      "Loop through each character, incrementing a counter object keyed by that character.",
    ],
    solution: `function characterFrequency(text) {\n  const counts = {};\n  for (const char of text) {\n    counts[char] = (counts[char] ?? 0) + 1;\n  }\n  return counts;\n}`,
    explanation:
      "The ?? 0 default lets you increment a key whether or not it has appeared yet, avoiding an undefined + 1 bug.",
    relatedConcepts: ["Objects & methods", "reduce, sort & analysis"],
  },
  {
    slug: "longest-word",
    title: "Longest Word",
    category: "Strings",
    difficulty: "medium",
    skills: ["strings", "arrays"],
    description: "Return the longest word in a sentence.",
    examples: ['longestWord("the quick brown fox") → "quick"'],
    starterCode: `function longestWord(sentence) {\n  // your code\n}`,
    tests: [
      {
        description: "finds the longest word",
        assertion: 'expect(longestWord("the quick brown fox")).toBe("quick")',
      },
      {
        description: "returns the first of equally long words",
        assertion: 'expect(longestWord("cat dog owl")).toBe("cat")',
      },
      {
        hidden: true,
        description: "handles a single-word sentence",
        assertion: 'expect(longestWord("hero")).toBe("hero")',
      },
    ],
    hints: [
      "Split on spaces, then reduce to keep whichever word is longer so far.",
    ],
    solution: `function longestWord(sentence) {\n  return sentence\n    .split(" ")\n    .reduce((longest, word) => (word.length > longest.length ? word : longest), "");\n}`,
    explanation:
      "reduce tracks the running 'best so far' the same way it would track a running total.",
    relatedConcepts: ["reduce, sort & analysis"],
  },
  {
    slug: "string-compression",
    title: "String Compression",
    category: "Strings",
    difficulty: "hard",
    skills: ["strings", "algorithms"],
    description:
      "Compress consecutive repeated characters, e.g. 'aaabcc' → 'a3b1c2'. Only compress runs of length 1+.",
    examples: [
      'stringCompress("aaabcc") → "a3b1c2"',
      'stringCompress("abc") → "a1b1c1"',
    ],
    starterCode: `function stringCompress(text) {\n  // your code\n}`,
    tests: [
      {
        description: "compresses repeated runs",
        assertion: 'expect(stringCompress("aaabcc")).toBe("a3b1c2")',
      },
      {
        description: "compresses a string with no repeats",
        assertion: 'expect(stringCompress("abc")).toBe("a1b1c1")',
      },
      {
        hidden: true,
        description: "compresses a single repeated character",
        assertion: 'expect(stringCompress("zzzz")).toBe("z4")',
      },
    ],
    hints: [
      "Walk the string tracking the current character and a run-length counter; flush the count when the character changes.",
    ],
    solution: `function stringCompress(text) {\n  let result = "";\n  let count = 1;\n  for (let i = 0; i < text.length; i++) {\n    if (text[i] === text[i + 1]) {\n      count++;\n    } else {\n      result += text[i] + count;\n      count = 1;\n    }\n  }\n  return result;\n}`,
    explanation:
      "A single pass with a running counter avoids building intermediate arrays — flush the run whenever the next character differs.",
    relatedConcepts: ["Loops & iteration", "Character Frequency"],
  },
  {
    slug: "anagram-checker",
    title: "Anagram Checker",
    category: "Strings",
    difficulty: "medium",
    skills: ["strings", "algorithms"],
    description:
      "Return true if two strings are anagrams of each other, ignoring case and spaces.",
    examples: [
      'isAnagram("listen", "silent") → true',
      'isAnagram("hello", "world") → false',
    ],
    starterCode: `function isAnagram(a, b) {\n  // your code\n}`,
    tests: [
      {
        description: "detects a valid anagram",
        assertion: 'expect(isAnagram("listen", "silent")).toBe(true)',
      },
      {
        description: "rejects a non-anagram",
        assertion: 'expect(isAnagram("hello", "world")).toBe(false)',
      },
      {
        description: "ignores case and spaces",
        assertion: 'expect(isAnagram("Dormitory", "Dirty Room")).toBe(true)',
      },
      {
        hidden: true,
        description: "rejects strings of different lengths",
        assertion: 'expect(isAnagram("abc", "abcd")).toBe(false)',
      },
    ],
    hints: [
      "Normalize both strings (lowercase, remove spaces), then compare their characters sorted.",
    ],
    solution: `function isAnagram(a, b) {\n  const normalize = (s) => [...s.toLowerCase().replace(/\\s/g, "")].sort().join("");\n  return normalize(a) === normalize(b);\n}`,
    explanation:
      "Two strings are anagrams exactly when their normalized, sorted characters are identical.",
    relatedConcepts: ["reduce, sort & analysis", "Palindrome Check"],
  },
];
