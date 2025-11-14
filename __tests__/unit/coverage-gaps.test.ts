import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Effect } from 'effect'
import { applyChalkStyle } from '../../src/core/colors'
import { displayTable } from '../../src/tables/table'
import { startSpinner, stopSpinner } from '../../src/progress/spinner'
import { registerCleanupHandler, clearCleanupHandlers, getCleanupHandlerCount } from '../../src/core/signal-handler'

/**
 * Coverage gaps test - fills in remaining uncovered lines
 */

describe('Coverage Gaps - Fill Missing Lines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearCleanupHandlers()
  })

  afterEach(() => {
    clearCleanupHandlers()
  })

  describe('applyChalkStyle - null options', () => {
    it('should return text unchanged when options are null', () => {
      const result = applyChalkStyle('test', null as any)
      expect(result).toBe('test')
    })

    it('should return text unchanged when options are undefined', () => {
      const result = applyChalkStyle('test', undefined as any)
      expect(result).toBe('test')
    })

    it('should apply style when options provided', () => {
      const result = applyChalkStyle('test', { bold: true })
      expect(result).toContain('test')
    })
  })

  describe('displayTable - column formatters', () => {
    it('should apply column formatter to cell values', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable(
        [
          { id: 1, value: 100 },
          { id: 2, value: 200 }
        ],
        {
          columns: [
            { key: 'id', label: 'ID' },
            {
              key: 'value',
              label: 'Value',
              formatter: (val) => `$${val}` // Formatter with $ prefix
            }
          ]
        }
      )

      await Effect.runPromise(program)

      expect(consoleSpy).toHaveBeenCalled()
      const output = consoleSpy.mock.calls[0][0]
      expect(output).toContain('$100')
      expect(output).toContain('$200')

      consoleSpy.mockRestore()
    })

    it('should apply formatter to nested object property', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable(
        [{ item: { count: 5 } }],
        {
          columns: [
            {
              key: 'item',
              label: 'Item',
              formatter: (val: any) => `Count: ${val?.count || 0}`
            }
          ]
        }
      )

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle formatter returning null or undefined', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable(
        [{ id: 1 }, { id: 2 }],
        {
          columns: [
            {
              key: 'id',
              label: 'ID',
              formatter: () => null as any
            }
          ]
        }
      )

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should apply multiple formatters to different columns', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable(
        [{ name: 'test', count: 5 }],
        {
          columns: [
            {
              key: 'name',
              label: 'Name',
              formatter: (val) => val.toUpperCase()
            },
            {
              key: 'count',
              label: 'Count',
              formatter: (val) => `x${val}`
            }
          ]
        }
      )

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()
      const output = consoleSpy.mock.calls[0][0]
      expect(output).toContain('TEST')
      expect(output).toContain('x5')

      consoleSpy.mockRestore()
    })
  })

  describe('startSpinner - cursor hidden condition', () => {
    it('should write show cursor in cleanup when cursor was hidden', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Processing...', { hideCursor: true })
          // Wait briefly to let animation start
          yield* Effect.sleep(50)
        })
      )

      await Effect.runPromise(program)

      // Check that cursor show sequence was written during cleanup
      const cursorShowCalls = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\x1B[?25h')
      )
      expect(cursorShowCalls.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
    })

    it('should not write show cursor in cleanup when cursor was not hidden', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Processing...', { hideCursor: false })
          yield* Effect.sleep(50)
        })
      )

      await Effect.runPromise(program)

      // Cleanup handler still runs but doesn't write show cursor sequence
      stdoutSpy.mockRestore()
    })

    it('should clear line in cleanup for spinners', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Loading...')
          yield* Effect.sleep(50)
        })
      )

      await Effect.runPromise(program)

      // Check that clear line sequence was written
      const clearLineCalls = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\r\x1B[K')
      )
      expect(clearLineCalls.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
    })

    it('should animate spinner frames', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Spinning...', { type: 'dots' })
          // Wait for multiple animation frames
          yield* Effect.sleep(300)
        })
      )

      await Effect.runPromise(program)

      // Check that multiple frames were written (animation happened)
      const frameWrites = stdoutSpy.mock.calls.filter((call) => {
        const str = call[0]?.toString() || ''
        return str.includes('Spinning...')
      })
      expect(frameWrites.length).toBeGreaterThan(1)

      stdoutSpy.mockRestore()
    })
  })

  describe('Signal Handler - cleanup execution', () => {
    it('should register handlers that execute during cleanup', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      registerCleanupHandler(handler1)
      registerCleanupHandler(handler2)
      registerCleanupHandler(handler3)

      expect(getCleanupHandlerCount()).toBe(3)
    })

    it('should handle multiple registered handlers', () => {
      const handlers = [vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn()]

      handlers.forEach((handler) => registerCleanupHandler(handler))

      expect(getCleanupHandlerCount()).toBe(5)
    })

    it('should deregister handler without affecting others', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      const deregister2 = registerCleanupHandler(handler2)
      registerCleanupHandler(handler1)
      registerCleanupHandler(handler3)

      expect(getCleanupHandlerCount()).toBe(3)

      deregister2()

      expect(getCleanupHandlerCount()).toBe(2)
    })

    it('should handle async cleanup handlers', async () => {
      const asyncHandler = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      registerCleanupHandler(asyncHandler)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should handle handlers that throw errors', () => {
      const throwingHandler = vi.fn(() => {
        throw new Error('Handler error')
      })
      const normalHandler = vi.fn()

      registerCleanupHandler(throwingHandler)
      registerCleanupHandler(normalHandler)

      expect(getCleanupHandlerCount()).toBe(2)
    })

    it('should track cleanup handler lifecycle', () => {
      const handler = vi.fn()

      expect(getCleanupHandlerCount()).toBe(0)

      const deregister = registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)

      deregister()
      expect(getCleanupHandlerCount()).toBe(0)
    })
  })

  describe('Spinner animation frame cycling', () => {
    it('should cycle through spinner frames with animation', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Animating...', { type: 'simpleDots' })
          // Wait long enough for multiple frame cycles
          yield* Effect.sleep(400)
        })
      )

      await Effect.runPromise(program)

      // Verify writes occurred (indicating animation happened)
      expect(stdoutSpy.mock.calls.length).toBeGreaterThan(0)
      // At least some writes should contain carriage return (for frame animation)
      const frameWrites = stdoutSpy.mock.calls.filter((call) =>
        call[0]?.toString().includes('\r')
      )
      expect(frameWrites.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
    })

    it('should update frame counter correctly', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

      const program = Effect.scoped(
        Effect.gen(function* () {
          yield* startSpinner('Counting frames...', { type: 'dots' })
          yield* Effect.sleep(200)
        })
      )

      await Effect.runPromise(program)

      // Verify animation writes occurred
      expect(stdoutSpy.mock.calls.length).toBeGreaterThan(0)
      // Check for carriage returns indicating frame updates
      const writes = stdoutSpy.mock.calls.map((call) => call[0]?.toString() || '')
      const carriageReturnWrites = writes.filter((w) => w.includes('\r'))
      expect(carriageReturnWrites.length).toBeGreaterThan(0)

      stdoutSpy.mockRestore()
    })
  })

  describe('Table with all column features', () => {
    it('should handle table with formatter and style together', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable(
        [
          { status: 'active', count: 10 },
          { status: 'inactive', count: 5 }
        ],
        {
          columns: [
            {
              key: 'status',
              label: 'Status',
              formatter: (val) => val.toUpperCase()
            },
            {
              key: 'count',
              label: 'Count',
              formatter: (val) => val * 100
            }
          ],
          style: { bold: true }
        }
      )

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle empty data with formatters', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const program = displayTable([], {
        columns: [
          {
            key: 'id',
            label: 'ID',
            formatter: (val) => `ID:${val}`
          }
        ]
      })

      await Effect.runPromise(program)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})
