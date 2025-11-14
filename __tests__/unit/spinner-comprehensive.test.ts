import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Effect } from 'effect'
import {
  spinnerEffect,
  startSpinner,
  stopSpinner,
  updateSpinner,
  type SpinnerOptions
} from '../../src/progress/spinner'

/**
 * Comprehensive tests for spinner.ts module
 * Tests spinner lifecycle, options, and error handling
 */

describe('Spinner - Comprehensive Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('startSpinner - Basic Functionality', () => {
    it('should start spinner with default options', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Processing...')
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should start spinner with message', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading data...')
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should hide cursor when hideCursor option is true', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Processing...', { hideCursor: true })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('\x1B[?25l'))
      stdoutSpy.mockRestore()
    })

    it('should not hide cursor when hideCursor is false', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Processing...', { hideCursor: false })
        })
      )

      await Effect.runPromise(program)
      // Should not have hidden cursor
      const hideCursorCalls = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\x1B[?25l')
      )
      expect(hideCursorCalls.length).toBe(0)
      stdoutSpy.mockRestore()
    })
  })

  describe('startSpinner - Spinner Types', () => {
    it('should support dots spinner type', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'dots' })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should support line spinner type', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'line' })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should support pipe spinner type', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'pipe' })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should support simpleDots spinner type', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'simpleDots' })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should support simpleDotsScrolling spinner type', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'simpleDotsScrolling' })
        })
      )

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should throw error for invalid spinner type', async () => {
      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...', { type: 'invalid-type' as any })
        })
      )

      await expect(Effect.runPromise(program)).rejects.toThrow()
    })
  })

  describe('updateSpinner', () => {
    it('should update spinner message', async () => {
      const program = Effect.gen(function* () {
        yield* updateSpinner('Updated message')
        yield* Effect.succeed(undefined)
      })

      await Effect.runPromise(program)
    })

    it('should update spinner with empty message', async () => {
      const program = Effect.gen(function* () {
        yield* updateSpinner('')
        yield* Effect.succeed(undefined)
      })

      await Effect.runPromise(program)
    })

    it('should update spinner with long message', async () => {
      const longMsg = 'Processing ' + 'data'.repeat(50)
      const program = Effect.gen(function* () {
        yield* updateSpinner(longMsg)
        yield* Effect.succeed(undefined)
      })

      await Effect.runPromise(program)
    })
  })

  describe('stopSpinner', () => {
    it('should stop spinner with success message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        yield* stopSpinner('Completed!', 'success')
      })

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalledWith('✓ Completed!')
      consoleSpy.mockRestore()
    })

    it('should stop spinner with error message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        yield* stopSpinner('Failed!', 'error')
      })

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalledWith('✗ Failed!')
      consoleSpy.mockRestore()
    })

    it('should stop spinner without message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        yield* stopSpinner(undefined, 'success')
      })

      await Effect.runPromise(program)
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should stop spinner with empty message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        yield* stopSpinner('', 'success')
      })

      await Effect.runPromise(program)
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('spinnerEffect - Integration', () => {
    it('should run effect with spinner on success', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const effect = Effect.succeed('result')
      const program = spinnerEffect('Processing...', effect)

      const result = await Effect.runPromise(program)
      expect(result).toBe('result')
      expect(consoleSpy).toHaveBeenCalledWith('✓ Done!')

      stdoutSpy.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should stop spinner on effect failure', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const effect = Effect.fail(new Error('Test error'))
      const program = spinnerEffect('Processing...', effect)

      try {
        await Effect.runPromise(program)
      } catch (error) {
        // Expected to throw
      }

      // Check if error handling attempt was made
      expect(stdoutSpy).toHaveBeenCalled()

      stdoutSpy.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should work with spinner options', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const effect = Effect.succeed('done')
      const options: SpinnerOptions = { hideCursor: true, type: 'dots' }
      const program = spinnerEffect('Loading...', effect, options)

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')

      stdoutSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('spinnerEffect - Resource Cleanup', () => {
    it('should restore cursor on cleanup', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const effect = Effect.succeed('result')
      const program = spinnerEffect('Processing...', effect, { hideCursor: true })

      await Effect.runPromise(program)

      // Should have shown cursor again
      const showCursorCalls = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\x1B[?25h')
      )
      expect(showCursorCalls.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should clear spinner line on cleanup', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const effect = Effect.succeed('result')
      const program = spinnerEffect('Processing...', effect)

      await Effect.runPromise(program)

      // Should have cleared the line
      const clearLineCalls = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\x1B[K')
      )
      expect(clearLineCalls.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })
})
