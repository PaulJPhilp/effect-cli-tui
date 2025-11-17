import * as Effect from "effect/Effect";
import { describe, expect, it, vi } from "vitest";
import {
  display,
  displayError,
  displayJson,
  displayLines,
  displaySuccess,
  EffectCLI,
  TUIHandler,
} from "../src/index";

describe("effect-cli-tui Integration", () => {
  describe("TUIHandler - Display Messages", () => {
    it("should display success message", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Success!", "success");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("✓"));
      consoleSpy.mockRestore();
    });

    it("should display error message", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Error!", "error");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("✗"));
      consoleSpy.mockRestore();
    });

    it("should display info message", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Info", "info");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("ℹ"));
      consoleSpy.mockRestore();
    });
  });

  describe("Display API", () => {
    it("display should output with info prefix by default", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(display("Test message"));
      expect(consoleSpy).toHaveBeenCalledWith("\nℹ Test message");
      consoleSpy.mockRestore();
    });

    it("display should output with success prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(display("Success!", { type: "success" }));
      expect(consoleSpy).toHaveBeenCalledWith("\n✓ Success!");
      consoleSpy.mockRestore();
    });

    it("display should output with error prefix", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await Effect.runPromise(display("Error!", { type: "error" }));
      expect(consoleErrorSpy).toHaveBeenCalledWith("\n✗ Error!");
      consoleErrorSpy.mockRestore();
    });

    it("display should support custom prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(display("Custom", { prefix: ">>>" }));
      expect(consoleSpy).toHaveBeenCalledWith("\n>>> Custom");
      consoleSpy.mockRestore();
    });

    it("display should support newline option", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(display("No newline", { newline: false }));
      expect(consoleSpy).toHaveBeenCalledWith("ℹ No newline");
      consoleSpy.mockRestore();
    });

    it("displayLines should output multiple lines with prefixes", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(
        displayLines(["Line 1", "Line 2"], { type: "info" })
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(1, "\nℹ Line 1");
      expect(consoleSpy).toHaveBeenNthCalledWith(2, "\nℹ Line 2");
      consoleSpy.mockRestore();
    });

    it("displayJson should format JSON correctly", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const data = { key: "value", num: 42 };
      await Effect.runPromise(displayJson(data, { spaces: 2 }));
      const output = consoleSpy.mock.calls[0][0] as string;
      expect(output).toContain("ℹ");
      expect(output).toContain('"key": "value"');
      expect(output).toContain('"num": 42');
      consoleSpy.mockRestore();
    });

    it("displayJson should support custom spaces", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const data = { test: true };
      await Effect.runPromise(displayJson(data, { spaces: 4 }));
      const output = consoleSpy.mock.calls[0][0] as string;
      expect(output).toContain("ℹ");
      expect(output).toContain('"test": true');
      expect(output).toContain("    "); // 4 spaces indentation
      consoleSpy.mockRestore();
    });

    it("displayJson should support prefix option", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const data = { msg: "hello" };
      await Effect.runPromise(displayJson(data, { showPrefix: false }));
      expect(consoleSpy).toHaveBeenCalledWith('\n{\n  "msg": "hello"\n}');
      consoleSpy.mockRestore();
    });

    it("displaySuccess should be equivalent to display with success type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await Effect.runPromise(displaySuccess("Done!"));
      expect(consoleSpy).toHaveBeenCalledWith("\n✓ Done!");
      consoleSpy.mockRestore();
    });

    it("displayError should be equivalent to display with error type", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await Effect.runPromise(displayError("Failed!"));
      expect(consoleErrorSpy).toHaveBeenCalledWith("\n✗ Failed!");
      consoleErrorSpy.mockRestore();
    });

    it("all display functions should return Effect<void, never, never>", async () => {
      const successEffect = displaySuccess("test");
      const errorEffect = displayError("test");
      const displayEffect = display("test");
      const linesEffect = displayLines(["test"]);
      const jsonEffect = displayJson({ test: true });

      expect(successEffect).toBeDefined();
      expect(errorEffect).toBeDefined();
      expect(displayEffect).toBeDefined();
      expect(linesEffect).toBeDefined();
      expect(jsonEffect).toBeDefined();

      // Should run without errors
      await Effect.runPromise(successEffect);
      await Effect.runPromise(errorEffect);
      await Effect.runPromise(displayEffect);
      await Effect.runPromise(linesEffect);
      await Effect.runPromise(jsonEffect);
    });
  });

  describe("EffectCLI - Integration", () => {
    it("should be instantiable", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return {
          hasRun: typeof cli.run === "function",
          hasStream: typeof cli.stream === "function",
        };
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasRun).toBe(true);
      expect(result.hasStream).toBe(true);
    });

    it("should return Effect.Effect type", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = cli.run("echo", ["test"]);
        return result !== undefined;
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });
  });
});
