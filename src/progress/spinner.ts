import cliSpinners from 'cli-spinners'
import { Effect, Ref } from 'effect'
import {
  ANSI_CARRIAGE_RETURN,
  ANSI_CARRIAGE_RETURN_CLEAR,
  ANSI_HIDE_CURSOR,
  ANSI_SHOW_CURSOR,
  ICON_ERROR,
  ICON_SUCCESS,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
} from '../core/icons'
import type { ChalkColor } from '../types'

export interface SpinnerOptions {
  type?: 'dots' | 'line' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling'
  color?: ChalkColor
  hideCursor?: boolean
}

interface SpinnerState {
  timer: NodeJS.Timeout
  frames: string[]
  frameIndex: number
  message: string
  hideCursor: boolean
}

interface SpinnerServiceApi {
  start: (message: string, options?: SpinnerOptions) => Effect.Effect<void>
  update: (message: string) => Effect.Effect<void>
  stop: (message?: string, type?: 'success' | 'error') => Effect.Effect<void>
  withSpinner: <A, E, R>(
    message: string,
    effect: Effect.Effect<A, E, R>,
    options?: SpinnerOptions,
  ) => Effect.Effect<A, E, R>
}

const renderFrame = (state: SpinnerState) => {
  const frame = state.frames[state.frameIndex % state.frames.length]
  process.stdout.write(`${ANSI_CARRIAGE_RETURN}${frame} ${state.message}`)
}

const createSpinnerState = (message: string, options?: SpinnerOptions): SpinnerState => {
  const spinner = cliSpinners[options?.type ?? SPINNER_DEFAULT_TYPE]
  if (!spinner) {
    throw new Error(`Unknown spinner type: ${options?.type ?? 'undefined'}`)
  }
  const frames = spinner.frames ?? ['-', '\\']
  const hideCursor = options?.hideCursor ?? true

  if (hideCursor) {
    process.stdout.write(ANSI_HIDE_CURSOR)
  }

  const state: SpinnerState = {
    timer: setInterval(() => {
      state.frameIndex = (state.frameIndex + 1) % frames.length
      renderFrame(state)
    }, spinner.interval ?? SPINNER_DEFAULT_INTERVAL),
    frames,
    frameIndex: 0,
    message,
    hideCursor,
  }

  renderFrame(state)
  return state
}

const finalizeSpinner = (
  state: SpinnerState,
  message?: string,
  type: 'success' | 'error' = 'success',
) => {
  clearInterval(state.timer)
  process.stdout.write(ANSI_CARRIAGE_RETURN_CLEAR)
  if (state.hideCursor) {
    process.stdout.write(ANSI_SHOW_CURSOR)
  }

  if (message && message.length > 0) {
    const prefix = type === 'success' ? ICON_SUCCESS : ICON_ERROR
    process.stdout.write(`${prefix} ${message}\n`)
  }
}

export class SpinnerService extends Effect.Service<SpinnerService>()('app/SpinnerService', {
  effect: Effect.gen(function* () {
    const stateRef = yield* Ref.make<SpinnerState | null>(null)

    const startSpinnerInternal = (message: string, options?: SpinnerOptions) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(stateRef)
        if (current) {
          yield* Ref.set(stateRef, null)
          yield* Effect.sync(() => finalizeSpinner(current))
        }
        const state = yield* Effect.sync(() => createSpinnerState(message, options))
        yield* Ref.set(stateRef, state)
      })

    const updateSpinnerInternal = (message: string) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(stateRef)
        if (!current) return
        yield* Effect.sync(() => {
          current.message = message
          renderFrame(current)
        })
      })

    const stopSpinnerInternal = (
      message?: string,
      type: 'success' | 'error' = 'success',
      options?: { allowFallbackMessage?: boolean },
    ) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(stateRef)
        if (current) {
          yield* Ref.set(stateRef, null)
          yield* Effect.sync(() => finalizeSpinner(current, message, type))
          return
        }

        if (options?.allowFallbackMessage !== false) {
          yield* Effect.sync(() => {
            if (message && message.length > 0) {
              const prefix = type === 'success' ? ICON_SUCCESS : ICON_ERROR
              process.stdout.write(`${prefix} ${message}\n`)
            } else {
              process.stdout.write(ANSI_SHOW_CURSOR)
              process.stdout.write('\n')
            }
          })
        }
      })

    return {
      start: startSpinnerInternal,
      update: updateSpinnerInternal,
      stop: stopSpinnerInternal,
      withSpinner: <A, E, R>(
        message: string,
        effect: Effect.Effect<A, E, R>,
        options?: SpinnerOptions,
      ): Effect.Effect<A, E, R> =>
        Effect.acquireUseRelease(
          startSpinnerInternal(message, options),
          () =>
            effect.pipe(
              Effect.tap(() => stopSpinnerInternal(SPINNER_MESSAGE_DONE, 'success')),
              Effect.catchAll((error) =>
                Effect.gen(function* () {
                  yield* stopSpinnerInternal(SPINNER_MESSAGE_FAILED, 'error')
                  return yield* Effect.fail(error)
                }),
              ),
            ),
          () => stopSpinnerInternal(undefined, 'success', { allowFallbackMessage: false }),
        ),
    } as const satisfies SpinnerServiceApi
  }),
}) {}

/**
 * Run an async Effect with an animated spinner
 */
export function spinnerEffect<A, E, R>(
  message: string,
  effect: Effect.Effect<A, E, R>,
  options?: SpinnerOptions,
): Effect.Effect<A, E, R | SpinnerService> {
  return Effect.gen(function* () {
    const service = yield* SpinnerService
    return yield* service.withSpinner(message, effect, options)
  })
}

/**
 * Start an animated spinner
 */
export function startSpinner(
  message: string,
  options?: SpinnerOptions,
): Effect.Effect<void, never, SpinnerService> {
  return Effect.gen(function* () {
    const service = yield* SpinnerService
    yield* service.start(message, options)
  })
}

/**
 * Update the spinner message
 */
export function updateSpinner(message: string): Effect.Effect<void, never, SpinnerService> {
  return Effect.gen(function* () {
    const service = yield* SpinnerService
    yield* service.update(message)
  })
}

/**
 * Stop the spinner and show final message
 */
export function stopSpinner(
  message?: string,
  type: 'success' | 'error' = 'success',
): Effect.Effect<void, never, SpinnerService> {
  return Effect.gen(function* () {
    const service = yield* SpinnerService
    yield* service.stop(message, type)
  })
}
