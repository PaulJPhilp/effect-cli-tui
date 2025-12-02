import { Effect, Layer } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type SlashCommandContext } from "../../tui-slash-commands";
import {
    MissingSupermemoryApiKey,
    SupermemoryClient,
    SupermemoryClientLive
} from "../client";
import { handleAddCommand, handleApiKeyCommand, handleSearchCommand } from "../commands";
import { ConfigError, loadConfig, saveConfig, SupermemoryTuiConfig, updateApiKey } from "../config";
import { SUPERMEMORY_SLASH_COMMANDS } from "../slash-commands";

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

// Mock effect-supermemory
const mockSupermemory = {
  make: vi.fn(),
  Ingest: {
    addText: vi.fn(),
  },
  Search: {
    searchMemories: vi.fn(),
  },
};

vi.mock("effect-supermemory", () => mockSupermemory);

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
      
      const result = await Effect.runPromise(
        Effect.flip(loadConfig())
      );
      
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

  describe("SupermemoryClient", () => {
    it("should fail when API key is missing", async () => {
      const result = await Effect.runPromise(
        Effect.flip(
          Effect.gen(function* () {
            yield* SupermemoryClient;
          }).pipe(
            Effect.provide(
              Layer.succeed(SupermemoryTuiConfig, { apiKey: null })
            ),
            Effect.provide(SupermemoryClientLive)
          )
        )
      );

      expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
      expect(result.message).toContain("No Supermemory API key configured");
    });

    it("should create client when API key is present", async () => {
      const mockClient = { addText: vi.fn(), search: vi.fn() };
      mockSupermemory.make.mockReturnValue(mockClient);

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          yield* SupermemoryClient;
        }).pipe(
          Effect.provide(
            Layer.succeed(SupermemoryTuiConfig, { apiKey: "sk_test123" })
          ),
          Effect.provide(SupermemoryClientLive)
        )
      );

      expect(mockSupermemory.make).toHaveBeenCalledWith({
        apiKey: "sk_test123",
      });
      expect(result).toBeDefined();
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
      registry: {} as any,
    });

    it("handleApiKeyCommand should handle missing API key", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleApiKeyCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: API key is required."
      );
    });

    it("handleAddCommand should handle missing text", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleAddCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: No text provided to add."
      );
    });

    it("handleSearchCommand should handle missing query", async () => {
      const context = createMockContext([]);
      
      const result = await Effect.runPromise(handleSearchCommand(context));
      
      expect(result).toEqual({ kind: "continue" });
      expect(mockConsole.log).toHaveBeenCalledWith(
        "[Supermemory] Error: No search query provided."
      );
    });
  });

  describe("Slash Commands Registration", () => {
    it("should export correct slash commands", () => {
      expect(SUPERMEMORY_SLASH_COMMANDS).toHaveLength(1);
      
      const command = SUPERMEMORY_SLASH_COMMANDS[0];
      expect(command.name).toBe("supermemory");
      expect(command.aliases).toContain("sm");
      expect(command.description).toBe("Supermemory integration commands");
      expect(typeof command.run).toBe("function");
    });
  });
});
