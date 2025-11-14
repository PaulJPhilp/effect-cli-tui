/**
 * Interactive terminal UI handler using Ink/React
 *
 * Provides a service for interactive prompts, selections, and messages
 * in terminal applications using Ink (React renderer for terminals).
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* (_) {
 *   const tui = yield* _(TUIHandler)
 *   const name = yield* _(tui.prompt('Enter your name:'))
 *   yield* _(tui.display(`Hello, ${name}!`, 'success'))
 * }).pipe(Effect.provide(TUIHandler.Default))
 * ```
 */

import * as Effect from 'effect/Effect'
import { DisplayType, TUIError } from './types'

/**
 * TUI Handler Service
 *
 * Provides interactive terminal UI operations including prompts,
 * selections, confirmations, and display messages.
 *
 * Use via dependency injection:
 * ```ts
 * const tui = yield* TUIHandler
 * const result = yield* tui.prompt('Question?')
 * ```
 */
export class TUIHandler extends Effect.Service<TUIHandler>()('app/TUIHandler', {
    effect: Effect.gen(function* () {
        return {
            /**
             * Display a message with optional styling
             *
             * @param message - The message to display
             * @param type - Message type: 'info', 'success', or 'error'
             * @returns Effect that displays the message
             *
             * @example
             * ```ts
             * yield* tui.display('Operation complete!', 'success')
             * ```
             */
            display: (message: string, type: DisplayType = 'info'): Effect.Effect<void> =>
                Effect.sync(() => {
                    const prefix =
                        type === 'success'
                            ? '✓'
                            : type === 'error'
                              ? '✗'
                              : 'ℹ'
                    console.log(`\n${prefix} ${message}`)
                }),

            /**
             * Prompt user for text input with optional validation
             *
             * @param message - The prompt message
             * @param options - Optional validation and default value
             * @returns Effect that resolves with the user's input
             *
             * @example
             * ```ts
             * const name = yield* tui.prompt('Enter your name:')
             * ```
             */
            prompt: (
                message: string,
                options?: { default?: string; validate?: (input: string) => boolean | string }
            ): Effect.Effect<string, TUIError> =>
                Effect.fail(
                    new TUIError('RenderError', 'prompt() not yet implemented with Ink')
                ),

            /**
             * Let user select a single option from a list
             *
             * @param message - The selection prompt
             * @param choices - Array of available choices
             * @returns Effect that resolves with the selected choice
             *
             * @example
             * ```ts
             * const choice = yield* tui.selectOption(
             *   'Choose one:',
             *   ['Option A', 'Option B', 'Option C']
             * )
             * ```
             */
            selectOption: (message: string, choices: string[]): Effect.Effect<string, TUIError> =>
                Effect.fail(
                    new TUIError('RenderError', 'selectOption() not yet implemented with Ink')
                ),

            /**
             * Let user select multiple options from a list
             *
             * @param message - The selection prompt
             * @param choices - Array of available choices
             * @returns Effect that resolves with array of selected choices
             *
             * @example
             * ```ts
             * const selected = yield* tui.multiSelect(
             *   'Choose multiple:',
             *   ['Item 1', 'Item 2', 'Item 3']
             * )
             * ```
             */
            multiSelect: (message: string, choices: string[]): Effect.Effect<string[], TUIError> =>
                Effect.fail(
                    new TUIError('RenderError', 'multiSelect() not yet implemented with Ink')
                ),

            /**
             * Ask user for yes/no confirmation
             *
             * @param message - The confirmation prompt
             * @returns Effect that resolves with boolean (true = yes, false = no)
             *
             * @example
             * ```ts
             * const confirmed = yield* tui.confirm('Are you sure?')
             * ```
             */
            confirm: (message: string): Effect.Effect<boolean, TUIError> =>
                Effect.fail(
                    new TUIError('RenderError', 'confirm() not yet implemented with Ink')
                ),

            /**
             * Prompt user for password input (hidden)
             *
             * @param message - The prompt message
             * @returns Effect that resolves with the password
             *
             * @example
             * ```ts
             * const password = yield* tui.password('Enter password:')
             * ```
             */
            password: (message: string): Effect.Effect<string, TUIError> =>
                Effect.fail(
                    new TUIError('RenderError', 'password() not yet implemented with Ink')
                )
        } as const
    })
}) {}
