/**
 * Interactive terminal UI handler using Ink/React
 *
 * Provides a service for interactive prompts, selections, and messages
 * in terminal applications using Ink (React renderer for terminals).
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* (_) {
 *   const tui = yield* _(TUIHandler)
 *   const name = yield* _(tui.prompt('Enter your name:'))
 *   yield* _(tui.display(`Hello, ${name}!`, 'success'))
 * }).pipe(Effect.provide(TUIHandler.Default))
 * ```
 */

// biome-ignore assist/source/organizeImports: <>
import { Console, Effect } from "effect";
import React from "react";
import { Confirm } from "./components/Confirm";
import { Input } from "./components/Input";
import { MultiSelect } from "./components/MultiSelect";
import { Password } from "./components/Password";
import { Select } from "./components/Select";
import { DEFAULT_DISPLAY_TYPE } from "./constants";
import { getDisplayIcon } from "./core/icons";
import { InkService } from "./services/ink";
import { ToolCallLogService } from "./services/logs";
import {
  addSlashCommandHistoryEntry,
  applyShortFlagMapping,
  getGlobalSlashCommandRegistry,
  getSlashCommandHistory,
  getSlashCommandSuggestionsAsync,
  parseSlashCommand,
  type SlashCommandRegistry,
  type SlashCommandResult,
} from "./tui-slash-commands";
import {
  InkError,
  TUIError,
  type DisplayType,
  type SelectOption,
} from "./types";

/**
 * TUI Handler Service
 *
 * Provides interactive terminal UI operations including prompts,
 * selections, confirmations, and display messages.
 *
 * Use via dependency injection:
 * ```ts
 * const tui = yield* TUIHandler
 * const result = yield* tui.prompt('Question?')
 * ```
 */
export class TUIHandler extends Effect.Service<TUIHandler>()("app/TUIHandler", {
  effect: Effect.gen(function* () {
    const ink = yield* InkService;
    const slashRegistry: SlashCommandRegistry = getGlobalSlashCommandRegistry();

    const mapToTUIError = (error: unknown): TUIError => {
      if (error instanceof TUIError) {
        return error;
      }

      if (error instanceof InkError) {
        // Map cancellation to TUIError with Cancelled reason
        if (
          error.reason === "TerminalError" &&
          error.message.toLowerCase().includes("cancelled")
        ) {
          return new TUIError("Cancelled", error.message);
        }
        return new TUIError("RenderError", error.message);
      }

      return new TUIError("RenderError", String(error));
    };

    const handleSlashCommandResult = (
      result: SlashCommandResult | null
    ): Effect.Effect<"continue" | "return", TUIError> => {
      if (!result) {
        return Effect.succeed<"return">("return");
      }

      if (result.kind === "continue") {
        return Effect.succeed<"continue">("continue");
      }

      if (result.kind === "abortPrompt") {
        return Effect.fail(
          new TUIError(
            "SlashCommandAbort",
            result.message ?? "Slash command aborted the prompt"
          )
        );
      }

      return Effect.fail(
        new TUIError(
          "SlashCommandExit",
          result.message ?? "Slash command requested session exit"
        )
      );
    };

    const maybeRunSlashCommand = <R = never>({
      input,
      promptMessage,
      promptKind,
    }: {
      input: string;
      promptMessage: string;
      promptKind: "input" | "password" | "select" | "multiSelect";
    }): Effect.Effect<SlashCommandResult | null, TUIError, R> =>
      Effect.gen(function* () {
        const parsed = parseSlashCommand(input);
        if (!parsed) {
          return null;
        }
        const definition = slashRegistry.lookup.get(parsed.command);

        if (!definition) {
          return null;
        }

        const context = {
          promptMessage,
          promptKind,
          rawInput: input,
          command: parsed.command,
          args: parsed.args,
          flags: applyShortFlagMapping(parsed.flags, definition.shortFlags),
          tokens: parsed.tokens,
          registry: slashRegistry,
        } as const;

        // Run the slash command - requirements (like EffectCLI) must be provided
        // by the caller when running the TUIHandler program
        const result: SlashCommandResult | null = yield* definition
          .run(context)
          .pipe(
            Effect.mapError((error) => {
              if (error instanceof TUIError) {
                return error;
              }
              return new TUIError(
                "RenderError",
                `Slash command failed: ${String(error)}`
              );
            })
          );

        // Record successful execution attempt (regardless of kind returned)
        addSlashCommandHistoryEntry(input);

        // Log tool call (try to get ToolCallLogService, but don't fail if not available)
        const toolLogResult = yield* Effect.either(
          Effect.gen(function* () {
            const toolLog = yield* ToolCallLogService;
            yield* toolLog.log({
              timestamp: Date.now(),
              commandName: parsed.command,
              args: parsed.args,
              resultSummary:
                result?.kind === "continue"
                  ? "continued"
                  : result?.kind === "exitSession"
                    ? "exited session"
                    : result?.kind === "abortPrompt"
                      ? "aborted prompt"
                      : undefined,
            });
          })
        );
        // Ignore errors from tool logging (service might not be available)

        return result;
      });

    return {
      /**
       * Display a message with optional styling
       *
       * @param message - The message to display
       * @param type - Message type: 'info', 'success', 'error', or 'warning'
       * @returns Effect that displays the message
       *
       * @example
       * ```ts
       * yield* tui.display('Operation complete!', 'success')
       * ```
       */
      display: (
        message: string,
        type: DisplayType = DEFAULT_DISPLAY_TYPE
      ): Effect.Effect<void> =>
        Effect.gen(function* () {
          const prefix = getDisplayIcon(type);
          yield* Console.log(`\n${prefix} ${message}`);
        }),

      /**
       * Prompt user for text input with optional validation
       *
       * @param message - The prompt message
       * @param options - Optional validation and default value
       * @returns Effect that resolves with the user's input
       *
       * @example
       * ```ts
       * const name = yield* tui.prompt('Enter your name:', { default: 'Guest' })
       * ```
       */
      prompt: <R = never>(
        message: string,
        options?: {
          default?: string;
          validate?: (input: string) => boolean | string;
        }
      ): Effect.Effect<string, TUIError, R> =>
        Effect.gen(function* () {
          // Loop until we get a non-slash input or a slash command decides to abort/exit
          // eslint-disable-next-line no-constant-condition
          while (true) {
            let historyIndex: number | null = null;
            const history = getSlashCommandHistory();
            let currentValue = options?.default ?? "";

            const value = yield* ink.renderWithResult<string>((onComplete) =>
              React.createElement(Input, {
                message,
                defaultValue: currentValue,
                validate: options?.validate,
                onSubmit: onComplete,
                computeSlashSuggestions: (val: string) =>
                  getSlashCommandSuggestionsAsync(val, slashRegistry),
                onHistoryPrev: () => {
                  if (history.length === 0) return;
                  if (historyIndex === null) historyIndex = history.length - 1;
                  else historyIndex = Math.max(0, historyIndex - 1);
                  currentValue = history[historyIndex] ?? currentValue;
                },
                onHistoryNext: () => {
                  if (history.length === 0 || historyIndex === null) return;
                  historyIndex = Math.min(history.length - 1, historyIndex + 1);
                  currentValue = history[historyIndex] ?? currentValue;
                },
              })
            );

            if (!value.startsWith("/")) {
              return value;
            }

            const slashResult = yield* maybeRunSlashCommand({
              input: value,
              promptMessage: message,
              promptKind: "input",
            });

            const control = yield* handleSlashCommandResult(slashResult);
            if (control === "return") {
              return value;
            }
            // For "continue", loop and re-prompt
          }
        }).pipe(Effect.mapError(mapToTUIError)),

      /**
       * Let user select a single option from a list
       *
       * @param message - The selection prompt
       * @param choices - Array of available choices (strings or SelectOption objects with descriptions)
       * @returns Effect that resolves with the selected choice value
       *
       * @example
       * ```ts
       * // Simple string array
       * const choice = yield* tui.selectOption(
       *   'Choose one:',
       *   ['Option A', 'Option B', 'Option C']
       * )
       *
       * // With descriptions
       * const choice = yield* tui.selectOption(
       *   'Choose template:',
       *   [
       *     { label: 'Basic', value: 'basic', description: 'Simple starter template' },
       *     { label: 'CLI', value: 'cli', description: 'Command-line interface template' }
       *   ]
       * )
       * ```
       */
      selectOption: <R = never>(
        message: string,
        choices: string[] | SelectOption[]
      ): Effect.Effect<string, TUIError, R> =>
        Effect.gen(function* () {
          // Loop until we get a non-slash selection or a slash command decides to abort/exit
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const value = yield* ink.renderWithResult<string>((onComplete) =>
              React.createElement(Select, {
                message,
                choices,
                onSubmit: onComplete,
              })
            );

            if (!value.startsWith("/")) {
              return value;
            }

            const slashResult = yield* maybeRunSlashCommand({
              input: value,
              promptMessage: message,
              promptKind: "select",
            });

            const control = yield* handleSlashCommandResult(slashResult);
            if (control === "return") {
              return value;
            }
            // For "continue", loop and re-show the select
          }
        }).pipe(Effect.mapError(mapToTUIError)),

      /**
       * Let user select multiple options from a list
       *
       * @param message - The selection prompt
       * @param choices - Array of available choices (strings or SelectOption objects with descriptions)
       * @returns Effect that resolves with array of selected choice values
       *
       * @example
       * ```ts
       * // Simple string array
       * const selected = yield* tui.multiSelect(
       *   'Choose multiple:',
       *   ['Item 1', 'Item 2', 'Item 3']
       * )
       *
       * // With descriptions
       * const selected = yield* tui.multiSelect(
       *   'Choose features:',
       *   [
       *     { label: 'Testing', value: 'test', description: 'Unit and integration tests' },
       *     { label: 'Linting', value: 'lint', description: 'ESLint configuration' }
       *   ]
       * )
       * ```
       */
      multiSelect: <R = never>(
        message: string,
        choices: string[] | SelectOption[]
      ): Effect.Effect<string[], TUIError, R> =>
        Effect.gen(function* () {
          // Loop until we get selections without slash commands or a slash command decides to abort/exit
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const values = yield* ink.renderWithResult<string[]>((onComplete) =>
              React.createElement(MultiSelect, {
                message,
                choices,
                onSubmit: onComplete,
              })
            );

            // Check if any selected value is a slash command
            const slashCommand = values.find((value) => value.startsWith("/"));
            if (!slashCommand) {
              return values;
            }

            const slashResult = yield* maybeRunSlashCommand({
              input: slashCommand,
              promptMessage: message,
              promptKind: "multiSelect",
            });

            const control = yield* handleSlashCommandResult(slashResult);
            if (control === "return") {
              return values;
            }
            // For "continue", loop and re-show the multi-select
          }
        }).pipe(Effect.mapError(mapToTUIError)),

      /**
       * Ask user for yes/no confirmation
       *
       * @param message - The confirmation prompt
       * @param options - Optional default value
       * @returns Effect that resolves with boolean (true = yes, false = no)
       *
       * @example
       * ```ts
       * const confirmed = yield* tui.confirm('Are you sure?', { default: false })
       * ```
       */
      confirm: (
        message: string,
        options?: { default?: boolean }
      ): Effect.Effect<boolean, TUIError> =>
        ink
          .renderWithResult<boolean>((onComplete) =>
            React.createElement(Confirm, {
              message,
              default: options?.default,
              onSubmit: onComplete,
            })
          )
          .pipe(Effect.mapError(mapToTUIError)),

      /**
       * Prompt user for password input (hidden)
       *
       * @param message - The prompt message
       * @param options - Optional validation function
       * @returns Effect that resolves with the password
       *
       * @example
       * ```ts
       * const password = yield* tui.password('Enter password:', {
       *   validate: (pwd) => pwd.length >= 8 || 'Password must be at least 8 characters'
       * })
       * ```
       */
      password: <R = never>(
        message: string,
        options?: {
          validate?: (input: string) => boolean | string;
        }
      ): Effect.Effect<string, TUIError, R> =>
        Effect.gen(function* () {
          // Loop until we get a non-slash input or a slash command decides to abort/exit
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const historyIndex: number | null = null;
            const history = getSlashCommandHistory();
            const currentValue = "";
            const value = yield* ink.renderWithResult<string>((onComplete) =>
              React.createElement(Password, {
                message,
                validate: options?.validate,
                onSubmit: onComplete,
              })
            );

            if (!value.startsWith("/")) {
              return value;
            }

            const slashResult = yield* maybeRunSlashCommand({
              input: value,
              promptMessage: message,
              promptKind: "password",
            });

            const control = yield* handleSlashCommandResult(slashResult);
            if (control === "return") {
              return value;
            }
            // For "continue", loop and re-prompt
          }
        }).pipe(Effect.mapError(mapToTUIError)),
    } as const;
  }),
  dependencies: [InkService.Default],
}) {}
