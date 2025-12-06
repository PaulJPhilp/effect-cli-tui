import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { createKit } from "@kits";
import { KitRegistryService } from "@kits/registry";
import type { Kit } from "@kits/types";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createEffectCliSlashCommand,
  DEFAULT_SLASH_COMMANDS,
  getGlobalSlashCommandRegistry,
  setGlobalSlashCommandRegistry,
} from "@/tui-slash-commands";

const CONFIG_DIR_NAME = ".effect-cli-tui";
const CONFIG_FILE_NAME = "kits.json";

function getConfigPath(): string {
  return path.join(os.homedir(), CONFIG_DIR_NAME, CONFIG_FILE_NAME);
}

/**
 * Test kit for use in tests
 */
const testKit: Kit = createKit(
  "testkit",
  "Test Kit",
  "A test kit for unit tests",
  "1.0.0",
  [
    createEffectCliSlashCommand({
      name: "test-command",
      description: "A test command",
      effect: () => Effect.succeed({ kind: "continue" } as const),
    }),
  ]
);

/**
 * Another test kit
 */
const anotherKit: Kit = createKit(
  "anotherkit",
  "Another Kit",
  "Another test kit",
  "1.0.0",
  [
    createEffectCliSlashCommand({
      name: "another-command",
      description: "Another test command",
      effect: () => Effect.succeed({ kind: "continue" } as const),
    }),
  ]
);

describe("KitRegistryService", () => {
  beforeEach(async () => {
    // Reset global registry to defaults before each test
    setGlobalSlashCommandRegistry(DEFAULT_SLASH_COMMANDS);

    // Clean up config file to ensure fresh state
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up config file after each test
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  describe("Service Registration", () => {
    it("should be accessible via Effect.Service", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        return registry !== undefined;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should provide Default layer", () => {
      expect(KitRegistryService.Default).toBeDefined();
    });
  });

  describe("register", () => {
    it("should register a kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        const available = yield* registry.listAvailable();
        return available.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(1);
    });

    it("should register multiple kits", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(anotherKit);
        const available = yield* registry.listAvailable();
        return available.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(2);
    });

    it("should fail when registering duplicate kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(testKit); // Duplicate
      })
        .pipe(Effect.provide(KitRegistryService.Default))
        .pipe(
          Effect.catchTag("KitError", (error) => {
            expect(error.reason).toBe("KitAlreadyRegistered");
            return Effect.succeed(undefined);
          })
        );

      await Effect.runPromise(program);
    });
  });

  describe("enable", () => {
    it("should enable a registered kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);

        // Ensure kit is not already enabled (cleanup from previous tests)
        const alreadyEnabled = yield* registry.isEnabled("testkit");
        if (alreadyEnabled) {
          yield* registry.disable("testkit");
        }

        yield* registry.enable("testkit");
        const enabled = yield* registry.listEnabled();
        return enabled.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(1);
    });

    it("should add kit commands to global registry when enabled", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");

        // Check that command is in global registry
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("test-command");
        return hasCommand;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should fail when enabling unregistered kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.enable("nonexistent");
      })
        .pipe(Effect.provide(KitRegistryService.Default))
        .pipe(
          Effect.catchTag("KitError", (error) => {
            expect(error.reason).toBe("KitNotFound");
            return Effect.succeed(undefined);
          })
        );

      await Effect.runPromise(program);
    });

    it("should fail when enabling already enabled kit", async () => {
      // Ensure clean state
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);

        // Ensure not already enabled
        const alreadyEnabled = yield* registry.isEnabled("testkit");
        if (alreadyEnabled) {
          yield* registry.disable("testkit");
        }

        yield* registry.enable("testkit");
        yield* registry.enable("testkit"); // Already enabled
      })
        .pipe(Effect.provide(KitRegistryService.Default))
        .pipe(
          Effect.catchTag("KitError", (error) => {
            expect(error.reason).toBe("KitAlreadyEnabled");
            return Effect.succeed(undefined);
          })
        );

      await Effect.runPromise(program);
    });
  });

  describe("disable", () => {
    it("should disable an enabled kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");
        yield* registry.disable("testkit");
        const enabled = yield* registry.listEnabled();
        return enabled.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(0);
    });

    it("should remove kit commands from global registry when disabled", async () => {
      // Ensure config directory exists
      const configDir = path.join(os.homedir(), CONFIG_DIR_NAME);
      try {
        await fs.mkdir(configDir, { recursive: true });
      } catch {
        // Ignore if already exists
      }

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");
        yield* registry.disable("testkit");

        // Check that command is removed from global registry
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("test-command");
        return hasCommand;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should fail when disabling non-enabled kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.disable("testkit"); // Not enabled
      })
        .pipe(Effect.provide(KitRegistryService.Default))
        .pipe(
          Effect.catchTag("KitError", (error) => {
            expect(error.reason).toBe("KitNotEnabled");
            return Effect.succeed(undefined);
          })
        );

      await Effect.runPromise(program);
    });
  });

  describe("listAvailable", () => {
    it("should return empty array when no kits registered", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        const available = yield* registry.listAvailable();
        return available.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(0);
    });

    it("should return all registered kits", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(anotherKit);
        const available = yield* registry.listAvailable();
        return available.map((k) => k.id);
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toEqual(["testkit", "anotherkit"]);
    });
  });

  describe("listEnabled", () => {
    it("should return empty array when no kits enabled", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        const enabled = yield* registry.listEnabled();
        return enabled.length;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(0);
    });

    it("should return only enabled kits", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(anotherKit);
        yield* registry.enable("testkit");
        const enabled = yield* registry.listEnabled();
        return enabled.map((k) => k.id);
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toEqual(["testkit"]);
    });
  });

  describe("isEnabled", () => {
    it("should return false for unregistered kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        const enabled = yield* registry.isEnabled("testkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should return false for registered but not enabled kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        const enabled = yield* registry.isEnabled("testkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should return true for enabled kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");
        const enabled = yield* registry.isEnabled("testkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });
  });

  describe("getKit", () => {
    it("should return registered kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        const kit = yield* registry.getKit("testkit");
        return kit.id;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("testkit");
    });

    it("should fail when getting unregistered kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.getKit("nonexistent");
      })
        .pipe(Effect.provide(KitRegistryService.Default))
        .pipe(
          Effect.catchTag("KitError", (error) => {
            expect(error.reason).toBe("KitNotFound");
            return Effect.succeed(undefined);
          })
        );

      await Effect.runPromise(program);
    });
  });

  describe("Config Integration", () => {
    it("should auto-enable kit from config when registered", async () => {
      // First, save a config with testkit enabled
      const { saveKitConfig } = await import("../../../src/kits/config");
      await Effect.runPromise(saveKitConfig({ enabledKits: ["testkit"] }));

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);

        // Kit should be automatically enabled because it was in config
        const enabled = yield* registry.isEnabled("testkit");
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("test-command");
        return { enabled, hasCommand };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.enabled).toBe(true);
      expect(result.hasCommand).toBe(true);
    });

    it("should persist enabled state to config when enabling", async () => {
      // Ensure clean state
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      const { loadKitConfig } = await import("../../../src/kits/config");

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);

        // Ensure not already enabled
        const alreadyEnabled = yield* registry.isEnabled("testkit");
        if (alreadyEnabled) {
          yield* registry.disable("testkit");
        }

        yield* registry.enable("testkit");

        // Small delay to ensure config write completes
        yield* Effect.sleep("10 millis");

        // Verify config was saved
        const config = yield* loadKitConfig();
        return config.enabledKits;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toContain("testkit");
    });

    it("should persist disabled state to config when disabling", async () => {
      const { loadKitConfig } = await import("../../../src/kits/config");

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");
        yield* registry.disable("testkit");

        // Verify config was updated
        const config = yield* loadKitConfig();
        return config.enabledKits;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).not.toContain("testkit");
    });
  });

  describe("Multiple Kits", () => {
    it("should handle multiple kits with multiple commands", async () => {
      const multiCommandKit: Kit = createKit(
        "multikit",
        "Multi Command Kit",
        "Kit with multiple commands",
        "1.0.0",
        [
          createEffectCliSlashCommand({
            name: "multi-1",
            description: "First command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
          createEffectCliSlashCommand({
            name: "multi-2",
            description: "Second command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
          createEffectCliSlashCommand({
            name: "multi-3",
            description: "Third command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
        ]
      );

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(multiCommandKit);
        yield* registry.enable("testkit");
        yield* registry.enable("multikit");

        const globalRegistry = getGlobalSlashCommandRegistry();
        return {
          hasTest: globalRegistry.lookup.has("test-command"),
          hasMulti1: globalRegistry.lookup.has("multi-1"),
          hasMulti2: globalRegistry.lookup.has("multi-2"),
          hasMulti3: globalRegistry.lookup.has("multi-3"),
        };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(true);
      expect(result.hasMulti1).toBe(true);
      expect(result.hasMulti2).toBe(true);
      expect(result.hasMulti3).toBe(true);
    });

    it("should enable and disable multiple kits independently", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.register(anotherKit);

        yield* registry.enable("testkit");
        yield* registry.enable("anotherkit");

        let enabled = yield* registry.listEnabled();
        expect(enabled.length).toBe(2);

        yield* registry.disable("testkit");
        enabled = yield* registry.listEnabled();
        expect(enabled.map((k) => k.id)).toEqual(["anotherkit"]);

        const globalRegistry = getGlobalSlashCommandRegistry();
        return {
          hasTest: globalRegistry.lookup.has("test-command"),
          hasAnother: globalRegistry.lookup.has("another-command"),
        };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(false);
      expect(result.hasAnother).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle kit with no commands", async () => {
      const emptyKit: Kit = createKit(
        "emptykit",
        "Empty Kit",
        "Kit with no commands",
        "1.0.0",
        []
      );

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(emptyKit);
        yield* registry.enable("emptykit");

        const enabled = yield* registry.listEnabled();
        const kit = yield* registry.getKit("emptykit");
        return {
          enabledCount: enabled.length,
          commandCount: kit.commands.length,
        };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.enabledCount).toBe(1);
      expect(result.commandCount).toBe(0);
    });

    it("should handle kit with empty string ID", async () => {
      const emptyIdKit: Kit = createKit(
        "",
        "Empty ID Kit",
        "Kit with empty ID",
        "1.0.0",
        [
          createEffectCliSlashCommand({
            name: "empty-id-command",
            description: "Command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
        ]
      );

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(emptyIdKit);
        const enabled = yield* registry.isEnabled("");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should preserve default commands when enabling/disabling kits", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* registry.enable("testkit");

        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasHelp = globalRegistry.lookup.has("help");
        const hasTest = globalRegistry.lookup.has("test-command");

        yield* registry.disable("testkit");

        const globalRegistry2 = getGlobalSlashCommandRegistry();
        const hasHelpAfter = globalRegistry2.lookup.has("help");
        const hasTestAfter = globalRegistry2.lookup.has("test-command");

        return { hasHelp, hasTest, hasHelpAfter, hasTestAfter };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasHelp).toBe(true);
      expect(result.hasTest).toBe(true);
      expect(result.hasHelpAfter).toBe(true);
      expect(result.hasTestAfter).toBe(false);
    });
  });
});
