/**
 * Error Handling Examples for effect-cli-tui
 *
 * Demonstrates how to handle errors gracefully in CLI/TUI applications:
 * - TUIError handling (Cancelled, ValidationFailed, RenderError)
 * - CLIError handling (CommandFailed, Timeout, NotFound, ExecutionError)
 * - Error recovery patterns
 * - Cancellation handling
 */

import { Effect } from "effect";
import { displayError, displaySuccess, EffectCLI, TUIHandler } from "../src";

/**
 * Example 1: Handle TUI cancellation gracefully
 */
export const handleCancellation = Effect.gen(function* () {
  const tui = yield* TUIHandler;

  const name = yield* tui.prompt("Enter your name:").pipe(
    Effect.catchTag("TUIError", (err) => {
      if (err.reason === "Cancelled") {
        yield * tui.display("Operation cancelled by user", "warning");
        return Effect.succeed("Anonymous");
      }
      return Effect.fail(err);
    })
  );

  yield* tui.display(`Hello, ${name}!`, "success");
  return name;
});

/**
 * Example 2: Handle validation errors with retry
 */
export const handleValidationWithRetry = Effect.gen(function* () {
  const tui = yield* TUIHandler;

  const validateEmail = (input: string) => {
    if (input.includes("@")) return true;
    return "Please enter a valid email address";
  };

  let email: string | undefined;
  let attempts = 0;
  const maxAttempts = 3;

  while (!email && attempts < maxAttempts) {
    email = yield* tui
      .prompt("Enter email:", {
        validate: validateEmail,
      })
      .pipe(
        Effect.catchTag("TUIError", (err) => {
          if (err.reason === "ValidationFailed") {
            attempts++;
            if (attempts < maxAttempts) {
              yield *
                displayError(`Validation failed: ${err.message}. Try again.`);
              return Effect.fail(err); // Retry
            }
            yield * displayError("Max attempts reached. Using default email.");
            return Effect.succeed("user@example.com");
          }
          return Effect.fail(err);
        })
      );
  }

  return email;
});

/**
 * Example 3: Handle CLI command errors
 */
export const handleCLIErrors = Effect.gen(function* () {
  const cli = yield* EffectCLI;

  const result = yield* cli.run("git", ["status"]).pipe(
    Effect.catchTag("CLIError", (err) => {
      switch (err.reason) {
        case "NotFound":
          yield *
            displayError("Command not found: git. Please install Git first.");
          return Effect.fail(err);
        case "Timeout":
          yield *
            displayError(
              `Command timed out after ${err.message}. Please try again.`
            );
          return Effect.fail(err);
        case "CommandFailed":
          yield *
            displayError(
              `Command failed with exit code ${err.exitCode}: ${err.message}`
            );
          return Effect.fail(err);
        case "ExecutionError":
          yield * displayError(`Execution error: ${err.message}`);
          return Effect.fail(err);
      }
    })
  );

  yield* displaySuccess("Git status retrieved successfully");
  return result;
});

/**
 * Example 4: Comprehensive error handling workflow
 */
export const comprehensiveErrorHandling = Effect.gen(function* () {
  const tui = yield* TUIHandler;
  const cli = yield* EffectCLI;

  // Step 1: Get user input with cancellation handling
  const projectName = yield* tui.prompt("Project name:").pipe(
    Effect.catchTag("TUIError", (err) => {
      if (err.reason === "Cancelled") {
        yield * tui.display("Setup cancelled", "warning");
        return Effect.fail(new Error("User cancelled"));
      }
      return Effect.fail(err);
    })
  );

  // Step 2: Run command with error handling
  const buildResult = yield* cli
    .run("npm", ["run", "build"], {
      cwd: projectName,
      timeout: 30_000,
    })
    .pipe(
      Effect.catchTag("CLIError", (err) => {
        if (err.reason === "NotFound") {
          yield * displayError("npm not found. Please install Node.js.");
          return Effect.fail(err);
        }
        if (err.reason === "Timeout") {
          yield * displayError("Build timed out. Try increasing timeout.");
          return Effect.fail(err);
        }
        if (err.reason === "CommandFailed") {
          yield * displayError(`Build failed: ${err.message}`);
          yield * displayError(`Exit code: ${err.exitCode}`);
          return Effect.fail(err);
        }
        return Effect.fail(err);
      })
    );

  yield* displaySuccess("Build completed successfully!");
  return { projectName, buildResult };
});

/**
 * Example 5: Handle multiple error types in sequence
 */
export const handleMultipleErrors = Effect.gen(function* () {
  const tui = yield* TUIHandler;
  const cli = yield* EffectCLI;

  // Try multiple operations, handling each error type
  const results = yield* Effect.all([
    tui
      .prompt("Name:")
      .pipe(
        Effect.catchTag("TUIError", (err) =>
          err.reason === "Cancelled"
            ? Effect.succeed("skipped")
            : Effect.fail(err)
        )
      ),
    cli
      .run("echo", ["test"])
      .pipe(
        Effect.catchTag("CLIError", (err) =>
          err.reason === "NotFound"
            ? Effect.succeed({ exitCode: 0, stdout: "skipped", stderr: "" })
            : Effect.fail(err)
        )
      ),
  ]);

  return results;
});

/**
 * Example 6: Error recovery with fallback values
 */
export const errorRecoveryWithFallback = Effect.gen(function* () {
  const tui = yield* TUIHandler;

  const template = yield* tui
    .selectOption("Choose template:", [
      { label: "Basic", value: "basic", description: "Simple starter" },
      { label: "CLI", value: "cli", description: "CLI application" },
    ])
    .pipe(
      Effect.catchTag("TUIError", (err) => {
        if (err.reason === "Cancelled") {
          yield * tui.display("Using default template: basic", "info");
          return Effect.succeed("basic");
        }
        return Effect.fail(err);
      })
    );

  return template;
});

// Run examples (commented out - uncomment to test)
/*
async function main() {
  try {
    // Example 1: Cancellation handling
    // await TUIHandlerRuntime.runPromise(handleCancellation)

    // Example 2: Validation with retry
    // await TUIHandlerRuntime.runPromise(handleValidationWithRetry)

    // Example 3: CLI errors
    // await EffectCLIRuntime.runPromise(handleCLIErrors)

    // Example 4: Comprehensive
    // await EffectCLIRuntime.runPromise(comprehensiveErrorHandling)

    // Example 5: Multiple errors
    // await EffectCLIRuntime.runPromise(handleMultipleErrors)

    // Example 6: Recovery with fallback
    // await TUIHandlerRuntime.runPromise(errorRecoveryWithFallback)
  } catch (error) {
    console.error('Unhandled error:', error)
    process.exit(1)
  } finally {
    await TUIHandlerRuntime.dispose()
    await EffectCLIRuntime.dispose()
  }
}

// main()
*/
