import type { Effect } from "effect";
import type React from "react";
import type { InkError } from "../../types";

/**
 * Ink service API interface
 *
 * Provides methods for rendering Ink/React components with proper
 * resource management and Effect composition.
 */
export interface InkService {
  /**
   * Render an Ink component and wait for it to unmount
   *
   * Guarantees cleanup of Ink instance even if the effect fails or is interrupted.
   *
   * @param component - React component to render
   * @returns Effect that resolves when component unmounts
   *
   * @example
   * ```ts
   * const ink = yield* InkService
   * yield* ink.renderComponent(<MyComponent />)
   * ```
   */
  renderComponent: (
    component: React.ReactElement
  ) => Effect.Effect<void, InkError>;

  /**
   * Render an Ink component that returns a value
   *
   * Component receives onComplete callback to pass result and unmount.
   * Guarantees cleanup of Ink instance.
   *
   * @param component - Function that returns a component receiving onComplete
   * @returns Effect that resolves with the component's return value
   *
   * @example
   * ```ts
   * const ink = yield* InkService
   * const selected = yield* ink.renderWithResult<string>((onComplete) =>
   *   <SelectComponent choices={items} onSubmit={onComplete} />
   * )
   * ```
   */
  renderWithResult: <T>(
    component: (onComplete: (value: T) => void) => React.ReactElement
  ) => Effect.Effect<T, InkError>;
}
