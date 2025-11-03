import * as Data from 'effect/Data'

export interface SelectOption {
    label: string
    value: string
    description?: string
}

export interface CLIResult {
    exitCode: number
    stdout: string
    stderr: string
}

export interface CLIRunOptions {
    cwd?: string
    env?: Record<string, string>
    timeout?: number
}

export interface PromptOptions {
    default?: string
    validate?: (input: string) => boolean | string
}

// Error types
export class CLIError extends Data.TaggedError('CLIError') {
    constructor(
        readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound',
        readonly message: string
    ) {
        super()
    }
}

export class TUIError extends Data.TaggedError('TUIError') {
    constructor(
        readonly reason: 'Cancelled' | 'ValidationFailed' | 'RenderError',
        readonly message: string
    ) {
        super()
    }
}

// Display API types
export type DisplayType = 'info' | 'success' | 'error'

export interface ChalkStyleOptions {
    bold?: boolean
    dim?: boolean
    italic?: boolean
    underline?: boolean
    inverse?: boolean
    strikethrough?: boolean
    color?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'
    bgColor?: 'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite'
}

export interface DisplayOptions {
    type?: DisplayType
    prefix?: string
    newline?: boolean
    style?: ChalkStyleOptions
}

export interface JsonDisplayOptions extends DisplayOptions {
    spaces?: number
}
