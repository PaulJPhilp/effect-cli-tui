import type { ChalkColor, ChalkStyleOptions } from "../../types";

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
    readonly success: string;
    readonly error: string;
    readonly warning: string;
    readonly info: string;
  };

  /**
   * Colors for each display type
   */
  readonly colors: {
    readonly success: ChalkColor;
    readonly error: ChalkColor;
    readonly warning: ChalkColor;
    readonly info: ChalkColor;
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
