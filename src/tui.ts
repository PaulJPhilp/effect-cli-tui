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

import { Console, Effect } from 'effect'
import React from 'react'
import { Confirm } from './components/Confirm'
import { Input } from './components/Input'
import { MultiSelect } from './components/MultiSelect'
import { Password } from './components/Password'
import { Select } from './components/Select'
import { DEFAULT_DISPLAY_TYPE, getDisplayIcon } from './core/icons'
import { InkService } from './services/ink'
import { type DisplayType, InkError, type SelectOption, TUIError } from './types'

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
    const ink = yield* InkService

    return {
      /**
       * Display a message with optional styling
       *
       * @param message - The message to display
       * @param type - Message type: 'info', 'success', 'error', or 'warning'
       * @returns Effect that displays the message
       *
       * @example
       * ```ts
       * yield* tui.display('Operation complete!', 'success')
       * ```
       */
      display: (message: string, type: DisplayType = DEFAULT_DISPLAY_TYPE): Effect.Effect<void> =>
        Effect.gen(function* () {
          const prefix = getDisplayIcon(type)
          yield* Console.log(`\n${prefix} ${message}`)
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
       * const name = yield* tui.prompt('Enter your name:', { default: 'Guest' })
       * ```
       */
      prompt: (
        message: string,
        options?: {
          default?: string
          validate?: (input: string) => boolean | string
        },
      ): Effect.Effect<string, TUIError> =>
        ink
          .renderWithResult<string>((onComplete) =>
            React.createElement(Input, {
              message,
              defaultValue: options?.default,
              validate: options?.validate,
              onSubmit: onComplete,
            }),
          )
          .pipe(
            Effect.mapError((err) => {
              if (err instanceof InkError) {
                // Map cancellation to TUIError with Cancelled reason
                if (
                  err.reason === 'TerminalError' &&
                  err.message.toLowerCase().includes('cancelled')
                ) {
                  return new TUIError('Cancelled', err.message)
                }
                return new TUIError('RenderError', err.message)
              }
              return new TUIError('RenderError', String(err))
            }),
          ),

      /**
       * Let user select a single option from a list
       *
       * @param message - The selection prompt
       * @param choices - Array of available choices (strings or SelectOption objects with descriptions)
       * @returns Effect that resolves with the selected choice value
       *
       * @example
       * ```ts
       * // Simple string array
       * const choice = yield* tui.selectOption(
       *   'Choose one:',
       *   ['Option A', 'Option B', 'Option C']
       * )
       *
       * // With descriptions
       * const choice = yield* tui.selectOption(
       *   'Choose template:',
       *   [
       *     { label: 'Basic', value: 'basic', description: 'Simple starter template' },
       *     { label: 'CLI', value: 'cli', description: 'Command-line interface template' }
       *   ]
       * )
       * ```
       */
      selectOption: (
        message: string,
        choices: string[] | SelectOption[],
      ): Effect.Effect<string, TUIError> =>
        ink
          .renderWithResult<string>((onComplete) =>
            React.createElement(Select, {
              message,
              choices,
              onSubmit: onComplete,
            }),
          )
          .pipe(
            Effect.mapError((err) => {
              if (err instanceof InkError) {
                // Map cancellation to TUIError with Cancelled reason
                if (
                  err.reason === 'TerminalError' &&
                  err.message.toLowerCase().includes('cancelled')
                ) {
                  return new TUIError('Cancelled', err.message)
                }
                return new TUIError('RenderError', err.message)
              }
              return new TUIError('RenderError', String(err))
            }),
          ),

      /**
       * Let user select multiple options from a list
       *
       * @param message - The selection prompt
       * @param choices - Array of available choices (strings or SelectOption objects with descriptions)
       * @returns Effect that resolves with array of selected choice values
       *
       * @example
       * ```ts
       * // Simple string array
       * const selected = yield* tui.multiSelect(
       *   'Choose multiple:',
       *   ['Item 1', 'Item 2', 'Item 3']
       * )
       *
       * // With descriptions
       * const selected = yield* tui.multiSelect(
       *   'Choose features:',
       *   [
       *     { label: 'Testing', value: 'test', description: 'Unit and integration tests' },
       *     { label: 'Linting', value: 'lint', description: 'Ultracite configuration' }
       *   ]
       * )
       * ```
       */
      multiSelect: (
        message: string,
        choices: string[] | SelectOption[],
      ): Effect.Effect<string[], TUIError> =>
        ink
          .renderWithResult<string[]>((onComplete) =>
            React.createElement(MultiSelect, {
              message,
              choices,
              onSubmit: onComplete,
            }),
          )
          .pipe(
            Effect.mapError((err) => {
              if (err instanceof InkError) {
                // Map cancellation to TUIError with Cancelled reason
                if (
                  err.reason === 'TerminalError' &&
                  err.message.toLowerCase().includes('cancelled')
                ) {
                  return new TUIError('Cancelled', err.message)
                }
                return new TUIError('RenderError', err.message)
              }
              return new TUIError('RenderError', String(err))
            }),
          ),

      /**
       * Ask user for yes/no confirmation
       *
       * @param message - The confirmation prompt
       * @param options - Optional default value
       * @returns Effect that resolves with boolean (true = yes, false = no)
       *
       * @example
       * ```ts
       * const confirmed = yield* tui.confirm('Are you sure?', { default: false })
       * ```
       */
      confirm: (
        message: string,
        options?: { default?: boolean },
      ): Effect.Effect<boolean, TUIError> =>
        ink
          .renderWithResult<boolean>((onComplete) =>
            React.createElement(Confirm, {
              message,
              default: options?.default,
              onSubmit: onComplete,
            }),
          )
          .pipe(
            Effect.mapError((err) => {
              if (err instanceof InkError) {
                // Map cancellation to TUIError with Cancelled reason
                if (
                  err.reason === 'TerminalError' &&
                  err.message.toLowerCase().includes('cancelled')
                ) {
                  return new TUIError('Cancelled', err.message)
                }
                return new TUIError('RenderError', err.message)
              }
              return new TUIError('RenderError', String(err))
            }),
          ),

      /**
       * Prompt user for password input (hidden)
       *
       * @param message - The prompt message
       * @param options - Optional validation function
       * @returns Effect that resolves with the password
       *
       * @example
       * ```ts
       * const password = yield* tui.password('Enter password:', {
       *   validate: (pwd) => pwd.length >= 8 || 'Password must be at least 8 characters'
       * })
       * ```
       */
      password: (
        message: string,
        options?: {
          validate?: (input: string) => boolean | string
        },
      ): Effect.Effect<string, TUIError> =>
        ink
          .renderWithResult<string>((onComplete) =>
            React.createElement(Password, {
              message,
              validate: options?.validate,
              onSubmit: onComplete,
            }),
          )
          .pipe(
            Effect.mapError((err) => {
              if (err instanceof InkError) {
                // Map cancellation to TUIError with Cancelled reason
                if (
                  err.reason === 'TerminalError' &&
                  err.message.toLowerCase().includes('cancelled')
                ) {
                  return new TUIError('Cancelled', err.message)
                }
                return new TUIError('RenderError', err.message)
              }
              return new TUIError('RenderError', String(err))
            }),
          ),
    } as const
  }),
  dependencies: [InkService.Default],
}) {}
