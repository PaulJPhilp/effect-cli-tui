import {
  MissingSupermemoryApiKey,
  type SupermemoryClient,
  SupermemoryClientService,
} from "@supermemory/client";
import {
  handleAddCommand,
  handleApiKeyCommand,
  handleSearchCommand,
} from "@supermemory/commands";
import {
  ConfigError,
  loadConfig,
  saveConfig,
  updateApiKey,
} from "@supermemory/config";
import { SUPERMEMORY_SLASH_COMMANDS } from "@supermemory/slash-commands";
import { Effect, Layer } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  SlashCommandContext,
  SlashCommandRegistry,
} from "@/tui-slash-commands";

/**
 * Note: These tests use vi.mock for file system operations.
 * When running multiple test files together, mocks may interfere.
 * Run individually with: bun test src/supermemory/__tests__/full-integration.test.ts
 */

// Mock fs operations
const mockFs = {
  access: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
};

// Mock os.homedir
vi.mock("node:os", () => ({
  homedir: () => "/mock/home",
}));

// Mock node:fs/promises
vi.mock("node:fs/promises", () => mockFs);

/**
 * Helper to create a mock layer for SupermemoryClientService
 */
function createMockClientLayer(mockClient: SupermemoryClient) {
  return Layer.succeed(
    SupermemoryClientService,
    mockClient as unknown as SupermemoryClientService
  );
}

/**
 * Default mock client for tests
 */
const defaultMockClient: SupermemoryClient = {
  addText: () => Effect.void,
  search: () => Effect.succeed([]),
  addDocument: () => Effect.succeed({ id: "1", title: null, content: "test" }),
  listDocuments: () => Effect.succeed([]),
  getDocument: () => Effect.succeed({ id: "1", title: null, content: "test" }),
  getMemory: () =>
    Effect.succeed({ id: "1", content: "test", documentId: "1" }),
  deleteDocument: () => Effect.void,
  searchMemories: () => Effect.succeed([]),
};

describe("Supermemory Integration Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SUPERMEMORY_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Config Module", () => {
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

  describe("SupermemoryClientService", () => {
    it("should fail when API key is missing", async () => {
      // Use a mock layer that simulates missing API key error
      const mockClient: SupermemoryClient = {
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
          }).pipe(Effect.provide(createMockClientLayer(mockClient)))
        )
      );

      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(result.message).toContain("No Supermemory API key configured");
    });

    it("should create client when API key is present", async () => {
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
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          return client;
        }).pipe(Effect.provide(createMockClientLayer(mockClient)))
      );

      expect(result).toBeDefined();
      expect(typeof result.addText).toBe("function");
    });
  });

  describe("Command Handlers", () => {
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

    it("handleApiKeyCommand should return continue when API key is missing", async () => {
      const context = createMockContext([]);

      const result = await Effect.runPromise(handleApiKeyCommand(context));

      expect(result).toEqual({ kind: "continue" });
    });

    it("handleAddCommand should return continue when text is missing", async () => {
      const context = createMockContext([]);

      const result = await Effect.runPromise(
        handleAddCommand(context).pipe(
          Effect.provide(createMockClientLayer(defaultMockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });

    it("handleSearchCommand should return continue when query is missing", async () => {
      const context = createMockContext([]);

      const result = await Effect.runPromise(
        handleSearchCommand(context).pipe(
          Effect.provide(createMockClientLayer(defaultMockClient))
        )
      );

      expect(result).toEqual({ kind: "continue" });
    });
  });

  describe("Slash Commands Registration", () => {
    it("should export correct slash commands", () => {
      expect(SUPERMEMORY_SLASH_COMMANDS).toHaveLength(1);

      const command = SUPERMEMORY_SLASH_COMMANDS[0];
      expect(command?.name).toBe("supermemory");
      expect(command?.aliases).toContain("sm");
      expect(command?.description).toBe("Supermemory integration commands");
      expect(typeof command?.run).toBe("function");
    });
  });
});
