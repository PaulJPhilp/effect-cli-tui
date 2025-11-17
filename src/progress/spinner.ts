import cliSpinners from "cli-spinners";
import { Effect } from "effect";
import {
  ANSI_CARRIAGE_RETURN,
  ANSI_HIDE_CURSOR,
  ANSI_SHOW_CURSOR,
  ICON_ERROR,
  ICON_SUCCESS,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
} from "../core/icons";
import type { ChalkColor } from "../types";

export interface SpinnerOptions {
  message?: string;
  type?: "dots" | "line" | "pipe" | "simpleDots" | "simpleDotsScrolling";
  color?: ChalkColor;
  hideCursor?: boolean;
}

let currentSpinner: NodeJS.Timer | null = null;
let spinnerFrames: string[] = [];
let currentFrame = 0;
let spinnerMessage = "";

/**
 * Run an async Effect with an animated spinner
 */
export function spinnerEffect<A, E, R>(
  message: string,
  effect: Effect.Effect<A, E, R>,
  options?: SpinnerOptions
): Effect.Effect<A, E, R> {
  return Effect.gen(function* () {
    yield* startSpinner(message, options);
    const result: A = yield* effect.pipe(
      Effect.tap(() => stopSpinner(SPINNER_MESSAGE_DONE, "success")),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* stopSpinner(SPINNER_MESSAGE_FAILED, "error");
          return yield* Effect.fail(error);
        })
      )
    );
    return result;
  });
}

/**
 * Start an animated spinner
 */
export function startSpinner(
  message: string,
  options?: SpinnerOptions
): Effect.Effect<void> {
  return Effect.sync(() => {
    spinnerMessage = message;
    const spinnerType = options?.type || SPINNER_DEFAULT_TYPE;
    const spinner = cliSpinners[spinnerType];
    spinnerFrames = spinner.frames;
    currentFrame = 0;

    if (options?.hideCursor) {
      process.stdout.write(ANSI_HIDE_CURSOR);
    }

    const interval: number =
      ((spinner as unknown as Record<string, unknown>).interval as number) ||
      SPINNER_DEFAULT_INTERVAL;
    currentSpinner = setInterval(() => {
      const frame = spinnerFrames[currentFrame % spinnerFrames.length];
      process.stdout.write(`${ANSI_CARRIAGE_RETURN}${frame} ${spinnerMessage}`);
      currentFrame++;
    }, interval);
  });
}

/**
 * Update the spinner message
 */
export function updateSpinner(message: string): Effect.Effect<void> {
  return Effect.sync(() => {
    spinnerMessage = message;
  });
}

/**
 * Stop the spinner and show final message
 */
export function stopSpinner(
  message?: string,
  type: "success" | "error" = "success"
): Effect.Effect<void> {
  return Effect.sync(() => {
    if (currentSpinner) {
      clearInterval(currentSpinner);
      currentSpinner = null;
    }

    // Show cursor again
    process.stdout.write(ANSI_SHOW_CURSOR);

    const prefix = type === "success" ? ICON_SUCCESS : ICON_ERROR;
    const finalMessage = message ? `${prefix} ${message}` : "";
    process.stdout.write(`${ANSI_CARRIAGE_RETURN}${finalMessage}\n`);
  });
}
