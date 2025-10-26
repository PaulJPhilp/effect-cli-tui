/**
 * Effect wrapper for Ink render()
 *
 * This module bridges React/Ink imperative rendering with Effect's
 * functional composition model.
 */

import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import { Instance, render } from 'ink'
import type React from 'react'

/**
 * Error type for Ink rendering failures
 */
export class InkError extends Data.TaggedError('InkError') {
    constructor(
        readonly reason: string,
        readonly message: string
    ) {
        super()
    }
}

/**
 * Wrap Ink component rendering in Effect
 *
 * @param component React component to render
 * @returns Effect that resolves when component unmounts
 *
 * @example
 * const myApp = <MyComponent />
 * const effect = renderInkComponent(myApp)
 * Effect.runPromise(effect).then(() => console.log('Done'))
 */
export function renderInkComponent(
    component: React.ReactElement
): Effect.Effect<void, InkError> {
    return Effect.tryPromise({
        try: () =>
            new Promise<void>((resolve, reject) => {
                try {
                    const instance: Instance = render(component)

                    instance
                        .waitUntilExit()
                        .then(() => {
                            instance.unmount()
                            resolve()
                        })
                        .catch((err: unknown) => {
                            instance.unmount()
                            reject(err)
                        })
                } catch (err) {
                    reject(err)
                }
            }),
        catch: (err: unknown) =>
            new InkError(
                'RenderError',
                `Failed to render component: ${err instanceof Error ? err.message : String(err)}`
            )
    })
}

/**
 * Wrap Ink component that returns a value
 *
 * Component receives onComplete callback to pass result and unmount
 *
 * @param component Function that returns a component receiving onComplete
 * @returns Effect that resolves with the component's return value
 *
 * @example
 * const result = yield* Effect.gen(function* (_) {
 *   return yield* _(
 *     renderInkWithResult<string>((onComplete) =>
 *       <MySelectComponent onComplete={onComplete} />
 *     )
 *   )
 * })
 */
export function renderInkWithResult<T>(
    component: (onComplete: (value: T) => void) => React.ReactElement
): Effect.Effect<T, InkError> {
    return Effect.tryPromise({
        try: () =>
            new Promise<T>((resolve, reject) => {
                try {
                    let instance: Instance | null = null

                    const handleComplete = (value: T) => {
                        if (instance) {
                            instance.unmount()
                        }
                        resolve(value)
                    }

                    instance = render(component(handleComplete))
                } catch (err) {
                    reject(err)
                }
            }),
        catch: (err: unknown) =>
            new InkError(
                'RenderError',
                `Failed to render component: ${err instanceof Error ? err.message : String(err)}`
            )
    })
}
