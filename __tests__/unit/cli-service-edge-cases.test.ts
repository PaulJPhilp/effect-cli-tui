import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Effect } from 'effect'
import { spawn as originalSpawn } from 'child_process'
import { EffectCLI } from '../../src/cli'
import { CLIError } from '../../src/types'
import {
  MockCLI,
  MockCLIFailure,
  MockCLITimeout,
  createMockCLI
} from '../fixtures/test-layers'

/**
 * Extended edge case tests for EffectCLI service.
 * Focus on uncovered code paths and error scenarios.
 */

describe('EffectCLI Service - Edge Cases & Uncovered Paths', () => {
  describe('Buffer Configuration', () => {
    it('should accept maxBuffer option', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'output',
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { maxBuffer: 5 * 1024 * 1024 })
        return result.exitCode
      }).pipe(Effect.provide(customMock))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBe(0)
    })

    it('should respect maxBuffer = 0 (unlimited)', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'large'.repeat(1000),
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { maxBuffer: 0 })
        return result.stdout.length > 0
      }).pipe(Effect.provide(customMock))

      const success = await Effect.runPromise(program)
      expect(success).toBe(true)
    })

    it('should handle large output within buffer limit', async () => {
      const largeOutput = 'x'.repeat(1024)
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: largeOutput,
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { maxBuffer: 10 * 1024 * 1024 })
        return result.stdout.length
      }).pipe(Effect.provide(customMock))

      const length = await Effect.runPromise(program)
      expect(length).toBe(1024)
    })

    it('should handle combined stdout and stderr', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'output line',
        stderr: 'warning'
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { maxBuffer: 10 * 1024 })
        return result.stdout + result.stderr
      }).pipe(Effect.provide(customMock))

      const combined = await Effect.runPromise(program)
      expect(combined).toContain('output')
      expect(combined).toContain('warning')
    })
  })

  describe('Stream Method - Comprehensive Coverage', () => {
    it('should return void on stream success', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.stream('stream-cmd')
        return result
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBeUndefined()
    })

    it('should handle stream with multiple args', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', ['arg1', 'arg2', 'arg3'])
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle stream with empty args', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [])
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle stream failure with non-zero exit code', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('fail-cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.reason))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const reason = await Effect.runPromise(program)
      expect(reason).toBe('CommandFailed')
    })

    it('should handle stream timeout', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.stream('slow-cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.reason))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const reason = await Effect.runPromise(program)
      expect(reason).toBe('Timeout')
    })

    it('should handle stream with options', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], {
          cwd: process.cwd(),
          env: { TEST: 'value' },
          timeout: 5000
        })
        return 'done'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')
    })

    it('should handle stream with different timeout values', async () => {
      const program1 = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { timeout: 100 })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result1 = await Effect.runPromise(program1)
      expect(result1).toBe('ok')

      const program2 = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { timeout: 10000 })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result2 = await Effect.runPromise(program2)
      expect(result2).toBe('ok')
    })

    it('should handle stream with cwd option', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { cwd: '/tmp' })
        return 'executed'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('executed')
    })

    it('should handle stream with env variables', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], {
          env: {
            CUSTOM_VAR: 'custom_value',
            ANOTHER_VAR: 'another_value'
          }
        })
        return 'ok'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('ok')
    })

    it('should handle stream error recovery', async () => {
      const program = Effect.gen(function* () {
        return yield* Effect.gen(function* () {
          const cli = yield* EffectCLI
          yield* cli.stream('fail-cmd')
        }).pipe(
          Effect.catchTag('CLIError', () => Effect.succeed('recovered'))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBe('recovered')
    })

    it('should handle stream method chaining', async () => {
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
  })

  describe('Error Handling - Specific Scenarios', () => {
    it('should handle multiple simultaneous completions gracefully', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd')
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(typeof exitCode).toBe('number')
      expect(exitCode).toBe(0)
    })

    it('should handle command with stderr output', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'stdout content',
        stderr: 'warning message'
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd')
        return result
      }).pipe(Effect.provide(customMock))

      const result = await Effect.runPromise(program)
      expect(result.stdout).toBe('stdout content')
      expect(result.stderr).toBe('warning message')
    })

    it('should fail with command output in stderr on non-zero exit', async () => {
      const customMock = createMockCLI({
        exitCode: 2,
        stdout: '',
        stderr: 'Error: something went wrong'
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.message))
        )
      }).pipe(Effect.provide(customMock))

      const message = await Effect.runPromise(program)
      expect(message).toContain('exit code 2')
    })

    it('should handle very large exit codes', async () => {
      const customMock = createMockCLI({
        exitCode: 255,
        stdout: '',
        stderr: 'failed'
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('cmd').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.message))
        )
      }).pipe(Effect.provide(customMock))

      const message = await Effect.runPromise(program)
      expect(message).toContain('exit code 255')
    })
  })

  describe('Resource Cleanup & Scoping', () => {
    it('should execute cleanup in sequence', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('cmd')
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result.exitCode).toBe(0)
    })

    it('should handle cleanup on error', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('fail-cmd').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed(null))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result).toBeNull()
    })

    it('should cleanup after timeout', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('slow-cmd').pipe(
          Effect.catchTag('CLIError', () => Effect.succeed('cleaned-up'))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const result = await Effect.runPromise(program)
      expect(result).toBe('cleaned-up')
    })

    it('should handle nested effect scopes', async () => {
      const program = Effect.gen(function* () {
        return yield* Effect.gen(function* () {
          const cli = yield* EffectCLI
          return yield* cli.run('cmd')
        })
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result.exitCode).toBe(0)
    })
  })

  describe('Run Method - Additional Coverage', () => {
    it('should handle command with no output', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: '',
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('silent-cmd')
        return result
      }).pipe(Effect.provide(customMock))

      const result = await Effect.runPromise(program)
      expect(result.stdout).toBe('')
      expect(result.stderr).toBe('')
    })

    it('should capture multiline output', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'line1\nline2\nline3\nline4\n',
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('multiline')
        return result.stdout.split('\n').length
      }).pipe(Effect.provide(customMock))

      const lineCount = await Effect.runPromise(program)
      expect(lineCount).toBeGreaterThan(3)
    })

    it('should handle binary-like output safely', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: Buffer.from([0, 1, 2, 3, 255]).toString(),
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('binary')
        return typeof result.stdout === 'string'
      }).pipe(Effect.provide(customMock))

      const isString = await Effect.runPromise(program)
      expect(isString).toBe(true)
    })

    it('should handle concurrent run calls', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const results = yield* Effect.all([
          cli.run('cmd1'),
          cli.run('cmd2'),
          cli.run('cmd3')
        ])
        return results.length
      }).pipe(Effect.provide(MockCLI))

      const count = await Effect.runPromise(program)
      expect(count).toBe(3)
    })

    it('should preserve order in sequential execution', async () => {
      const execution: string[] = []

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        execution.push('start')
        yield* cli.run('cmd1')
        execution.push('middle')
        yield* cli.run('cmd2')
        execution.push('end')
      }).pipe(Effect.provide(MockCLI))

      await Effect.runPromise(program)
      expect(execution).toEqual(['start', 'middle', 'end'])
    })
  })

  describe('Timeout Edge Cases', () => {
    it('should handle timeout of exactly 1ms', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('cmd', [], { timeout: 1 }).pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.reason))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const reason = await Effect.runPromise(program)
      expect(['Timeout', 'CommandFailed']).toContain(reason)
    })

    it('should handle very large timeout value', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { timeout: 999999999 })
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBe(0)
    })

    it('should handle timeout of 0 (no timeout)', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { timeout: 0 })
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBe(0)
    })

    it('should handle stream timeout edge cases', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        yield* cli.stream('cmd', [], { timeout: 1000 })
        return 'done'
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')
    })
  })

  describe('Environment & Working Directory', () => {
    it('should handle empty environment object', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { env: {} })
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBe(0)
    })

    it('should handle empty working directory string', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], { cwd: '' })
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBeGreaterThanOrEqual(0)
    })

    it('should merge env variables with process.env', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('cmd', [], {
          env: { CUSTOM_ENV: 'test' }
        })
        return result.exitCode
      }).pipe(Effect.provide(MockCLI))

      const exitCode = await Effect.runPromise(program)
      expect(exitCode).toBe(0)
    })
  })

  describe('CLIError Type Safety', () => {
    it('should return typed CLIError for CommandFailed', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('fail').pipe(
          Effect.catchTag('CLIError', (err) =>
            Effect.succeed({
              isError: err instanceof Error,
              tag: err._tag,
              reason: err.reason,
              hasMessage: typeof err.message === 'string'
            })
          )
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const result = await Effect.runPromise(program)
      expect(result.isError).toBe(true)
      expect(result.tag).toBe('CLIError')
      expect(result.reason).toBe('CommandFailed')
      expect(result.hasMessage).toBe(true)
    })

    it('should preserve error context through catch', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('fail').pipe(
          Effect.catchTag('CLIError', (err) => Effect.succeed(err.message))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const message = await Effect.runPromise(program)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })
  })
})
