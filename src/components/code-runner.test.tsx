import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeRunner } from "./code-runner";
import type { TestCase } from "@/types/learning";

const tests: TestCase[] = [
  { description: "handles normal input", assertion: "expect(1).toBe(1)" },
  { description: "handles punctuation", assertion: "expect(1).toBe(2)" },
];

class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  postMessage() {
    queueMicrotask(() => {
      this.onmessage?.({
        data: {
          console: [],
          tests: [
            {
              description: "handles normal input",
              hidden: false,
              passed: true,
            },
            {
              description: "handles punctuation",
              hidden: false,
              passed: false,
              expected: '"hello"',
              received: '"Hello"',
            },
          ],
        },
      } as MessageEvent);
    });
  }
  terminate() {}
}

describe("CodeRunner", () => {
  beforeEach(() => {
    vi.stubGlobal("Worker", MockWorker);
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reports pass/fail counts and expected/received for a visible failure", async () => {
    const onTestResult = vi.fn();
    render(
      <CodeRunner
        initialCode="function id(x) { return x; }"
        tests={tests}
        onTestResult={onTestResult}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /run tests/i }));

    await waitFor(() =>
      expect(screen.getByText("1 / 2 passed")).toBeInTheDocument(),
    );
    expect(screen.getByText("handles normal input")).toBeInTheDocument();
    expect(screen.getByText("handles punctuation")).toBeInTheDocument();
    expect(screen.getByText('"hello"')).toBeInTheDocument();
    expect(screen.getByText('"Hello"')).toBeInTheDocument();
    expect(onTestResult).toHaveBeenCalledWith(
      expect.objectContaining({ passed: 1, total: 2 }),
    );
  });

  it("only shows a Run Tests button when tests are provided", () => {
    render(<CodeRunner initialCode="console.log(1)" />);
    expect(
      screen.queryByRole("button", { name: /run tests/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /run code/i }),
    ).toBeInTheDocument();
  });
});
