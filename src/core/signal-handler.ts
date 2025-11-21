import { Effect, Ref } from "effect";
import {
  ANSI_CARRIAGE_RETURN_CLEAR,
  ANSI_SHOW_CURSOR,
  EXIT_CODE_SIGINT,
  EXIT_CODE_SIGTERM,
} from "./icons";

/**
 * Signal handler for graceful shutdown on SIGINT/SIGTERM.
 *
 * Ensures terminal state is restored and cleanup handlers are called
 * when the user presses Ctrl+C or the process receives a termination signal.
 */

/**
 * List of cleanup handlers to run on signal
 */
const cleanupHandlers: (() => void | Promise<void>)[] = [];

/**
 * Atomic reference for whether signal handlers are already registered
 * Uses Effect.Ref for thread-safe atomic updates
 */
const signalsRegisteredRef = Ref.unsafeMake(false);

/**
 * Register a cleanup handler to run on SIGINT/SIGTERM
 *
 * @param handler Function to call during cleanup
 * @returns Effect that yields a function to deregister the handler
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const deregister = yield* registerCleanupHandler(() => {
 *     process.stdout.write('\x1B[?25h') // Show cursor
 *   })
 *
 *   // Later, deregister if needed
 *   deregister()
 * })
 * ```
 */
export function registerCleanupHandler(
  handler: () => void | Promise<void>
): Effect.Effect<() => void> {
  return Effect.gen(function* () {
    cleanupHandlers.push(handler);

    // Register signal handlers on first registration (atomic check-and-set)
    yield* Ref.modify(signalsRegisteredRef, (registered) => {
      if (!registered) {
        setupSignalHandlers();
        return [undefined, true] as const;
      }
      return [undefined, registered] as const;
    });

    // Return deregister function
    return () => {
      const index = cleanupHandlers.indexOf(handler);
      if (index >= 0) {
        cleanupHandlers.splice(index, 1);
      }
    };
  });
}

/**
 * Setup SIGINT and SIGTERM handlers
 */
function setupSignalHandlers(): void {
  const handleSignal = async (signal: string) => {
    // Run all cleanup handlers in reverse order
    for (let i = cleanupHandlers.length - 1; i >= 0; i--) {
      const handler = cleanupHandlers[i];
      if (handler) {
        await Effect.runPromise(
          Effect.tryPromise({
            try: () => {
              const result = handler();
              return result instanceof Promise ? result : Promise.resolve();
            },
            catch: () => null, // Silently ignore cleanup errors to avoid masking the actual error
          })
        );
      }
    }

    // Ensure cursor is visible as final fallback
    await Effect.runPromise(
      Effect.try({
        try: () => process.stdout.write(ANSI_SHOW_CURSOR),
        catch: () => null, // Ignore
      })
    );

    // Exit with standard exit codes
    process.exit(signal === "SIGINT" ? EXIT_CODE_SIGINT : EXIT_CODE_SIGTERM);
  };

  process.on("SIGINT", () => {
    handleSignal("SIGINT").catch(() => {
      // Ignore errors in signal handler
    });
  });
  process.on("SIGTERM", () => {
    handleSignal("SIGTERM").catch(() => {
      // Ignore errors in signal handler
    });
  });
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
export function withCleanup(
  cleanup: () => void | Promise<void>
): Effect.Effect<void> {
  return Effect.scoped(
    Effect.acquireRelease(registerCleanupHandler(cleanup), (deregister) =>
      Effect.sync(() => deregister())
    ).pipe(Effect.flatMap(() => Effect.void))
  );
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
    process.stdout.write(ANSI_SHOW_CURSOR);
    // Clear current line
    process.stdout.write(ANSI_CARRIAGE_RETURN_CLEAR);
  });
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
    process.stdout.write(ANSI_SHOW_CURSOR);
    process.stdout.write(ANSI_CARRIAGE_RETURN_CLEAR);
  };
}

/**
 * Check if a signal handler has been registered
 */
export function hasSignalHandlers(): boolean {
  return Effect.runSync(Ref.get(signalsRegisteredRef));
}

/**
 * Clear all registered cleanup handlers (useful for testing)
 */
export function clearCleanupHandlers(): void {
  cleanupHandlers.length = 0;
  Effect.runSync(Ref.set(signalsRegisteredRef, false));
}

/**
 * Get count of registered cleanup handlers (useful for debugging)
 */
export function getCleanupHandlerCount(): number {
  return cleanupHandlers.length;
}
