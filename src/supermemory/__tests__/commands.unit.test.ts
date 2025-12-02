import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SlashCommandContext } from "../../tui-slash-commands";
import {
  MissingSupermemoryApiKey,
  SupermemoryClient,
  SupermemoryClientLive,
} from "../client";
import {
  handleAddCommand,
  handleApiKeyCommand,
  handleSearchCommand,
} from "../commands";
import { SupermemoryTuiConfig } from "../config";

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

describe("Supermemory Command Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockContext = (args: string[]): SlashCommandContext => ({
    promptMessage: "Test prompt",
    promptKind: "input" as const,
    rawInput: "/supermemory test",
    command: "supermemory",
    args,
    flags: {},
    tokens: ["supermemory", ...args],
    registry: {} as any,
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
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Usage: /supermemory add <text-to-remember>"
      );
    });

    it("should handle missing API key", async () => {
      const context = createMockContext(["test memory"]);

      const result = await Effect.runPromise(
        Effect.flip(
          handleAddCommand(context).pipe(Effect.provide(SupermemoryClientLive))
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
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Usage: /supermemory search <query>"
      );
    });

    it("should handle missing API key", async () => {
      const context = createMockContext(["test query"]);

      const result = await Effect.runPromise(
        Effect.flip(
          handleSearchCommand(context).pipe(
            Effect.provide(SupermemoryClientLive)
          )
        )
      );

      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("No Supermemory API key configured")
      );
    });

    it("should display search results correctly", async () => {
      const mockMemories = [
        { id: "1", content: "test memory about cats", score: 0.95 },
        { id: "2", content: "another memory", score: 0.87 },
      ];

      const mockClient = {
        addText: vi.fn(),
        search: vi.fn().mockResolvedValue(mockMemories),
      };

      const context = createMockContext(["test query"]);

      const result = await Effect.runPromise(
        handleSearchCommand(context).pipe(
          Effect.provide(
            Layer.succeed(SupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(Layer.succeed(SupermemoryClient, mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[Supermemory] Results for "test query":'
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        '  1. "test memory about cats" (score: 95.0)'
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        '  2. "another memory" (score: 87.0)'
      );
    });

    it("should handle empty search results", async () => {
      const mockClient = {
        addText: vi.fn(),
        search: vi.fn().mockResolvedValue([]),
      };

      const context = createMockContext(["test query"]);

      const result = await Effect.runPromise(
        handleSearchCommand(context).pipe(
          Effect.provide(
            Layer.succeed(SupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(Layer.succeed(SupermemoryClient, mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[Supermemory] Results for "test query":'
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        "  No memories found matching your query."
      );
    });
  });
});
