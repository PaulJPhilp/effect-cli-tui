import { Data } from 'effect'

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
  /**
   * Working directory for the spawned process
   */
  cwd?: string
  /**
   * Environment variables to merge with {@link process.env}
   */
  env?: Record<string, string>
  /**
   * Timeout in milliseconds before the process is terminated.
   * Set to 0 or undefined for no timeout.
   */
  timeout?: number
  /**
   * Maximum number of bytes to capture from stdout/stderr combined.
   * Set to 0 for unlimited buffer size.
   */
  maxBuffer?: number
  /**
   * Abort signal used to cancel the running process.
   */
  signal?: AbortSignal
  /**
   * Signal used to terminate the process when cleaned up.
   * Defaults to "SIGTERM".
   */
  killSignal?: NodeJS.Signals | number
  /**
   * Optional stdin payload to write to the process before closing.
   */
  stdin?: string | Buffer
}

export interface PromptOptions {
  default?: string
  validate?: (input: string) => boolean | string
}

// Error types
export class CLIError extends Data.TaggedError('CLIError') {
  constructor(
    readonly reason:
      | 'CommandFailed'
      | 'Timeout'
      | 'NotFound'
      | 'ExecutionError'
      | 'Aborted'
      | 'OutputLimitExceeded',
    readonly message: string,
    readonly exitCode?: number,
  ) {
    super()
  }
}

export class TUIError extends Data.TaggedError('TUIError') {
  constructor(
    readonly reason: 'Cancelled' | 'ValidationFailed' | 'RenderError',
    readonly message: string,
  ) {
    super()
  }
}

/**
 * Ink rendering error type
 *
 * Thrown when Ink component rendering fails.
 */
export class InkError extends Data.TaggedError('InkError') {
  constructor(
    readonly reason: 'RenderError' | 'ComponentError' | 'TerminalError',
    readonly message: string,
  ) {
    super()
  }
}

// Box border style types
export type BorderStyle = 'single' | 'double' | 'rounded' | 'bold' | 'classic'

// Table types
export type TableAlignment = 'left' | 'center' | 'right'

// Color types
export type ChalkColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'

/**
 * Colors used for display types (info, success, error, warning)
 * Discriminated union mapping DisplayType to its corresponding color
 */
export type DisplayTypeColor =
  | { type: 'info'; color: 'blue' }
  | { type: 'success'; color: 'green' }
  | { type: 'error'; color: 'red' }
  | { type: 'warning'; color: 'yellow' }

export type ChalkBgColor =
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite'

export interface ChalkStyleOptions {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikethrough?: boolean
  color?: ChalkColor
  bgColor?: ChalkBgColor
}

// Display types moved to src/services/display/types.ts
// Re-exported here for backward compatibility
export type {
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
} from './services/display/types'
