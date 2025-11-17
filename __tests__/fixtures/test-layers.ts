import { Effect, Layer } from 'effect'
import { EffectCLI } from '../../src/cli'
import { InkService } from '../../src/services/ink'
import { TUIHandler } from '../../src/tui'
import { CLIResult, CLIError, TUIError } from '../../src/types'

/**
 * Mock layer for EffectCLI service.
 * Returns successful dummy results without actually spawning processes.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const result = yield* cli.run('test')
 *   console.log(result) // { exitCode: 0, stdout: 'mock', stderr: '' }
 * }).pipe(Effect.provide(MockCLI))
 * ```
 */
export const MockCLI = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.succeed({
        exitCode: 0,
        stdout: 'Mock command executed successfully',
        stderr: ''
      }),

    stream: (): Effect.Effect<void, CLIError> => Effect.void
  })
)

/**
 * Mock layer for EffectCLI that simulates command failures
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   yield* Effect.catchTag('CLIError', (err) => {
 *     console.log(err.reason) // 'CommandFailed'
 *   })(cli.run('failing-command'))
 * }).pipe(Effect.provide(MockCLIFailure))
 * ```
 */
export const MockCLIFailure = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.fail(
        new CLIError(
          'CommandFailed',
          'Mock command failed with exit code 1.\nError output'
        )
      ),

    stream: (): Effect.Effect<void, CLIError> =>
      Effect.fail(
        new CLIError('CommandFailed', 'Mock stream command failed')
      )
  })
)

/**
 * Mock layer for EffectCLI that simulates timeout
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   yield* Effect.catchTag('CLIError', (err) => {
 *     console.log(err.reason) // 'Timeout'
 *   })(cli.run('slow-command'))
 * }).pipe(Effect.provide(MockCLITimeout))
 * ```
 */
export const MockCLITimeout = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.fail(
        new CLIError('Timeout', 'Command timed out after 5000ms')
      ),

    stream: (): Effect.Effect<void, CLIError> =>
      Effect.fail(
        new CLIError('Timeout', 'Stream command timed out after 5000ms')
      )
  })
)

/**
 * Mock layer for TUIHandler service.
 * Provides in-memory mocking of all prompts without actual terminal interaction.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   const name = yield* tui.prompt('Your name:')
 *   console.log(name) // 'mock-input'
 * }).pipe(Effect.provide(MockTUI))
 * ```
 */
export const MockTUI = Layer.succeed(
  TUIHandler,
  TUIHandler.of({
    /**
     * Mock display: No-op, logs to memory instead of console
     */
    display: (_message: string): Effect.Effect<void> =>
      Effect.sync(() => {
        // In-memory log instead of console.log
        // This allows tests to verify display calls
      }),

    /**
     * Mock prompt: Returns predefined mock value
     */
    prompt: (): Effect.Effect<string> =>
      Effect.succeed('mock-input'),

    /**
     * Mock selectOption: Returns first choice
     */
    selectOption: (choices: string[]): Effect.Effect<string> =>
      Effect.succeed(choices[0] ?? 'default-choice'),

    /**
     * Mock multiSelect: Returns all choices
     */
    multiSelect: (choices: string[]): Effect.Effect<string[]> =>
      Effect.succeed(choices),

    /**
     * Mock confirm: Returns true
     */
    confirm: (): Effect.Effect<boolean> =>
      Effect.succeed(true),

    /**
     * Mock password: Returns predefined mock password
     */
    password: (): Effect.Effect<string> =>
      Effect.succeed('mock-password-12345')
  })
).pipe(Layer.provide(InkService.Default))

/**
 * Mock layer for TUIHandler that simulates user cancellation
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   yield* Effect.catchTag('TUIError', (err) => {
 *     console.log(err.reason) // 'Cancelled'
 *   })(tui.prompt('Your name:'))
 * }).pipe(Effect.provide(MockTUICancelled))
 * ```
 */
export const MockTUICancelled = Layer.succeed(
  TUIHandler,
  TUIHandler.of({
    display: (): Effect.Effect<void> => Effect.void,

    prompt: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('Cancelled', 'User cancelled the prompt')),

    selectOption: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('Cancelled', 'User cancelled the selection')),

    multiSelect: (): Effect.Effect<string[], TUIError> =>
      Effect.fail(new TUIError('Cancelled', 'User cancelled the multi-select')),

    confirm: (): Effect.Effect<boolean, TUIError> =>
      Effect.fail(new TUIError('Cancelled', 'User cancelled the confirmation')),

    password: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('Cancelled', 'User cancelled the password prompt'))
  })
).pipe(Layer.provide(InkService.Default))

/**
 * Mock layer for TUIHandler with validation failure
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   yield* Effect.catchTag('TUIError', (err) => {
 *     console.log(err.reason) // 'ValidationFailed'
 *   })(tui.prompt('Your email:'))
 * }).pipe(Effect.provide(MockTUIValidationFailed))
 * ```
 */
export const MockTUIValidationFailed = Layer.succeed(
  TUIHandler,
  TUIHandler.of({
    display: (): Effect.Effect<void> => Effect.void,

    prompt: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('ValidationFailed', 'Validation failed')),

    selectOption: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('ValidationFailed', 'Validation failed')),

    multiSelect: (): Effect.Effect<string[], TUIError> =>
      Effect.fail(new TUIError('ValidationFailed', 'Validation failed')),

    confirm: (): Effect.Effect<boolean, TUIError> =>
      Effect.fail(new TUIError('ValidationFailed', 'Validation failed')),

    password: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError('ValidationFailed', 'Validation failed'))
  })
).pipe(Layer.provide(InkService.Default))

/**
 * Convenience helper to create a combined mock layer with custom responses
 *
 * @example
 * ```ts
 * const customCLI = createMockCLI({
 *   stdout: 'Custom output',
 *   exitCode: 0,
 *   stderr: ''
 * })
 *
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const result = yield* cli.run('custom-command')
 *   console.log(result) // { exitCode: 0, stdout: 'Custom output', stderr: '' }
 * }).pipe(Effect.provide(customCLI))
 * ```
 */
export function createMockCLI(response: CLIResult) {
  return Layer.succeed(
    EffectCLI,
    EffectCLI.of({
      run: (): Effect.Effect<CLIResult, CLIError> => {
        // Mimic the real EffectCLI behavior: fail on non-zero exit code
        if (response.exitCode === 0) {
          return Effect.succeed(response)
        } else {
          return Effect.fail(
            new CLIError(
              'CommandFailed',
              `Command failed with exit code ${response.exitCode}.\n${response.stderr}`
            )
          )
        }
      },
      stream: (): Effect.Effect<void, CLIError> => Effect.void
    })
  )
}

/**
 * Convenience helper to create a combined mock layer with custom TUI responses
 *
 * @example
 * ```ts
 * const customTUI = createMockTUI({
 *   prompt: 'user-input',
 *   selectOption: 'selected-choice',
 *   multiSelect: ['choice1', 'choice2'],
 *   confirm: true,
 *   password: 'secret123'
 * })
 * ```
 */
export function createMockTUI(responses: {
  prompt?: string
  selectOption?: string
  multiSelect?: string[]
  confirm?: boolean
  password?: string
}) {
  return Layer.succeed(
    TUIHandler,
    TUIHandler.of({
      display: (): Effect.Effect<void> => Effect.void,

      prompt: (): Effect.Effect<string> =>
        Effect.succeed(responses.prompt ?? 'mock-input'),

      selectOption: (choices: string[]): Effect.Effect<string> =>
        Effect.succeed(
          responses.selectOption ?? choices[0] ?? 'default'
        ),

      multiSelect: (): Effect.Effect<string[]> =>
        Effect.succeed(responses.multiSelect ?? []),

      confirm: (): Effect.Effect<boolean> =>
        Effect.succeed(responses.confirm ?? true),

      password: (): Effect.Effect<string> =>
        Effect.succeed(responses.password ?? 'mock-password')
    })
  ).pipe(Layer.provide(InkService.Default))
}
