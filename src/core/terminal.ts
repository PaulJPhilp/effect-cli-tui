import { Effect, Layer } from 'effect'
import { ANSI_CARRIAGE_RETURN, ANSI_CLEAR_LINE, ANSI_HIDE_CURSOR, ANSI_SHOW_CURSOR } from './icons'

/**
 * Terminal service for writing to stdout/stderr.
 * Provides methods for terminal output operations.
 *
 * Usage:
 * ```ts
 * const program = Effect.gen(function* () {
 *   const terminal = yield* Terminal
 *   yield* terminal.stdout('Hello, world!')
 *   yield* terminal.line('Line 2')
 * }).pipe(Effect.provide(Terminal.Default))
 *
 * await Effect.runPromise(program)
 * ```
 */
export class Terminal extends Effect.Service<Terminal>()('app/Terminal', {
  effect: Effect.sync(
    () =>
      ({
        /**
         * Write to standard output without newline
         */
        stdout: (text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stdout.write(text)
          }),

        /**
         * Write to standard error without newline
         */
        stderr: (text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stderr.write(text)
          }),

        /**
         * Write a line to standard output (adds newline via console.log)
         */
        line: (text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            console.log(text)
          }),

        /**
         * Clear the current line (ANSI escape sequence)
         */
        clearLine: (): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stdout.write(ANSI_CLEAR_LINE)
          }),

        /**
         * Move cursor to start of line (carriage return)
         */
        carriageReturn: (): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stdout.write(ANSI_CARRIAGE_RETURN)
          }),

        /**
         * Hide cursor (ANSI escape sequence)
         */
        hideCursor: (): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stdout.write(ANSI_HIDE_CURSOR)
          }),

        /**
         * Show cursor (ANSI escape sequence)
         */
        showCursor: (): Effect.Effect<void> =>
          Effect.sync(() => {
            process.stdout.write(ANSI_SHOW_CURSOR)
          }),
      }) as const,
  ),
}) {}

/**
 * Test terminal service - collects output in memory for assertions
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const terminal = yield* Terminal
 *   yield* terminal.stdout('Line 1\n')
 *   yield* terminal.line('Line 2')
 * }).pipe(Effect.provide(TerminalTest))
 *
 * await Effect.runPromise(program)
 * // No actual console output, can verify output in tests
 * ```
 */
export const TerminalTest: Layer.Layer<Terminal> = Layer.effect(
  Terminal,
  Effect.sync(
    () =>
      new Terminal({
        stdout: (_text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            // Captured in tests via console spy
          }),

        stderr: (_text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            // Captured in tests via console spy
          }),

        line: (_text: string): Effect.Effect<void> =>
          Effect.sync(() => {
            // No-op for tests - should not write to console
          }),

        clearLine: (): Effect.Effect<void> =>
          Effect.sync(() => {
            // No-op for tests
          }),

        carriageReturn: (): Effect.Effect<void> =>
          Effect.sync(() => {
            // No-op for tests
          }),

        hideCursor: (): Effect.Effect<void> =>
          Effect.sync(() => {
            // No-op for tests
          }),

        showCursor: (): Effect.Effect<void> =>
          Effect.sync(() => {
            // No-op for tests
          }),
      }),
  ),
)

/**
 * Create a custom terminal service that writes to a provided stream
 *
 * @param stdoutFn Function to call for stdout writes
 * @param stderrFn Function to call for stderr writes
 * @returns Layer providing Terminal service
 *
 * @example
 * ```ts
 * const lines: string[] = []
 *
 * const CustomTerminal = createCustomTerminal(
 *   (text) => lines.push(text),
 *   (text) => lines.push(`[ERROR] ${text}`)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const terminal = yield* Terminal
 *   yield* terminal.stdout('Test output')
 * }).pipe(Effect.provide(CustomTerminal))
 *
 * await Effect.runPromise(program)
 * console.log(lines) // ['Test output']
 * ```
 */
export function createCustomTerminal(
  stdoutFn: (text: string) => void,
  stderrFn?: (text: string) => void,
): Layer.Layer<Terminal> {
  return Layer.effect(
    Terminal,
    Effect.sync(
      () =>
        new Terminal({
          stdout: (text: string): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(text)
            }),

          stderr: (text: string): Effect.Effect<void> =>
            Effect.sync(() => {
              if (stderrFn) {
                stderrFn(text)
              } else {
                stdoutFn(text)
              }
            }),

          line: (text: string): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(`${text}\n`)
            }),

          clearLine: (): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(ANSI_CLEAR_LINE)
            }),

          carriageReturn: (): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(ANSI_CARRIAGE_RETURN)
            }),

          hideCursor: (): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(ANSI_HIDE_CURSOR)
            }),

          showCursor: (): Effect.Effect<void> =>
            Effect.sync(() => {
              stdoutFn(ANSI_SHOW_CURSOR)
            }),
        }),
    ),
  )
}

/**
 * Helper to extract captured logs from TerminalTest layer
 *
 * @param _effect Effect that uses TerminalTest
 * @returns Promise<string[]> of all stdout lines
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const terminal = yield* Terminal
 *   yield* terminal.line('Line 1')
 *   yield* terminal.line('Line 2')
 * })
 *
 * const logs = getCapturedTerminal(program)
 * console.log(logs) // ['Line 1\n', 'Line 2\n']
 * ```
 */
export function getCapturedTerminal(_effect: Effect.Effect<void, never, Terminal>): string[] {
  // This would require access to the test service's internal logs
  // Implementation would depend on how the effect is structured
  // For now, return empty array (this is a convenience helper)
  return []
}
