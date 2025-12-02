/**
 * Layout service implementation
 *
 * Manages persistent TUI layout state using Effect.Ref for state management.
 */

import { Effect, Ref } from "effect";
import type React from "react";
import type { LayoutService as LayoutServiceApi } from "./api";
import type { LayoutError } from "./errors";
import type { OutputItem } from "./types";

/**
 * Layout state stored in Ref
 */
interface LayoutState {
  outputItems: OutputItem[];
  statusStrip?: React.ReactNode;
}

/**
 * Layout service
 *
 * Provides methods to manage persistent TUI layout state.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const layout = yield* LayoutService
 *   yield* layout.addText("Hello, world!")
 *   yield* layout.addPanel(<MyPanel />)
 * })
 * ```
 */
export class LayoutService extends Effect.Service<LayoutService>()(
  "app/LayoutService",
  {
    effect: Effect.gen(function* () {
      const stateRef = yield* Ref.make<LayoutState>({
        outputItems: [],
      });

      return {
        addText: (content: string): Effect.Effect<void, LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            yield* Ref.set(stateRef, {
              ...state,
              outputItems: [
                ...state.outputItems,
                { _tag: "text", content } as const,
              ],
            });
          }),

        addPanel: (
          panel: React.ReactElement
        ): Effect.Effect<void, LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            yield* Ref.set(stateRef, {
              ...state,
              outputItems: [
                ...state.outputItems,
                { _tag: "panel", panel } as const,
              ],
            });
          }),

        clearOutput: (): Effect.Effect<void, LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            yield* Ref.set(stateRef, {
              ...state,
              outputItems: [],
            });
          }),

        getOutputItems: (): Effect.Effect<readonly OutputItem[], LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            return state.outputItems;
          }),

        setStatusStrip: (
          content: React.ReactNode
        ): Effect.Effect<void, LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            yield* Ref.set(stateRef, {
              ...state,
              statusStrip: content,
            });
          }),

        clearStatusStrip: (): Effect.Effect<void, LayoutError> =>
          Effect.gen(function* () {
            const state = yield* Ref.get(stateRef);
            yield* Ref.set(stateRef, {
              ...state,
              statusStrip: undefined,
            });
          }),
      } as const satisfies LayoutServiceApi;
    }),
    dependencies: [],
  }
) {}
