/** biome-ignore-all assist/source/organizeImports: <> */
import { Effect } from "effect";
import { spawn } from "node:child_process";
import { MILLISECONDS_PER_SECOND } from "./constants";
import { isErrnoException, isError } from "./core/error-utils";
import { CLIError, type CLIResult, type CLIRunOptions } from "./types";
import { ERROR_CODE_ENOENT } from "./types/system-signals";

/**
 * EffectCLI Service API
 *
 * Provides methods for executing CLI commands with proper error handling
 * and Effect composition.
 */
export interface EffectCLIApi {
  /**
   * Run a command and capture its output
   *
   * @param command - The command to execute
   * @param args - Command arguments
   * @param options - Execution options (cwd, env, timeout)
   * @returns Effect that resolves with CLIResult containing exitCode, stdout, stderr
   *
   * @example
   * ```ts
   * const result = yield* cli.run('echo', ['hello'])
   * console.log(result.stdout) // 'hello\n'
   * ```
   */
  readonly run: (
    command: string,
    args?: string[],
    options?: CLIRunOptions
  ) => Effect.Effect<CLIResult, CLIError>;

  /**
   * Run a command with inherited stdio (output streams to terminal)
   *
   * @param command - The command to execute
   * @param args - Command arguments
   * @param options - Execution options (cwd, env, timeout)
   * @returns Effect that resolves when command completes
   *
   * @example
   * ```ts
   * yield* cli.stream('npm', ['install'])
   * // Output appears directly in terminal
   * ```
   */
  readonly stream: (
    command: string,
    args?: string[],
    options?: CLIRunOptions
  ) => Effect.Effect<void, CLIError>;
}

/**
 * EffectCLI Service
 *
 * Executes CLI commands with proper error handling and Effect composition.
 * Supports both captured output (run) and streaming output (stream) modes.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const result = yield* cli.run('echo', ['hello'])
 *   return result.stdout
 * }).pipe(Effect.provide(EffectCLI.Default))
 * ```
 */
export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(
    (): EffectCLIApi => ({
      run: (
        command: string,
        args: string[] = [],
        options: CLIRunOptions = {}
      ) =>
        Effect.gen(function* () {
          const processEnv = process.env as Record<string, string>;
          const cwd = options.cwd || process.cwd();

          return yield* Effect.async<CLIResult, CLIError>((resume) => {
            let stdout = "";
            let stderr = "";
            let hasResumed = false;

            const safeResume = (effect: Effect.Effect<CLIResult, CLIError>) => {
              if (!hasResumed) {
                hasResumed = true;
                resume(effect);
              }
            };

            const child = spawn(command, args, {
              cwd,
              env: { ...processEnv, ...options.env },
              stdio: ["pipe", "pipe", "pipe"],
            });

            if (!(child.stdout && child.stderr)) {
              safeResume(
                Effect.fail(
                  new CLIError(
                    "NotFound",
                    "Unable to start the command. Please check that the command is available and try again."
                  )
                )
              );
              return;
            }

            child.stdout.on("data", (data: Buffer) => {
              stdout += data.toString();
            });

            child.stderr.on("data", (data: Buffer) => {
              stderr += data.toString();
            });

            const timeout = options.timeout
              ? (() => {
                  const timeoutMs = options.timeout;
                  return setTimeout(() => {
                    child.kill();
                    safeResume(
                      Effect.fail(
                        new CLIError(
                          "Timeout",
                          `The command took too long to complete (timeout: ${Math.round(
                            timeoutMs / MILLISECONDS_PER_SECOND
                          )}s). Please try again or increase the timeout.`
                        )
                      )
                    );
                  }, timeoutMs);
                })()
              : null;

            child.on("close", (exitCode) => {
              if (timeout) {
                clearTimeout(timeout);
              }

              if (exitCode === 0) {
                safeResume(
                  Effect.succeed({ exitCode: exitCode ?? 0, stdout, stderr })
                );
              } else {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "CommandFailed",
                      `The command failed (exit code ${exitCode}).\n\nError details:\n${
                        stderr || "No error details available"
                      }`,
                      exitCode ?? undefined
                    )
                  )
                );
              }
            });

            // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: error handler needs multiple branches for different error types
            child.on("error", (err) => {
              if (timeout) {
                clearTimeout(timeout);
              }
              if (isErrnoException(err) && err.code === ERROR_CODE_ENOENT) {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "NotFound",
                      `The command "${command}" was not found. Please verify it is installed and available in your PATH.`
                    )
                  )
                );
              } else {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "ExecutionError",
                      `Unable to execute the command: ${
                        isError(err) ? err.message : globalThis.String(err)
                      }\n\nPlease verify the command is installed and accessible in your PATH.`
                    )
                  )
                );
              }
            });
          });
        }),

      stream: (
        command: string,
        args: string[] = [],
        options: CLIRunOptions = {}
      ) =>
        Effect.gen(function* () {
          const processEnv = process.env as Record<string, string>;
          const cwd = options.cwd || process.cwd();

          return yield* Effect.async<void, CLIError>((resume) => {
            let hasResumed = false;

            const safeResume = (effect: Effect.Effect<void, CLIError>) => {
              if (!hasResumed) {
                hasResumed = true;
                resume(effect);
              }
            };

            const child = spawn(command, args, {
              cwd,
              env: { ...processEnv, ...options.env },
              stdio: "inherit",
            });

            const timeout = options.timeout
              ? (() => {
                  const timeoutMs = options.timeout;
                  return setTimeout(() => {
                    child.kill();
                    safeResume(
                      Effect.fail(
                        new CLIError(
                          "Timeout",
                          `The command took too long to complete (timeout: ${Math.round(
                            timeoutMs / MILLISECONDS_PER_SECOND
                          )}s). Please try again or increase the timeout.`
                        )
                      )
                    );
                  }, timeoutMs);
                })()
              : null;

            child.on("close", (exitCode) => {
              if (timeout) {
                clearTimeout(timeout);
              }

              if (exitCode === 0) {
                safeResume(Effect.succeed(undefined));
              } else {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "CommandFailed",
                      `The command failed with exit code ${exitCode}. Please check the command output above for details.`,
                      exitCode ?? undefined
                    )
                  )
                );
              }
            });

            // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: error handler needs multiple branches for different error types
            child.on("error", (err) => {
              if (timeout) {
                clearTimeout(timeout);
              }
              if (isErrnoException(err) && err.code === ERROR_CODE_ENOENT) {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "NotFound",
                      `The command "${command}" was not found. Please verify it is installed and available in your PATH.`
                    )
                  )
                );
              } else {
                safeResume(
                  Effect.fail(
                    new CLIError(
                      "ExecutionError",
                      `Unable to execute the command: ${
                        isError(err) ? err.message : globalThis.String(err)
                      }\n\nPlease verify the command is installed and accessible in your PATH.`
                    )
                  )
                );
              }
            });
          });
        }),
    })
  ),
  dependencies: [],
}) {}

/**
 * @deprecated Use `EffectCLI.Default` instead. This alias is provided for backward compatibility.
 */
export const EffectCLILive = EffectCLI.Default;
