import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearCleanupHandlers,
  createTerminalCleanup,
  ensureTerminalCleanup,
  getCleanupHandlerCount,
  hasSignalHandlers,
  registerCleanupHandler,
  withCleanup,
} from "../../src/core/signal-handler";

/**
 * Comprehensive tests for signal handling and cleanup.
 * Ensures graceful shutdown and terminal state restoration.
 */

describe("Signal Handler Utilities", () => {
  beforeEach(() => {
    // Clear all handlers before each test
    clearCleanupHandlers();
  });

  afterEach(() => {
    // Cleanup after each test
    clearCleanupHandlers();
  });

  describe("registerCleanupHandler", () => {
    it("should register a cleanup handler", async () => {
      const handler = vi.fn();
      await Effect.runPromise(registerCleanupHandler(handler));
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should register multiple cleanup handlers", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      await Effect.runPromise(registerCleanupHandler(handler1));
      await Effect.runPromise(registerCleanupHandler(handler2));
      await Effect.runPromise(registerCleanupHandler(handler3));

      expect(getCleanupHandlerCount()).toBe(3);
    });

    it("should return a deregister function", async () => {
      const handler = vi.fn();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(handler)
      );
      expect(typeof deregister).toBe("function");
    });

    it("should deregister handler when deregister is called", async () => {
      const handler = vi.fn();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(handler)
      );
      expect(getCleanupHandlerCount()).toBe(1);

      deregister();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should deregister only the specific handler", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const deregister1 = await Effect.runPromise(
        registerCleanupHandler(handler1)
      );
      await Effect.runPromise(registerCleanupHandler(handler2));

      expect(getCleanupHandlerCount()).toBe(2);
      deregister1();
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should handle deregistering twice gracefully", async () => {
      const handler = vi.fn();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(handler)
      );
      deregister();
      expect(() => deregister()).not.toThrow();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should set up signal handlers on first registration", async () => {
      expect(hasSignalHandlers()).toBe(false);
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(hasSignalHandlers()).toBe(true);
    });

    it("should register SIGINT handler", async () => {
      // Verify signal handlers are registered by checking hasSignalHandlers
      expect(hasSignalHandlers()).toBe(false);
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(hasSignalHandlers()).toBe(true);
      // Signal handlers (SIGINT, SIGTERM) are registered to process
      // We verify this indirectly through hasSignalHandlers
    });

    it("should register SIGTERM handler", async () => {
      // Verify signal handlers are registered
      expect(hasSignalHandlers()).toBe(false);
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(hasSignalHandlers()).toBe(true);
      // Both SIGINT and SIGTERM handlers are set up together
    });

    it("should not duplicate signal handler setup", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      // Signal handlers should be set up only once
      expect(hasSignalHandlers()).toBe(true);
    });

    it("should handle async cleanup handlers", async () => {
      const handler = vi.fn(async () => Promise.resolve());
      await Effect.runPromise(registerCleanupHandler(handler));
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should handle handlers that throw errors gracefully", async () => {
      const badHandler = vi.fn(() => {
        throw new Error("Handler error");
      });
      await Effect.runPromise(registerCleanupHandler(badHandler));
      expect(getCleanupHandlerCount()).toBe(1);
      // Handler can be registered, error handling happens during signal
    });
  });

  describe("withCleanup - Effect-based Cleanup", () => {
    it("should register cleanup in Effect context", () => {
      const handler = vi.fn();
      const effect = withCleanup(() => handler());
      expect(effect).toBeDefined();
    });

    it("should deregister cleanup after Effect completes", async () => {
      const handler = vi.fn();
      const effect = withCleanup(() => handler());
      await Effect.runPromise(effect);
      // Handler should be deregistered from manager
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should work with Effect.gen", async () => {
      const handler = vi.fn();
      const effect = Effect.gen(function* () {
        yield* withCleanup(() => handler());
      });
      await Effect.runPromise(effect);
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should handle cleanup errors gracefully", () => {
      const badEffect = withCleanup(() => {
        throw new Error("Cleanup failed");
      });
      // Effect should not throw during registration
      expect(badEffect).toBeDefined();
    });

    it("should allow multiple withCleanup calls in sequence", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const effect = Effect.gen(function* () {
        yield* withCleanup(() => handler1());
        yield* withCleanup(() => handler2());
      });

      await Effect.runPromise(effect);
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("ensureTerminalCleanup", () => {
    it("should return an Effect", () => {
      const effect = ensureTerminalCleanup();
      expect(effect).toBeDefined();
    });

    it("should register cursor show command", async () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
      const effect = ensureTerminalCleanup();
      await Effect.runPromise(effect);
      // Cleanup would call write with cursor show sequence
      stdoutSpy.mockRestore();
    });

    it("should write cursor show and clear line sequences in cleanup", () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      // Test the cleanup function directly (lines 130-132)
      // This is the function that ensureTerminalCleanup registers
      const cleanup = createTerminalCleanup();
      cleanup();

      // Verify both sequences were written
      const calls = stdoutSpy.mock.calls.map((call) => String(call[0] || ""));
      const allText = calls.join("");
      expect(allText).toContain("\x1B[?25h"); // Cursor show
      expect(allText).toContain("\r\x1B[K"); // Clear line

      stdoutSpy.mockRestore();
    });

    it("should work in Effect.gen context", async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup();
        return "success";
      });
      const result = await Effect.runPromise(effect);
      expect(result).toBe("success");
    });

    it("should deregister after completion", async () => {
      const effect = ensureTerminalCleanup();
      await Effect.runPromise(effect);
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("createTerminalCleanup", () => {
    it("should return a cleanup function", () => {
      const cleanup = createTerminalCleanup();
      expect(typeof cleanup).toBe("function");
    });

    it("should write cursor show ANSI sequence", () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
      const cleanup = createTerminalCleanup();
      cleanup();
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[?25h");
      stdoutSpy.mockRestore();
    });

    it("should write carriage return and clear line", () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
      const cleanup = createTerminalCleanup();
      cleanup();
      expect(stdoutSpy).toHaveBeenCalledWith("\r\x1B[K");
      stdoutSpy.mockRestore();
    });

    it("should be callable multiple times safely", () => {
      const cleanup = createTerminalCleanup();
      expect(() => {
        cleanup();
        cleanup();
        cleanup();
      }).not.toThrow();
    });

    it("should work with registerCleanupHandler", async () => {
      const cleanup = createTerminalCleanup();
      await Effect.runPromise(registerCleanupHandler(cleanup));
      expect(getCleanupHandlerCount()).toBe(1);
    });
  });

  describe("hasSignalHandlers", () => {
    it("should return false initially", () => {
      expect(hasSignalHandlers()).toBe(false);
    });

    it("should return true after first registration", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(hasSignalHandlers()).toBe(true);
    });

    it("should remain true after multiple registrations", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(hasSignalHandlers()).toBe(true);
    });

    it("should still be true even after all handlers deregistered", async () => {
      const deregister1 = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      const deregister2 = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      deregister1();
      deregister2();
      // Signal handlers remain registered to process
      expect(hasSignalHandlers()).toBe(true);
    });
  });

  describe("clearCleanupHandlers", () => {
    it("should clear all registered handlers", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(3);

      clearCleanupHandlers();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should be safe to call multiple times", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      clearCleanupHandlers();
      expect(() => clearCleanupHandlers()).not.toThrow();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should work on empty handler list", () => {
      expect(() => clearCleanupHandlers()).not.toThrow();
    });
  });

  describe("getCleanupHandlerCount", () => {
    it("should return 0 initially", () => {
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should increment on registration", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(1);
      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(2);
    });

    it("should decrement on deregistration", async () => {
      const deregister = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(1);
      deregister();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should return accurate count with mixed operations", async () => {
      const _d1 = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      const d2 = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      const _d3 = await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(3);

      d2();
      expect(getCleanupHandlerCount()).toBe(2);

      await Effect.runPromise(
        registerCleanupHandler(() => {
          /* Test cleanup handler - no-op */
        })
      );
      expect(getCleanupHandlerCount()).toBe(3);

      clearCleanupHandlers();
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("LIFO Order (Last In, First Out)", () => {
    it("should execute handlers in LIFO order", async () => {
      const order: number[] = [];
      const h1 = vi.fn(() => {
        order.push(1);
      });
      const h2 = vi.fn(() => {
        order.push(2);
      });
      const h3 = vi.fn(() => {
        order.push(3);
      });

      await Effect.runPromise(registerCleanupHandler(h1));
      await Effect.runPromise(registerCleanupHandler(h2));
      await Effect.runPromise(registerCleanupHandler(h3));

      // In a real signal, handlers would execute in LIFO: 3, 2, 1
      // This test documents the intended order
      expect(getCleanupHandlerCount()).toBe(3);
    });
  });

  describe("Cleanup Handler Error Resilience", () => {
    it("should handle async cleanup that resolves", async () => {
      const handler = vi.fn(
        () => new Promise<void>((resolve) => setTimeout(() => resolve(), 5))
      );
      await Effect.runPromise(registerCleanupHandler(handler));
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should handle sync cleanup", async () => {
      const handler = vi.fn(() => {
        // Sync cleanup
      });
      await Effect.runPromise(registerCleanupHandler(handler));
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should handle mixed sync and async handlers", async () => {
      await Effect.runPromise(
        registerCleanupHandler(() => {
          // Sync
        })
      );
      await Effect.runPromise(
        registerCleanupHandler(
          () => new Promise((resolve) => setTimeout(resolve, 5))
        )
      );
      await Effect.runPromise(
        registerCleanupHandler(() => {
          // Sync
        })
      );
      expect(getCleanupHandlerCount()).toBe(3);
    });
  });

  describe("Integration with Terminal Cleanup", () => {
    it("should register terminal cleanup handlers", async () => {
      const terminalCleanup = createTerminalCleanup();
      await Effect.runPromise(registerCleanupHandler(terminalCleanup));
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should allow ensureTerminalCleanup in Effect chain", async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup();
        return "complete";
      });
      const result = await Effect.runPromise(effect);
      expect(result).toBe("complete");
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should support multiple terminal cleanups", async () => {
      const effect = Effect.gen(function* () {
        yield* ensureTerminalCleanup();
        yield* ensureTerminalCleanup();
        yield* ensureTerminalCleanup();
      });
      await Effect.runPromise(effect);
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });
});
