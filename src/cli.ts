import { spawn } from 'child_process'
import { Effect } from 'effect'
import { CLIError, CLIResult, CLIRunOptions } from './types'

/**
 * Service for running and streaming CLI commands.
 * Uses Effect.Service pattern for dependency injection.
 */
export class EffectCLI extends Effect.Service<EffectCLI>()('app/EffectCLI', {
  effect: Effect.sync(() => ({
    /**
     * Run a CLI command and capture output.
     * @param command - The command to execute
     * @param args - Command arguments
     * @param options - Run options (cwd, env, timeout)
     * @returns Effect with CLIResult or CLIError
     */
    run: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
      Effect.async<CLIResult, CLIError>((resume) => {
        const cwd = options.cwd || process.cwd()
        let stdout = ''
        let stderr = ''

        const child = spawn('effect', [command, ...args], {
          cwd,
          env: { ...process.env, ...options.env }
        })

        if (!child.stdout || !child.stderr) {
          resume(
            Effect.fail(
              new CLIError(
                'NotFound',
                'Failed to spawn Effect CLI process'
              )
            )
          )
          return
        }

        child.stdout.on('data', (data: Buffer) => {
          stdout += data.toString()
        })

        child.stderr.on('data', (data: Buffer) => {
          stderr += data.toString()
        })

        const timeout = options.timeout
          ? setTimeout(() => {
            child.kill()
            resume(
              Effect.fail(
                new CLIError(
                  'Timeout',
                  `Command timed out after ${options.timeout}ms`
                )
              )
            )
          }, options.timeout)
          : null

        child.on('close', (exitCode) => {
          if (timeout) clearTimeout(timeout)

          if (exitCode === 0) {
            resume(Effect.succeed({ exitCode: exitCode ?? 0, stdout, stderr }))
          } else {
            resume(
              Effect.fail(
                new CLIError(
                  'CommandFailed',
                  `Command failed with exit code ${exitCode}.\n${stderr}`
                )
              )
            )
          }
        })

        child.on('error', (err) => {
          if (timeout) clearTimeout(timeout)
          const error = err as NodeJS.ErrnoException
          if (error.code === 'ENOENT') {
            resume(
              Effect.fail(
                new CLIError(
                  'NotFound',
                  'Effect CLI not found. Please install with: pnpm add -g effect'
                )
              )
            )
          } else {
            resume(
              Effect.fail(
                new CLIError(
                  'NotFound',
                  `Failed to execute: ${err.message}`
                )
              )
            )
          }
        })
      }),

    /**
     * Stream a CLI command with inherited stdio.
     * @param command - The command to execute
     * @param args - Command arguments
     * @param options - Run options (cwd, env, timeout)
     * @returns Effect<void, CLIError>
     */
    stream: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
      Effect.async<void, CLIError>((resume) => {
        const cwd = options.cwd || process.cwd()

        const child = spawn('effect', [command, ...args], {
          cwd,
          env: { ...process.env, ...options.env },
          stdio: 'inherit'
        })

        const timeout = options.timeout
          ? setTimeout(() => {
            child.kill()
            resume(
              Effect.fail(
                new CLIError(
                  'Timeout',
                  `Command timed out after ${options.timeout}ms`
                )
              )
            )
          }, options.timeout)
          : null

        child.on('close', (exitCode) => {
          if (timeout) clearTimeout(timeout)

          if (exitCode === 0) {
            resume(Effect.succeed(undefined))
          } else {
            resume(
              Effect.fail(
                new CLIError(
                  'CommandFailed',
                  `Command failed with exit code ${exitCode}`
                )
              )
            )
          }
        })

        child.on('error', (err) => {
          if (timeout) clearTimeout(timeout)
          const error = err as NodeJS.ErrnoException
          if (error.code === 'ENOENT') {
            resume(
              Effect.fail(
                new CLIError(
                  'NotFound',
                  'Effect CLI not found. Please install with: pnpm add -g effect'
                )
              )
            )
          } else {
            resume(
              Effect.fail(
                new CLIError(
                  'NotFound',
                  `Failed to execute: ${err.message}`
                )
              )
            )
          }
        })
      })
  } as const))
}) {}