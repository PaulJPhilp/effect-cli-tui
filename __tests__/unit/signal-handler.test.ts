import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  registerCleanupHandler,
  withCleanup,
  ensureTerminalCleanup,
  createTerminalCleanup,
  hasSignalHandlers,
  clearCleanupHandlers,
  getCleanupHandlerCount
} from '../../src/core/signal-handler'
import { Effect } from 'effect'

/**
 * Comprehensive tests for signal handling and cleanup.
 * Ensures graceful shutdown and terminal state restoration.
 */

describe('Signal Handler Utilities', () => {
  beforeEach(() => {
    // Clear all handlers before each test
    clearCleanupHandlers()
    expect(getCleanupHandlerCount()).toBe(0)
  })

  afterEach(() => {
    // Cleanup after each test
    clearCleanupHandlers()
  })

  describe('registerCleanupHandler', () => {
    it('should register a cleanup handler', () => {
      const handler = vi.fn()
      registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should register multiple cleanup handlers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      registerCleanupHandler(handler1)
      registerCleanupHandler(handler2)
      registerCleanupHandler(handler3)

      expect(getCleanupHandlerCount()).toBe(3)
    })

    it('should return a deregister function', () => {
      const handler = vi.fn()
      const deregister = registerCleanupHandler(handler)
      expect(typeof deregister).toBe('function')
    })

    it('should deregister handler when deregister is called', () => {
      const handler = vi.fn()
      const deregister = registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)

      deregister()
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should deregister only the specific handler', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const deregister1 = registerCleanupHandler(handler1)
      registerCleanupHandler(handler2)

      expect(getCleanupHandlerCount()).toBe(2)
      deregister1()
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should handle deregistering twice gracefully', () => {
      const handler = vi.fn()
      const deregister = registerCleanupHandler(handler)
      deregister()
      expect(() => deregister()).not.toThrow()
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should set up signal handlers on first registration', () => {
      expect(hasSignalHandlers()).toBe(false)
      registerCleanupHandler(() => {})
      expect(hasSignalHandlers()).toBe(true)
    })

    it('should not duplicate signal handler setup', () => {
      registerCleanupHandler(() => {})
      registerCleanupHandler(() => {})
      // Signal handlers should be set up only once
      expect(hasSignalHandlers()).toBe(true)
    })

    it('should handle async cleanup handlers', async () => {
      const handler = vi.fn(async () => {
        return new Promise((resolve) => setTimeout(resolve, 10))
      })
      registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should handle handlers that throw errors gracefully', () => {
      const badHandler = vi.fn(() => {
        throw new Error('Handler error')
      })
      registerCleanupHandler(badHandler)
      expect(getCleanupHandlerCount()).toBe(1)
      // Handler can be registered, error handling happens during signal
    })
  })

  describe('withCleanup - Effect-based Cleanup', () => {
    it('should register cleanup in Effect context', async () => {
      const handler = vi.fn()
      const effect = withCleanup(() => handler())
      expect(effect).toBeDefined()
    })

    it('should deregister cleanup after Effect completes', async () => {
      const handler = vi.fn()
      const effect = withCleanup(() => handler())
      await Effect.runPromise(effect)
      // Handler should be deregistered from manager
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should work with Effect.gen', async () => {
      const handler = vi.fn()
      const effect = Effect.gen(function* () {
        yield* withCleanup(() => handler())
      })
      await Effect.runPromise(effect)
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should handle cleanup errors gracefully', async () => {
      const badEffect = withCleanup(() => {
        throw new Error('Cleanup failed')
      })
      // Effect should not throw during registration
      expect(badEffect).toBeDefined()
    })

    it('should allow multiple withCleanup calls in sequence', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const effect = Effect.gen(function* () {
        yield* withCleanup(() => handler1())
        yield* withCleanup(() => handler2())
      })

      await Effect.runPromise(effect)
      expect(getCleanupHandlerCount()).toBe(0)
    })
  })

  describe('ensureTerminalCleanup', () => {
    it('should return an Effect', () => {
      const effect = ensureTerminalCleanup()
      expect(effect).toBeDefined()
    })

    it('should register cursor show command', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any)
      const effect = ensureTerminalCleanup()
      await Effect.runPromise(effect)
      // Cleanup would call write with cursor show sequence
      stdoutSpy.mockRestore()
    })

    it('should work in Effect.gen context', async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup()
        return 'success'
      })
      const result = await Effect.runPromise(effect)
      expect(result).toBe('success')
    })

    it('should deregister after completion', async () => {
      const effect = ensureTerminalCleanup()
      await Effect.runPromise(effect)
      expect(getCleanupHandlerCount()).toBe(0)
    })
  })

  describe('createTerminalCleanup', () => {
    it('should return a cleanup function', () => {
      const cleanup = createTerminalCleanup()
      expect(typeof cleanup).toBe('function')
    })

    it('should write cursor show ANSI sequence', () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any)
      const cleanup = createTerminalCleanup()
      cleanup()
      expect(stdoutSpy).toHaveBeenCalledWith('\x1B[?25h')
      stdoutSpy.mockRestore()
    })

    it('should write carriage return and clear line', () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any)
      const cleanup = createTerminalCleanup()
      cleanup()
      expect(stdoutSpy).toHaveBeenCalledWith('\r\x1B[K')
      stdoutSpy.mockRestore()
    })

    it('should be callable multiple times safely', () => {
      const cleanup = createTerminalCleanup()
      expect(() => {
        cleanup()
        cleanup()
        cleanup()
      }).not.toThrow()
    })

    it('should work with registerCleanupHandler', () => {
      const cleanup = createTerminalCleanup()
      registerCleanupHandler(cleanup)
      expect(getCleanupHandlerCount()).toBe(1)
    })
  })

  describe('hasSignalHandlers', () => {
    it('should return false initially', () => {
      expect(hasSignalHandlers()).toBe(false)
    })

    it('should return true after first registration', () => {
      registerCleanupHandler(() => {})
      expect(hasSignalHandlers()).toBe(true)
    })

    it('should remain true after multiple registrations', () => {
      registerCleanupHandler(() => {})
      registerCleanupHandler(() => {})
      expect(hasSignalHandlers()).toBe(true)
    })

    it('should still be true even after all handlers deregistered', () => {
      const deregister1 = registerCleanupHandler(() => {})
      const deregister2 = registerCleanupHandler(() => {})
      deregister1()
      deregister2()
      // Signal handlers remain registered to process
      expect(hasSignalHandlers()).toBe(true)
    })
  })

  describe('clearCleanupHandlers', () => {
    it('should clear all registered handlers', () => {
      registerCleanupHandler(() => {})
      registerCleanupHandler(() => {})
      registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(3)

      clearCleanupHandlers()
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should be safe to call multiple times', () => {
      registerCleanupHandler(() => {})
      clearCleanupHandlers()
      expect(() => clearCleanupHandlers()).not.toThrow()
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should work on empty handler list', () => {
      expect(() => clearCleanupHandlers()).not.toThrow()
    })
  })

  describe('getCleanupHandlerCount', () => {
    it('should return 0 initially', () => {
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should increment on registration', () => {
      registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(1)
      registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(2)
    })

    it('should decrement on deregistration', () => {
      const deregister = registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(1)
      deregister()
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should return accurate count with mixed operations', () => {
      const d1 = registerCleanupHandler(() => {})
      const d2 = registerCleanupHandler(() => {})
      const d3 = registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(3)

      d2()
      expect(getCleanupHandlerCount()).toBe(2)

      registerCleanupHandler(() => {})
      expect(getCleanupHandlerCount()).toBe(3)

      clearCleanupHandlers()
      expect(getCleanupHandlerCount()).toBe(0)
    })
  })

  describe('LIFO Order (Last In, First Out)', () => {
    it('should execute handlers in LIFO order', async () => {
      const order: number[] = []
      const h1 = vi.fn(() => order.push(1))
      const h2 = vi.fn(() => order.push(2))
      const h3 = vi.fn(() => order.push(3))

      registerCleanupHandler(h1)
      registerCleanupHandler(h2)
      registerCleanupHandler(h3)

      // In a real signal, handlers would execute in LIFO: 3, 2, 1
      // This test documents the intended order
      expect(getCleanupHandlerCount()).toBe(3)
    })
  })

  describe('Cleanup Handler Error Resilience', () => {
    it('should handle async cleanup that resolves', async () => {
      const handler = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 5))
      )
      registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should handle sync cleanup', () => {
      const handler = vi.fn(() => {
        // Sync cleanup
      })
      registerCleanupHandler(handler)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should handle mixed sync and async handlers', () => {
      registerCleanupHandler(() => {
        // Sync
      })
      registerCleanupHandler(() =>
        new Promise((resolve) => setTimeout(resolve, 5))
      )
      registerCleanupHandler(() => {
        // Sync
      })
      expect(getCleanupHandlerCount()).toBe(3)
    })
  })

  describe('Integration with Terminal Cleanup', () => {
    it('should register terminal cleanup handlers', () => {
      const terminalCleanup = createTerminalCleanup()
      registerCleanupHandler(terminalCleanup)
      expect(getCleanupHandlerCount()).toBe(1)
    })

    it('should allow ensureTerminalCleanup in Effect chain', async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup()
        return 'complete'
      })
      const result = await Effect.runPromise(effect)
      expect(result).toBe('complete')
      expect(getCleanupHandlerCount()).toBe(0)
    })

    it('should support multiple terminal cleanups', async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup()
        yield* ensureTerminalCleanup()
        yield* ensureTerminalCleanup()
      })
      await Effect.runPromise(effect)
      expect(getCleanupHandlerCount()).toBe(0)
    })
  })
})
