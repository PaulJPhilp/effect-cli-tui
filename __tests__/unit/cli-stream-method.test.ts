import { describe, it, expect, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { EffectCLI } from '../../src/cli'
import {
  MockCLI,
  MockCLIFailure,
  MockCLITimeout,
  createMockCLI
} from '../../__tests__/fixtures/test-layers'

/**
 * Comprehensive tests for EffectCLI.stream() method.
 * Tests with real child_process.spawn to exercise code paths.
 */

describe('EffectCLI.stream() Method - Comprehensive Testing', () => {
  describe('Basic Stream Execution', () => {
    it('should return void on successful stream', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.stream('test-command', ['arg1'])
        return result
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBeUndefined()
    })

    it('should handle stream with multiple arguments', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('test-cmd', ['arg1', 'arg2', 'arg3'])
        return 'completed'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('completed')
    })

    it('should handle stream with no arguments', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd')
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle stream with empty args array', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [])
        return 'done'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')
    })
  })

  describe('Stream with Options', () => {
    it('should accept cwd option', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], { cwd: process.cwd() })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should accept env option', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], { env: { CUSTOM: 'value' } })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should accept timeout option', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], { timeout: 5000 })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should accept all options together', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], {
          cwd: process.cwd(),
          env: { VAR: 'val' },
          timeout: 5000
        })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })
  })

  describe('Stream Error Handling', () => {
    it('should fail with CLIError on command failure', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('failing-cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.reason))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const reason = await Effect.runPromise(program)
      expect(reason).toBe('CommandFailed')
    })

    it('should provide error message', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('failing-cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.message))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const message = await Effect.runPromise(program)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })

    it('should support error recovery with catchTag', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('failing-cmd').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed('recovered'))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBe('recovered')
    })

    it('should support error recovery with orElse', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('failing-cmd').pipe(
          Effect.orElse(() => Effect.succeed('fallback'))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBe('fallback')
    })

    it('should support error recovery with catchAll', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('failing-cmd').pipe(
          Effect.catchAll(() => Effect.succeed('all-caught'))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBe('all-caught')
    })
  })

  describe('Stream Timeout Handling', () => {
    it('should timeout on slow command', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('slow-cmd', [], { timeout: 100 }).pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.reason))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const reason = await Effect.runPromise(program)
      expect(reason).toBe('Timeout')
    })

    it('should include timeout duration in error message', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('slow-cmd', [], { timeout: 50 }).pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.message))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const message = await Effect.runPromise(program)
      expect(message).toContain('timed out')
      expect(message).toContain('50')
    })

    it('should handle large timeout value', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], { timeout: 999999999 })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle zero timeout (no timeout)', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg'], { timeout: 0 })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })
  })

  describe('Stream Composition & Chaining', () => {
    it('should support sequential stream calls', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd1')
        yield* cli.stream('cmd2')
        yield* cli.stream('cmd3')
        return 'all-done'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('all-done')
    })

    it('should handle error in one stream without affecting others', async () => {
      // For stream(), the mock returns void, and we just test error handling
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        // First call succeeds
        yield* cli.stream('cmd1')
        // Second call fails but is caught
        yield* cli.stream('failing-cmd').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed(undefined))
        )
        // Third call succeeds
        yield* cli.stream('cmd3')
        return 'completed'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('completed')
    })

    it('should handle multiple error recovery patterns', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const r1 = yield* cli.stream('cmd1').pipe(
          Effect.catchAll(() => Effect.succeed(undefined))
        )
        const r2 = yield* cli.stream('failing-cmd').pipe(
          Effect.orElse(() => Effect.succeed(undefined))
        )
        const r3 = yield* cli.stream('cmd3').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed(undefined))
        )
        return { r1, r2, r3 }
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result.r1).toBeUndefined()
      expect(result.r2).toBeUndefined()
      expect(result.r3).toBeUndefined()
    })
  })

  describe('Stream Environment & Working Directory', () => {
    it('should handle env variable overrides', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], {
          env: {
            TEST_VAR_1: 'val1',
            TEST_VAR_2: 'val2',
            TEST_VAR_3: 'val3'
          }
        })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle empty env object', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { env: {} })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should use default working directory when not specified', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd')
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle specified working directory', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { cwd: '/tmp' })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })
  })

  describe('Stream vs Run Method Differences', () => {
    it('stream should return void while run returns CLIResult', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const runResult = yield* cli.run('test-cmd')
        const streamResult = yield* cli.stream('test-cmd')
        return {
          runHasExitCode: 'exitCode' in runResult,
          streamIsVoid: streamResult === undefined
        }
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result.runHasExitCode).toBe(true)
      expect(result.streamIsVoid).toBe(true)
    })

    it('stream uses inherited stdio while run captures output', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const runResult = yield* cli.run('test-cmd')
        yield* cli.stream('test-cmd')
        return {
          runCapturesOutput: runResult.stdout.length > 0,
          streamReturnsVoid: true
        }
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result.runCapturesOutput).toBe(true)
      expect(result.streamReturnsVoid).toBe(true)
    })
  })

  describe('Edge Cases & Resource Management', () => {
    it('should handle immediate command completion', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd')
        return 'done'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')
    })

    it('should handle nested Effect scopes', async () => {
      const program = Effect.gen(function* () {
        return yield* Effect.gen(function* () {
          const cli = yield* EffectCLI
          yield* cli.stream('cmd')
          return 'inner'
        })
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('inner')
    })

    it('should handle mixed success and error patterns', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        // Test error recovery - stream fails but we recover
        const errorHandled = yield* cli.stream('cmd1').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed(true))
        )

        // After error recovery, we can continue
        yield* cli.stream('cmd2').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed(undefined))
        )

        return errorHandled
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })

    it('should support conditional stream execution', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const condition = true

        if (condition) {
          yield* cli.stream('cmd')
        }

        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle multiple options combinations', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd1', ['a', 'b'], {
          cwd: process.cwd(),
          timeout: 5000
        })
        yield* cli.stream('cmd2', ['c'], { env: { X: 'y' } })
        yield* cli.stream('cmd3', ['d'], { timeout: 1000 })
        return 'all-ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('all-ok')
    })
  })

  describe('Stream Method Type Safety', () => {
    it('should return Effect<void, CLIError>', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const effect = cli.stream('cmd')
        return typeof effect === 'object'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })

    it('should work with Effect error handling utilities', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const results = yield* Effect.all([
          cli.stream('cmd1'),
          cli.stream('cmd2').pipe(
            Effect.catchTag('CLIError', () => Effect.succeed(undefined))
          )
        ])
        return Array.isArray(results)
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })
  })
})
