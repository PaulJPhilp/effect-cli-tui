import { Effect } from "effect";
import { DEFAULT_DISPLAY_TYPE, getDisplayIcon } from "./core/icons";
import type { DisplayOptions, JsonDisplayOptions } from "./types";

/**
 * Core display function for single-line messages
 *
 * @param message The message to display
 * @param options Display options
 * @returns Effect that displays the message
 *
 * @example
 * ```ts
 * import { display } from 'effect-cli-tui'
 *
 * const effect = display('Active project set to: effect-patterns')
 * ```
 */
export function display(
  message: string,
  options: DisplayOptions = {}
): Effect.Effect<void> {
  const {
    type = DEFAULT_DISPLAY_TYPE,
    prefix: customPrefix,
    newline = true,
  } = options;

  return Effect.gen(function* () {
    const prefix = customPrefix ?? getDisplayIcon(type);

    const output = newline ? `\n${prefix} ${message}` : `${prefix} ${message}`;
    yield* Effect.log(output);
  });
}

/**
 * Display multiple lines sequentially
 *
 * @param lines Array of lines to display
 * @param options Display options (applied to each line)
 * @returns Effect that displays all lines
 *
 * @example
 * ```ts
 * import { displayLines } from 'effect-cli-tui'
 *
 * const lines = [
 *   'Project Information',
 *   '━━━━━━━━━━━━━━━━━━━━━',
 *   'Active Project: effect-patterns',
 *   'API Key: Configured'
 * ]
 * const effect = displayLines(lines, { type: 'info' })
 * ```
 */
export function displayLines(
  lines: string[],
  options: DisplayOptions = {}
): Effect.Effect<void> {
  return Effect.gen(function* (_) {
    for (const line of lines) {
      yield* _(display(line, options));
    }
  });
}

/**
 * Display JSON data with pretty-printing
 *
 * @param data The data to display as JSON
 * @param options JSON display options
 * @returns Effect that displays the JSON
 *
 * @example
 * ```ts
 * import { displayJson } from 'effect-cli-tui'
 *
 * const data = { key: 'value', nested: { prop: 123 } }
 * const effect = displayJson(data, { type: 'info', spaces: 2 })
 * ```
 */
export function displayJson(
  data: unknown,
  options: JsonDisplayOptions = {}
): Effect.Effect<void> {
  const {
    type = DEFAULT_DISPLAY_TYPE,
    spaces = 2,
    showPrefix = true,
    customPrefix,
    newline = true,
  } = options;

  return Effect.gen(function* () {
    const jsonString = JSON.stringify(data, null, spaces);

    if (!(showPrefix || customPrefix)) {
      const output = newline ? `\n${jsonString}` : jsonString;
      yield* Effect.log(output);
      return;
    }

    const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type) : "");
    const prefixedJson = jsonString
      .split("\n")
      .map((line, index) =>
        index === 0
          ? `${prefix} ${line}`
          : `${" ".repeat(prefix.length + 1)}${line}`
      )
      .join("\n");

    const output = newline ? `\n${prefixedJson}` : prefixedJson;
    yield* Effect.log(output);
  });
}

/**
 * Convenience function for success messages
 *
 * @param message The success message to display
 * @returns Effect that displays the success message
 *
 * @example
 * ```ts
 * import { displaySuccess } from 'effect-cli-tui'
 *
 * const effect = displaySuccess('Operation completed successfully')
 * ```
 */
export function displaySuccess(message: string): Effect.Effect<void> {
  return display(message, { type: "success" });
}

/**
 * Convenience function for error messages
 *
 * @param message The error message to display
 * @returns Effect that displays the error message
 *
 * @example
 * ```ts
 * import { displayError } from 'effect-cli-tui'
 *
 * const effect = displayError('Failed to connect to database')
 * ```
 */
export function displayError(message: string): Effect.Effect<void> {
  return display(message, { type: "error" });
}
