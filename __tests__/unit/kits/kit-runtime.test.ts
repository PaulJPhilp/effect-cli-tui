import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const CONFIG_DIR_NAME = ".effect-cli-tui";
const CONFIG_FILE_NAME = "kits.json";

function getConfigPath(): string {
  return path.join(os.homedir(), CONFIG_DIR_NAME, CONFIG_FILE_NAME);
}

import {
  createKit,
  disableKit,
  enableKit,
  type Kit,
  withKit,
  withKits,
} from "@kits";
import { KitRegistryService } from "@kits/registry";
import {
  createEffectCliSlashCommand,
  getGlobalSlashCommandRegistry,
} from "@/tui-slash-commands";

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

describe("Kit Runtime Helpers", () => {
  beforeEach(async () => {
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
  describe("withKit", () => {
    it("should enable kit for duration of effect", async () => {
      const program = Effect.gen(function* () {
        // Check command is not in registry initially
        const beforeRegistry = getGlobalSlashCommandRegistry();
        const hasBefore = beforeRegistry.lookup.has("test-command");

        // Run effect with kit enabled
        const result = yield* withKit(
          testKit,
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            const hasDuring = registry.lookup.has("test-command");
            return hasDuring;
          })
        );

        // Check command is removed after effect
        const afterRegistry = getGlobalSlashCommandRegistry();
        const hasAfter = afterRegistry.lookup.has("test-command");

        return { hasBefore, result, hasAfter };
      });

      const result = await Effect.runPromise(program);
      expect(result.hasBefore).toBe(false);
      expect(result.result).toBe(true);
      expect(result.hasAfter).toBe(false);
    });

    it("should return effect result", async () => {
      const program = withKit(testKit, Effect.succeed("test-result"));

      const result = await Effect.runPromise(program);
      expect(result).toBe("test-result");
    });
  });

  describe("withKits", () => {
    it("should enable multiple kits for duration of effect", async () => {
      const program = Effect.gen(function* () {
        // Run effect with multiple kits enabled
        const result = yield* withKits(
          [testKit, anotherKit],
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            const hasTest = registry.lookup.has("test-command");
            const hasAnother = registry.lookup.has("another-command");
            return { hasTest, hasAnother };
          })
        );

        return result;
      });

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(true);
      expect(result.hasAnother).toBe(true);
    });

    it("should remove all kit commands after effect", async () => {
      const program = Effect.gen(function* () {
        yield* withKits([testKit, anotherKit], Effect.void);

        // Check commands are removed
        const registry = getGlobalSlashCommandRegistry();
        const hasTest = registry.lookup.has("test-command");
        const hasAnother = registry.lookup.has("another-command");
        return { hasTest, hasAnother };
      });

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(false);
      expect(result.hasAnother).toBe(false);
    });
  });

  describe("enableKit", () => {
    it("should enable kit via registry", async () => {
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

        yield* enableKit("testkit");

        const enabled = yield* registry.isEnabled("testkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should fail when enabling unregistered kit", async () => {
      const program = enableKit("nonexistent")
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

  describe("disableKit", () => {
    it("should disable kit via registry", async () => {
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
        yield* registry.enable("testkit");
        yield* disableKit("testkit");

        const enabled = yield* registry.isEnabled("testkit");
        return enabled;
      }).pipe(Effect.provide(KitRegistryService.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should fail when disabling non-enabled kit", async () => {
      const program = Effect.gen(function* () {
        const registry = yield* KitRegistryService;
        yield* registry.register(testKit);
        yield* disableKit("testkit");
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

  describe("Nested withKit", () => {
    it("should handle nested withKit calls", async () => {
      const program = Effect.gen(function* () {
        // Outer withKit sets testKit
        const result = yield* withKit(
          testKit,
          Effect.gen(function* () {
            // Check testKit is available in outer scope
            const outerRegistry = getGlobalSlashCommandRegistry();
            const hasTestOuter = outerRegistry.lookup.has("test-command");

            // Inner withKit replaces registry with anotherKit only
            const innerResult = yield* withKit(
              anotherKit,
              Effect.gen(function* () {
                const registry = getGlobalSlashCommandRegistry();
                // During inner withKit, only anotherKit is available (registry is replaced)
                return {
                  hasTest: registry.lookup.has("test-command"),
                  hasAnother: registry.lookup.has("another-command"),
                };
              })
            );

            // After inner withKit, testKit should be restored
            const restoredRegistry = getGlobalSlashCommandRegistry();
            return {
              hasTestOuter,
              inner: innerResult,
              hasTestRestored: restoredRegistry.lookup.has("test-command"),
              hasAnotherRestored:
                restoredRegistry.lookup.has("another-command"),
            };
          })
        );

        // After outer withKit completes, both should be removed
        const registry = getGlobalSlashCommandRegistry();
        return {
          ...result,
          hasTestAfter: registry.lookup.has("test-command"),
          hasAnotherAfter: registry.lookup.has("another-command"),
        };
      });

      const result = await Effect.runPromise(program);
      expect(result.hasTestOuter).toBe(true);
      // During inner withKit, only anotherKit is available (withKit replaces entire registry)
      expect(result.inner.hasTest).toBe(false);
      expect(result.inner.hasAnother).toBe(true);
      // After inner withKit, testKit is restored
      expect(result.hasTestRestored).toBe(true);
      expect(result.hasAnotherRestored).toBe(false);
      // After outer withKit, both are gone
      expect(result.hasTestAfter).toBe(false);
      expect(result.hasAnotherAfter).toBe(false);
    });

    it("should restore previous state after nested withKit", async () => {
      const program = Effect.gen(function* () {
        // Enable testKit in outer scope
        const innerResult = yield* withKit(
          testKit,
          Effect.gen(function* () {
            // Check testKit is available in outer scope
            const outerRegistry = getGlobalSlashCommandRegistry();
            const hasTestOuter = outerRegistry.lookup.has("test-command");

            // Enable anotherKit in inner scope (replaces registry with just anotherKit commands)
            const nestedResult = yield* withKit(
              anotherKit,
              Effect.gen(function* () {
                const registry = getGlobalSlashCommandRegistry();
                // During inner withKit, only anotherKit commands are available
                const hasTest = registry.lookup.has("test-command");
                const hasAnother = registry.lookup.has("another-command");
                return { hasTest, hasAnother };
              })
            );

            // After inner withKit completes, testKit should be restored (outer scope)
            const registry = getGlobalSlashCommandRegistry();
            return {
              hasTestOuter,
              nested: nestedResult,
              hasTest: registry.lookup.has("test-command"),
              hasAnother: registry.lookup.has("another-command"),
            };
          })
        );

        // After outer withKit, both should be gone
        const registry = getGlobalSlashCommandRegistry();
        return {
          ...innerResult,
          hasTestAfter: registry.lookup.has("test-command"),
          hasAnotherAfter: registry.lookup.has("another-command"),
        };
      });

      const result = await Effect.runPromise(program);
      expect(result.hasTestOuter).toBe(true);
      // During inner withKit, only anotherKit is available (withKit replaces entire registry)
      expect(result.nested.hasTest).toBe(false);
      expect(result.nested.hasAnother).toBe(true);
      // After inner withKit, testKit is restored
      expect(result.hasTest).toBe(true);
      expect(result.hasAnother).toBe(false);
      // After outer withKit, both are gone
      expect(result.hasTestAfter).toBe(false);
      expect(result.hasAnotherAfter).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should restore state even if effect fails", async () => {
      const failingEffect = Effect.gen(function* () {
        const registry = getGlobalSlashCommandRegistry();
        const hasCommand = registry.lookup.has("test-command");
        if (!hasCommand) {
          return Effect.fail(new Error("Command not found"));
        }
        return Effect.fail(new Error("Intentional failure"));
      });

      const program = withKit(testKit, failingEffect).pipe(
        Effect.catchAll(() => Effect.succeed(undefined))
      );

      await Effect.runPromise(program);

      // Verify state was restored
      const registry = getGlobalSlashCommandRegistry();
      expect(registry.lookup.has("test-command")).toBe(false);
    });

    it("should propagate errors from nested effects", async () => {
      const program = withKit(
        testKit,
        Effect.gen(function* () {
          yield* Effect.fail(new Error("Test error"));
        })
      ).pipe(
        Effect.catchAll((error) => {
          expect(error.message).toBe("Test error");
          return Effect.succeed("caught");
        })
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("caught");
    });
  });

  describe("Empty Kits", () => {
    it("should handle kit with no commands in withKit", async () => {
      const emptyKit: Kit = createKit(
        "emptykit",
        "Empty Kit",
        "Kit with no commands",
        "1.0.0",
        []
      );

      const program = withKit(emptyKit, Effect.succeed("success"));

      const result = await Effect.runPromise(program);
      expect(result).toBe("success");
    });

    it("should handle empty array in withKits", async () => {
      const program = withKits([], Effect.succeed("success"));

      const result = await Effect.runPromise(program);
      expect(result).toBe("success");
    });
  });

  describe("Command Isolation", () => {
    it("should isolate commands between different withKit calls", async () => {
      const program = Effect.gen(function* () {
        // First withKit
        yield* withKit(testKit, Effect.void);

        // Second withKit with different kit
        const result = yield* withKit(
          anotherKit,
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            return {
              hasTest: registry.lookup.has("test-command"),
              hasAnother: registry.lookup.has("another-command"),
            };
          })
        );

        return result;
      });

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(false);
      expect(result.hasAnother).toBe(true);
    });

    it("should combine commands from multiple kits in withKits", async () => {
      const thirdKit: Kit = createKit(
        "thirdkit",
        "Third Kit",
        "Third test kit",
        "1.0.0",
        [
          createEffectCliSlashCommand({
            name: "third-command",
            description: "Third command",
            effect: () => Effect.succeed({ kind: "continue" } as const),
          }),
        ]
      );

      const program = withKits(
        [testKit, anotherKit, thirdKit],
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          return {
            hasTest: registry.lookup.has("test-command"),
            hasAnother: registry.lookup.has("another-command"),
            hasThird: registry.lookup.has("third-command"),
          };
        })
      );

      const result = await Effect.runPromise(program);
      expect(result.hasTest).toBe(true);
      expect(result.hasAnother).toBe(true);
      expect(result.hasThird).toBe(true);
    });
  });
});
