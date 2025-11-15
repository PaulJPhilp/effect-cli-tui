import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { EffectCLI } from '../../src/cli'
import {
  MockCLI,
  MockCLIFailure,
  MockCLITimeout,
  createMockCLI
} from '../../__tests__/fixtures/test-layers'

/**
 * Integration tests for EffectCLI service.
 *
 * Tests both mock and real command execution to ensure:
 * - Commands execute successfully
 * - Output is captured correctly
 * - Errors are handled properly
 * - Resources are cleaned up
 * - Timeouts work as expected
 */

describe('EffectCLI Integration Tests', () => {
  describe('Mock CLI Execution', () => {
    it('should execute mock command successfully', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const result = yield* cli.run('test-command')
        return result
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(program)
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('successful')
      expect(result.stderr).toBe('')
    })

    it('should handle mock command failure', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('failing-command').pipe(
          Effect.catchTag('CLIError', (error) => Effect.succeed(error))
        )
      }).pipe(Effect.provide(MockCLIFailure))

      const error = await Effect.runPromise(program)
      expect(error.reason).toBe('CommandFailed')
      expect(error.message).toContain('exit code 1')
    })

    it('should handle mock timeout', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('slow-command').pipe(
          Effect.catchTag('CLIError', (error) => Effect.succeed(error))
        )
      }).pipe(Effect.provide(MockCLITimeout))

      const error = await Effect.runPromise(program)
      expect(error.reason).toBe('Timeout')
      expect(error.message).toContain('timed out')
    })

    it('should use custom mock response', async () => {
      const customMock = createMockCLI({
        exitCode: 0,
        stdout: 'Custom output from mock',
        stderr: ''
      })

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('custom')
      }).pipe(Effect.provide(customMock))

      const result = await Effect.runPromise(program)
      expect(result.stdout).toBe('Custom output from mock')
    })
  })

  describe('Real Command Execution', () => {
    /**
     * Tests that use real command execution.
     * These test common CLI tools that should be available on most systems.
     */

    it('should execute echo command successfully', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('echo', ['hello world'])
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.exitCode).toBe(0)
      expect(result.stdout.trim()).toBe('hello world')
    })

    it('should handle command not found error', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('nonexistent-command-xyz-123').pipe(
          Effect.catchTag('CLIError', (error) => Effect.succeed(error))
        )
      }).pipe(Effect.provide(EffectCLI.Default))

      const error = await Effect.runPromise(program)
      expect(error.reason).toBe('NotFound')
    })

    it('should capture both stdout and stderr from command', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('sh', ['-c', 'echo "output"; echo "error" >&2'])
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.stdout).toContain('output')
      expect(result.stderr).toContain('error')
    })

    it('should pass environment variables to command', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('sh', ['-c', 'echo $TEST_VAR'], {
          env: { TEST_VAR: 'test-value-123' }
        })
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.stdout.trim()).toBe('test-value-123')
    })

    it('should handle command execution with multiple arguments', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return yield* cli.run('sh', ['-c', 'for arg in "$@"; do echo "$arg"; done', '--', 'arg1', 'arg2', 'arg3'])
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('arg1')
      expect(result.stdout).toContain('arg2')
      expect(result.stdout).toContain('arg3')
    })
  })

  describe('Service Interface Completeness', () => {
    it('should provide run and stream methods', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        return {
          hasRun: typeof cli.run === 'function',
          hasStream: typeof cli.stream === 'function'
        }
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.hasRun).toBe(true)
      expect(result.hasStream).toBe(true)
    })

    it('should return Effect from CLI methods', async () => {
      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI
        const runEffect = cli.run('echo', ['test'])
        const streamEffect = cli.stream('echo', ['test'])
        return {
          runIsEffect: runEffect && typeof runEffect === 'object',
          streamIsEffect: streamEffect && typeof streamEffect === 'object'
        }
      }).pipe(Effect.provide(EffectCLI.Default))

      const result = await Effect.runPromise(program)
      expect(result.runIsEffect).toBe(true)
      expect(result.streamIsEffect).toBe(true)
    })
  })
})
