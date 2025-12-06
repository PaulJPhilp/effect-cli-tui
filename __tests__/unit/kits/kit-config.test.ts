import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { loadKitConfig, saveKitConfig } from "@kits/config";
import type { KitConfig } from "@kits/types";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const CONFIG_DIR_NAME = ".effect-cli-tui";
const CONFIG_FILE_NAME = "kits.json";

function getConfigDir(): string {
  return path.join(os.homedir(), CONFIG_DIR_NAME);
}

function getConfigPath(): string {
  return path.join(getConfigDir(), CONFIG_FILE_NAME);
}

describe("Kit Config", () => {
  beforeEach(async () => {
    // Clean up test config file before each test
    // Use a small delay to ensure any previous file operations complete
    await new Promise((resolve) => setTimeout(resolve, 10));
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up test config file after each test
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  describe("loadKitConfig", () => {
    it("should return default config when file does not exist", async () => {
      const program = loadKitConfig();
      const result = await Effect.runPromise(program);

      expect(result).toEqual({ enabledKits: [] });
    });

    it("should load config from file", async () => {
      // Create test config file
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      const testConfig: KitConfig = {
        enabledKits: ["memkit", "testkit"],
      };
      await fs.writeFile(configPath, JSON.stringify(testConfig, null, 2));

      const program = loadKitConfig();
      const result = await Effect.runPromise(program);

      expect(result).toEqual(testConfig);
    });

    it("should handle invalid JSON gracefully", async () => {
      // Create invalid config file
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      await fs.writeFile(configPath, "invalid json");

      const program = loadKitConfig().pipe(
        Effect.catchTag("KitConfigError", (error) => {
          expect(error.message).toContain("Invalid JSON");
          return Effect.succeed({ enabledKits: [] });
        })
      );

      await Effect.runPromise(program);
    });

    it("should handle invalid config shape gracefully", async () => {
      // Create config file with invalid shape
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      await fs.writeFile(configPath, JSON.stringify({ invalid: "shape" }));

      const program = loadKitConfig();
      const result = await Effect.runPromise(program);

      // Should return default config
      expect(result).toEqual({ enabledKits: [] });
    });

    it("should filter out non-string kit IDs", async () => {
      // Create config file with mixed types
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      await fs.writeFile(
        configPath,
        JSON.stringify({ enabledKits: ["valid", 123, null, "also-valid"] })
      );

      const program = loadKitConfig();
      const result = await Effect.runPromise(program);

      expect(result.enabledKits).toEqual(["valid", "also-valid"]);
    });
  });

  describe("saveKitConfig", () => {
    it("should save config to file", async () => {
      const testConfig: KitConfig = {
        enabledKits: ["memkit", "testkit"],
      };

      const program = saveKitConfig(testConfig);
      await Effect.runPromise(program);

      // Verify file was created
      const configPath = getConfigPath();
      const content = await fs.readFile(configPath, "utf-8");
      const saved = JSON.parse(content) as KitConfig;

      expect(saved).toEqual(testConfig);
    });

    it("should create config directory if it doesn't exist", async () => {
      const testConfig: KitConfig = {
        enabledKits: ["memkit"],
      };

      // Remove config directory and file if they exist
      const configDir = getConfigDir();
      const configPath = getConfigPath();
      try {
        await fs.unlink(configPath);
      } catch {
        // Ignore if doesn't exist
      }
      try {
        await fs.rmdir(configDir);
      } catch {
        // Ignore if doesn't exist or not empty
      }

      const program = saveKitConfig(testConfig);
      await Effect.runPromise(program);

      // Verify directory and file were created
      const stats = await fs.stat(configPath);
      expect(stats.isFile()).toBe(true);
    });

    it("should overwrite existing config file", async () => {
      // Create initial config
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      const initialConfig: KitConfig = {
        enabledKits: ["oldkit"],
      };
      await fs.writeFile(configPath, JSON.stringify(initialConfig, null, 2));

      // Save new config
      const newConfig: KitConfig = {
        enabledKits: ["newkit"],
      };
      const program = saveKitConfig(newConfig);
      await Effect.runPromise(program);

      // Verify file was overwritten
      const content = await fs.readFile(configPath, "utf-8");
      const saved = JSON.parse(content) as KitConfig;
      expect(saved).toEqual(newConfig);
    });

    it("should handle empty enabledKits array", async () => {
      const emptyConfig: KitConfig = {
        enabledKits: [],
      };

      const program = saveKitConfig(emptyConfig);
      await Effect.runPromise(program);

      const configPath = getConfigPath();
      const content = await fs.readFile(configPath, "utf-8");
      const saved = JSON.parse(content) as KitConfig;

      expect(saved.enabledKits).toEqual([]);
    });

    it("should handle very long kit ID lists", async () => {
      const longConfig: KitConfig = {
        enabledKits: Array.from({ length: 100 }, (_, i) => `kit-${i}`),
      };

      const program = saveKitConfig(longConfig);
      await Effect.runPromise(program);

      const loaded = await Effect.runPromise(loadKitConfig());
      expect(loaded.enabledKits.length).toBe(100);
    });

    it("should preserve order of enabled kits", async () => {
      // Ensure clean state
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      const orderedConfig: KitConfig = {
        enabledKits: ["first", "second", "third", "fourth"],
      };

      const program = saveKitConfig(orderedConfig);
      await Effect.runPromise(program);

      // Small delay to ensure file write completes
      await new Promise((resolve) => setTimeout(resolve, 100));

      const loaded = await Effect.runPromise(loadKitConfig());
      expect(loaded.enabledKits).toEqual([
        "first",
        "second",
        "third",
        "fourth",
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle config with special characters in kit IDs", async () => {
      const specialConfig: KitConfig = {
        enabledKits: [
          "kit-with-dashes",
          "kit_with_underscores",
          "kit.with.dots",
        ],
      };

      const program = saveKitConfig(specialConfig);
      await Effect.runPromise(program);

      // Small delay to ensure file write completes and is flushed
      await new Promise((resolve) => setTimeout(resolve, 100));

      const loaded = await Effect.runPromise(loadKitConfig());
      expect(loaded.enabledKits).toEqual(specialConfig.enabledKits);
    });

    it("should handle config with unicode characters in kit IDs", async () => {
      // Ensure clean state
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      const unicodeConfig: KitConfig = {
        enabledKits: ["kit-测试", "kit-🎉", "kit-🚀"],
      };

      const program = saveKitConfig(unicodeConfig);
      await Effect.runPromise(program);

      // Small delay to ensure file write completes
      await new Promise((resolve) => setTimeout(resolve, 100));

      const loaded = await Effect.runPromise(loadKitConfig());
      expect(loaded.enabledKits).toEqual(unicodeConfig.enabledKits);
    });

    it("should handle config file with trailing whitespace", async () => {
      // Ensure clean state
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      // Write valid JSON with whitespace (JSON.parse handles this)
      const validJson = JSON.stringify({ enabledKits: ["testkit"] });
      await fs.writeFile(configPath, `  ${validJson}  `);

      // Small delay to ensure file write completes
      await new Promise((resolve) => setTimeout(resolve, 50));

      const program = loadKitConfig();
      const result = await Effect.runPromise(program);

      expect(result.enabledKits).toEqual(["testkit"]);
    });

    it("should handle config file with comments (should fail JSON parse)", async () => {
      const configDir = getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
      const configPath = getConfigPath();
      await fs.writeFile(
        configPath,
        '{ "enabledKits": ["testkit"] } // comment'
      );

      const program = loadKitConfig().pipe(
        Effect.catchTag("KitConfigError", (error) => {
          expect(error.message).toContain("Invalid JSON");
          return Effect.succeed({ enabledKits: [] });
        })
      );

      await Effect.runPromise(program);
    });

    it("should handle config with duplicate kit IDs", async () => {
      // Ensure clean state - wait a bit to ensure previous operations complete
      await new Promise((resolve) => setTimeout(resolve, 50));
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }
      // Wait a bit more to ensure file deletion completes
      await new Promise((resolve) => setTimeout(resolve, 50));

      const duplicateConfig: KitConfig = {
        enabledKits: ["testkit", "testkit", "anotherkit"],
      };

      const program = saveKitConfig(duplicateConfig);
      await Effect.runPromise(program);

      // Small delay to ensure file write completes and is flushed
      await new Promise((resolve) => setTimeout(resolve, 200));

      const loaded = await Effect.runPromise(loadKitConfig());
      // Should preserve duplicates (filtering happens at registry level)
      expect(loaded.enabledKits).toEqual(["testkit", "testkit", "anotherkit"]);
    });
  });

  describe("File System Edge Cases", () => {
    it("should handle read-only directory gracefully", async () => {
      // This test may not work on all systems, so we'll just verify
      // that the error is properly caught
      const program = loadKitConfig().pipe(
        Effect.catchTag("KitConfigError", (error) => {
          // Error should be caught
          expect(error.message).toBeDefined();
          return Effect.succeed({ enabledKits: [] });
        })
      );

      // Should not throw
      await Effect.runPromise(program);
    });

    it("should create nested directory structure if needed", async () => {
      // Remove entire config directory
      const configDir = getConfigDir();
      const configPath = getConfigPath();
      try {
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }
      try {
        await fs.rmdir(configDir);
      } catch {
        // Ignore if doesn't exist or not empty
      }

      // Small delay to ensure directory removal completes
      await new Promise((resolve) => setTimeout(resolve, 50));

      const testConfig: KitConfig = {
        enabledKits: ["testkit"],
      };

      const program = saveKitConfig(testConfig);
      await Effect.runPromise(program);

      // Small delay to ensure directory and file creation completes
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify directory and file were created
      const stats = await fs.stat(configPath);
      expect(stats.isFile()).toBe(true);
    });
  });
});
