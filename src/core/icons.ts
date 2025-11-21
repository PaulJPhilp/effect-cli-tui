import { Effect, Match } from "effect";
import type { Theme } from "../services/theme/types";
import type { ChalkColor } from "../types";

// Lazy import to avoid circular dependency with ThemeService
let ThemeServiceModule: typeof import("../services/theme/service") | null =
  null;
function getThemeService(): typeof import("../services/theme/service").ThemeService {
  if (!ThemeServiceModule) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ThemeServiceModule = require("../services/theme/service");
  }
  // TypeScript doesn't narrow the type after assignment, so we assert the module exists
  // This is safe because we just assigned it above if it was null
  if (!ThemeServiceModule) {
    throw new Error("Failed to load ThemeService module");
  }
  return ThemeServiceModule.ThemeService;
}

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
 * Uses the provided theme if available, otherwise uses the current theme if available,
 * otherwise falls back to default icons.
 *
 * @param type - The display type
 * @param theme - Optional theme to use
 * @returns The corresponding icon symbol
 */
export function getDisplayIcon(
  type: "info" | "success" | "error" | "warning",
  theme?: Theme
): string {
  // Use provided theme first
  if (theme?.icons) {
    return Match.value(type).pipe(
      Match.when("success", () => theme.icons.success),
      Match.when("error", () => theme.icons.error),
      Match.when("warning", () => theme.icons.warning),
      Match.when("info", () => theme.icons.info),
      Match.exhaustive
    );
  }

  // Try to get theme from ThemeService, fallback to defaults if not available
  // Use lazy import to avoid circular dependency
  try {
    const ThemeService = getThemeService();
    const themeOption = Effect.runSync(Effect.serviceOption(ThemeService));
    if (themeOption._tag === "Some") {
      const currentTheme = themeOption.value.getTheme();
      if (currentTheme?.icons) {
        return Match.value(type).pipe(
          Match.when("success", () => currentTheme.icons.success),
          Match.when("error", () => currentTheme.icons.error),
          Match.when("warning", () => currentTheme.icons.warning),
          Match.when("info", () => currentTheme.icons.info),
          Match.exhaustive
        );
      }
    }
  } catch {
    // ThemeService not available, fall through to defaults
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
 * Uses the provided theme if available, otherwise uses the current theme if available,
 * otherwise falls back to default colors.
 *
 * @param type - The display type
 * @param theme - Optional theme to use
 * @returns The corresponding color
 */
export function getDisplayColor(
  type: "info" | "success" | "error" | "warning",
  theme?: Theme
): string {
  // Use provided theme first
  if (theme?.colors) {
    return Match.value(type).pipe(
      Match.when("success", () => theme.colors.success),
      Match.when("error", () => theme.colors.error),
      Match.when("warning", () => theme.colors.warning),
      Match.when("info", () => theme.colors.info),
      Match.exhaustive
    );
  }

  // Try to get theme from ThemeService, fallback to defaults if not available
  // Use lazy import to avoid circular dependency
  try {
    const ThemeService = getThemeService();
    const themeOption = Effect.runSync(Effect.serviceOption(ThemeService));
    if (themeOption._tag === "Some") {
      const currentTheme = themeOption.value.getTheme();
      if (currentTheme?.colors) {
        return Match.value(type).pipe(
          Match.when("success", () => currentTheme.colors.success),
          Match.when("error", () => currentTheme.colors.error),
          Match.when("warning", () => currentTheme.colors.warning),
          Match.when("info", () => currentTheme.colors.info),
          Match.exhaustive
        );
      }
    }
  } catch {
    // ThemeService not available, fall through to defaults
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
