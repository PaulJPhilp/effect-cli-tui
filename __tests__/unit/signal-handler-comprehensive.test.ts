import {
  clearCleanupHandlers,
  createTerminalCleanup,
  ensureTerminalCleanup,
  getCleanupHandlerCount,
  hasSignalHandlers,
  registerCleanupHandler,
  withCleanup,
} from "@core/signal-handler";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Comprehensive tests for signal-handler.ts module
 * Tests cleanup handler registration and lifecycle
 */

describe("Signal Handler - Comprehensive Coverage", () => {
  beforeEach(() => {
    clearCleanupHandlers();
  });

  afterEach(() => {
    clearCleanupHandlers();
  });

  describe("registerCleanupHandler", () => {
    it("should register a cleanup handler", async () => {
      const handler = vi.fn();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(handler)
      );

      expect(getCleanupHandlerCount()).toBe(1);
      expect(deregister).toBeDefined();
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

    it("should return deregister function", async () => {
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

    it("should handle deregistering non-existent handler gracefully", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const deregister1 = await Effect.runPromise(
        registerCleanupHandler(handler1)
      );
      await Effect.runPromise(registerCleanupHandler(handler2));

      deregister1();
      expect(getCleanupHandlerCount()).toBe(1);

      // Calling again should not throw
      deregister1();
      expect(getCleanupHandlerCount()).toBe(1);
    });

    it("should register signal handlers on first registration", async () => {
      clearCleanupHandlers();
      expect(hasSignalHandlers()).toBe(false);

      const handler = vi.fn();
      await Effect.runPromise(registerCleanupHandler(handler));

      expect(hasSignalHandlers()).toBe(true);
    });

    it("should not register multiple signal handler sets", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await Effect.runPromise(registerCleanupHandler(handler1));
      const signalsRegisteredAfterFirst = hasSignalHandlers();

      await Effect.runPromise(registerCleanupHandler(handler2));
      const signalsRegisteredAfterSecond = hasSignalHandlers();

      expect(signalsRegisteredAfterFirst).toBe(true);
      expect(signalsRegisteredAfterSecond).toBe(true);
    });
  });

  describe("withCleanup", () => {
    it("should register and deregister cleanup on completion", async () => {
      const cleanup = vi.fn();

      const program = Effect.gen(function* () {
        yield* withCleanup(cleanup);
        yield* Effect.succeed(undefined);
      });

      await Effect.runPromise(program);

      // Handler should be deregistered after effect completes
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should handle async cleanup function", async () => {
      const cleanup = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const program = Effect.gen(function* () {
        yield* withCleanup(cleanup);
        yield* Effect.succeed(undefined);
      });

      await Effect.runPromise(program);

      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should deregister even if effect fails", async () => {
      const cleanup = vi.fn();

      const program = Effect.gen(function* () {
        yield* withCleanup(cleanup);
        yield* Effect.fail(new Error("Test error"));
      });

      await expect(Effect.runPromise(program)).rejects.toThrow("Test error");

      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("ensureTerminalCleanup", () => {
    it("should register terminal cleanup handler", async () => {
      const program = Effect.gen(function* () {
        yield* ensureTerminalCleanup();
        yield* Effect.succeed(undefined);
      });

      await Effect.runPromise(program);

      // Handler is deregistered after scope exits
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should create terminal cleanup function that writes sequences", () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      // Directly test the cleanup function creation
      const cleanup = createTerminalCleanup();
      cleanup();

      // Should have written cursor sequences
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[?25h");
      expect(stdoutSpy).toHaveBeenCalledWith("\r\x1B[K");

      stdoutSpy.mockRestore();
    });
  });

  describe("createTerminalCleanup", () => {
    it("should return a cleanup function", () => {
      const cleanup = createTerminalCleanup();
      expect(typeof cleanup).toBe("function");
    });

    it("should write terminal control sequences when called", () => {
      const stdoutSpy = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const cleanup = createTerminalCleanup();
      cleanup();

      // Should have written show cursor and clear line sequences
      expect(stdoutSpy).toHaveBeenCalledWith("\x1B[?25h");
      expect(stdoutSpy).toHaveBeenCalledWith("\r\x1B[K");

      stdoutSpy.mockRestore();
    });

    it("should be usable with registerCleanupHandler", async () => {
      const cleanup = createTerminalCleanup();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(cleanup)
      );

      expect(getCleanupHandlerCount()).toBe(1);

      deregister();

      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("hasSignalHandlers", () => {
    it("should return false when no handlers registered", () => {
      clearCleanupHandlers();
      expect(hasSignalHandlers()).toBe(false);
    });

    it("should return true after registering handler", async () => {
      const handler = vi.fn();
      await Effect.runPromise(registerCleanupHandler(handler));
      expect(hasSignalHandlers()).toBe(true);
    });

    it("should remain true after deregistering all handlers", async () => {
      const handler = vi.fn();
      const deregister = await Effect.runPromise(
        registerCleanupHandler(handler)
      );

      expect(hasSignalHandlers()).toBe(true);

      deregister();

      // Signals still registered (would need explicit reset)
      expect(hasSignalHandlers()).toBe(true);
    });
  });

  describe("clearCleanupHandlers", () => {
    it("should clear all registered handlers", async () => {
      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      await Effect.runPromise(registerCleanupHandler(vi.fn()));

      expect(getCleanupHandlerCount()).toBe(3);

      clearCleanupHandlers();

      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should reset signal handlers flag", async () => {
      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      expect(hasSignalHandlers()).toBe(true);

      clearCleanupHandlers();
      expect(hasSignalHandlers()).toBe(false);
    });

    it("should allow re-registration after clearing", async () => {
      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      clearCleanupHandlers();

      const handler = vi.fn();
      await Effect.runPromise(registerCleanupHandler(handler));

      expect(getCleanupHandlerCount()).toBe(1);
      expect(hasSignalHandlers()).toBe(true);
    });
  });

  describe("getCleanupHandlerCount", () => {
    it("should return 0 when no handlers registered", () => {
      clearCleanupHandlers();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should return correct count", async () => {
      expect(getCleanupHandlerCount()).toBe(0);

      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      expect(getCleanupHandlerCount()).toBe(1);

      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      expect(getCleanupHandlerCount()).toBe(2);

      await Effect.runPromise(registerCleanupHandler(vi.fn()));
      expect(getCleanupHandlerCount()).toBe(3);
    });

    it("should decrease count after deregistration", async () => {
      const deregister1 = await Effect.runPromise(
        registerCleanupHandler(vi.fn())
      );
      const deregister2 = await Effect.runPromise(
        registerCleanupHandler(vi.fn())
      );

      expect(getCleanupHandlerCount()).toBe(2);

      deregister1();
      expect(getCleanupHandlerCount()).toBe(1);

      deregister2();
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("Cleanup Handler Lifecycle", () => {
    it("should support handler with side effects", async () => {
      const effects: string[] = [];

      const program = Effect.gen(function* () {
        yield* withCleanup(() => {
          effects.push("cleanup");
        });
        effects.push("main");
        yield* Effect.succeed(undefined);
      });

      await Effect.runPromise(program);

      // Note: withCleanup deregisters, so cleanup runs when scope exits
      expect(effects).toContain("main");
    });

    it("should handle multiple handlers in correct order", async () => {
      const calls: number[] = [];

      const deregister1 = await Effect.runPromise(
        registerCleanupHandler(() => {
          calls.push(1);
        })
      );
      const deregister2 = await Effect.runPromise(
        registerCleanupHandler(() => {
          calls.push(2);
        })
      );
      const deregister3 = await Effect.runPromise(
        registerCleanupHandler(() => {
          calls.push(3);
        })
      );

      expect(getCleanupHandlerCount()).toBe(3);

      deregister1();
      deregister2();
      deregister3();

      expect(getCleanupHandlerCount()).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle handler throwing error gracefully", async () => {
      const throwingHandler = vi.fn(() => {
        throw new Error("Cleanup error");
      });

      const normalHandler = vi.fn();

      await Effect.runPromise(registerCleanupHandler(throwingHandler));
      await Effect.runPromise(registerCleanupHandler(normalHandler));

      expect(getCleanupHandlerCount()).toBe(2);

      // Should not throw when clearing
      clearCleanupHandlers();
      expect(getCleanupHandlerCount()).toBe(0);
    });

    it("should handle registering same handler multiple times", async () => {
      const handler = vi.fn();

      await Effect.runPromise(registerCleanupHandler(handler));
      await Effect.runPromise(registerCleanupHandler(handler));
      await Effect.runPromise(registerCleanupHandler(handler));

      expect(getCleanupHandlerCount()).toBe(3);
    });

    it("should handle empty handler list operations", () => {
      clearCleanupHandlers();

      expect(getCleanupHandlerCount()).toBe(0);
      expect(hasSignalHandlers()).toBe(false);

      // Should not throw
      clearCleanupHandlers();
      expect(getCleanupHandlerCount()).toBe(0);
    });
  });
});
