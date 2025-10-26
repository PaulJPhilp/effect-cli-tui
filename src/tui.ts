import {
    checkbox as inquirerCheckbox,
    confirm as inquirerConfirm,
    input as inquirerInput,
    select as inquirerSelect
} from '@inquirer/prompts'
import * as Effect from 'effect/Effect'
import { PromptOptions, SelectOption, TUIError } from './types'

export class TUIHandler {
    selectOption(
        message: string,
        options: SelectOption[]
    ): Effect.Effect<string, TUIError> {
        return Effect.tryPromise({
            try: async () => {
                if (options.length === 0) {
                    throw new Error('No options provided')
                }

                const result = await inquirerSelect({
                    message,
                    choices: options.map((opt) => ({
                        name: opt.label,
                        value: opt.value,
                        description: opt.description
                    }))
                })

                return result
            },
            catch: (err) =>
                new TUIError(
                    'RenderError',
                    `Failed to render select dialog: ${err instanceof Error ? err.message : String(err)}`
                )
        })
    }

    prompt(
        message: string,
        options?: PromptOptions
    ): Effect.Effect<string, TUIError> {
        return Effect.tryPromise({
            try: async () => {
                const result = await inquirerInput({
                    message,
                    default: options?.default
                })

                return result
            },
            catch: (err) =>
                new TUIError(
                    'RenderError',
                    `Failed to render prompt dialog: ${err instanceof Error ? err.message : String(err)}`
                )
        })
    }

    confirm(message: string): Effect.Effect<boolean, TUIError> {
        return Effect.tryPromise({
            try: async () => {
                const result = await inquirerConfirm({
                    message
                })

                return result
            },
            catch: (err) =>
                new TUIError(
                    'RenderError',
                    `Failed to render confirm dialog: ${err instanceof Error ? err.message : String(err)}`
                )
        })
    }

    multiSelect(
        message: string,
        options: SelectOption[]
    ): Effect.Effect<string[], TUIError> {
        return Effect.tryPromise({
            try: async () => {
                if (options.length === 0) {
                    throw new Error('No options provided')
                }

                const result = await inquirerCheckbox({
                    message,
                    choices: options.map((opt) => ({
                        name: opt.label,
                        value: opt.value,
                        description: opt.description
                    }))
                })

                return result
            },
            catch: (err) =>
                new TUIError(
                    'RenderError',
                    `Failed to render multi-select dialog: ${err instanceof Error ? err.message : String(err)}`
                )
        })
    }

    display(
        message: string,
        type: 'info' | 'success' | 'error'
    ): Effect.Effect<void> {
        return Effect.sync(() => {
            const prefix =
                type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'
            console.log(`\n${prefix} ${message}`)
        })
    }
}
