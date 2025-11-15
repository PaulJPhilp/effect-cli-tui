/**
 * Clipboard utility for prompt-builder example
 *
 * Provides cross-platform clipboard support using native OS commands:
 * - macOS: pbcopy
 * - Linux: xclip or xsel
 * - Windows: clip
 *
 * Uses the EffectCLI pattern for command execution
 */

import { Effect } from 'effect'
import { EffectCLI } from '../../src/index.js'

/**
 * Detect which clipboard command is available on this platform
 */
const detectClipboardCommand = (): Effect.Effect<
  'pbcopy' | 'xclip' | 'xsel' | 'clip',
  Error
> =>
  Effect.gen(function* () {
    const cli = yield* EffectCLI

    // Try macOS pbcopy first
    try {
      yield* cli.run('which', ['pbcopy'])
      return 'pbcopy' as const
    } catch {
      // Continue
    }

    // Try Linux xclip
    try {
      yield* cli.run('which', ['xclip'])
      return 'xclip' as const
    } catch {
      // Continue
    }

    // Try Linux xsel
    try {
      yield* cli.run('which', ['xsel'])
      return 'xsel' as const
    } catch {
      // Continue
    }

    // Try Windows clip
    try {
      yield* cli.run('where', ['clip'])
      return 'clip' as const
    } catch {
      // All failed
      return yield* Effect.fail(
        new Error(
          'No clipboard command found. Tried: pbcopy, xclip, xsel, clip'
        )
      )
    }
  })

/**
 * Copy text to clipboard using platform-native command
 *
 * @param text - The text to copy to clipboard
 * @returns Effect that succeeds when text is copied
 *
 * @example
 * ```ts
 * yield* copyToClipboard('Hello, world!')
 * ```
 */
export const copyToClipboard = (text: string): Effect.Effect<void, Error> =>
  Effect.gen(function* () {
    const command = yield* detectClipboardCommand()
    const cli = yield* EffectCLI

    if (command === 'pbcopy') {
      // macOS: pipe text to pbcopy
      yield* Effect.tryPromise(() =>
        new Promise<void>((resolve, reject) => {
          const { spawn } = require('child_process')
          const proc = spawn('pbcopy')

          proc.stdin.write(text)
          proc.stdin.end()

          proc.on('error', reject)
          proc.on('close', (code: number) => {
            if (code === 0) {
              resolve()
            } else {
              reject(new Error(`pbcopy failed with code ${code}`))
            }
          })
        })
      )
    } else if (command === 'xclip') {
      // Linux xclip
      yield* Effect.tryPromise(() =>
        new Promise<void>((resolve, reject) => {
          const { spawn } = require('child_process')
          const proc = spawn('xclip', ['-selection', 'clipboard'])

          proc.stdin.write(text)
          proc.stdin.end()

          proc.on('error', reject)
          proc.on('close', (code: number) => {
            if (code === 0) {
              resolve()
            } else {
              reject(new Error(`xclip failed with code ${code}`))
            }
          })
        })
      )
    } else if (command === 'xsel') {
      // Linux xsel
      yield* Effect.tryPromise(() =>
        new Promise<void>((resolve, reject) => {
          const { spawn } = require('child_process')
          const proc = spawn('xsel', ['--clipboard', '--input'])

          proc.stdin.write(text)
          proc.stdin.end()

          proc.on('error', reject)
          proc.on('close', (code: number) => {
            if (code === 0) {
              resolve()
            } else {
              reject(new Error(`xsel failed with code ${code}`))
            }
          })
        })
      )
    } else {
      // Windows clip
      yield* Effect.tryPromise(() =>
        new Promise<void>((resolve, reject) => {
          const { spawn } = require('child_process')
          const proc = spawn('clip')

          proc.stdin.write(text)
          proc.stdin.end()

          proc.on('error', reject)
          proc.on('close', (code: number) => {
            if (code === 0) {
              resolve()
            } else {
              reject(new Error(`clip failed with code ${code}`))
            }
          })
        })
      )
    }
  })
