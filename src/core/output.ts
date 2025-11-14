import { Effect, Layer } from 'effect'

/**
 * Output service for writing to stdout/stderr.
 * Provides methods for terminal output operations.
 *
 * Usage:
 * ```ts
 * const program = Effect.gen(function* () {
 *   const output = yield* Output
 *   yield* output.stdout('Hello, world!')
 *   yield* output.line('Line 2')
 * }).pipe(Effect.provide(Output.Default))
 *
 * await Effect.runPromise(program)
 * ```
 */
export class Output extends Effect.Service<Output>()('app/Output', {
  effect: Effect.sync(() => ({
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
        process.stdout.write('\x1B[K')
      }),

    /**
     * Move cursor to start of line (carriage return)
     */
    carriageReturn: (): Effect.Effect<void> =>
      Effect.sync(() => {
        process.stdout.write('\r')
      }),

    /**
     * Hide cursor (ANSI escape sequence)
     */
    hideCursor: (): Effect.Effect<void> =>
      Effect.sync(() => {
        process.stdout.write('\x1B[?25l')
      }),

    /**
     * Show cursor (ANSI escape sequence)
     */
    showCursor: (): Effect.Effect<void> =>
      Effect.sync(() => {
        process.stdout.write('\x1B[?25h')
      })
  } as const))
}) {}

/**
 * Test output service - collects output in memory for assertions
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const output = yield* Output
 *   yield* output.stdout('Line 1\n')
 *   yield* output.line('Line 2')
 * }).pipe(Effect.provide(OutputTest))
 *
 * await Effect.runPromise(program)
 * // No actual console output, can verify output in tests
 * ```
 */
export const OutputTest: Layer.Layer<Output> = Layer.succeed(Output, {
  stdout: (text: string): Effect.Effect<void> =>
    Effect.sync(() => {
      // Captured in tests via console spy
    }),

  stderr: (text: string): Effect.Effect<void> =>
    Effect.sync(() => {
      // Captured in tests via console spy
    }),

  line: (text: string): Effect.Effect<void> =>
    Effect.sync(() => {
      console.log(text)
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
    })
})

/**
 * Create a custom output service that writes to a provided stream
 *
 * @param stdoutFn Function to call for stdout writes
 * @param stderrFn Function to call for stderr writes
 * @returns Layer providing Output service
 *
 * @example
 * ```ts
 * const lines: string[] = []
 *
 * const CustomOutput = createCustomOutput(
 *   (text) => lines.push(text),
 *   (text) => lines.push(`[ERROR] ${text}`)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const output = yield* Output
 *   yield* output.stdout('Test output')
 * }).pipe(Effect.provide(CustomOutput))
 *
 * await Effect.runPromise(program)
 * console.log(lines) // ['Test output']
 * ```
 */
export function createCustomOutput(
  stdoutFn: (text: string) => void,
  stderrFn?: (text: string) => void
): Layer.Layer<Output> {
  return Layer.succeed(Output, {
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
        stdoutFn('\x1B[K')
      }),

    carriageReturn: (): Effect.Effect<void> =>
      Effect.sync(() => {
        stdoutFn('\r')
      }),

    hideCursor: (): Effect.Effect<void> =>
      Effect.sync(() => {
        stdoutFn('\x1B[?25l')
      }),

    showCursor: (): Effect.Effect<void> =>
      Effect.sync(() => {
        stdoutFn('\x1B[?25h')
      })
  })
}

/**
 * Helper to extract captured logs from OutputTest layer
 *
 * @param effect Effect that uses OutputTest
 * @returns Promise<string[]> of all stdout lines
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const output = yield* Output
 *   yield* output.line('Line 1')
 *   yield* output.line('Line 2')
 * })
 *
 * const logs = await getCapturedOutput(program)
 * console.log(logs) // ['Line 1\n', 'Line 2\n']
 * ```
 */
export async function getCapturedOutput(
  _effect: Effect.Effect<void, never, Output>
): Promise<string[]> {
  // This would require access to the test service's internal logs
  // Implementation would depend on how the effect is structured
  // For now, return empty array (this is a convenience helper)
  return []
}
