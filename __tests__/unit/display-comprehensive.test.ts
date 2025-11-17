import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import {
  display,
  displayError,
  displayJson,
  displayLines,
  displayOutput,
  displaySuccess,
} from "../../src/core/display";

/**
 * Comprehensive tests for display.ts module
 * Tests all display functions with various options
 */

describe("Display - Comprehensive Coverage", () => {
  describe("display", () => {
    it("should display message with default options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = display("Test message");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalledWith("\nℹ Test message");
      consoleSpy.mockRestore();
    });

    it("should display message with info type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = display("Info message", { type: "info" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display message with custom prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = display("Custom prefix message", { prefix: "▶" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("▶"));
      consoleSpy.mockRestore();
    });

    it("should display message without newline", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = display("No newline", { newline: false });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayOutput", () => {
    it("should output message with default type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayOutput("Output message");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should output message with success type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayOutput("Success", "success");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("✓"));
      consoleSpy.mockRestore();
    });

    it("should output message with error type", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const program = displayOutput("Error", "error");
      await Effect.runPromise(program);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("✗")
      );
      consoleErrorSpy.mockRestore();
    });

    it("should apply style options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayOutput("Styled message", "info", {
        style: { color: "red", bold: true },
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayLines", () => {
    it("should display single line", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayLines(["Line 1"]);
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display multiple lines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayLines(["Line 1", "Line 2", "Line 3"]);
      await Effect.runPromise(program);

      expect(consoleSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
      consoleSpy.mockRestore();
    });

    it("should display empty lines array", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayLines([]);
      await Effect.runPromise(program);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display lines with type option", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayLines(["Line 1", "Line 2"], { type: "success" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display lines with custom prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayLines(["Item 1", "Item 2"], { prefix: "→" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayJson", () => {
    it("should display JSON with default options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ name: "Test", value: 123 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("name");
      expect(output).toContain("Test");

      consoleSpy.mockRestore();
    });

    it("should display JSON with custom spacing", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ a: 1, b: 2 }, { spaces: 4 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display JSON without prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ test: "data" }, { showPrefix: false });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display JSON with success type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ status: "ok" }, { type: "success" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display JSON with error type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ error: "Failed" }, { type: "error" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display array as JSON", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson([1, 2, 3, 4, 5]);
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display nested JSON", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({
        user: {
          name: "Test",
          address: {
            city: "Boston",
          },
        },
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should handle null and undefined values", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displayJson({ a: null, b: undefined });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displaySuccess", () => {
    it("should display success message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displaySuccess("Operation completed!");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalledWith("\n✓ Operation completed!");
      consoleSpy.mockRestore();
    });

    it("should display success with custom prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displaySuccess("Done", { prefix: "✔" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display success without newline", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = displaySuccess("Success", { newline: false });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayError", () => {
    it("should display error message", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const program = displayError("Operation failed!");
      await Effect.runPromise(program);

      expect(consoleErrorSpy).toHaveBeenCalledWith("\n✗ Operation failed!");
      consoleErrorSpy.mockRestore();
    });

    it("should display error with custom prefix", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const program = displayError("Failed", { prefix: "❌" });
      await Effect.runPromise(program);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it("should display error without newline", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const program = displayError("Error", { newline: false });
      await Effect.runPromise(program);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Complex Display Scenarios", () => {
    it("should compose multiple display calls", async () => {
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const program = Effect.gen(function* () {
        yield* display("Starting process...");
        yield* displaySuccess("Step 1 complete");
        yield* displayError("Step 2 failed");
        yield* displayJson({ result: "partial" });
      });

      await Effect.runPromise(program);

      expect(
        consoleLogSpy.mock.calls.length + consoleErrorSpy.mock.calls.length
      ).toBeGreaterThanOrEqual(4);
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should display structured workflow output", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const program = Effect.gen(function* () {
        yield* displayLines(["Building...", "Testing...", "Deploying..."]);
        yield* displayJson(
          { status: "deployed", version: "1.0.0" },
          { type: "success" }
        );
      });

      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
