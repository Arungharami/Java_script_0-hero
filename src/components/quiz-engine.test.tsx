import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Providers } from "./providers";
import { QuizEngine } from "./quiz-engine";
import type { QuizQuestion } from "@/types/learning";

const questions: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    skill: "variables",
    question: "Which declaration is immutable?",
    options: ["let", "const"],
    answer: 1,
    explanation: "const prevents reassignment.",
  },
];

describe("QuizEngine", () => {
  it("reveals an explanation after checking", () => {
    render(
      <Providers>
        <QuizEngine id="test" questions={questions} />
      </Providers>,
    );
    fireEvent.click(screen.getByText("B. const"));
    fireEvent.click(screen.getByText("Check answer"));
    expect(
      screen.getByText("const prevents reassignment."),
    ).toBeInTheDocument();
  });

  it("shows a passing result after finishing all questions", () => {
    render(
      <Providers>
        <QuizEngine id="test-2" questions={questions} />
      </Providers>,
    );
    fireEvent.click(screen.getByText("B. const"));
    fireEvent.click(screen.getByText("Check answer"));
    fireEvent.click(screen.getByText("See results"));
    expect(screen.getByText("Checkpoint passed")).toBeInTheDocument();
  });
});
