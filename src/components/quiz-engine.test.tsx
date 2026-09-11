import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Providers } from "./providers";
import { QuizEngine } from "./quiz-engine";
const questions = [
  {
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
});
