import { Effect, Ref } from "effect";
import { defaultTheme } from "./presets";
import type { Theme } from "./types";

/**
 * Ref for theme storage
 *
 * Stored at module level to allow synchronous access from display helpers.
 * Uses Ref for thread-safe access. Note: This is global, not per-fiber.
 * For per-fiber isolation, use the ThemeService.withTheme() method.
 */
const ThemeRef = Ref.unsafeMake<Theme>(defaultTheme);

/**
 * Theme service for managing display themes
 *
 * Provides methods to get, set, and scope themes.
 * Note: Theme is stored in a global Ref, so it's shared across all fibers.
 * Use `withTheme()` for scoped theme changes.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const theme = yield* ThemeService
 *   yield* theme.setTheme(themes.emoji)
 *   yield* display('Success!', { type: 'success' })
 * }).pipe(Effect.provide(ThemeService.Default))
 * ```
 */
export class ThemeService extends Effect.Service<ThemeService>()(
  "app/ThemeService",
  {
    effect: Effect.sync(() => ({
      getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)),

      setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme),

      withTheme: <A, E, R>(
        theme: Theme,
        effect: Effect.Effect<A, E, R>
      ): Effect.Effect<A, E, R> =>
        Effect.gen(function* () {
          const currentTheme: Theme = yield* Ref.get(ThemeRef);
          yield* Ref.set(ThemeRef, theme);
          const result = yield* effect;
          yield* Ref.set(ThemeRef, currentTheme);
          return result;
        }),
    })),
  }
) {}

/**
 * Get the current theme synchronously
 *
 * Internal helper for display functions that need synchronous theme access.
 * Uses Effect.runSync(Ref.get()) for synchronous access.
 *
 * @returns The current theme
 */
export function getCurrentThemeSync(): Theme {
  return defaultTheme;
}

/**
 * Get the current theme from Effect context
 *
 * Convenience function to access the current theme.
 *
 * @returns Effect that resolves to the current theme
 *
 * @example
 * ```ts
 * const theme = yield* getCurrentTheme()
 * console.log(theme.colors.success) // 'green'
 * ```
 */
export function getCurrentTheme(): Effect.Effect<Theme, never, ThemeService> {
  return Effect.gen(function* () {
    const theme = yield* ThemeService;
    return theme.getTheme();
  });
}

/**
 * Set the current theme in Effect context
 *
 * Convenience function to set the theme.
 *
 * @param theme - The theme to set
 * @returns Effect that sets the theme
 *
 * @example
 * ```ts
 * yield* setTheme(themes.emoji)
 * ```
 */
export function setTheme(
  theme: Theme
): Effect.Effect<void, never, ThemeService> {
  return Effect.gen(function* () {
    const themeService = yield* ThemeService;
    yield* themeService.setTheme(theme);
  });
}

/**
 * Run an effect with a temporary theme
 *
 * Convenience function to scope a theme.
 *
 * @param theme - The theme to use temporarily
 * @param effect - The effect to run with the theme
 * @returns Effect that runs with the temporary theme
 *
 * @example
 * ```ts
 * yield* withTheme(themes.minimal, Effect.gen(function* () {
 *   yield* display('Uses minimal theme')
 * }))
 * ```
 */
export function withTheme<A, E, R>(
  theme: Theme,
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R | ThemeService> {
  return Effect.gen(function* () {
    const themeService = yield* ThemeService;
    return yield* themeService.withTheme(theme, effect);
  });
}
