import { Effect } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

// Mock os.homedir
vi.mock("node:os", () => ({
  homedir: () => "/mock/home",
}));

// Mock node:fs/promises
vi.mock("node:fs/promises", () => mockFs);

describe("Supermemory Config Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SUPERMEMORY_API_KEY;
  });

  describe("loadConfig", () => {
    it("should load default config when no file exists and no env var", async () => {
      mockFs.access.mockRejectedValue(new Error("File not found"));

      const result = await Effect.runPromise(loadConfig());

      expect(result).toEqual({
        apiKey: null,
      });
      expect(mockFs.access).toHaveBeenCalledWith(
        "/mock/home/.effect-supermemory.json"
      );
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
      expect(mockFs.readFile).toHaveBeenCalledWith(
        "/mock/home/.effect-supermemory.json",
        "utf-8"
      );
    });

    it("should handle invalid JSON in config file", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{"apiKey": invalid}');

      const result = await Effect.runPromise(Effect.flip(loadConfig()));

      expect(result).toBeInstanceOf(ConfigError);
      expect(result.message).toContain("Invalid JSON");
    });

    it("should return default config for invalid config structure", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{"apiKey": 123}');

      const result = await Effect.runPromise(loadConfig());

      expect(result).toEqual({
        apiKey: null,
      });
    });

    it("should handle file read errors", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockRejectedValue(new Error("Permission denied"));

      const result = await Effect.runPromise(Effect.flip(loadConfig()));

      expect(result).toBeInstanceOf(ConfigError);
      expect(result.message).toContain("Failed to read config file");
    });
  });

  describe("saveConfig", () => {
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

    it("should handle file write errors", async () => {
      mockFs.writeFile.mockRejectedValue(new Error("Disk full"));

      const config = { apiKey: "sk_new789" };
      const result = await Effect.runPromise(Effect.flip(saveConfig(config)));

      expect(result).toBeInstanceOf(ConfigError);
      expect(result.message).toContain("Failed to write config file");
    });
  });

  describe("updateApiKey", () => {
    it("should update existing API key", async () => {
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

    it("should create new config file when none exists", async () => {
      mockFs.access.mockRejectedValue(new Error("File not found"));
      mockFs.writeFile.mockResolvedValue(undefined);

      await Effect.runPromise(updateApiKey("sk_new"));

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/mock/home/.effect-supermemory.json",
        JSON.stringify({ apiKey: "sk_new" }, null, 2),
        "utf-8"
      );
    });

    it("should handle setting API key to null", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{"apiKey": "sk_old"}');
      mockFs.writeFile.mockResolvedValue(undefined);

      await Effect.runPromise(updateApiKey(null));

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/mock/home/.effect-supermemory.json",
        JSON.stringify({ apiKey: null }, null, 2),
        "utf-8"
      );
    });
  });

  describe("Context Tag", () => {
    it("should create a valid Context tag", () => {
      expect(SupermemoryTuiConfig.key).toBe("SupermemoryTuiConfig");
    });
  });
});
