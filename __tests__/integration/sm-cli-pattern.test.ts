import * as Effect from "effect/Effect";
import { describe, expect, it, vi } from "vitest";
import {
  display,
  displayError,
  displayJson,
  displayLines,
  displaySuccess,
} from "../../src/core/display";

describe("SM-CLI Integration Patterns", () => {
  describe("Real-world CLI Usage", () => {
    it("should support project information display pattern", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const projectInfo = Effect.gen(function* (_) {
        yield* _(display("Project Information"));
        yield* _(
          displayLines([
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "Active Project: effect-patterns",
            "API Key: Configured",
            "Environment: development",
          ])
        );
      });

      await Effect.runPromise(projectInfo);

      expect(consoleSpy).toHaveBeenNthCalledWith(1, "\nℹ Project Information");
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "\nℹ ━━━━━━━━━━━━━━━━━━━━━━━━━━"
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        3,
        "\nℹ Active Project: effect-patterns"
      );
      consoleSpy.mockRestore();
    });

    it("should support JSON data display for API responses", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const apiResponse = {
        status: "success",
        data: {
          project: "effect-patterns",
          version: "1.0.0",
          features: ["typescript", "effect", "testing"],
        },
      };

      await Effect.runPromise(displayJson(apiResponse));

      // displayJson formats with prefix on first line and indentation on subsequent lines
      const expectedJson = JSON.stringify(apiResponse, null, 2);
      const output = consoleSpy.mock.calls[0][0] as string;
      expect(output).toContain("ℹ");
      expect(output).toContain('"status": "success"');
      expect(output).toContain('"project": "effect-patterns"');
      consoleSpy.mockRestore();
    });

    it("should support success/error messaging patterns", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const operationResult = Effect.gen(function* (_) {
        yield* _(display("Connecting to database..."));
        yield* _(displaySuccess("Database connection established"));

        // Simulate error
        yield* _(display("Processing payment..."));
        yield* _(displayError("Payment processing failed: Insufficient funds"));
      });

      await Effect.runPromise(operationResult);

      // Theme colors are applied, so check for content rather than exact matches
      const logCalls = consoleSpy.mock.calls.map((call) => call[0] as string);
      const errorCalls = consoleErrorSpy.mock.calls.map(
        (call) => call[0] as string
      );
      const allCalls = [...logCalls, ...errorCalls];

      expect(
        allCalls.some(
          (call) =>
            call.includes("ℹ") && call.includes("Connecting to database...")
        )
      ).toBe(true);
      expect(
        allCalls.some(
          (call) =>
            call.includes("✓") &&
            call.includes("Database connection established")
        )
      ).toBe(true);
      expect(
        allCalls.some(
          (call) =>
            call.includes("ℹ") && call.includes("Processing payment...")
        )
      ).toBe(true);
      expect(
        allCalls.some(
          (call) =>
            call.includes("✗") &&
            call.includes("Payment processing failed: Insufficient funds")
        )
      ).toBe(true);

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should work with @effect/cli command patterns", async () => {
      // This test demonstrates how the display functions integrate
      // with Effect CLI commands (simulated here)

      const mockCommand = Effect.gen(function* (_) {
        // Simulate CLI command flow
        yield* _(display("Initializing CLI command..."));
        yield* _(
          displayLines([
            "Command: deploy",
            "Environment: production",
            "Version: 1.2.3",
          ])
        );

        // Simulate successful operation
        yield* _(displaySuccess("Deployment completed successfully"));

        // Return mock result
        return { exitCode: 0, output: "Deployed v1.2.3" };
      });

      const result = await Effect.runPromise(mockCommand);
      expect(result.exitCode).toBe(0);
      expect(result.output).toBe("Deployed v1.2.3");
    });

    it("should support custom formatting for advanced CLI output", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const customOutput = Effect.gen(function* (_) {
        // Custom prefix for logs
        yield* _(display("Starting process...", { prefix: "▶️ " }));

        // Multi-line status with custom type
        yield* _(
          displayLines(
            [
              "System Status Report",
              "════════════════════",
              "CPU: 45%",
              "Memory: 2.1GB/8GB",
              "Disk: 120GB free",
            ],
            { type: "info" }
          )
        );

        // JSON without prefix for clean output
        const metrics = { responseTime: 120, throughput: 1500 };
        yield* _(displayJson(metrics, { showPrefix: false, spaces: 4 }));

        yield* _(displaySuccess("Process completed"));
      });

      await Effect.runPromise(customOutput);

      // Theme colors are applied, so check for content rather than exact matches
      const calls = consoleSpy.mock.calls.map((call) => call[0] as string);
      expect(
        calls.some(
          (call) => call.includes("▶️") && call.includes("Starting process...")
        )
      ).toBe(true);
      expect(
        calls.some(
          (call) => call.includes("ℹ") && call.includes("System Status Report")
        )
      ).toBe(true);

      // JSON output - verify it contains the expected data
      const jsonCall = consoleSpy.mock.calls.find(
        (call) =>
          call[0] &&
          typeof call[0] === "string" &&
          call[0].includes("responseTime")
      );
      expect(jsonCall).toBeDefined();
      if (jsonCall) {
        const jsonOutput = jsonCall[0] as string;
        expect(jsonOutput).toContain("responseTime");
        expect(jsonOutput).toContain("120");
        expect(jsonOutput).toContain("throughput");
        expect(jsonOutput).toContain("1500");
      }
      consoleSpy.mockRestore();
    });

    it("should handle newline control for inline messages", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const inlineMessages = Effect.gen(function* (_) {
        yield* _(display("Processing", { newline: false }));
        yield* _(display("... Done!", { newline: false }));
        yield* _(display("", { newline: true })); // Just a newline
        yield* _(displaySuccess("All operations completed"));
      });

      await Effect.runPromise(inlineMessages);

      // Theme colors are applied, so check for content rather than exact matches
      const calls = consoleSpy.mock.calls.map((call) => call[0] as string);
      expect(
        calls.some(
          (call) =>
            call.includes("ℹ") &&
            call.includes("Processing") &&
            !call.startsWith("\n")
        )
      ).toBe(true);
      expect(
        calls.some(
          (call) =>
            call.includes("ℹ") &&
            call.includes("... Done!") &&
            !call.startsWith("\n")
        )
      ).toBe(true);
      // Empty message with newline outputs '\nℹ ' (prefix + space)
      expect(
        calls.some(
          (call) =>
            call.includes("ℹ") && call.startsWith("\n") && call.trim() === "ℹ"
        )
      ).toBe(true);
      expect(
        calls.some(
          (call) =>
            call.includes("✓") && call.includes("All operations completed")
        )
      ).toBe(true);
      consoleSpy.mockRestore();
    });
  });
});
