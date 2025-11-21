import { spawn } from "node:child_process";
import { Effect } from "effect";
import { isErrnoException, isError } from "./core/error-utils";
import { CLIError, type CLIResult, type CLIRunOptions } from "./types";

/**
 * Service for running and streaming CLI commands.
 * Uses Effect.Service pattern for dependency injection.
 */
export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(
    () =>
      ({
        /**
         * Run a CLI command and capture output.
         * @param command - The command to execute
         * @param args - Command arguments
         * @param options - Run options (cwd, env, timeout)
         * @returns Effect with CLIResult or CLIError
         */
        run: (
          command: string,
          args: string[] = [],
          options: CLIRunOptions = {}
        ) =>
          Effect.async<CLIResult, CLIError>((resume) => {
            const cwd = options.cwd || process.cwd();
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
              env: { ...process.env, ...options.env },
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
                          `The command took too long to complete (timeout: ${Math.round(timeoutMs / 1000)}s). Please try again or increase the timeout.`
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
                      `The command failed (exit code ${exitCode}).\n\nError details:\n${stderr || "No error details available"}`,
                      exitCode ?? undefined
                    )
                  )
                );
              }
            });

            child.on("error", (err) => {
              if (timeout) {
                clearTimeout(timeout);
              }
              if (isErrnoException(err) && err.code === "ENOENT") {
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
                      `Unable to execute the command: ${isError(err) ? err.message : String(err)}\n\nPlease verify the command is installed and accessible in your PATH.`
                    )
                  )
                );
              }
            });
          }),

        /**
         * Stream a CLI command with inherited stdio.
         * @param command - The command to execute
         * @param args - Command arguments
         * @param options - Run options (cwd, env, timeout)
         * @returns Effect<void, CLIError>
         */
        stream: (
          command: string,
          args: string[] = [],
          options: CLIRunOptions = {}
        ) =>
          Effect.async<void, CLIError>((resume) => {
            const cwd = options.cwd || process.cwd();
            let hasResumed = false;

            const safeResume = (effect: Effect.Effect<void, CLIError>) => {
              if (!hasResumed) {
                hasResumed = true;
                resume(effect);
              }
            };

            const child = spawn(command, args, {
              cwd,
              env: { ...process.env, ...options.env },
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
                          `The command took too long to complete (timeout: ${Math.round(timeoutMs / 1000)}s). Please try again or increase the timeout.`
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

            child.on("error", (err) => {
              if (timeout) {
                clearTimeout(timeout);
              }
              if (isErrnoException(err) && err.code === "ENOENT") {
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
                      `Unable to execute the command: ${isError(err) ? err.message : String(err)}\n\nPlease verify the command is installed and accessible in your PATH.`
                    )
                  )
                );
              }
            });
          }),
      }) as const
  ),
}) {}
