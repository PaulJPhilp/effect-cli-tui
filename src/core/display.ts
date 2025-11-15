import { Effect } from 'effect'
import type { DisplayOptions, DisplayType, JsonDisplayOptions } from '../types'
import { applyChalkStyle } from './colors'

/**
 * Enhanced display function with style support
 */
export function displayOutput(
    message: string,
    type: DisplayType = 'info',
    options: DisplayOptions = {}
): Effect.Effect<void> {
    return Effect.sync(() => {
        const prefix = options.prefix ??
            (type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ')

        const styledMessage = options.style ? applyChalkStyle(message, options.style) : message
        const styledPrefix = options.style ? applyChalkStyle(prefix, options.style) : prefix

        const output = options.newline !== false ? `\n${styledPrefix} ${styledMessage}` : `${styledPrefix} ${styledMessage}`
        console.log(output)
    })
}

/**
 * Enhanced display function for single-line messages with style support
 */
export function display(
    message: string,
    options: DisplayOptions = {}
): Effect.Effect<void> {
    const { type = 'info', ...restOptions } = options
    return displayOutput(message, type, restOptions)
}

/**
 * Enhanced display multiple lines with style support
 */
export function displayLines(
    lines: string[],
    options: DisplayOptions = {}
): Effect.Effect<void> {
    const { type = 'info', ...restOptions } = options

    return Effect.gen(function* () {
        for (const line of lines) {
            yield* displayOutput(line, type, { ...restOptions, newline: true })
        }
    })
}

/**
 * Enhanced display JSON with style support
 */
export function displayJson(
    data: unknown,
    options: JsonDisplayOptions = {}
): Effect.Effect<void> {
    const { type = 'info', spaces = 2, prefix: showPrefix = true } = options

    return Effect.sync(() => {
        const jsonString = JSON.stringify(data, null, spaces)

        if (!showPrefix) {
            const output = options.newline !== false ? `\n${jsonString}` : jsonString
            console.log(output)
            return
        }

        const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'
        const styledPrefix = options.style ? applyChalkStyle(prefix, options.style) : prefix

        const prefixedJson = jsonString
            .split('\n')
            .map((line, index) => index === 0 ? `${styledPrefix} ${line}` : `${' '.repeat(String(styledPrefix).length + 1)}${line}`)
            .join('\n')

        const output = options.newline !== false ? `\n${prefixedJson}` : prefixedJson
        console.log(output)
    })
}

/**
 * Enhanced success message display
 */
export function displaySuccess(message: string, options: Omit<DisplayOptions, 'type'> = {}): Effect.Effect<void> {
    return display(message, { ...options, type: 'success' })
}

/**
 * Enhanced error message display
 */
export function displayError(message: string, options: Omit<DisplayOptions, 'type'> = {}): Effect.Effect<void> {
    return display(message, { ...options, type: 'error' })
}
