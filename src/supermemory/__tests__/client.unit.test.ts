import { Context, Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MissingSupermemoryApiKey,
  SupermemoryClientService,
  SupermemoryError,
} from "../client";

// Create a test config tag that allows providing API key
const TestSupermemoryTuiConfig = Context.GenericTag<{
  readonly apiKey: string | null;
}>("TestSupermemoryTuiConfig");

// Mock loadConfig to use our test config
vi.mock("../config", () => ({
  ConfigError: vi.fn(),
  loadConfig: () => Effect.succeed(TestSupermemoryTuiConfig),
  updateApiKey: vi.fn(),
}));

describe("Supermemory Client Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SupermemoryClientService", () => {
    it("should fail when API key is missing", async () => {
      const result = await Effect.runPromise(
        Effect.flip(
          Effect.gen(function* () {
            yield* SupermemoryClientService;
          }).pipe(
            Effect.provide(
              Layer.succeed(TestSupermemoryTuiConfig, { apiKey: null })
            ),
            Effect.provide(SupermemoryClientService.Default)
          )
        )
      );

      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(result.message).toContain("No Supermemory API key configured");
    });

    it("should create client when API key is present", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return client;
        }).pipe(
          Effect.provide(
            Layer.succeed(TestSupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(SupermemoryClientService.Default)
        )
      );

      expect(result).toBeDefined();
      expect(typeof result.addText).toBe("function");
      expect(typeof result.search).toBe("function");
    });

    it("should handle addText success", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          yield* client.addText("test memory");
        }).pipe(
          Effect.provide(
            Layer.succeed(TestSupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(SupermemoryClientService.Default)
        )
      );

      expect(result).toBeUndefined();
    });

    it("should handle search success", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return yield* client.search("test query");
        }).pipe(
          Effect.provide(
            Layer.succeed(TestSupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(SupermemoryClientService.Default)
        )
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle search with custom options", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return yield* client.search("test query", {
            topK: 10,
            threshold: 0.8,
          });
        }).pipe(
          Effect.provide(
            Layer.succeed(TestSupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(SupermemoryClientService.Default)
        )
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

  describe("Context Tag", () => {
    it("should create a valid Context tag", () => {
      expect(SupermemoryClientService.key).toBe("SupermemoryClient");
    });
  });
});
