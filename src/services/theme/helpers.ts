import { defaultTheme } from "./presets";
import type { PartialTheme, Theme } from "./types";

/**
 * Merge a partial theme with a base theme
 *
 * Creates a new theme by merging the partial theme over the base theme.
 * Useful for extending or customizing existing themes.
 *
 * @param base - The base theme to merge into
 * @param partial - The partial theme to merge over the base
 * @returns A new merged theme
 *
 * @example
 * ```ts
 * const customTheme = mergeTheme(themes.default, {
 *   colors: { info: 'cyan' }
 * })
 * ```
 */
export function mergeTheme(base: Theme, partial: PartialTheme): Theme {
  return {
    icons: {
      ...base.icons,
      ...partial.icons,
    },
    colors: {
      ...base.colors,
      ...partial.colors,
    },
    styles: {
      ...base.styles,
      ...partial.styles,
    },
  };
}

/**
 * Create a theme from a partial theme
 *
 * Merges the partial theme with the default theme.
 *
 * @param partial - The partial theme to create from
 * @returns A complete theme
 *
 * @example
 * ```ts
 * const customTheme = createTheme({
 *   icons: { success: '✅' },
 *   colors: { info: 'cyan' }
 * })
 * ```
 */
export function createTheme(partial: PartialTheme): Theme {
  return mergeTheme(defaultTheme, partial);
}
