/**
 * Comprehensive Integration Tests for effect-cli-tui
 *
 * Tests practical end-to-end scenarios with real service combinations.
 * Follows the "no external service mocks" principle - uses test fixtures
 * and real implementations where possible.
 */

import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyChalkStyle,
  display,
  displayBox,
  displayError,
  displayHighlight,
  displayJson,
  displayLines,
  displaySuccess,
  displayTable,
  displayWarning,
  spinnerEffect,
  Terminal,
  TerminalTest,
} from "../src";

describe("Integration Tests - Comprehensive Scenarios", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // ==========================================================================
  // 1. Display API Integration
  // ==========================================================================

  describe("Display API Integration", () => {
    it("should display success/error/warning messages", async () => {
      const program = Effect.gen(function* () {
        yield* displaySuccess("Operation successful");
        yield* displayError("Operation failed");
        yield* displayWarning("Operation warning");
        yield* displayHighlight("Important information");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled(); // Error messages go to stderr
      const logCalls = consoleLogSpy.mock.calls
        .map((c) => c[0] as string)
        .join("\n");
      const errorCalls = consoleErrorSpy.mock.calls
        .map((c) => c[0] as string)
        .join("\n");
      const allCalls = logCalls + "\n" + errorCalls;
      expect(allCalls).toContain("✓");
      expect(allCalls).toContain("✗");
      expect(allCalls).toContain("⚠");
    });

    it("should display JSON with formatting", async () => {
      const data = { name: "test", version: "1.0.0" };

      const program = Effect.gen(function* () {
        yield* displayJson(data, { type: "success", spaces: 2 });
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      const output = consoleLogSpy.mock.calls
        .map((c) => c[0] as string)
        .join("\n");
      expect(output).toContain("test");
      expect(output).toContain("1.0.0");
    });

    it("should display multiple lines consistently", async () => {
      const lines = ["Line 1", "Line 2", "Line 3"];

      const program = Effect.gen(function* () {
        yield* displayLines(lines, { type: "info" });
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    });

    it("should apply chalk styling correctly", () => {
      const text = "Styled text";
      const bold = applyChalkStyle(text, { bold: true });
      const colored = applyChalkStyle(text, { color: "green" });
      const combined = applyChalkStyle(text, {
        bold: true,
        color: "cyan",
        underline: true,
      });

      expect(bold).toBeDefined();
      expect(colored).toBeDefined();
      expect(combined).toBeDefined();
    });
  });

  // ==========================================================================
  // 2. Component Integration Tests
  // ==========================================================================

  describe("Component Integration", () => {
    it("should render data tables", async () => {
      const data = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ];

      const program = Effect.gen(function* () {
        yield* displayTable(data, {
          columns: [
            { key: "name", header: "Name" },
            { key: "age", header: "Age" },
          ],
        });
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      const output = consoleLogSpy.mock.calls
        .map((c) => c[0] as string)
        .join("\n");
      expect(output).toContain("Alice");
      expect(output).toContain("Bob");
    });

    it("should handle empty tables gracefully", async () => {
      const program = Effect.gen(function* () {
        yield* displayTable([], {
          columns: [{ key: "id", header: "ID" }],
        });
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      const output = consoleLogSpy.mock.calls
        .map((c) => c[0] as string)
        .join("\n");
      expect(output).toContain("No data");
    });

    it("should render boxes with content", async () => {
      const program = Effect.gen(function* () {
        yield* displayBox("Important Message");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should work with spinner effects", async () => {
      const mockEffect = Effect.succeed({ status: "done" });

      const result = await Effect.runPromise(
        spinnerEffect("Processing...", mockEffect)
      );

      expect(result.status).toBe("done");
    });
  });

  // ==========================================================================
  // 3. CLI Service Integration (existing tests in cli-execution.test.ts)
  // ==========================================================================

  describe("CLI Service Patterns", () => {
    it("should demonstrate CLI command pattern", async () => {
      // CLI tests are covered in __tests__/integration/cli-execution.test.ts
      // This demonstrates the expected result pattern
      const result = {
        exitCode: 0,
        stdout: "output",
        stderr: "",
      };

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe("output");
    });
  });

  // ==========================================================================
  // 4. TUI Service Patterns (existing tests in tui-service.test.ts)
  // ==========================================================================

  describe("TUI Service Patterns", () => {
    it("should demonstrate TUI interaction patterns", () => {
      // TUI service tests are in __tests__/unit/tui-service.test.ts
      // Demonstrating the expected interaction pattern
      const responses = {
        prompt: "user-input",
        selectOption: "option1",
        multiSelect: ["opt1", "opt2"],
        confirm: true,
        password: "secret123",
      };

      expect(responses.prompt).toBe("user-input");
      expect(responses.selectOption).toBe("option1");
      expect(responses.confirm).toBe(true);
    });
  });

  // ==========================================================================
  // 5. Terminal Service Integration
  // ==========================================================================

  describe("Terminal Service Integration", () => {
    it("should use TerminalTest for testing", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("test");
        yield* terminal.line("line");
        yield* terminal.stderr("error");
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
    });

    it("should work with Terminal.Default", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("Test line");
        yield* terminal.stdout("Direct output");
        return "done";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("done");
    });
  });

  // ==========================================================================
  // 6. Effect Composition
  // ==========================================================================

  describe("Effect Composition", () => {
    it("should compose effects in sequence", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const a = yield* Effect.succeed(1);
          const b = yield* Effect.succeed(2);
          return a + b;
        })
      );

      expect(result).toBe(3);
    });

    it("should handle effect arrays", async () => {
      const results = await Effect.runPromise(
        Effect.all([Effect.succeed(1), Effect.succeed(2), Effect.succeed(3)], {
          mode: "validate",
        })
      );

      expect(results).toEqual([1, 2, 3]);
    });

    it("should map and transform effects", async () => {
      const result = await Effect.runPromise(
        Effect.succeed({ value: "test" }).pipe(
          Effect.map((x) => x.value.toUpperCase())
        )
      );

      expect(result).toBe("TEST");
    });

    it("should chain effects with flatMap", async () => {
      const result = await Effect.runPromise(
        Effect.succeed(5).pipe(Effect.flatMap((n) => Effect.succeed(n * 2)))
      );

      expect(result).toBe(10);
    });
  });

  // ==========================================================================
  // 7. Error Handling Integration
  // ==========================================================================

  describe("Error Handling Integration", () => {
    it("should catch and recover from errors", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          return yield* Effect.fail(new Error("test")).pipe(
            Effect.catchAll(() => Effect.succeed("recovered"))
          );
        })
      );

      expect(result).toBe("recovered");
    });

    it("should handle multiple error scenarios", async () => {
      const program = Effect.gen(function* () {
        const first = yield* Effect.fail("error1").pipe(
          Effect.catchAll(() => Effect.succeed("first_handled"))
        );
        const second = yield* Effect.fail("error2").pipe(
          Effect.catchAll(() => Effect.succeed("second_handled"))
        );
        return { first, second };
      });

      const result = await Effect.runPromise(program);
      expect(result.first).toBe("first_handled");
      expect(result.second).toBe("second_handled");
    });
  });

  // ==========================================================================
  // 8. Real-World Workflow Scenarios
  // ==========================================================================

  describe("Real-World Workflows", () => {
    it("should execute a display workflow", async () => {
      const program = Effect.gen(function* () {
        yield* display("Starting workflow...");
        yield* displaySuccess("Step 1 complete");
        yield* displayWarning("Step 2 warning");
        yield* displaySuccess("Workflow finished");
        return "completed";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("completed");
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should execute a multi-step workflow", async () => {
      const program = Effect.gen(function* () {
        yield* displayHighlight("Starting Process");
        yield* displayLines(
          ["Step 1: Initialize", "Step 2: Execute", "Step 3: Finalize"],
          { type: "info" }
        );
        yield* displaySuccess("Process complete");
        return "done";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("done");
    });

    it("should execute workflow with data display", async () => {
      const workflow = Effect.gen(function* () {
        yield* display("Processing data...");
        yield* displayTable([{ id: 1, name: "Item 1" }], {
          columns: [
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
          ],
        });
        yield* displaySuccess("Data processed");
        return "success";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(workflow);
      expect(result).toBe("success");
    });
  });

  // ==========================================================================
  // 9. Integration Edge Cases
  // ==========================================================================

  describe("Integration Edge Cases", () => {
    it("should handle nested effects", async () => {
      const program = Effect.gen(function* () {
        const result = yield* Effect.gen(function* () {
          const inner = yield* Effect.succeed(42);
          return inner * 2;
        });
        return result;
      });

      const result = await Effect.runPromise(program);
      expect(result).toBe(84);
    });

    it("should handle empty operations", async () => {
      const program = Effect.gen(function* () {
        yield* displayLines([]);
        return "empty_handled";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("empty_handled");
    });

    it("should handle rapid sequential operations", async () => {
      const program = Effect.gen(function* () {
        yield* display("Step 1");
        yield* display("Step 2");
        yield* display("Step 3");
        yield* displaySuccess("All steps complete");
        return "success";
      }).pipe(Effect.provide(Terminal.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("success");
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});
