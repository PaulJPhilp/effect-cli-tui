import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { EffectCLI } from "@/cli";
import {
  createMockCLI,
  MockCLI,
  MockCLIFailure,
  MockCLITimeout,
} from "../fixtures/test-layers";

/**
 * Integration tests for EffectCLI service.
 *
 * Tests both mock and real command execution to ensure:
 * - Commands execute successfully
 * - Output is captured correctly
 * - Errors are handled properly
 * - Resources are cleaned up
 * - Timeouts work as expected
 */

describe("EffectCLI Integration Tests", () => {
  describe("Mock CLI Execution", () => {
    it("should execute mock command successfully", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("test-command");
        return result;
      }).pipe(Effect.provide(MockCLI));

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("successful");
      expect(result.stderr).toBe("");
    });

    it("should handle mock command failure", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return yield* cli
          .run("failing-command")
          .pipe(
            Effect.catchTag("CLIError", (errorFromCli) =>
              Effect.succeed(errorFromCli)
            )
          );
      }).pipe(Effect.provide(MockCLIFailure));

      const cliError = await Effect.runPromise(program);
      expect(cliError.reason).toBe("CommandFailed");
      expect(cliError.message).toContain("exit code 1");
    });

    it("should handle mock timeout", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return yield* cli
          .run("slow-command")
          .pipe(
            Effect.catchTag("CLIError", (errorFromCli) =>
              Effect.succeed(errorFromCli)
            )
          );
      }).pipe(Effect.provide(MockCLITimeout));

      const cliError = await Effect.runPromise(program);
      expect(cliError.reason).toBe("Timeout");
      expect(cliError.message).toContain("timed out");
    });

    it("should use custom mock response", async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: "Custom output from mock",
        stderr: "",
      });

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return yield* cli.run("custom");
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result.stdout).toBe("Custom output from mock");
    });
  });

  // Real command execution tests have been moved to cli-execution-real.test.ts
  // to prevent resource contention when running the full test suite.
  // Run them separately with: bun test __tests__/integration/cli-execution-real.test.ts

  describe("Service Interface Completeness", () => {
    it("should provide run and stream methods", async () => {
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

    it("should return Effect from CLI methods", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const runEffect = cli.run("echo", ["test"]);
        const streamEffect = cli.stream("echo", ["test"]);
        return {
          runIsEffect: runEffect && typeof runEffect === "object",
          streamIsEffect: streamEffect && typeof streamEffect === "object",
        };
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.runIsEffect).toBe(true);
      expect(result.streamIsEffect).toBe(true);
    });
  });
});
