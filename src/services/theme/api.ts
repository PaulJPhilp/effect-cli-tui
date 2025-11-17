import type { Effect } from 'effect'
import type { Theme } from './types'

/**
 * Theme service API
 *
 * Provides methods to get, set, and scope themes.
 */
export interface ThemeService {
  /**
   * Get the current theme
   *
   * @returns The current theme
   */
  readonly getTheme: () => Effect.Effect<Theme>

  /**
   * Set the current theme
   *
   * @param theme - The theme to set
   * @returns Effect that sets the theme
   */
  readonly setTheme: (theme: Theme) => Effect.Effect<void>

  /**
   * Run an effect with a temporary theme
   *
   * The theme is restored after the effect completes.
   *
   * @param theme - The theme to use temporarily
   * @param effect - The effect to run with the theme
   * @returns Effect that runs with the temporary theme
   *
   * @example
   * ```ts
   * yield* theme.withTheme(themes.minimal, Effect.gen(function* () {
   *   yield* display('Uses minimal theme')
   * }))
   * ```
   */
  readonly withTheme: <A, E, R>(
    theme: Theme,
    effect: Effect.Effect<A, E, R>,
  ) => Effect.Effect<A, E, R>
}
