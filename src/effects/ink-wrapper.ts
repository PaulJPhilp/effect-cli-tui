/**
 * Effect wrapper for Ink render()
 *
 * This module bridges React/Ink imperative rendering with Effect's
 * functional composition model.
 */

import * as Effect from 'effect/Effect'
import { Instance, render } from 'ink'
import type React from 'react'
import { InkError } from '../types'

/**
 * Wrap Ink component rendering in Effect with proper resource management
 *
 * Guarantees cleanup of Ink instance even if the effect fails or is interrupted.
 *
 * @param component React component to render
 * @returns Effect that resolves when component unmounts
 *
 * @example
 * ```ts
 * yield* Effect.gen(function* (_) {
 *   yield* renderInkComponent(<MyComponent />)
 *   console.log('Component unmounted')
 * })
 * ```
 */
export function renderInkComponent(
    component: React.ReactElement
): Effect.Effect<void, InkError> {
    return Effect.tryPromise({
        try: async () => {
            const instance = render(component)
            try {
                await instance.waitUntilExit()
            } finally {
                instance.unmount()
            }
        },
        catch: (err: unknown) =>
            new InkError(
                'RenderError',
                `Failed to render component: ${err instanceof Error ? err.message : String(err)}`
            )
    })
}

/**
 * Wrap Ink component that returns a value with proper resource management
 *
 * Component receives onComplete callback to pass result and unmount.
 * Guarantees cleanup of Ink instance.
 *
 * @param component Function that returns a component receiving onComplete
 * @returns Effect that resolves with the component's return value
 *
 * @example
 * ```ts
 * yield* Effect.gen(function* (_) {
 *   const selected = yield* (
 *     renderInkWithResult<string>((onComplete) =>
 *       <SelectComponent choices={items} onSubmit={onComplete} />
 *     )
 *   )
 *   console.log(`You selected: ${selected}`)
 * })
 * ```
 */
export function renderInkWithResult<T>(
    component: (onComplete: (value: T) => void) => React.ReactElement
): Effect.Effect<T, InkError> {
    return Effect.tryPromise({
        try: () =>
            new Promise<T>((resolve, reject) => {
                let instance: Instance | null = null

                try {
                    const handleComplete = (value: T) => {
                        if (instance) {
                            instance.unmount()
                        }
                        resolve(value)
                    }

                    instance = render(component(handleComplete))
                } catch (err) {
                    reject(
                        new InkError(
                            'RenderError',
                            `Failed to render component: ${err instanceof Error ? err.message : String(err)}`
                        )
                    )
                }
            }),
        catch: (err: unknown) =>
            err instanceof InkError
                ? err
                : new InkError(
                      'RenderError',
                      `Failed to render component: ${err instanceof Error ? err.message : String(err)}`
                  )
    })
}
