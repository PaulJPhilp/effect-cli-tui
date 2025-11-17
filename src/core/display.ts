import { Effect } from "effect";
import { DisplayService } from "../services/display";
import type {
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
} from "../services/display/types";

/**
 * Enhanced display function with style support
 *
 * Convenience wrapper around DisplayService
 */
export function displayOutput(
  message: string,
  type: DisplayType,
  options: DisplayOptions = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.output(message, { ...options, type });
  }).pipe(Effect.provide(DisplayService.Default));
}

/**
 * Enhanced display function for single-line messages with style support
 *
 * Convenience wrapper around DisplayService
 */
export function display(
  message: string,
  options: DisplayOptions = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.output(message, options);
  }).pipe(Effect.provide(DisplayService.Default));
}

/**
 * Enhanced display multiple lines with style support
 *
 * Convenience wrapper around DisplayService
 */
export function displayLines(
  lines: string[],
  options: DisplayOptions = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.lines(lines, options);
  }).pipe(Effect.provide(DisplayService.Default));
}

/**
 * Enhanced display JSON with style support
 *
 * Convenience wrapper around DisplayService
 */
export function displayJson(
  data: unknown,
  options: JsonDisplayOptions = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.json(data, options);
  }).pipe(Effect.provide(DisplayService.Default));
}

/**
 * Enhanced success message display
 *
 * Convenience wrapper around DisplayService
 */
export function displaySuccess(
  message: string,
  options: Omit<DisplayOptions, "type"> = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.success(message, options);
  }).pipe(Effect.provide(DisplayService.Default));
}

/**
 * Enhanced error message display
 *
 * Convenience wrapper around DisplayService
 */
export function displayError(
  message: string,
  options: Omit<DisplayOptions, "type"> = {}
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService;
    yield* display.error(message, options);
  }).pipe(Effect.provide(DisplayService.Default));
}
