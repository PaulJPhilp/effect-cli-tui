import { Effect } from "effect";
import { render, type Instance } from "ink";
import type React from "react";
import { isError } from "../../core/error-utils";
import type { InkService as InkServiceApi } from "./api";
import { InkError } from "./errors";

/**
 * Ink service for rendering React/Ink components
 *
 * Provides methods for rendering Ink components with proper resource management
 * and Effect composition.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const ink = yield* InkService
 *   const selected = yield* ink.renderWithResult<string>((onComplete) =>
 *     <SelectComponent choices={items} onSubmit={onComplete} />
 *   )
 *   return selected
 * }).pipe(Effect.provide(InkService.Default))
 * ```
 */
export class InkService extends Effect.Service<InkService>()("app/InkService", {
  effect: Effect.sync(
    (): InkServiceApi =>
      ({
        renderComponent: (
          component: React.ReactElement
        ): Effect.Effect<void, InkError> =>
          Effect.acquireUseRelease(
            // Acquire: Create Ink instance
            Effect.try({
              try: () => render(component),
              catch: (err: unknown) =>
                new InkError(
                  "RenderError",
                  `Unable to display the interactive component. ${isError(err) ? err.message : String(err)}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.`
                ),
            }),
            // Use: Wait for component to exit
            (instance) =>
              Effect.tryPromise({
                try: () => instance.waitUntilExit(),
                catch: (err: unknown) =>
                  new InkError(
                    "RenderError",
                    `Component execution failed. ${isError(err) ? err.message : String(err)}`
                  ),
              }),
            // Release: ALWAYS unmount, even on error/interruption
            (instance) =>
              Effect.sync(() => {
                if (instance) {
                  instance.unmount();
                }
              })
          ),

        renderWithResult: <T>(
          component: (onComplete: (value: T) => void) => React.ReactElement
        ): Effect.Effect<T, InkError> =>
          Effect.acquireUseRelease(
            // Acquire: Create Ink instance and promise with cancellation support
            Effect.gen(function* () {
              let resolve: (value: T) => void;
              let reject: (err: unknown) => void;
              let completed = false;
              let sigintHandler: (() => void) | null = null;

              const promise = new Promise<T>((res, rej) => {
                resolve = res;
                reject = rej;
              });

              const handleComplete = (value: T) => {
                if (!completed) {
                  completed = true;
                  // Remove SIGINT handler before resolving
                  if (sigintHandler) {
                    process.removeListener("SIGINT", sigintHandler);
                    sigintHandler = null;
                  }
                  resolve(value);
                }
              };

              // Set up cancellation handler for SIGINT (Ctrl+C)
              sigintHandler = () => {
                if (!completed) {
                  completed = true;
                  // Remove handler before rejecting
                  if (sigintHandler) {
                    process.removeListener("SIGINT", sigintHandler);
                    sigintHandler = null;
                  }
                  // Prevent default SIGINT behavior (don't exit immediately)
                  // The error will be handled by the Effect error channel
                  reject(
                    new InkError(
                      "TerminalError",
                      "Operation cancelled by user (Ctrl+C)"
                    )
                  );
                }
              };

              // Register SIGINT handler for cancellation
              // Use prependListener to ensure our handler runs first
              process.prependListener("SIGINT", sigintHandler);

              const instance = yield* Effect.try({
                try: () => render(component(handleComplete)),
                catch: (err: unknown) => {
                  // Clean up handler on render error
                  if (sigintHandler) {
                    process.removeListener("SIGINT", sigintHandler);
                  }
                  return new InkError(
                    "RenderError",
                    `Unable to display the interactive component. ${isError(err) ? err.message : String(err)}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.`
                  );
                },
              });

              return { instance, promise, completed, sigintHandler };
            }),
            // Use: Wait for component to complete
            ({ promise }) =>
              Effect.tryPromise({
                try: () => promise,
                catch: (err: unknown) =>
                  err instanceof InkError
                    ? err
                    : new InkError(
                        "ComponentError",
                        `Component execution failed. ${isError(err) ? err.message : String(err)}`
                      ),
              }),
            // Release: ALWAYS unmount and clean up SIGINT handler
            ({ instance, sigintHandler }) =>
              Effect.sync(() => {
                // Remove SIGINT handler
                if (sigintHandler) {
                  process.removeListener("SIGINT", sigintHandler);
                }
                // Unmount instance
                if (instance) {
                  instance.unmount();
                }
              })
          ),
      }) as const
  ),
}) {}

