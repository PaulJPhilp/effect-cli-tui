import { Effect } from 'effect';
import cliSpinners from 'cli-spinners';

export interface SpinnerOptions {
  message?: string;
  type?: 'dots' | 'line' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling';
  color?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
  hideCursor?: boolean;
}

let currentSpinner: NodeJS.Timer | null = null;
let spinnerFrames: string[] = [];
let currentFrame = 0;
let spinnerMessage = '';

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
    try {
      const result = yield* effect;
      yield* stopSpinner('Done!', 'success');
      return result;
    } catch (error) {
      yield* stopSpinner('Failed!', 'error');
      throw error;
    }
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
    const spinnerType = options?.type || 'dots';
    const spinner = cliSpinners[spinnerType];
    spinnerFrames = spinner.frames;
    currentFrame = 0;

    if (options?.hideCursor) {
      process.stdout.write('\x1B[?25l');
    }

    currentSpinner = setInterval(() => {
      const frame = spinnerFrames[currentFrame % spinnerFrames.length];
      process.stdout.write(`\r${frame} ${spinnerMessage}`);
      currentFrame++;
    }, (spinner as any).interval || 100);
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
  type: 'success' | 'error' = 'success'
): Effect.Effect<void> {
  return Effect.sync(() => {
    if (currentSpinner) {
      clearInterval(currentSpinner);
      currentSpinner = null;
    }

    // Show cursor again
    process.stdout.write('\x1B[?25h');

    const prefix = type === 'success' ? '✓' : '✗';
    const finalMessage = message ? `${prefix} ${message}` : '';
    console.log(`\r${finalMessage}`);
  });
}
