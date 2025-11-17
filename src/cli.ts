import {
  type ChildProcess,
  type ChildProcessWithoutNullStreams,
  type SpawnOptions,
  spawn,
} from 'node:child_process'
import { Effect } from 'effect'
import { isErrnoException, isError } from './core/error-utils'
import { CLIError, type CLIResult, type CLIRunOptions } from './types'

const DEFAULT_MAX_BUFFER = 10 * 1024 * 1024

/**
 * Service for running and streaming CLI commands.
 * Uses Effect.Service pattern for dependency injection.
 */
export class EffectCLI extends Effect.Service<EffectCLI>()('app/EffectCLI', {
  effect: Effect.sync(() => {
    const normalizeOptions = (options: CLIRunOptions = {}) => {
      const maxBuffer =
        options.maxBuffer === undefined ? DEFAULT_MAX_BUFFER : Math.max(0, options.maxBuffer)

      return {
        cwd: options.cwd ?? process.cwd(),
        env: options.env ?? {},
        timeout: options.timeout && options.timeout > 0 ? options.timeout : undefined,
        maxBuffer,
        signal: options.signal,
        killSignal: options.killSignal ?? 'SIGTERM',
        stdin: options.stdin,
      }
    }

    const createSpawnOptions = (
      normalized: ReturnType<typeof normalizeOptions>,
      inheritStdio: boolean,
    ) =>
      ({
        cwd: normalized.cwd,
        env: {
          ...process.env,
          ...normalized.env,
        },
        stdio: inheritStdio ? 'inherit' : 'pipe',
        signal: normalized.signal,
      }) satisfies SpawnOptions

    const acquireProcess = (
      command: string,
      args: string[],
      options: ReturnType<typeof normalizeOptions>,
      inheritStdio: boolean,
    ) =>
      Effect.acquireUseRelease(
        Effect.try({
          try: () => {
            const child = spawn(command, args, createSpawnOptions(options, inheritStdio))
            return child
          },
          catch: (error: unknown) =>
            new CLIError(
              'ExecutionError',
              `Unable to start the command "${command}": ${isError(error) ? error.message : String(error)}`,
            ),
        }),
        (child) => Effect.succeed(child),
        (child) =>
          Effect.sync(() => {
            if (child.exitCode === null && child.signalCode === null && !child.killed) {
              child.kill(options.killSignal)
            }
          }),
      )

    const handleAbortSignal = (signal: AbortSignal | undefined, onAbort: () => void) => {
      if (!signal) {
        return undefined
      }

      if (signal.aborted) {
        onAbort()
        return undefined
      }

      const handler = () => onAbort()
      signal.addEventListener('abort', handler, { once: true })
      return () => signal.removeEventListener('abort', handler)
    }

    const createTimeout = (timeout: number | undefined, onTimeout: () => void) => {
      if (!timeout) return undefined
      return setTimeout(onTimeout, timeout)
    }

    const clearTimeoutIfNeeded = (timeoutId?: NodeJS.Timeout) => {
      if (timeoutId) clearTimeout(timeoutId)
    }

    const failBufferLimit = (streamName: 'stdout' | 'stderr', maxBuffer: number) =>
      new CLIError(
        'OutputLimitExceeded',
        `The ${streamName} output exceeded the configured maxBuffer (${maxBuffer} bytes).`,
      )

    const createRunEffect = (
      child: ChildProcessWithoutNullStreams,
      options: ReturnType<typeof normalizeOptions>,
    ): Effect.Effect<CLIResult, CLIError> =>
      Effect.async<CLIResult, CLIError>((resume) => {
        let completed = false
        let stdout = ''
        let stderr = ''
        let stdoutBytes = 0
        let stderrBytes = 0
        const maxBuffer = options.maxBuffer ?? 0
        const bufferLimit = maxBuffer === 0 ? Infinity : maxBuffer

        const cleanup = (timeoutId?: NodeJS.Timeout, abortHandler?: () => void) => {
          child.stdout?.removeAllListeners('data')
          child.stderr?.removeAllListeners('data')
          child.removeAllListeners('close')
          child.removeAllListeners('error')
          clearTimeoutIfNeeded(timeoutId)
          abortHandler?.()
        }

        const finish = (
          effect: Effect.Effect<CLIResult, CLIError>,
          timeoutId?: NodeJS.Timeout,
          abortHandler?: () => void,
        ) => {
          if (completed) return
          completed = true
          cleanup(timeoutId, abortHandler)
          resume(effect)
        }

        const abortCleanupRef: { handler?: () => void } = {}
        const timeoutId = createTimeout(options.timeout, () => {
          finish(
            Effect.fail(
              new CLIError(
                'Timeout',
                `The command took too long to complete (timeout: ${Math.round((options.timeout ?? 0) / 1000)}s). Please try again or increase the timeout.`,
              ),
            ),
            timeoutId,
            abortCleanupRef.handler,
          )
          child.kill(options.killSignal)
        })

        abortCleanupRef.handler = handleAbortSignal(options.signal, () => {
          finish(
            Effect.fail(
              new CLIError('Aborted', 'The command execution was aborted via AbortSignal.'),
            ),
            timeoutId,
            abortCleanupRef.handler,
          )
          child.kill(options.killSignal)
        })

        const enforceBuffer = (
          size: number,
          chunkBytes: number,
          streamName: 'stdout' | 'stderr',
        ): boolean => {
          if (bufferLimit === Infinity) return true
          if (size + chunkBytes > bufferLimit) {
            finish(
              Effect.fail(failBufferLimit(streamName, maxBuffer)),
              timeoutId,
              abortCleanupRef.handler,
            )
            child.kill(options.killSignal)
            return false
          }
          return true
        }

        child.stdout.on('data', (chunk: Buffer) => {
          if (completed) return
          const chunkBytes = chunk.byteLength
          if (!enforceBuffer(stdoutBytes, chunkBytes, 'stdout')) return
          stdoutBytes += chunkBytes
          stdout += chunk.toString()
        })

        child.stderr.on('data', (chunk: Buffer) => {
          if (completed) return
          const chunkBytes = chunk.byteLength
          if (!enforceBuffer(stderrBytes, chunkBytes, 'stderr')) return
          stderrBytes += chunkBytes
          stderr += chunk.toString()
        })

        child.on('close', (exitCode) => {
          if (completed) return
          if (exitCode === 0) {
            finish(
              Effect.succeed({
                exitCode: exitCode ?? 0,
                stdout,
                stderr,
              }),
              timeoutId,
              abortCleanupRef.handler,
            )
          } else {
            finish(
              Effect.fail(
                new CLIError(
                  'CommandFailed',
                  `The command failed (exit code ${exitCode}).\n\nError details:\n${stderr || 'No error details available'}`,
                  exitCode ?? undefined,
                ),
              ),
              timeoutId,
              abortCleanupRef.handler,
            )
          }
        })

        child.on('error', (err) => {
          if (completed) return
          const error =
            isErrnoException(err) && err.code === 'ENOENT'
              ? new CLIError(
                  'NotFound',
                  `The command "${child.spawnargs[0]}" was not found. Please verify it is installed and available in your PATH.`,
                )
              : new CLIError(
                  'ExecutionError',
                  `Unable to execute the command: ${isError(err) ? err.message : String(err)}\n\nPlease verify the command is installed and accessible in your PATH.`,
                )
          finish(Effect.fail(error), timeoutId, abortCleanupRef.handler)
        })

        if (options.stdin !== undefined && child.stdin) {
          child.stdin.write(options.stdin)
          child.stdin.end()
        }

        return Effect.sync(() => {
          if (!completed) {
            child.kill(options.killSignal)
            cleanup(timeoutId, abortCleanupRef.handler)
          }
        })
      })

    const createStreamEffect = (
      child: ChildProcess,
      options: ReturnType<typeof normalizeOptions>,
    ): Effect.Effect<void, CLIError> =>
      Effect.async<void, CLIError>((resume) => {
        let completed = false

        const cleanup = (timeoutId?: NodeJS.Timeout, abortHandler?: () => void) => {
          child.removeAllListeners('close')
          child.removeAllListeners('error')
          clearTimeoutIfNeeded(timeoutId)
          abortHandler?.()
        }

        const finish = (
          effect: Effect.Effect<void, CLIError>,
          timeoutId?: NodeJS.Timeout,
          abortHandler?: () => void,
        ) => {
          if (completed) return
          completed = true
          cleanup(timeoutId, abortHandler)
          resume(effect)
        }

        const abortCleanupRef: { handler?: () => void } = {}
        const timeoutId = createTimeout(options.timeout, () => {
          finish(
            Effect.fail(
              new CLIError(
                'Timeout',
                `The command took too long to complete (timeout: ${Math.round((options.timeout ?? 0) / 1000)}s). Please try again or increase the timeout.`,
              ),
            ),
            timeoutId,
            abortCleanupRef.handler,
          )
          child.kill(options.killSignal)
        })

        abortCleanupRef.handler = handleAbortSignal(options.signal, () => {
          finish(
            Effect.fail(
              new CLIError('Aborted', 'The command execution was aborted via AbortSignal.'),
            ),
            timeoutId,
            abortCleanupRef.handler,
          )
          child.kill(options.killSignal)
        })

        child.on('close', (exitCode) => {
          if (completed) return
          if (exitCode === 0) {
            finish(Effect.succeed(undefined), timeoutId, abortCleanupRef.handler)
          } else {
            finish(
              Effect.fail(
                new CLIError(
                  'CommandFailed',
                  `The command failed with exit code ${exitCode}. Please check the command output above for details.`,
                  exitCode ?? undefined,
                ),
              ),
              timeoutId,
              abortCleanupRef.handler,
            )
          }
        })

        child.on('error', (err) => {
          if (completed) return
          const error =
            isErrnoException(err) && err.code === 'ENOENT'
              ? new CLIError(
                  'NotFound',
                  `The command "${child.spawnargs[0]}" was not found. Please verify it is installed and available in your PATH.`,
                )
              : new CLIError(
                  'ExecutionError',
                  `Unable to execute the command: ${isError(err) ? err.message : String(err)}\n\nPlease verify the command is installed and accessible in your PATH.`,
                )
          finish(Effect.fail(error), timeoutId, abortCleanupRef.handler)
        })

        return Effect.sync(() => {
          if (!completed) {
            child.kill(options.killSignal)
            cleanup(timeoutId, abortCleanupRef.handler)
          }
        })
      })

    return {
      /**
       * Run a CLI command and capture output.
       * @param command - The command to execute
       * @param args - Command arguments
       * @param options - Run options (cwd, env, timeout)
       * @returns Effect with CLIResult or CLIError
       */
      run: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
        Effect.scoped(
          Effect.gen(function* () {
            const normalized = normalizeOptions(options)
            const child = (yield* acquireProcess(
              command,
              args,
              normalized,
              false,
            )) as ChildProcessWithoutNullStreams
            return yield* createRunEffect(child, normalized)
          }),
        ),

      /**
       * Stream a CLI command with inherited stdio.
       * @param command - The command to execute
       * @param args - Command arguments
       * @param options - Run options (cwd, env, timeout)
       * @returns Effect<void, CLIError>
       */
      stream: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
        Effect.scoped(
          Effect.gen(function* () {
            const normalized = normalizeOptions(options)
            const child = yield* acquireProcess(command, args, normalized, true)
            return yield* createStreamEffect(child, normalized)
          }),
        ),
    } as const
  }),
}) {}
