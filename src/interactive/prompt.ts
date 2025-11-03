import { Effect } from 'effect';
import { Data } from 'effect';
import {
  input,
  confirm,
  select,
  password,
} from '@inquirer/prompts';

export class PromptError extends Data.TaggedError('PromptError')<{
  message: string;
}> {}

export interface PromptOptions {
  message: string;
  type?: 'text' | 'confirm' | 'choice' | 'password';
  default?: string;
  choices?: string[];
  validate?: (value: string) => boolean | string;
}

/**
 * Prompt user for text input
 */
export function promptInput(
  message: string,
  defaultValue?: string,
  validate?: (value: string) => boolean | string
): Effect.Effect<string, PromptError> {
  return Effect.tryPromise({
    try: async () => {
      return await input({
        message,
        default: defaultValue,
        validate: validate ? (v) => {
          const result = validate(v);
          return result === true ? true : String(result);
        } : undefined,
      });
    },
    catch: (error) =>
      new PromptError({
        message: `Prompt failed: ${String(error)}`,
      }),
  });
}

/**
 * Prompt user for yes/no confirmation
 */
export function promptConfirm(
  message: string,
  defaultValue?: boolean
): Effect.Effect<boolean, PromptError> {
  return Effect.tryPromise({
    try: async () => {
      return await confirm({
        message,
        default: defaultValue ?? true,
      });
    },
    catch: (error) =>
      new PromptError({
        message: `Confirmation prompt failed: ${String(error)}`,
      }),
  });
}

/**
 * Prompt user to select from choices
 */
export function promptChoice(
  message: string,
  choices: string[],
  defaultIndex?: number
): Effect.Effect<string, PromptError> {
  return Effect.tryPromise({
    try: async () => {
      return await select({
        message,
        choices: choices.map((choice) => ({
          name: choice,
          value: choice,
        })),
        default: defaultIndex !== undefined ? choices[defaultIndex] : undefined,
      });
    },
    catch: (error) =>
      new PromptError({
        message: `Choice prompt failed: ${String(error)}`,
      }),
  });
}

/**
 * Prompt user for password (hidden input)
 */
export function promptPassword(
  message: string,
  validate?: (value: string) => boolean | string
): Effect.Effect<string, PromptError> {
  return Effect.tryPromise({
    try: async () => {
      return await password({
        message,
        mask: '*',
        validate: validate ? (v) => {
          const result = validate(v);
          return result === true ? true : String(result);
        } : undefined,
      });
    },
    catch: (error) =>
      new PromptError({
        message: `Password prompt failed: ${String(error)}`,
      }),
  });
}

/**
 * Generic prompt function that handles all types
 */
export function prompt(
  options: PromptOptions
): Effect.Effect<string, PromptError> {
  return Effect.gen(function* () {
    let value: string;

    switch (options.type) {
      case 'confirm':
        const confirmed = yield* promptConfirm(
          options.message,
          options.default === 'true'
        );
        value = String(confirmed);
        break;

      case 'choice':
        if (!options.choices) {
          return yield* Effect.fail(
            new PromptError({
              message: 'Choices required for choice prompt',
            })
          );
        }
        value = yield* promptChoice(
          options.message,
          options.choices,
          0
        );
        break;

      case 'password':
        value = yield* promptPassword(
          options.message,
          options.validate
        );
        break;

      case 'text':
      default:
        value = yield* promptInput(
          options.message,
          options.default,
          options.validate
        );
        break;
    }

    return value;
  });
}
