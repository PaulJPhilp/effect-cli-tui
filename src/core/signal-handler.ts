import { Effect } from 'effect'

/**
 * Signal handler for graceful shutdown on SIGINT/SIGTERM.
 *
 * Ensures terminal state is restored and cleanup handlers are called
 * when the user presses Ctrl+C or the process receives a termination signal.
 */

/**
 * List of cleanup handlers to run on signal
 */
const cleanupHandlers: (() => void | Promise<void>)[] = []

/**
 * Whether signal handlers are already registered
 */
let signalsRegistered = false

/**
 * Register a cleanup handler to run on SIGINT/SIGTERM
 *
 * @param handler Function to call during cleanup
 * @returns Function to deregister the handler
 *
 * @example
 * ```ts
 * const deregister = registerCleanupHandler(() => {
 *   process.stdout.write('\x1B[?25h') // Show cursor
 * })
 *
 * // Later, deregister if needed
 * deregister()
 * ```
 */
export function registerCleanupHandler(handler: () => void | Promise<void>): () => void {
  cleanupHandlers.push(handler)

  // Register signal handlers on first registration
  if (!signalsRegistered) {
    signalsRegistered = true
    setupSignalHandlers()
  }

  // Return deregister function
  return () => {
    const index = cleanupHandlers.indexOf(handler)
    if (index >= 0) {
      cleanupHandlers.splice(index, 1)
    }
  }
}

/**
 * Setup SIGINT and SIGTERM handlers
 */
function setupSignalHandlers(): void {
  const handleSignal = async (signal: string) => {
    // Run all cleanup handlers in reverse order
    for (let i = cleanupHandlers.length - 1; i >= 0; i--) {
      try {
        const handler = cleanupHandlers[i]
        if (handler) {
          await handler()
        }
      } catch (error) {
        // Silently ignore cleanup errors to avoid masking the actual error
      }
    }

    // Ensure cursor is visible as final fallback
    try {
      process.stdout.write('\x1B[?25h')
    } catch {
      // Ignore
    }

    // Exit with code 130 (standard for SIGINT)
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }

  process.on('SIGINT', () => {
    void handleSignal('SIGINT')
  })
  process.on('SIGTERM', () => {
    void handleSignal('SIGTERM')
  })
}

/**
 * Create an Effect that registers a cleanup handler and automatically deregisters on completion
 *
 * @param cleanup Function to run during cleanup
 * @returns Effect that ensures cleanup is deregistered when done
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   yield* withCleanup(() => {
 *     process.stdout.write('\x1B[?25h') // Show cursor
 *   })
 *   // ... rest of program ...
 * })
 * ```
 */
export function withCleanup(cleanup: () => void | Promise<void>): Effect.Effect<void> {
  return Effect.scoped(
    Effect.acquireRelease(
      Effect.sync(() => registerCleanupHandler(cleanup)),
      (deregister) => Effect.sync(() => deregister())
    ).pipe(Effect.flatMap(() => Effect.void))
  )
}

/**
 * Ensure terminal state is restored on signal
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   yield* ensureTerminalCleanup()
 *   process.stdout.write('\x1B[?25l') // Hide cursor
 *   // ... rest of program ...
 * })
 * ```
 */
export function ensureTerminalCleanup(): Effect.Effect<void> {
  return withCleanup(() => {
    // Show cursor
    process.stdout.write('\x1B[?25h')
    // Clear current line
    process.stdout.write('\r\x1B[K')
  })
}

/**
 * Create a cleanup handler that shows cursor and clears line
 *
 * @example
 * ```ts
 * const deregister = registerCleanupHandler(createTerminalCleanup())
 * ```
 */
export function createTerminalCleanup(): () => void {
  return () => {
    process.stdout.write('\x1B[?25h')
    process.stdout.write('\r\x1B[K')
  }
}

/**
 * Check if a signal handler has been registered
 */
export function hasSignalHandlers(): boolean {
  return signalsRegistered
}

/**
 * Clear all registered cleanup handlers (useful for testing)
 */
export function clearCleanupHandlers(): void {
  cleanupHandlers.length = 0
  signalsRegistered = false
}

/**
 * Get count of registered cleanup handlers (useful for debugging)
 */
export function getCleanupHandlerCount(): number {
  return cleanupHandlers.length
}
