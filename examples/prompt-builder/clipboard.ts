/**
 * Clipboard utility for prompt-builder example
 *
 * Provides cross-platform clipboard support using native OS commands:
 * - macOS: pbcopy
 * - Linux: xclip or xsel
 * - Windows: clip
 */

import { Effect } from 'effect'
import { execSync } from 'child_process'

/**
 * Detect which clipboard command is available on this platform
 */
const detectClipboardCommand = (): 'pbcopy' | 'xclip' | 'xsel' | 'clip' | null => {
  // Try macOS pbcopy first
  try {
    execSync('which pbcopy', { stdio: 'ignore' })
    return 'pbcopy'
  } catch {
    // Continue
  }

  // Try Linux xclip
  try {
    execSync('which xclip', { stdio: 'ignore' })
    return 'xclip'
  } catch {
    // Continue
  }

  // Try Linux xsel
  try {
    execSync('which xsel', { stdio: 'ignore' })
    return 'xsel'
  } catch {
    // Continue
  }

  // Try Windows clip
  try {
    execSync('where clip', { stdio: 'ignore', shell: process.platform === 'win32' ? 'cmd.exe' : undefined })
    return 'clip'
  } catch {
    // All failed
    return null
  }
}

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
    const command = detectClipboardCommand()

    if (!command) {
      return yield* Effect.fail(
        new Error(
          'No clipboard command found. Tried: pbcopy, xclip, xsel, clip'
        )
      )
    }

    yield* Effect.tryPromise(() =>
      new Promise<void>((resolve, reject) => {
        const { spawn } = require('child_process')

        let args: string[] = []
        if (command === 'xclip') {
          args = ['-selection', 'clipboard']
        } else if (command === 'xsel') {
          args = ['--clipboard', '--input']
        }

        const proc = spawn(command, args)

        proc.stdin.write(text)
        proc.stdin.end()

        proc.on('error', reject)
        proc.on('close', (code: number) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`${command} failed with code ${code}`))
          }
        })
      })
    )
  })
