import { createCustomTerminal, Terminal, TerminalTest } from "@core/terminal";
import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";

/**
 * Comprehensive tests for terminal.ts module
 * Tests Terminal service with various terminal operations
 */

describe("Terminal Service - Comprehensive Coverage", () => {
  describe("Terminal.Default - stdout", () => {
    it("should write to stdout without newline", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("test output");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("test output");

      stdoutSpy.mockRestore();
    });

    it("should write multiple stdout calls", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("line1");
        yield* terminal.stdout("line2");
        yield* terminal.stdout("line3");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy.mock.calls.length).toBeGreaterThanOrEqual(3);

      stdoutSpy.mockRestore();
    });

    it("should handle empty stdout", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("");

      stdoutSpy.mockRestore();
    });
  });

  describe("Terminal.Default - stderr", () => {
    it("should write to stderr without newline", async () => {
      const stderrSpy = vi
        .spyOn(process.stderr, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stderr("error output");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stderrSpy).toHaveBeenCalledWith("error output");

      stderrSpy.mockRestore();
    });

    it("should write multiple stderr calls", async () => {
      const stderrSpy = vi
        .spyOn(process.stderr, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stderr("error1");
        yield* terminal.stderr("error2");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stderrSpy.mock.calls.length).toBeGreaterThanOrEqual(2);

      stderrSpy.mockRestore();
    });
  });

  describe("Terminal.Default - line", () => {
    it("should write line with newline", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("test line");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith("test line");

      consoleSpy.mockRestore();
    });

    it("should write multiple lines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("line 1");
        yield* terminal.line("line 2");
        yield* terminal.line("line 3");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleSpy.mock.calls.length).toBeGreaterThanOrEqual(3);

      consoleSpy.mockRestore();
    });

    it("should handle empty line", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("");
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith("");

      consoleSpy.mockRestore();
    });
  });

  describe("Terminal.Default - Terminal Control", () => {
    it("should clear line with ANSI escape", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.clearLine();
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[K");

      stdoutSpy.mockRestore();
    });

    it("should carriage return", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.carriageReturn();
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("\r");

      stdoutSpy.mockRestore();
    });

    it("should hide cursor", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.hideCursor();
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[?25l");

      stdoutSpy.mockRestore();
    });

    it("should show cursor", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.showCursor();
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[?25h");

      stdoutSpy.mockRestore();
    });
  });

  describe("TerminalTest - In-Memory Capture", () => {
    it("should capture stdout writes", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("captured");
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
      // Should not throw
    });

    it("should capture stderr writes", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stderr("error captured");
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
      // Should not throw
    });

    it("should capture line writes", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("line captured");
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
      // Should not throw
    });

    it("should capture multiple operations", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("out1");
        yield* terminal.stderr("err1");
        yield* terminal.line("line1");
        yield* terminal.clearLine();
        yield* terminal.hideCursor();
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
      // Should not throw and all operations should be recorded
    });

    it("should capture terminal control sequences", async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.hideCursor();
        yield* terminal.clearLine();
        yield* terminal.carriageReturn();
        yield* terminal.showCursor();
      }).pipe(Effect.provide(TerminalTest));

      await Effect.runPromise(program);
      // Should not throw
    });
  });

  describe("createCustomTerminal", () => {
    it("should write to custom stdout function", async () => {
      const outputs: string[] = [];
      const customTerminal = createCustomTerminal((text) => outputs.push(text));

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("test");
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(outputs).toContain("test");
    });

    it("should write to custom stderr function", async () => {
      const errors: string[] = [];
      const customTerminal = createCustomTerminal(
        () => {
          /* Mock implementation - no-op */
        },
        (text) => errors.push(text)
      );

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stderr("error message");
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(errors).toContain("error message");
    });

    it("should fall back to stdout if stderr not provided", async () => {
      const outputs: string[] = [];
      const customTerminal = createCustomTerminal((text) => outputs.push(text));

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stderr("fallback");
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(outputs).toContain("fallback");
    });

    it("should write lines with newline", async () => {
      const outputs: string[] = [];
      const customTerminal = createCustomTerminal((text) => outputs.push(text));

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.line("test line");
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(outputs[0]).toBe("test line\n");
    });

    it("should handle all terminal control operations", async () => {
      const outputs: string[] = [];
      const customTerminal = createCustomTerminal((text) => outputs.push(text));

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.hideCursor();
        yield* terminal.clearLine();
        yield* terminal.carriageReturn();
        yield* terminal.showCursor();
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(outputs).toContain("\x1B[?25l");
      expect(outputs).toContain("\x1B[K");
      expect(outputs).toContain("\r");
      expect(outputs).toContain("\x1B[?25h");
    });
  });

  describe("Complex Output Workflows", () => {
    it("should compose multiple output operations", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.hideCursor();
        yield* terminal.line("Processing...");
        yield* terminal.stdout("\rProgress: ");
        yield* terminal.clearLine();
        yield* terminal.line("Done!");
        yield* terminal.showCursor();
      }).pipe(Effect.provide(Terminal.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalled();
      expect(stdoutSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      stdoutSpy.mockRestore();
    });

    it("should work with custom output in complex workflow", async () => {
      const operations: string[] = [];
      const customTerminal = createCustomTerminal(
        (text) => operations.push(`stdout: ${text}`),
        (text) => operations.push(`stderr: ${text}`)
      );

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal;
        yield* terminal.stdout("start");
        yield* terminal.line("middle");
        yield* terminal.stderr("error");
        yield* terminal.stdout("end");
      }).pipe(Effect.provide(customTerminal));

      await Effect.runPromise(program);
      expect(operations.length).toBeGreaterThanOrEqual(4);
    });
  });
});
