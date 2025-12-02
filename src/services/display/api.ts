import type { Effect } from "effect";
import type { DisplayOptions, JsonDisplayOptions } from "./types";

/**
 * Display service API interface
 *
 * Provides methods for displaying messages, JSON, and lines
 * in the terminal with styling support.
 */
export interface DisplayService {
  /**
   * Display a single-line message with optional styling
   *
   * @param message - The message to display
   * @param options - Display options
   * @returns Effect that displays the message
   *
   * @example
   * ```ts
   * const display = yield* DisplayService
   * yield* display.output('Hello, world!', { type: 'success' })
   * ```
   */
  output: (message: string, options?: DisplayOptions) => Effect.Effect<void>;

  /**
   * Display multiple lines sequentially
   *
   * @param lines - Array of lines to display
   * @param options - Display options (applied to each line)
   * @returns Effect that displays all lines
   *
   * @example
   * ```ts
   * const display = yield* DisplayService
   * yield* display.lines(['Line 1', 'Line 2'], { type: 'info' })
   * ```
   */
  lines: (lines: string[], options?: DisplayOptions) => Effect.Effect<void>;

  /**
   * Display JSON data with formatting
   *
   * @param data - Data to display as JSON
   * @param options - JSON display options
   * @returns Effect that displays the JSON
   *
   * @example
   * ```ts
   * const display = yield* DisplayService
   * yield* display.json({ key: 'value' }, { spaces: 2 })
   * ```
   */
  json: (
    data: unknown,
    options?: JsonDisplayOptions
  ) => Effect.Effect<void, import("effect-json").StringifyError>;

  /**
   * Display a success message
   *
   * @param message - Success message
   * @param options - Display options (type is set to 'success')
   * @returns Effect that displays the message
   */
  success: (
    message: string,
    options?: Omit<DisplayOptions, "type">
  ) => Effect.Effect<void>;

  /**
   * Display an error message
   *
   * @param message - Error message
   * @param options - Display options (type is set to 'error')
   * @returns Effect that displays the message
   */
  error: (
    message: string,
    options?: Omit<DisplayOptions, "type">
  ) => Effect.Effect<void>;
}
