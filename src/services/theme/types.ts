import type { ChalkColor, ChalkStyleOptions } from "../../types";

/**
 * Icon value for theme display types
 *
 * Can be a Unicode symbol, emoji, or empty string.
 * Examples: "✓", "✅", "✗", "❌", "⚠", "⚠️", "ℹ", "ℹ️", ""
 */
export type ThemeIcon = string;

/**
 * Icon type for success display type
 * Defaults to "✓" (ICON_SUCCESS) but can be any ThemeIcon
 */
export type SuccessIcon = ThemeIcon;

/**
 * Icon type for error display type
 * Defaults to "✗" (ICON_ERROR) but can be any ThemeIcon
 */
export type ErrorIcon = ThemeIcon;

/**
 * Icon type for warning display type
 * Defaults to "⚠" (ICON_WARNING) but can be any ThemeIcon
 */
export type WarningIcon = ThemeIcon;

/**
 * Icon type for info display type
 * Defaults to "ℹ" (ICON_INFO) but can be any ThemeIcon
 */
export type InfoIcon = ThemeIcon;

/**
 * Color type for success display type
 * Defaults to "green" (from DisplayTypeColor) but can be any ChalkColor
 */
export type SuccessColor = ChalkColor;

/**
 * Color type for error display type
 * Defaults to "red" (from DisplayTypeColor) but can be any ChalkColor
 */
export type ErrorColor = ChalkColor;

/**
 * Color type for warning display type
 * Defaults to "yellow" (from DisplayTypeColor) but can be any ChalkColor
 */
export type WarningColor = ChalkColor;

/**
 * Color type for info display type
 * Defaults to "blue" (from DisplayTypeColor) but can be any ChalkColor
 */
export type InfoColor = ChalkColor;

/**
 * Theme configuration for display styling
 *
 * Defines icons, colors, and optional styles for each display type.
 * Used by ThemeService to customize the appearance of CLI output.
 *
 * @example
 * ```ts
 * const customTheme: Theme = {
 *   icons: {
 *     success: '✅',
 *     error: '❌',
 *     warning: '⚠️',
 *     info: 'ℹ️'
 *   },
 *   colors: {
 *     success: 'green',
 *     error: 'red',
 *     warning: 'yellow',
 *     info: 'cyan',
 *     highlight: 'magenta'
 *   }
 * }
 * ```
 */
export interface Theme {
  /**
   * Icons for each display type
   */
  readonly icons: {
    readonly success: SuccessIcon;
    readonly error: ErrorIcon;
    readonly warning: WarningIcon;
    readonly info: InfoIcon;
  };

  /**
   * Colors for each display type
   */
  readonly colors: {
    readonly success: SuccessColor;
    readonly error: ErrorColor;
    readonly warning: WarningColor;
    readonly info: InfoColor;
    readonly highlight: ChalkColor;
  };

  /**
   * Optional styles for each display type
   * Applied in addition to colors
   */
  readonly styles?: {
    readonly success?: ChalkStyleOptions;
    readonly error?: ChalkStyleOptions;
    readonly warning?: ChalkStyleOptions;
    readonly info?: ChalkStyleOptions;
  };
}

/**
 * Partial theme for merging/extending themes
 */
export type PartialTheme = {
  readonly icons?: Partial<Theme["icons"]>;
  readonly colors?: Partial<Theme["colors"]>;
  readonly styles?: Partial<Theme["styles"]>;
};
