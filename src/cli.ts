import { spawn } from "node:child_process";
import { Context, Effect, Layer, pipe, Schema } from "effect";
import { EnvService, fromProcess, makeEnvSchema } from "effect-env";
import { isErrnoException, isError } from "./core/error-utils";
import { CLIError, type CLIResult, type CLIRunOptions } from "./types";

const cliEnvSchema = makeEnvSchema(Schema.anySchema);

export const CLIEnvLayer = fromProcess(cliEnvSchema);

export class EffectCLI extends Context.Tag("app/EffectCLI")<
  EffectCLI,
  {
    readonly run: (
      command: string,
      args?: string[],
      options?: CLIRunOptions
    ) => Effect.Effect<CLIResult, CLIError>;
    readonly stream: (
      command: string,
      args?: string[],
      options?: CLIRunOptions
    ) => Effect.Effect<void, CLIError>;
  }
>() {}

export const EffectCLILive = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
      pipe(
        Effect.service(EnvService),
        Effect.flatMap((env) =>
          Effect.gen(function* () {
            const processEnv = yield* env.all();
            const cwd = options.cwd || process.cwd();

            return yield* Effect.async<CLIResult, CLIError>((resume) => {
              let stdout = "";
              let stderr = "";
              let hasResumed = false;

              const safeResume = (
                effect: Effect.Effect<CLIResult, CLIError>
              ) => {
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
                              timeoutMs / 1000
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
                        `Unable to execute the command: ${
                          isError(err) ? err.message : globalThis.String(err)
                        }\n\nPlease verify the command is installed and accessible in your PATH.`
                      )
                    )
                  );
                }
              });
            });
          })
        )
      ),

    stream: (
      command: string,
      args: string[] = [],
      options: CLIRunOptions = {}
    ) =>
      pipe(
        Effect.service(EnvService),
        Effect.flatMap((env) =>
          Effect.gen(function* () {
            const processEnv = yield* env.all();
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
                              timeoutMs / 1000
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
                        `Unable to execute the command: ${
                          isError(err) ? err.message : globalThis.String(err)
                        }\n\nPlease verify the command is installed and accessible in your PATH.`
                      )
                    )
                  );
                }
              });
            });
          })
        )
      ),
  })
).pipe(Layer.provide(CLIEnvLayer));
