/**
 * Backward compatibility wrappers for InkService
 *
 * These convenience functions wrap the InkService for easier usage.
 * New code should use InkService directly via dependency injection.
 *
 * @deprecated Use InkService directly via dependency injection instead
 */

import { Effect } from "effect";
import type React from "react";
import { InkService } from "../services/ink";
import type { InkError } from "../types";

/**
 * Wrap Ink component rendering in Effect with proper resource management
 *
 * @deprecated Use `InkService.renderComponent()` instead
 *
 * @example
 * ```ts
 * // Old way (still works)
 * yield* renderInkComponent(<MyComponent />)
 *
 * // New way (preferred)
 * const ink = yield* InkService
 * yield* ink.renderComponent(<MyComponent />)
 * ```
 */
export function renderInkComponent(
  component: React.ReactElement
): Effect.Effect<void, InkError> {
  return Effect.gen(function* () {
    const ink = yield* InkService;
    yield* ink.renderComponent(component);
  }).pipe(Effect.provide(InkService.Default));
}

/**
 * Wrap Ink component that returns a value with proper resource management
 *
 * @deprecated Use `InkService.renderWithResult()` instead
 *
 * @example
 * ```ts
 * // Old way (still works)
 * const selected = yield* renderInkWithResult<string>((onComplete) =>
 *   <SelectComponent choices={items} onSubmit={onComplete} />
 * )
 *
 * // New way (preferred)
 * const ink = yield* InkService
 * const selected = yield* ink.renderWithResult<string>((onComplete) =>
 *   <SelectComponent choices={items} onSubmit={onComplete} />
 * )
 * ```
 */
export function renderInkWithResult<T>(
  component: (onComplete: (value: T) => void) => React.ReactElement
): Effect.Effect<T, InkError> {
  return Effect.gen(function* () {
    const ink = yield* InkService;
    return yield* ink.renderWithResult(component);
  }).pipe(Effect.provide(InkService.Default));
}
