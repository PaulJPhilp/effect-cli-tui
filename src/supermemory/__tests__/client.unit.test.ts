import {
  MissingSupermemoryApiKey,
  type SupermemoryClient,
  SupermemoryClientService,
  SupermemoryError,
} from "@supermemory/client";
import type { SupermemoryTuiConfig } from "@supermemory/config";
import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock loadConfig to return controllable config
let mockApiKey: string | null = null;

vi.mock("../config", () => ({
  ConfigError: class ConfigError extends Error {
    readonly _tag = "ConfigError";
  },
  loadConfig: () =>
    Effect.sync((): SupermemoryTuiConfig => ({ apiKey: mockApiKey })),
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

describe("Supermemory Client Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiKey = null;
  });

  describe("SupermemoryClientService", () => {
    it("should fail when API key is missing", async () => {
      mockApiKey = null;

      const result = await Effect.runPromise(
        Effect.flip(
          Effect.gen(function* () {
            yield* SupermemoryClientService;
          }).pipe(Effect.provide(SupermemoryClientService.Default))
        )
      );

      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(result.message).toContain("No Supermemory API key configured");
    });

    it("should create client when API key is present", async () => {
      mockApiKey = "sk_test123";

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return client;
        }).pipe(Effect.provide(SupermemoryClientService.Default))
      );

      expect(result).toBeDefined();
      expect(typeof result.addText).toBe("function");
      expect(typeof result.search).toBe("function");
    });

    it("should handle addText success", async () => {
      mockApiKey = "sk_test123";

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          yield* client.addText("test memory");
        }).pipe(Effect.provide(SupermemoryClientService.Default))
      );

      expect(result).toBeUndefined();
    });

    it("should handle search success", async () => {
      mockApiKey = "sk_test123";

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return yield* client.search("test query");
        }).pipe(Effect.provide(SupermemoryClientService.Default))
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle search with custom options", async () => {
      mockApiKey = "sk_test123";

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return yield* client.search("test query", {
            topK: 10,
            threshold: 0.8,
          });
        }).pipe(Effect.provide(SupermemoryClientService.Default))
      );

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Error Types", () => {
    it("should create MissingSupermemoryApiKey error", () => {
      const error = new MissingSupermemoryApiKey({
        message: "API key missing",
      });

      expect(error._tag).toBe("MissingSupermemoryApiKey");
      expect(error.message).toBe("API key missing");
    });

    it("should create SupermemoryError", () => {
      const cause = new Error("Underlying error");
      const error = new SupermemoryError({
        message: "Supermemory operation failed",
        cause,
      });

      expect(error._tag).toBe("SupermemoryError");
      expect(error.message).toBe("Supermemory operation failed");
      expect(error.cause).toBe(cause);
    });
  });

  describe("Service", () => {
    it("should have correct service key", () => {
      expect(SupermemoryClientService.key).toBe("SupermemoryClient");
    });
  });

  describe("Mock Client Layer", () => {
    it("should work with a mock client layer", async () => {
      const mockClient: SupermemoryClient = {
        addText: () => Effect.void,
        search: () => Effect.succeed([]),
        addDocument: () =>
          Effect.succeed({
            id: "doc_1",
            title: "Test",
            content: "test content",
          }),
        listDocuments: () => Effect.succeed([]),
        getDocument: () =>
          Effect.succeed({
            id: "doc_1",
            title: "Test",
            content: "test content",
          }),
        getMemory: () =>
          Effect.succeed({
            id: "mem_1",
            content: "test",
            documentId: "doc_1",
          }),
        deleteDocument: () => Effect.void,
        searchMemories: () => Effect.succeed([]),
      };

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return yield* client.search("test");
        }).pipe(Effect.provide(createMockClientLayer(mockClient)))
      );

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
