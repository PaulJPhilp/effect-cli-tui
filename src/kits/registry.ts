/** biome-ignore-all assist/source/organizeImports: <> */
import { Effect } from "effect";
import {
  DEFAULT_SLASH_COMMANDS,
  setGlobalSlashCommandRegistry,
  type SlashCommandDefinition,
} from "../tui-slash-commands";
import { loadKitConfig, saveKitConfig } from "./config";
import { KitError, type Kit, type KitRegistry } from "./types";

/**
 * Kit Registry Service
 *
 * Manages kit registration, enablement, and discovery.
 * Uses the existing slash command registry system to enable/disable kits.
 */
export class KitRegistryService extends Effect.Service<KitRegistryService>()(
  "app/KitRegistryService",
  {
    effect: Effect.gen(function* () {
      // Internal state: registered kits and enabled kit IDs
      const registeredKits = new Map<string, Kit>();
      const enabledKitIds = new Set<string>();

      // Load enabled kits from config on initialization
      const config = yield* loadKitConfig();
      for (const kitId of config.enabledKits) {
        enabledKitIds.add(kitId);
      }

      // Helper to get all currently active commands (default + enabled kits)
      const getActiveCommands = (): readonly SlashCommandDefinition[] => {
        const kitCommands: SlashCommandDefinition[] = [];
        for (const kitId of enabledKitIds) {
          const kit = registeredKits.get(kitId);
          if (kit) {
            kitCommands.push(...kit.commands);
          }
        }
        return [...DEFAULT_SLASH_COMMANDS, ...kitCommands];
      };

      // Initialize global registry with default commands + enabled kits from config
      const initialCommands = getActiveCommands();
      setGlobalSlashCommandRegistry(initialCommands);

      return {
        /**
         * Register a kit (does not enable it, unless it was previously enabled in config)
         */
        register: (kit: Kit): Effect.Effect<void, KitError> =>
          Effect.gen(function* () {
            if (registeredKits.has(kit.id)) {
              yield* Effect.fail(
                new KitError({
                  reason: "KitAlreadyRegistered",
                  message: `Kit with id "${kit.id}" is already registered`,
                })
              );
            }
            registeredKits.set(kit.id, kit);

            // If this kit was enabled in config, enable it now that it's registered
            if (enabledKitIds.has(kit.id)) {
              // Update global slash command registry to include this kit's commands
              const activeCommands = getActiveCommands();
              setGlobalSlashCommandRegistry(activeCommands);
            }
          }),

        /**
         * Enable a kit (adds commands to slash command registry)
         */
        enable: (kitId: string): Effect.Effect<void, KitError> =>
          Effect.gen(function* () {
            const kit = registeredKits.get(kitId);
            if (!kit) {
              yield* Effect.fail(
                new KitError({
                  reason: "KitNotFound",
                  message: `Kit with id "${kitId}" is not registered`,
                })
              );
            }

            if (enabledKitIds.has(kitId)) {
              yield* Effect.fail(
                new KitError({
                  reason: "KitAlreadyEnabled",
                  message: `Kit with id "${kitId}" is already enabled`,
                })
              );
            }

            enabledKitIds.add(kitId);

            // Update global slash command registry
            const activeCommands = getActiveCommands();
            setGlobalSlashCommandRegistry(activeCommands);

            // Persist to config
            const _config = yield* loadKitConfig().pipe(
              Effect.mapError(
                (err) =>
                  new KitError({
                    reason: "ConfigError",
                    message: err.message,
                  })
              )
            );
            const updatedConfig = {
              enabledKits: Array.from(enabledKitIds),
            };
            yield* saveKitConfig(updatedConfig).pipe(
              Effect.mapError(
                (err) =>
                  new KitError({
                    reason: "ConfigError",
                    message: err.message,
                  })
              )
            );
          }),

        /**
         * Disable a kit (removes commands)
         */
        disable: (kitId: string): Effect.Effect<void, KitError> =>
          Effect.gen(function* () {
            if (!enabledKitIds.has(kitId)) {
              yield* Effect.fail(
                new KitError({
                  reason: "KitNotEnabled",
                  message: `Kit with id "${kitId}" is not enabled`,
                })
              );
            }

            enabledKitIds.delete(kitId);

            // Update global slash command registry
            const activeCommands = getActiveCommands();
            setGlobalSlashCommandRegistry(activeCommands);

            // Persist to config
            const updatedConfig = {
              enabledKits: Array.from(enabledKitIds),
            };
            yield* saveKitConfig(updatedConfig).pipe(
              Effect.mapError(
                (err) =>
                  new KitError({
                    reason: "ConfigError",
                    message: err.message,
                  })
              )
            );
          }),

        /**
         * List all registered kits
         */
        listAvailable: (): Effect.Effect<readonly Kit[]> =>
          Effect.sync(() => Array.from(registeredKits.values())),

        /**
         * List currently enabled kits
         */
        listEnabled: (): Effect.Effect<readonly Kit[]> =>
          Effect.sync(() => {
            const enabled: Kit[] = [];
            for (const kitId of enabledKitIds) {
              const kit = registeredKits.get(kitId);
              if (kit) {
                enabled.push(kit);
              }
            }
            return enabled;
          }),

        /**
         * Check if a kit is enabled
         */
        isEnabled: (kitId: string): Effect.Effect<boolean> =>
          Effect.sync(() => enabledKitIds.has(kitId)),

        /**
         * Get kit by ID
         */
        getKit: (kitId: string): Effect.Effect<Kit, KitError> =>
          Effect.gen(function* () {
            const kit = registeredKits.get(kitId);
            if (!kit) {
              return yield* Effect.fail(
                new KitError({
                  reason: "KitNotFound",
                  message: `Kit with id "${kitId}" is not registered`,
                })
              );
            }
            return kit;
          }),
      } as const satisfies KitRegistry;
    }),
    dependencies: [],
  }
) {}
