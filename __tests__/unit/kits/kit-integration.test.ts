import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { createKit, KitRegistryService, MemKit, withKit } from "@kits";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEffectCliSlashCommand,
  DEFAULT_SLASH_COMMANDS,
  getGlobalSlashCommandRegistry,
  setGlobalSlashCommandRegistry,
} from "@/tui-slash-commands";

const TEST_HOMEDIR = path.join(os.tmpdir(), "effect-cli-tui-test-integration");

vi.mock("node:os", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:os")>();
  return {
    ...actual,
    homedir: () => TEST_HOMEDIR,
  };
});

const CONFIG_DIR_NAME = ".effect-cli-tui";
const CONFIG_FILE_NAME = "kits.json";

function getConfigPath(): string {
  return path.join(os.homedir(), CONFIG_DIR_NAME, CONFIG_FILE_NAME);
}

describe("Kit Integration Tests", () => {
  beforeEach(async () => {
    setGlobalSlashCommandRegistry(DEFAULT_SLASH_COMMANDS);
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore
    }
  });

  afterEach(async () => {
    try {
      const configPath = getConfigPath();
      await fs.unlink(configPath);
    } catch {
      // Ignore
    }
  });

  describe("Full Workflow", () => {
    it("should complete full kit lifecycle: register -> enable -> use -> disable", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;

        // 1. Register kit
        yield* registry.register(MemKit);
        const available = yield* registry.listAvailable();
        expect(available.length).toBe(1);

        // 2. Enable kit
        yield* registry.enable("memkit");
        const enabled = yield* registry.isEnabled("memkit");
        expect(enabled).toBe(true);

        // 3. Use kit commands
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("mem-add-text");
        expect(hasCommand).toBe(true);

        // 4. Disable kit
        yield* registry.disable("memkit");
        const stillEnabled = yield* registry.isEnabled("memkit");
        expect(stillEnabled).toBe(false);

        const globalRegistry2 = getGlobalSlashCommandRegistry();
        const hasCommandAfter = globalRegistry2.lookup.has("mem-add-text");
        expect(hasCommandAfter).toBe(false);

        return "success";
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe("success");
    });

    it("should persist enabled state across service instances", async () => {
      // Clean config first
      try {
        const configPath = getConfigPath();
        await fs.unlink(configPath);
      } catch {
        // Ignore
      }

      // First program: register and enable
      const program1 = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(MemKit);
        yield* registry.enable("memkit");
        return "enabled";
      }).pipe(Effect.provide(KitRegistryService.Default));

      await Effect.runPromise(program1);

      // Small delay to ensure file write completes
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Verify config was saved
      const { loadKitConfig } = await import("../../../src/kits/config");
      const config = await Effect.runPromise(loadKitConfig());
      expect(config.enabledKits).toContain("memkit");

      // Second program: check if still enabled (via config)
      const program2 = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(MemKit); // Re-register (new service instance)
        const enabled = yield* registry.isEnabled("memkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program2);
      expect(result).toBe(true);
    });
  });

  describe("Runtime vs Registry", () => {
    it("should work with both runtime and registry enablement", async () => {
      const customKit = createKit(
        "customkit",
        "Custom Kit",
        "1.0.0",
        "Custom test kit",
        [
          createEffectCliSlashCommand({
            name: "custom-command",
            description: "Custom command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
        ]
      );

      const program = Effect.gen(function* () {
        // Enable via registry
        const registry = yield* KitRegistryService;
        yield* registry.register(MemKit);
        yield* registry.enable("memkit");

        // Note: withKit replaces the entire registry temporarily, so memkit
        // commands won't be available during withKit execution
        // This is expected behavior - withKit is for temporary runtime enablement
        const result = yield* withKit(
          customKit,
          Effect.gen(function* () {
            const globalRegistry = getGlobalSlashCommandRegistry();
            return {
              hasCustom: globalRegistry.lookup.has("custom-command"),
            };
          })
        );

        // After withKit, memkit should still be enabled (via registry)
        const globalRegistry = getGlobalSlashCommandRegistry();
        return {
          ...result,
          hasMemkitAfter: globalRegistry.lookup.has("mem-add-text"),
          hasCustomAfter: globalRegistry.lookup.has("custom-command"),
        };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasCustom).toBe(true);
      expect(result.hasMemkitAfter).toBe(true);
      expect(result.hasCustomAfter).toBe(false);
    });
  });

  describe("Multiple Kits Integration", () => {
    it("should handle multiple kits with registry and runtime", async () => {
      const kit1 = createKit("kit1", "Kit 1", "1.0.0", "First kit", [
        createEffectCliSlashCommand({
          name: "kit1-cmd",
          description: "Kit 1 command",
          effect: () => Effect.succeed({ kind: "continue" } as const),
        }),
      ]);

      const kit2 = createKit("kit2", "Kit 2", "1.0.0", "Second kit", [
        createEffectCliSlashCommand({
          name: "kit2-cmd",
          description: "Kit 2 command",
          effect: () => Effect.succeed({ kind: "continue" } as const),
        }),
      ]);

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;

        // Register and enable kit1 via registry
        yield* registry.register(kit1);
        yield* registry.enable("kit1");

        // Use kit2 via runtime (note: withKit replaces registry, so kit1 won't be available during withKit)
        const result = yield* withKit(
          kit2,
          Effect.gen(function* () {
            const globalRegistry = getGlobalSlashCommandRegistry();
            return {
              hasKit2: globalRegistry.lookup.has("kit2-cmd"),
            };
          })
        );

        // After withKit, kit1 should still be enabled
        const globalRegistry = getGlobalSlashCommandRegistry();
        return {
          ...result,
          hasKit1After: globalRegistry.lookup.has("kit1-cmd"),
        };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.hasKit2).toBe(true);
      expect(result.hasKit1After).toBe(true);
    });
  });

  describe("Error Recovery", () => {
    it("should recover from errors and maintain state", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;

        // Register and enable
        yield* registry.register(MemKit);
        yield* registry.enable("memkit");

        // Simulate an error in a nested operation
        yield* withKit(
          MemKit,
          Effect.gen(function* () {
            yield* Effect.fail(new Error("Test error"));
          })
        ).pipe(Effect.catchAll(() => Effect.succeed(undefined)));

        // State should still be maintained
        const enabled = yield* registry.isEnabled("memkit");
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("mem-add-text");

        return { enabled, hasCommand };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.enabled).toBe(true);
      expect(result.hasCommand).toBe(true);
    });
  });

  describe("createKit Helper", () => {
    it("should create valid kit with createKit helper", () => {
      const kit = createKit(
        "helperkit",
        "Helper Kit",
        "2.0.0",
        "Kit created with helper",
        [
          createEffectCliSlashCommand({
            name: "helper-cmd",
            description: "Helper command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
        ]
      );

      expect(kit.id).toBe("helperkit");
      expect(kit.name).toBe("Helper Kit");
      expect(kit.description).toBe("Kit created with helper");
      expect(kit.version).toBe("2.0.0");
      expect(kit.commands.length).toBe(1);
      expect(kit.commands[0]?.name).toBe("helper-cmd");
    });

    it("should work with kit created via createKit", async () => {
      const customKit = createKit("custom", "Custom", "1.0.0", "Custom kit", [
        createEffectCliSlashCommand({
          name: "custom-cmd",
          description: "Custom",
          effect: () => Effect.succeed({ kind: "continue" } as const),
        }),
      ]);

      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(customKit);
        yield* registry.enable("custom");

        const enabled = yield* registry.isEnabled("custom");
        const kit = yield* registry.getKit("custom");
        const globalRegistry = getGlobalSlashCommandRegistry();
        const hasCommand = globalRegistry.lookup.has("custom-cmd");

        return { enabled, kitId: kit.id, hasCommand };
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result.enabled).toBe(true);
      expect(result.kitId).toBe("custom");
      expect(result.hasCommand).toBe(true);
    });
  });
});
