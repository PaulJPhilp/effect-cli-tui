import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MissingSupermemoryApiKey, SupermemoryClient } from "../client";
import {
  ConfigError,
  loadConfig,
  SupermemoryTuiConfig,
  saveConfig,
  updateApiKey,
} from "../config";

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

describe("Supermemory Config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SUPERMEMORY_API_KEY;
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
    const result = await Effect.runPromise(
      Effect.flip(
        Effect.gen(function* () {
          yield* SupermemoryClient;
        }).pipe(
          Effect.provide(Layer.succeed(SupermemoryTuiConfig, { apiKey: null }))
        )
      )
    );

    expect(result).toBeInstanceOf(MissingSupermemoryApiKey);
    expect(result.message).toContain("No Supermemory API key configured");
  });
});
