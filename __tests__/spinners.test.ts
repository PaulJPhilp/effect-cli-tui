import * as Effect from 'effect/Effect'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { spinnerEffect, startSpinner, updateSpinner, stopSpinner, SpinnerOptions } from 'effect-cli-tui'

describe('Spinner Display', () => {
  let stdoutSpy: vi.SpyInstance

  beforeEach(() => {
    vi.useFakeTimers()
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.useRealTimers()
    stdoutSpy.mockRestore()
  })

  describe('startSpinner', () => {
    it('should start a spinner with default message', async () => {
      const message = 'Loading...'
      await Effect.runPromise(startSpinner(message))

      expect(stdoutSpy).toHaveBeenCalled()
      // Spinner should have started an interval
    })

    it('should support different spinner types', async () => {
      const types: ('dots' | 'line' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling')[] = [
        'dots', 'line', 'pipe', 'simpleDots', 'simpleDotsScrolling'
      ]

      for (const type of types) {
        await Effect.runPromise(startSpinner('Test', { type }))
        expect(stdoutSpy).toHaveBeenCalled()
      }
    })

    it('should hide cursor when hideCursor is true', async () => {
      await Effect.runPromise(startSpinner('Test', { hideCursor: true }))

      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25l')
    })

    it('should return Effect<void>', async () => {
      const effect = startSpinner('Test')
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })

  describe('updateSpinner', () => {
    it('should update spinner message', async () => {
      await Effect.runPromise(startSpinner('Initial'))
      await Effect.runPromise(updateSpinner('Updated'))

      // Message should be updated internally
      expect(stdoutSpy).toHaveBeenCalled()
    })

    it('should return Effect<void>', async () => {
      const effect = updateSpinner('Test')
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })

  describe('stopSpinner', () => {
    it('should stop spinner and show success message', async () => {
      await Effect.runPromise(startSpinner('Test'))
      await Effect.runPromise(stopSpinner('Done', 'success'))

      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h') // Show cursor
      expect(stdoutSpy).toHaveBeenCalledWith('\r✓ Done\n')
    })

    it('should stop spinner and show error message', async () => {
      await Effect.runPromise(startSpinner('Test'))
      await Effect.runPromise(stopSpinner('Failed', 'error'))

      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      expect(stdoutSpy).toHaveBeenCalledWith('\r✗ Failed\n')
    })

    it('should handle no message', async () => {
      await Effect.runPromise(startSpinner('Test'))
      await Effect.runPromise(stopSpinner())

      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      expect(stdoutSpy).toHaveBeenCalledWith('\r\n')
    })

    it('should return Effect<void>', async () => {
      const effect = stopSpinner('Test')
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })

  describe('spinnerEffect', () => {
    it('should wrap an effect with spinner and show success on completion', async () => {
      const mockEffect = Effect.succeed('result')

      const result = await Effect.runPromise(spinnerEffect('Processing...', mockEffect))

      expect(result).toBe('result')
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      expect(stdoutSpy).toHaveBeenCalledWith('\r✓ Done!\n')
    })

    it('should show error message on effect failure', async () => {
      const mockEffect = Effect.fail('error')

      await expect(Effect.runPromise(spinnerEffect('Processing...', mockEffect))).rejects.toBe('error')

      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      expect(stdoutSpy).toHaveBeenCalledWith('\r✗ Failed!\n')
    })

    it('should support custom options', async () => {
      const mockEffect = Effect.succeed('result')
      const options: SpinnerOptions = { type: 'line', hideCursor: true }

      const result = await Effect.runPromise(spinnerEffect('Processing...', mockEffect, options))

      expect(result).toBe('result')
    })

    it('should return Effect with same result type', async () => {
      const mockEffect = Effect.succeed(42)
      const spinnerEffectResult = spinnerEffect('Test', mockEffect)

      const result = await Effect.runPromise(spinnerEffectResult)
      expect(result).toBe(42)
    })
  })
})
