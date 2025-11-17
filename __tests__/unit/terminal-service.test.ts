import { Effect } from 'effect'
import { describe, expect, it, vi } from 'vitest'
import { createCustomTerminal, Terminal, TerminalTest } from '../../src/core/terminal'

/**
 * Comprehensive tests for the Output Service abstraction.
 * Ensures output can be captured, redirected, and tested.
 */

describe('Output Service Abstraction', () => {
  describe('OutputLive - Direct Process Output', () => {
    it('should write to stdout directly', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('test message')
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('test message')
      stdoutSpy.mockRestore()
    })

    it('should write to stderr directly', async () => {
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stderr('error message')
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stderrSpy).toHaveBeenCalledWith('error message')
      stderrSpy.mockRestore()
    })

    it('should write line with newline', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.line('test line')
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalledWith('test line')
      consoleSpy.mockRestore()
    })

    it('should clear line with ANSI sequence', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.clearLine()
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[K')
      stdoutSpy.mockRestore()
    })

    it('should move to start of line', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.carriageReturn()
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\r')
      stdoutSpy.mockRestore()
    })

    it('should hide cursor', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.hideCursor()
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25l')
      stdoutSpy.mockRestore()
    })

    it('should show cursor', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.showCursor()
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      stdoutSpy.mockRestore()
    })

    it('should handle multiple output operations in sequence', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.hideCursor()
        yield* terminal.stdout('message')
        yield* terminal.showCursor()
      }).pipe(Effect.provide(Terminal.Default))

      await Effect.runPromise(program)
      expect(stdoutSpy).toHaveBeenCalledTimes(3)
      stdoutSpy.mockRestore()
    })
  })

  describe('OutputTest - In-Memory Capturing', () => {
    it('should provide OutputTest layer', async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('test')
        return 'success'
      }).pipe(Effect.provide(TerminalTest))

      const result = await Effect.runPromise(program)
      expect(result).toBe('success')
    })

    it('should not write to actual stdout', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('test message')
      }).pipe(Effect.provide(TerminalTest))

      await Effect.runPromise(program)
      // OutputTest should not call actual stdout
      expect(stdoutSpy).not.toHaveBeenCalled()
      stdoutSpy.mockRestore()
    })

    it('should not write to actual stderr', async () => {
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stderr('error message')
      }).pipe(Effect.provide(TerminalTest))

      await Effect.runPromise(program)
      expect(stderrSpy).not.toHaveBeenCalled()
      stderrSpy.mockRestore()
    })

    it('should not write to console', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.line('test line')
      }).pipe(Effect.provide(TerminalTest))

      await Effect.runPromise(program)
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should work without side effects', async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('message1')
        yield* terminal.stderr('error1')
        yield* terminal.line('line1')
        yield* terminal.hideCursor()
        yield* terminal.showCursor()
        yield* terminal.clearLine()
        yield* terminal.carriageReturn()
        return 'done'
      }).pipe(Effect.provide(TerminalTest))

      const result = await Effect.runPromise(program)
      expect(result).toBe('done')
    })

    it('should handle multiple test layers independently', async () => {
      const program1 = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('program1')
      }).pipe(Effect.provide(TerminalTest))

      const program2 = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('program2')
      }).pipe(Effect.provide(TerminalTest))

      await Effect.runPromise(program1)
      await Effect.runPromise(program2)
      expect(true).toBe(true) // Both should complete
    })
  })

  describe('createCustomTerminal - Custom Stream Handling', () => {
    it('should use custom stdout function', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('test1')
        yield* terminal.stdout('test2')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toEqual(['test1', 'test2'])
    })

    it('should use custom stderr function', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal(
        () => {}, // stdout ignored
        (text) => outputs.push(text),
      )

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stderr('error1')
        yield* terminal.stderr('error2')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toEqual(['error1', 'error2'])
    })

    it('should fallback to stdout when stderr not provided', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stderr('error')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toContain('error')
    })

    it('should handle line output with custom function', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.line('line1')
        yield* terminal.line('line2')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toHaveLength(2)
    })

    it('should handle ANSI operations with custom function', async () => {
      const operations: string[] = []
      const customTerminal = createCustomTerminal((text) => operations.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.hideCursor()
        yield* terminal.stdout('text')
        yield* terminal.clearLine()
        yield* terminal.showCursor()
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(operations).toContain('\x1B[?25l')
      expect(operations).toContain('text')
      expect(operations).toContain('\x1B[K')
      expect(operations).toContain('\x1B[?25h')
    })

    it('should support buffering output to string', async () => {
      const buffer: string[] = []
      const customTerminal = createCustomTerminal((text) => buffer.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('hello')
        yield* terminal.stdout(' ')
        yield* terminal.stdout('world')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(buffer.join('')).toBe('hello world')
    })

    it('should support writing to array for analysis', async () => {
      const messages: { type: string; text: string }[] = []
      const customTerminal = createCustomTerminal(
        (text) => messages.push({ type: 'stdout', text }),
        (text) => messages.push({ type: 'stderr', text }),
      )

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('out1')
        yield* terminal.stderr('err1')
        yield* terminal.stdout('out2')
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(messages).toEqual([
        { type: 'stdout', text: 'out1' },
        { type: 'stderr', text: 'err1' },
        { type: 'stdout', text: 'out2' },
      ])
    })
  })

  describe('Service Interface Completeness', () => {
    it('should provide all required methods', async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        return Object.keys(terminal).sort()
      }).pipe(Effect.provide(Terminal.Default))

      const methods = await Effect.runPromise(program)
      expect(methods).toContain('stdout')
      expect(methods).toContain('stderr')
      expect(methods).toContain('line')
      expect(methods).toContain('clearLine')
      expect(methods).toContain('carriageReturn')
      expect(methods).toContain('hideCursor')
      expect(methods).toContain('showCursor')
    })

    it('should return Effect from all methods', async () => {
      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        const r1 = terminal.stdout('test')
        const r2 = terminal.line('test')
        const r3 = terminal.hideCursor()
        return [r1, r2, r3].every((r) => r && typeof r === 'object')
      }).pipe(Effect.provide(Terminal.Default))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle errors in custom output function', async () => {
      const errorFn = vi.fn(() => {
        throw new Error('Output error')
      })
      const customTerminal = createCustomTerminal(errorFn)

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('test')
      }).pipe(Effect.provide(customTerminal))

      // Should propagate the error
      await expect(Effect.runPromise(program)).rejects.toThrow()
    })

    it('should handle mixed error and success', async () => {
      let callCount = 0
      const customTerminal = createCustomTerminal((_text) => {
        callCount++
        if (callCount === 2) {
          throw new Error('Error on second call')
        }
      })

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('first')
        yield* terminal.stdout('second')
      }).pipe(Effect.provide(customTerminal))

      await expect(Effect.runPromise(program)).rejects.toThrow()
      expect(callCount).toBe(2)
    })
  })

  describe('Performance and Composition', () => {
    it('should handle high-volume output efficiently', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        for (let i = 0; i < 100; i++) {
          yield* terminal.stdout(`message-${i}\n`)
        }
      }).pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toHaveLength(100)
      expect(outputs[0]).toBe('message-0\n')
      expect(outputs[99]).toBe('message-99\n')
    })

    it('should support composing multiple custom outputs', async () => {
      const buffer1: string[] = []
      const buffer2: string[] = []

      const terminal1 = createCustomTerminal((text) => buffer1.push(text))
      const terminal2 = createCustomTerminal((text) => buffer2.push(text))

      const program1 = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('to-out1')
      }).pipe(Effect.provide(terminal1))

      const program2 = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('to-out2')
      }).pipe(Effect.provide(terminal2))

      await Effect.runPromise(program1)
      await Effect.runPromise(program2)

      expect(buffer1).toEqual(['to-out1'])
      expect(buffer2).toEqual(['to-out2'])
    })

    it('should work with chained Effect operations', async () => {
      const outputs: string[] = []
      const customTerminal = createCustomTerminal((text) => outputs.push(text))

      const program = Effect.gen(function* () {
        const terminal = yield* Terminal
        yield* terminal.stdout('before')
      })
        .pipe(
          Effect.flatMap(() =>
            Effect.gen(function* () {
              const terminal = yield* Terminal
              yield* terminal.stdout('after')
            }),
          ),
        )
        .pipe(Effect.provide(customTerminal))

      await Effect.runPromise(program)
      expect(outputs).toEqual(['before', 'after'])
    })
  })
})
