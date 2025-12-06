import {
  type SupermemoryClient,
  SupermemoryClientService,
} from "@supermemory/client";
import {
  handleAddCommand,
  handleApiKeyCommand,
  handleSearchCommand,
} from "@supermemory/commands";
import type { SupermemoryTuiConfig } from "@supermemory/config";
import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  SlashCommandContext,
  SlashCommandRegistry,
} from "@/tui-slash-commands";

// Mock config module
vi.mock("../config", () => ({
  ConfigError: class ConfigError extends Error {
    readonly _tag = "ConfigError";
  },
  loadConfig: () => Effect.succeed({ apiKey: null } as SupermemoryTuiConfig),
  updateApiKey: vi.fn(() => Effect.void),
}));

/**
 * Helper to create a mock layer for SupermemoryClientService
 */
function createMockClientLayer(mockClient: SupermemoryClient) {
  return Layer.succeed(
    SupermemoryClientService,
    mockClient as unknown as SupermemoryClientService
  );
}

describe("Supermemory Commands", () => {
  const createMockContext = (args: string[]): SlashCommandContext => ({
    promptMessage: "Test prompt",
    promptKind: "input" as const,
    rawInput: "/supermemory test",
    command: "supermemory",
    args,
    flags: {},
    tokens: ["supermemory", ...args],
    registry: { commands: [], lookup: new Map() } as SlashCommandRegistry,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleApiKeyCommand", () => {
    it("should return continue when API key is missing", async () => {
      const context = createMockContext([]);

      const result = await Effect.runPromise(handleApiKeyCommand(context));

      expect(result).toEqual({ kind: "continue" });
    });

    it("should return continue when API key doesn't start with sk_", async () => {
      const context = createMockContext(["invalid_key"]);

      const result = await Effect.runPromise(handleApiKeyCommand(context));

      expect(result).toEqual({ kind: "continue" });
    });

    it("should return continue with valid API key", async () => {
      const context = createMockContext(["sk_test123456789"]);

      const result = await Effect.runPromise(handleApiKeyCommand(context));

      expect(result).toEqual({ kind: "continue" });
    });
  });

  describe("handleAddCommand", () => {
    it("should return continue when text is missing", async () => {
      const context = createMockContext([]);

      const mockClient: SupermemoryClient = {
        addText: () => Effect.void,
        search: () => Effect.succeed([]),
        addDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        listDocuments: () => Effect.succeed([]),
        getDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        getMemory: () =>
          Effect.succeed({ id: "1", content: "test", documentId: "1" }),
        deleteDocument: () => Effect.void,
        searchMemories: () => Effect.succeed([]),
      };

      const result = await Effect.runPromise(
        handleAddCommand(context).pipe(
          Effect.provide(createMockClientLayer(mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });

    it("should add text successfully with mock client", async () => {
      const context = createMockContext(["test memory"]);

      const mockClient: SupermemoryClient = {
        addText: () => Effect.void,
        search: () => Effect.succeed([]),
        addDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        listDocuments: () => Effect.succeed([]),
        getDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        getMemory: () =>
          Effect.succeed({ id: "1", content: "test", documentId: "1" }),
        deleteDocument: () => Effect.void,
        searchMemories: () => Effect.succeed([]),
      };

      const result = await Effect.runPromise(
        handleAddCommand(context).pipe(
          Effect.provide(createMockClientLayer(mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });
  });

  describe("handleSearchCommand", () => {
    it("should return continue when query is missing", async () => {
      const context = createMockContext([]);

      const mockClient: SupermemoryClient = {
        addText: () => Effect.void,
        search: () => Effect.succeed([]),
        addDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        listDocuments: () => Effect.succeed([]),
        getDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        getMemory: () =>
          Effect.succeed({ id: "1", content: "test", documentId: "1" }),
        deleteDocument: () => Effect.void,
        searchMemories: () => Effect.succeed([]),
      };

      const result = await Effect.runPromise(
        handleSearchCommand(context).pipe(
          Effect.provide(createMockClientLayer(mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });

    it("should search successfully with mock client", async () => {
      const context = createMockContext(["test query"]);

      const mockClient: SupermemoryClient = {
        addText: () => Effect.void,
        search: () =>
          Effect.succeed([
            { id: "1", content: "result 1", score: 0.9 },
            { id: "2", content: "result 2", score: 0.8 },
          ]),
        addDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        listDocuments: () => Effect.succeed([]),
        getDocument: () =>
          Effect.succeed({ id: "1", title: null, content: "test" }),
        getMemory: () =>
          Effect.succeed({ id: "1", content: "test", documentId: "1" }),
        deleteDocument: () => Effect.void,
        searchMemories: () => Effect.succeed([]),
      };

      const result = await Effect.runPromise(
        handleSearchCommand(context).pipe(
          Effect.provide(createMockClientLayer(mockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });
  });
});
