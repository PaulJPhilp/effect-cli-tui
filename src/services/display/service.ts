import { Console, Effect } from "effect";
import { applyChalkStyle } from "../../core/colors";
import { DEFAULT_DISPLAY_TYPE, getDisplayIcon } from "../../core/icons";
import { ThemeService } from "../theme/service";
import type { DisplayService as DisplayServiceApi } from "./api";
import { formatDisplayOutput } from "./helpers";
import type { DisplayOptions, JsonDisplayOptions } from "./types";

/**
 * Display service for terminal output
 *
 * Provides methods for displaying messages, JSON, and lines
 * with styling support.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const display = yield* DisplayService
 *   yield* display.output('Hello!', { type: 'success' })
 *   yield* display.json({ key: 'value' })
 * }).pipe(Effect.provide(DisplayService.Default))
 * ```
 */
export class DisplayService extends Effect.Service<DisplayService>()(
  "app/DisplayService",
  {
    scoped: Effect.sync(
      (): DisplayServiceApi =>
        ({
          output: (
            message: string,
            options: DisplayOptions = {}
          ): Effect.Effect<void> => {
            const { type = DEFAULT_DISPLAY_TYPE, ...restOptions } = options;
            return Effect.gen(function* () {
              const themeOption = yield* Effect.serviceOption(ThemeService);
              const theme =
                themeOption._tag === "Some"
                  ? themeOption.value.getTheme()
                  : undefined;
              const output = formatDisplayOutput(
                message,
                type,
                restOptions,
                theme
              );
              // Route error messages to stderr for better CLI practices
              yield* type === "error"
                ? Console.error(output)
                : Console.log(output);
            });
          },

          lines: (
            lines: string[],
            options: DisplayOptions = {}
          ): Effect.Effect<void> => {
            const { type = DEFAULT_DISPLAY_TYPE, ...restOptions } = options;
            const useStderr = type === "error";

            return Effect.gen(function* () {
              const themeOption = yield* Effect.serviceOption(ThemeService);
              const theme =
                themeOption._tag === "Some"
                  ? themeOption.value.getTheme()
                  : undefined;
              for (const line of lines) {
                const output = formatDisplayOutput(
                  line,
                  type,
                  {
                    ...restOptions,
                    newline: true,
                  },
                  theme
                );
                yield* useStderr ? Console.error(output) : Console.log(output);
              }
            });
          },

          json: (
            data: unknown,
            options: JsonDisplayOptions = {}
          ): Effect.Effect<void> => {
            const {
              type = DEFAULT_DISPLAY_TYPE,
              spaces = 2,
              showPrefix = true,
              customPrefix,
            } = options;

            return Effect.gen(function* () {
              const themeOption = yield* Effect.serviceOption(ThemeService);
              const theme =
                themeOption._tag === "Some"
                  ? themeOption.value.getTheme()
                  : undefined;
              const jsonString = JSON.stringify(data, null, spaces);

              if (!(showPrefix || customPrefix)) {
                const output =
                  options.newline !== false ? `\n${jsonString}` : jsonString;
                yield* Console.log(output);
                return;
              }

              const prefix =
                customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : "");
              const styledPrefix =
                options.style && prefix
                  ? applyChalkStyle(prefix, options.style)
                  : prefix;

              const prefixedJson = jsonString
                .split("\n")
                .map((line, index) =>
                  index === 0
                    ? `${styledPrefix} ${line}`
                    : `${" ".repeat(String(styledPrefix).length + 1)}${line}`
                )
                .join("\n");

              const output =
                options.newline !== false ? `\n${prefixedJson}` : prefixedJson;
              yield* Console.log(output);
            });
          },

          success: (
            message: string,
            options: Omit<DisplayOptions, "type"> = {}
          ): Effect.Effect<void> =>
            Effect.gen(function* () {
              const themeOption = yield* Effect.serviceOption(ThemeService);
              const theme =
                themeOption._tag === "Some"
                  ? themeOption.value.getTheme()
                  : undefined;
              const output = formatDisplayOutput(
                message,
                "success",
                options,
                theme
              );
              yield* Console.log(output);
            }),

          error: (
            message: string,
            options: Omit<DisplayOptions, "type"> = {}
          ): Effect.Effect<void> => {
            return Effect.gen(function* () {
              const themeOption = yield* Effect.serviceOption(ThemeService);
              const theme =
                themeOption._tag === "Some"
                  ? themeOption.value.getTheme()
                  : undefined;
              const output = formatDisplayOutput(
                message,
                "error",
                options,
                theme
              );
              // Route error messages to stderr for better CLI practices
              yield* Console.error(output);
            });
          },
        }) as const
    ),
  }
) {}
