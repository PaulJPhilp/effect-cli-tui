import { spawn } from 'child_process'
import * as Effect from 'effect/Effect'
import * as Context from 'effect/Context'
import * as Layer from 'effect/Layer'
import { CLIError, CLIResult, CLIRunOptions } from './types'

/**
 * Interface for the Effect CLI service.
 * Defines methods for running and streaming CLI commands.
 */
export interface EffectCLI {
    readonly _: unique symbol
    readonly run: (
        command: string,
        args?: string[],
        options?: CLIRunOptions
    ) => Effect.Effect<CLIResult, CLIError>
    readonly stream: (
        command: string,
        args?: string[],
        options?: CLIRunOptions
    ) => Effect.Effect<void, CLIError>
}

/**
 * Tag for the EffectCLI service, used for dependency injection.
 */
export const EffectCLI = Context.Tag<EffectCLI>()

/**
 * Live implementation of the EffectCLI service.
 * This layer provides the concrete methods for CLI interaction.
 */
export const EffectCLILive = Layer.succeed(
    EffectCLI,
    {
        _: undefined as any, // Placeholder for unique symbol
        run: (command, args = [], options = {}) =>
            Effect.async((resume) => {
                const cwd = options.cwd || process.cwd()
                let stdout = ''
                let stderr = ''

                const child = spawn('effect', [command, ...args], {
                    cwd,
                    env: { ...process.env, ...options.env }
                })

                if (!child.stdout || !child.stderr) {
                    return resume(
                        Effect.fail(
                            new CLIError(
                                'NotFound',
                                'Failed to spawn Effect CLI process'
                            )
                        )
                    )
                }

                child.stdout.on('data', (data) => {
                    stdout += data.toString()
                })

                child.stderr.on('data', (data) => {
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
                        resume(Effect.succeed({ exitCode, stdout, stderr }))
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

        stream: (command, args = [], options = {}) =>
            Effect.async((resume) => {
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
    }
)