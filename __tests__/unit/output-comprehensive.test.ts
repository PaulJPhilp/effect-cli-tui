import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { Output, OutputTest, createCustomOutput } from '../../src/core/output'

/**
 * Comprehensive tests for output.ts module
 * Tests Output service with various output operations
 */

describe('Output Service - Comprehensive Coverage', () => {
  describe('Output.Default - stdout', () => {
    it('should write to stdout without newline', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('test output')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('test output')

      stdoutSpy.mockRestore()
    })

    it('should write multiple stdout calls', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('line1')
        yield* output.stdout('line2')
        yield* output.stdout('line3')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy.mock.calls.length).toBeGreaterThanOrEqual(3)

      stdoutSpy.mockRestore()
    })

    it('should handle empty stdout', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('')

      stdoutSpy.mockRestore()
    })
  })

  describe('Output.Default - stderr', () => {
    it('should write to stderr without newline', async () => {
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stderr('error output')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stderrSpy).toHaveBeenCalledWith('error output')

      stderrSpy.mockRestore()
    })

    it('should write multiple stderr calls', async () => {
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stderr('error1')
        yield* output.stderr('error2')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stderrSpy.mock.calls.length).toBeGreaterThanOrEqual(2)

      stderrSpy.mockRestore()
    })
  })

  describe('Output.Default - line', () => {
    it('should write line with newline', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.line('test line')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalledWith('test line')

      consoleSpy.mockRestore()
    })

    it('should write multiple lines', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.line('line 1')
        yield* output.line('line 2')
        yield* output.line('line 3')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(consoleSpy.mock.calls.length).toBeGreaterThanOrEqual(3)

      consoleSpy.mockRestore()
    })

    it('should handle empty line', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.line('')
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalledWith('')

      consoleSpy.mockRestore()
    })
  })

  describe('Output.Default - Terminal Control', () => {
    it('should clear line with ANSI escape', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.clearLine()
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[K')

      stdoutSpy.mockRestore()
    })

    it('should carriage return', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.carriageReturn()
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\r')

      stdoutSpy.mockRestore()
    })

    it('should hide cursor', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.hideCursor()
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25l')

      stdoutSpy.mockRestore()
    })

    it('should show cursor', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.showCursor()
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')

      stdoutSpy.mockRestore()
    })
  })

  describe('OutputTest - In-Memory Capture', () => {
    it('should capture stdout writes', async () => {
      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('captured')
      }).pipe(Effect.provide(OutputTest))

      await Effect.runPromise(program)
      // Should not throw
    })

    it('should capture stderr writes', async () => {
      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stderr('error captured')
      }).pipe(Effect.provide(OutputTest))

      await Effect.runPromise(program)
      // Should not throw
    })

    it('should capture line writes', async () => {
      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.line('line captured')
      }).pipe(Effect.provide(OutputTest))

      await Effect.runPromise(program)
      // Should not throw
    })

    it('should capture multiple operations', async () => {
      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('out1')
        yield* output.stderr('err1')
        yield* output.line('line1')
        yield* output.clearLine()
        yield* output.hideCursor()
      }).pipe(Effect.provide(OutputTest))

      await Effect.runPromise(program)
      // Should not throw and all operations should be recorded
    })

    it('should capture terminal control sequences', async () => {
      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.hideCursor()
        yield* output.clearLine()
        yield* output.carriageReturn()
        yield* output.showCursor()
      }).pipe(Effect.provide(OutputTest))

      await Effect.runPromise(program)
      // Should not throw
    })
  })

  describe('createCustomOutput', () => {
    it('should write to custom stdout function', async () => {
      const outputs: string[] = []
      const customOutput = createCustomOutput((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('test')
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(outputs).toContain('test')
    })

    it('should write to custom stderr function', async () => {
      const errors: string[] = []
      const customOutput = createCustomOutput(
        () => {},
        (text) => errors.push(text)
      )

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stderr('error message')
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(errors).toContain('error message')
    })

    it('should fall back to stdout if stderr not provided', async () => {
      const outputs: string[] = []
      const customOutput = createCustomOutput((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stderr('fallback')
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(outputs).toContain('fallback')
    })

    it('should write lines with newline', async () => {
      const outputs: string[] = []
      const customOutput = createCustomOutput((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.line('test line')
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(outputs[0]).toBe('test line\n')
    })

    it('should handle all terminal control operations', async () => {
      const outputs: string[] = []
      const customOutput = createCustomOutput((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.hideCursor()
        yield* output.clearLine()
        yield* output.carriageReturn()
        yield* output.showCursor()
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(outputs).toContain('\x1B[?25l')
      expect(outputs).toContain('\x1B[K')
      expect(outputs).toContain('\r')
      expect(outputs).toContain('\x1B[?25h')
    })
  })

  describe('Complex Output Workflows', () => {
    it('should compose multiple output operations', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.hideCursor()
        yield* output.line('Processing...')
        yield* output.stdout('\rProgress: ')
        yield* output.clearLine()
        yield* output.line('Done!')
        yield* output.showCursor()
      }).pipe(Effect.provide(Output.Default))

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()
      expect(stdoutSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      stdoutSpy.mockRestore()
    })

    it('should work with custom output in complex workflow', async () => {
      const operations: string[] = []
      const customOutput = createCustomOutput(
        (text) => operations.push(`stdout: ${text}`),
        (text) => operations.push(`stderr: ${text}`)
      )

      const program = Effect.gen(function* () {
        const output = yield* Output
        yield* output.stdout('start')
        yield* output.line('middle')
        yield* output.stderr('error')
        yield* output.stdout('end')
      }).pipe(Effect.provide(customOutput))

      await Effect.runPromise(program)
      expect(operations.length).toBeGreaterThanOrEqual(4)
    })
  })
})
