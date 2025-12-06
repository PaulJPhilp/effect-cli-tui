import type { Theme } from "@services/theme/types";
import { Match } from "effect";
import type { ChalkColor } from "@/types";

/** Success/checkmark icon (✓) */
export const ICON_SUCCESS = "✓";

/** Error/cross icon (✗) */
export const ICON_ERROR = "✗";

/** Warning icon (⚠) */
export const ICON_WARNING = "⚠";

/** Info icon (ℹ) */
export const ICON_INFO = "ℹ";

/**
 * ANSI escape sequences for terminal control
 */

/** ANSI escape sequence to show the cursor */
export const ANSI_SHOW_CURSOR = "\x1B[?25h";

/** ANSI escape sequence to hide the cursor */
export const ANSI_HIDE_CURSOR = "\x1B[?25l";

/** ANSI escape sequence to clear the current line */
export const ANSI_CLEAR_LINE = "\x1B[K";

/** ANSI escape sequence for carriage return (move cursor to start of line) */
export const ANSI_CARRIAGE_RETURN = "\r";

/** ANSI escape sequence for carriage return + clear line */
export const ANSI_CARRIAGE_RETURN_CLEAR = "\r\x1B[K";

/**
 * Process exit codes
 */

/** Standard exit code for SIGINT (Ctrl+C) */
export const EXIT_CODE_SIGINT = 130;

/** Standard exit code for SIGTERM */
export const EXIT_CODE_SIGTERM = 143;

/**
 * Spinner constants
 */

/** Default spinner type */
export const SPINNER_DEFAULT_TYPE = "dots" as const;

/** Default spinner interval in milliseconds */
export const SPINNER_DEFAULT_INTERVAL = 100;

/** Default success message for spinner */
export const SPINNER_MESSAGE_DONE = "Done!";

/** Default error message for spinner */
export const SPINNER_MESSAGE_FAILED = "Failed!";

/**
 * UI symbols
 */

/** Bullet point character */
export const SYMBOL_BULLET = "•";

/**
 * Display type color mappings
 */
export const COLOR_SUCCESS = "green" satisfies ChalkColor;
export const COLOR_ERROR = "red" satisfies ChalkColor;
export const COLOR_WARNING = "yellow" satisfies ChalkColor;
export const COLOR_INFO = "blue" satisfies ChalkColor;
export const COLOR_HIGHLIGHT = "cyan" satisfies ChalkColor;
export const COLOR_DEFAULT = COLOR_INFO satisfies ChalkColor;

/**
 * Get the display icon for a given type
 *
 * Uses the provided theme if available, otherwise falls back to default icons.
 * Pass a theme explicitly for theme-aware behavior.
 *
 * @param type - The display type
 * @param theme - Optional theme to use (if not provided, uses defaults)
 * @returns The corresponding icon symbol
 */
export function getDisplayIcon(
  type: "info" | "success" | "error" | "warning",
  theme?: Theme
): string {
  // Use provided theme if it has icons
  if (theme?.icons) {
    return Match.value(type).pipe(
      Match.when("success", () => theme.icons.success),
      Match.when("error", () => theme.icons.error),
      Match.when("warning", () => theme.icons.warning),
      Match.when("info", () => theme.icons.info),
      Match.exhaustive
    );
  }

  // Fallback to default icons
  return Match.value(type).pipe(
    Match.when("success", () => ICON_SUCCESS),
    Match.when("error", () => ICON_ERROR),
    Match.when("warning", () => ICON_WARNING),
    Match.when("info", () => ICON_INFO),
    Match.exhaustive
  );
}

/**
 * Get the display color for a given type
 *
 * Uses the provided theme if available, otherwise falls back to default colors.
 * Pass a theme explicitly for theme-aware behavior.
 *
 * @param type - The display type
 * @param theme - Optional theme to use (if not provided, uses defaults)
 * @returns The corresponding color
 */
export function getDisplayColor(
  type: "info" | "success" | "error" | "warning",
  theme?: Theme
): string {
  // Use provided theme if it has colors
  if (theme?.colors) {
    return Match.value(type).pipe(
      Match.when("success", () => theme.colors.success),
      Match.when("error", () => theme.colors.error),
      Match.when("warning", () => theme.colors.warning),
      Match.when("info", () => theme.colors.info),
      Match.exhaustive
    );
  }

  // Fallback to default colors
  return Match.value(type).pipe(
    Match.when("success", () => COLOR_SUCCESS),
    Match.when("error", () => COLOR_ERROR),
    Match.when("warning", () => COLOR_WARNING),
    Match.when("info", () => COLOR_INFO),
    Match.exhaustive
  );
}
