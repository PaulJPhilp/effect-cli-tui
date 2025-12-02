import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MissingSupermemoryApiKey, SupermemoryClient } from "../client";
import { handleAddCommand, handleApiKeyCommand, handleSearchCommand } from "../commands";

// Mock Console
const mockConsole = {
  log: vi.fn(),
};

vi.mock("effect", async (importOriginal) => {
  const actual = await importOriginal<typeof import("effect")>();
  return {
    ...actual,
    Console: {
      log: vi.fn((...args) => mockConsole.log(...args)),
    },
  };
});

describe("Supermemory Commands", () => {
  const createMockContext = (args: string[]) => ({
    promptMessage: "Test prompt",
    promptKind: "input" as const,
    rawInput: "/supermemory test",
    command: "supermemory",
    args,
    flags: {},
    tokens: ["supermemory", ...args],
    registry: {} as any,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleApiKeyCommand", () => {
    it("should handle missing API key", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleApiKeyCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: API key is required."
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Usage: /supermemory api-key <your-api-key>"
      );
    });

    it("should handle API key that doesn't start with sk_", async () => {
      const context = createMockContext(["invalid_key"]);
      
      const result = await Effect.runPromise(handleApiKeyCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Warning: API key should typically start with 'sk_'"
      );
    });

    it("should handle valid API key", async () => {
      const context = createMockContext(["sk_test123456789"]);
      
      const result = await Effect.runPromise(handleApiKeyCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] API key saved: sk_t************789"
      );
    });
  });

  describe("handleAddCommand", () => {
    it("should handle missing text", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleAddCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: No text provided to add."
      );
    });

    it("should handle missing API key", async () => {
      const context = createMockContext(["test memory"]);
      
      const result = await Effect.runPromise(
        Effect.flip(
          Effect.gen(function* () {
            yield* SupermemoryClient;
          }).pipe(
            Effect.provide(
              Layer.succeed(SupermemoryClient, {
                addText: vi.fn(),
                search: vi.fn(),
              })
            )
          )
        )
      );
      
      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("No Supermemory API key configured")
      );
    });
  });

  describe("handleSearchCommand", () => {
    it("should handle missing query", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleSearchCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: No search query provided."
      );
    });

    it("should handle missing API key", async () => {
      const context = createMockContext(["test query"]);
      
      const result = await Effect.runPromise(
        Effect.flip(
          Effect.gen(function* () {
            yield* SupermemoryClient;
          }).pipe(
            Effect.provide(
              Layer.succeed(SupermemoryClient, {
                addText: vi.fn(),
                search: vi.fn(),
              })
            )
          )
        )
      );
      
      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("No Supermemory API key configured")
      );
    });
  });
});
