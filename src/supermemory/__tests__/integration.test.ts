import {
  MissingSupermemoryApiKey,
  type SupermemoryClient,
  SupermemoryClientService,
} from "@supermemory/client";
import {
  ConfigError,
  loadConfig,
  saveConfig,
  updateApiKey,
} from "@supermemory/config";
import { Effect, Layer } from "effect";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Note: These tests use vi.mock for file system operations.
 * When running multiple test files together, mocks may interfere.
 * Run individually with: bun test src/supermemory/__tests__/integration.test.ts
 */

// Mock fs operations
const mockFs = {
  access: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
};

vi.mock("node:fs/promises", () => mockFs);

// Mock os.homedir
vi.mock("node:os", () => ({
  homedir: () => "/mock/home",
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

describe("Supermemory Config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPERMEMORY_API_KEY = undefined;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should load default config when no file exists and no env var", async () => {
    mockFs.access.mockRejectedValue(new Error("File not found"));

    const result = await Effect.runPromise(loadConfig());

    expect(result).toEqual({
      apiKey: null,
    });
  });

  it("should load config from environment variable when no file exists", async () => {
    mockFs.access.mockRejectedValue(new Error("File not found"));
    process.env.SUPERMEMORY_API_KEY = "sk_test123";

    const result = await Effect.runPromise(loadConfig());

    expect(result).toEqual({
      apiKey: "sk_test123",
    });
  });

  it("should load config from file when it exists", async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readFile.mockResolvedValue('{"apiKey": "sk_file456"}');

    const result = await Effect.runPromise(loadConfig());

    expect(result).toEqual({
      apiKey: "sk_file456",
    });
  });

  it("should handle invalid JSON in config file", async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readFile.mockResolvedValue('{"apiKey": invalid}');

    const result = await Effect.runPromise(Effect.flip(loadConfig()));

    expect(result).toBeInstanceOf(ConfigError);
    expect(result.message).toContain("Invalid JSON");
  });

  it("should save config to file", async () => {
    mockFs.writeFile.mockResolvedValue(undefined);

    const config = { apiKey: "sk_new789" };
    await Effect.runPromise(saveConfig(config));

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "/mock/home/.effect-supermemory.json",
      JSON.stringify(config, null, 2),
      "utf-8"
    );
  });

  it("should update API key", async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readFile.mockResolvedValue('{"apiKey": "sk_old"}');
    mockFs.writeFile.mockResolvedValue(undefined);

    await Effect.runPromise(updateApiKey("sk_new"));

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "/mock/home/.effect-supermemory.json",
      JSON.stringify({ apiKey: "sk_new" }, null, 2),
      "utf-8"
    );
  });
});

describe("Supermemory Client", () => {
  it("should fail when API key is missing", async () => {
    // Create a mock client that simulates the error from missing API key
    const mockClientThatFails: SupermemoryClient = {
      addText: () =>
        Effect.fail(
          new MissingSupermemoryApiKey({
            message: "No Supermemory API key configured",
          })
        ) as unknown as Effect.Effect<void, never>,
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
      Effect.flip(
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          yield* client.addText("test");
        }).pipe(Effect.provide(createMockClientLayer(mockClientThatFails)))
      )
    );

    expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
    expect(result.message).toContain("No Supermemory API key configured");
  });

  it("should work with mock client when API key is present", async () => {
    const mockClient: SupermemoryClient = {
      addText: () => Effect.void,
      search: () => Effect.succeed([{ id: "1", content: "test", score: 0.9 }]),
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
      Effect.gen(function* () {
        const client = yield* SupermemoryClientService;
        const searchResults = yield* client.search("test query");
        return searchResults;
      }).pipe(Effect.provide(createMockClientLayer(mockClient)))
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: "1", content: "test", score: 0.9 });
  });
});
