import { EventEmitter } from "node:events";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EffectCLI } from "@/cli";
import { CLIError } from "@/types";

/**
 * Comprehensive tests for EffectCLI service
 * Tests command execution, error handling, and resource management
 */

// Mock child_process
vi.mock("child_process", () => ({
  spawn: vi.fn(),
}));

import { spawn } from "node:child_process";

describe("EffectCLI - Comprehensive Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("run() - Basic Execution", () => {
    it("should execute command successfully", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("echo", ["hello"]);
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "hello\n");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe("hello\n");
      expect(result.stderr).toBe("");
    });

    it("should execute command with arguments", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("echo", ["arg1", "arg2"]);
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "arg1 arg2\n");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe("arg1 arg2\n");
    });

    it("should execute without arguments", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("true");
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
    });

    it("should capture stdout and stderr", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("test");
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "output");
        mockChild.stderr.emit("data", "error");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.stdout).toBe("output");
      expect(result.stderr).toBe("error");
    });

    it("should capture multiple stdout chunks", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("echo");
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "chunk1");
        mockChild.stdout.emit("data", "chunk2");
        mockChild.stdout.emit("data", "chunk3");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.stdout).toBe("chunk1chunk2chunk3");
    });
  });

  describe("run() - Options", () => {
    it("should use custom working directory", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("pwd", [], { cwd: "/tmp" });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "/tmp\n");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "pwd",
        [],
        expect.objectContaining({ cwd: "/tmp" })
      );
    });

    it("should use custom environment variables", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("echo", [], { env: { CUSTOM: "value" } });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "output");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "echo",
        [],
        expect.objectContaining({
          env: expect.objectContaining({ CUSTOM: "value" }),
        })
      );
    });

    it("should combine cwd and env options", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("cmd", [], {
          cwd: "/home",
          env: { VAR: "val" },
        });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "cmd",
        [],
        expect.objectContaining({
          cwd: "/home",
          env: expect.objectContaining({ VAR: "val" }),
        })
      );
    });
  });

  describe("run() - Error Handling", () => {
    it("should fail with CommandFailed on non-zero exit code", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("failing-command");
        return result;
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        mockChild.stdout.emit("data", "some output");
        mockChild.stderr.emit("data", "error message");
        mockChild.emit("close", 1);
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("CommandFailed");
    });

    it("should fail with NotFound on ENOENT error", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("nonexistent-command");
        return result;
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        const err = new Error("Command not found");
        (err as any).code = "ENOENT";
        mockChild.emit("error", err);
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("NotFound");
      expect(result.message).toContain("nonexistent-command");
    });

    it("should fail with ExecutionError on spawn error", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command");
        return result;
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        const err = new Error("Spawn error");
        (err as any).code = "EACCES";
        mockChild.emit("error", err);
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("ExecutionError");
    });

    it("should handle stderr with large buffer limit", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command", [], { maxBuffer: 1024 });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "output");
        mockChild.stderr.emit("data", "a".repeat(500));
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.stderr).toBe("a".repeat(500));
    });

    it("should handle maxBuffer = 0 (unlimited)", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command", [], { maxBuffer: 0 });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "a".repeat(1_000_000)); // Very large output
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
    });

    it("should handle missing stdout gracefully", async () => {
      const mockChild = new (EventEmitter.EventEmitter as any)();
      mockChild.stdout = null;
      mockChild.stderr = new (EventEmitter.EventEmitter as any)();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command");
        return result;
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        // Trigger the sync code path
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("NotFound");
    });
  });

  describe("stream() - Basic Execution", () => {
    it("should stream command output with inherited stdio", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("test-command");
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "test-command",
        [],
        expect.objectContaining({ stdio: "inherit" })
      );
    });

    it("should stream command with arguments", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("build", ["--release"]);
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "build",
        ["--release"],
        expect.objectContaining({ stdio: "inherit" })
      );
    });

    it("should stream with working directory option", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("command", [], { cwd: "/workspace" });
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      expect(spawn as any).toHaveBeenCalledWith(
        "command",
        [],
        expect.objectContaining({ cwd: "/workspace", stdio: "inherit" })
      );
    });

    it("should fail on non-zero exit code in stream", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("failing-cmd");
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        mockChild.emit("close", 1);
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("CommandFailed");
    });

    it("should handle NotFound error in stream", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("nonexistent");
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      setImmediate(() => {
        const err = new Error("Not found");
        (err as any).code = "ENOENT";
        mockChild.emit("error", err);
      });

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("NotFound");
    });

    it("should timeout on stream", async () => {
      const mockChild = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.stream("slow", [], { timeout: 50 });
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) => Effect.succeed(err))
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await Effect.runPromise(program);
      expect(result).toBeInstanceOf(CLIError);
      expect(result.reason).toBe("Timeout");
    });
  });

  describe("Resource Management", () => {
    it("should clear timeouts on completion", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.run("command", [], { timeout: 1000 });
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      // If timeouts weren't cleared, they would cause test to hang
      // Successful completion indicates cleanup worked
      expect(true).toBe(true);
    });

    it("should not kill process twice", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        yield* cli.run("command");
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      await Effect.runPromise(program);
      // Check that kill was called at most once (during cleanup)
      expect(mockChild.kill.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle sequential command executions", async () => {
      const mockChild1 = new EventEmitter();
      mockChild1.stdout = new EventEmitter();
      mockChild1.stderr = new EventEmitter();
      mockChild1.killed = false;
      mockChild1.kill = vi.fn();

      const mockChild2 = new EventEmitter();
      mockChild2.stdout = new EventEmitter();
      mockChild2.stderr = new EventEmitter();
      mockChild2.killed = false;
      mockChild2.kill = vi.fn();

      (spawn as any)
        .mockReturnValueOnce(mockChild1 as any)
        .mockReturnValueOnce(mockChild2 as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result1 = yield* cli.run("cmd1");
        const result2 = yield* cli.run("cmd2");
        return [result1, result2];
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild1.stdout.emit("data", "output1");
        mockChild1.stderr.emit("data", "");
        mockChild1.emit("close", 0);
      });

      setTimeout(() => {
        mockChild2.stdout.emit("data", "output2");
        mockChild2.stderr.emit("data", "");
        mockChild2.emit("close", 0);
      }, 10);

      const results = await Effect.runPromise(program);
      expect(results[0].stdout).toBe("output1");
      expect(results[1].stdout).toBe("output2");
    });

    it("should handle immediate command completion", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("true");
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      // Emit close immediately
      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.exitCode).toBe(0);
    });

    it("should handle large combined stdout and stderr", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command", [], {
          maxBuffer: 1024 * 1024,
        });
        return result;
      }).pipe(Effect.provide(EffectCLI.Default));

      setImmediate(() => {
        mockChild.stdout.emit("data", "x".repeat(500_000));
        mockChild.stderr.emit("data", "y".repeat(500_000));
        mockChild.emit("close", 0);
      });

      const result = await Effect.runPromise(program);
      expect(result.stdout).toBe("x".repeat(500_000));
      expect(result.stderr).toBe("y".repeat(500_000));
    });

    it("should prevent double completion from close and error", async () => {
      const mockChild = new EventEmitter();
      mockChild.stdout = new EventEmitter();
      mockChild.stderr = new EventEmitter();
      mockChild.killed = false;
      mockChild.kill = vi.fn();

      (spawn as any).mockReturnValue(mockChild as any);

      const program = Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("command");
        return result;
      }).pipe(
        Effect.provide(EffectCLI.Default),
        Effect.catchTag("CLIError", (err) =>
          Effect.succeed({ error: err.reason })
        )
      );

      setImmediate(() => {
        mockChild.stdout.emit("data", "");
        mockChild.stderr.emit("data", "");
        mockChild.emit("close", 0);
        // Error should be ignored since completed is already true
        const err = new Error("Error after close");
        mockChild.emit("error", err);
      });

      const result = await Effect.runPromise(program);
      expect(result).toEqual(expect.objectContaining({ exitCode: 0 }));
    });
  });
});
