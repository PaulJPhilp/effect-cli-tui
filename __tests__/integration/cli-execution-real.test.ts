import { Effect } from "effect";
import { beforeEach, describe, expect, it } from "vitest";

import { EffectCLI } from "@/cli";

/**
 * Real Command Execution Tests
 *
 * These tests execute actual CLI commands and are isolated from the main test suite
 * to prevent resource contention when running all tests together.
 *
 * Run these tests separately with:
 *   bun test __tests__/integration/cli-execution-real.test.ts
 *
 * These tests are SKIPPED in CI/full test runs due to resource contention.
 * Set RUN_CLI_INTEGRATION=true to force running them.
 */

// Skip when running full test suite (unless explicitly enabled)
// The detection checks if we're running this specific file
const isRunningThisFileDirectly = process.argv.some(
  (arg) =>
    arg.includes("cli-execution-real") ||
    arg.endsWith("integration/cli-execution-real.test.ts")
);
const shouldRun =
  process.env.RUN_CLI_INTEGRATION === "true" || isRunningThisFileDirectly;

describe.skipIf(!shouldRun)(
  "EffectCLI - Real Command Execution (Isolated)",
  () => {
    beforeEach(async () => {
      // Small delay to allow processes from previous tests to clean up
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    it("should execute echo command successfully", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return yield* cli.run("echo", ["hello world"], { timeout: 10_000 });
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.trim()).toBe("hello world");
    }, 15_000);

    it("should handle command not found error", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        return yield* cli
          .run("nonexistent-command-xyz-123", [], { timeout: 10_000 })
          .pipe(
            Effect.catchTag("CLIError", (errorFromCli) =>
              Effect.succeed(errorFromCli)
            )
          );
      }).pipe(Effect.provide(EffectCLI.Default));

      const cliError = await Effect.runPromise(program);
      expect(cliError.reason).toBe("NotFound");
    }, 15_000);

    it("should capture both stdout and stderr from command", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        // Use echo which is more reliable than shell commands
        // Write to stdout and stderr separately
        return yield* cli.run(
          "sh",
          ["-c", 'echo "output" && echo "error" >&2'],
          {
            timeout: 10_000,
          }
        );
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("output");
      expect(result.stderr).toContain("error");
    }, 15_000);

    it("should pass environment variables to command", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        // Use sh with echo - simpler and more reliable
        return yield* cli.run("sh", ["-c", 'echo "$TEST_VAR"'], {
          env: { TEST_VAR: "test-value-123" },
          timeout: 10_000,
        });
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.trim()).toBe("test-value-123");
    }, 15_000);

    it("should handle command execution with multiple arguments", async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        // Use printf which is POSIX-compliant and reliable
        return yield* cli.run(
          "printf",
          ["%s\n%s\n%s\n", "arg1", "arg2", "arg3"],
          {
            timeout: 10_000,
          }
        );
      }).pipe(Effect.provide(EffectCLI.Default));

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("arg1");
      expect(result.stdout).toContain("arg2");
      expect(result.stdout).toContain("arg3");
    }, 15_000);
  }
);
