import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { Data, Effect } from "effect";
import type { KitConfig } from "./types";

export class KitConfigError extends Data.TaggedError("KitConfigError")<{
  readonly message: string;
}> {}

const CONFIG_DIR_NAME = ".effect-cli-tui";
const CONFIG_FILE_NAME = "kits.json";
const DEFAULT_CONFIG: KitConfig = {
  enabledKits: [],
};

function getConfigDir(): string {
  return path.join(os.homedir(), CONFIG_DIR_NAME);
}

function getConfigPath(): string {
  return path.join(getConfigDir(), CONFIG_FILE_NAME);
}

/**
 * Load kit configuration from file
 *
 * @returns Effect that resolves with the kit configuration
 */
export function loadKitConfig(): Effect.Effect<KitConfig, KitConfigError> {
  return Effect.gen(function* () {
    const configPath = getConfigPath();

    // Check if config file exists
    const fileCheckResult = yield* Effect.either(
      Effect.tryPromise({
        try: () => fs.access(configPath),
        catch: () => new Error("File not found"),
      })
    );

    if (fileCheckResult._tag === "Left") {
      // Return default config if file doesn't exist
      return DEFAULT_CONFIG;
    }

    const content = yield* Effect.tryPromise({
      try: () => fs.readFile(configPath, "utf-8"),
      catch: (error) =>
        new KitConfigError({
          message: `Failed to read config file: ${String(error)}`,
        }),
    });

    const config = yield* Effect.try({
      try: () => JSON.parse(content) as KitConfig,
      catch: (error) =>
        new KitConfigError({
          message: `Invalid JSON in config file: ${String(error)}`,
        }),
    });

    // Validate config shape
    if (
      !config ||
      typeof config !== "object" ||
      !Array.isArray(config.enabledKits)
    ) {
      return DEFAULT_CONFIG;
    }

    // Ensure all enabledKits are strings
    const enabledKits = config.enabledKits.filter(
      (kitId): kitId is string => typeof kitId === "string"
    );

    return {
      enabledKits,
    };
  });
}

/**
 * Save kit configuration to file
 *
 * @param config - The kit configuration to save
 * @returns Effect that resolves when config is saved
 */
export function saveKitConfig(
  config: KitConfig
): Effect.Effect<void, KitConfigError> {
  return Effect.gen(function* () {
    const configDir = getConfigDir();
    const configPath = getConfigPath();

    // Ensure config directory exists
    yield* Effect.tryPromise({
      try: () => fs.mkdir(configDir, { recursive: true }),
      catch: (error) =>
        new KitConfigError({
          message: `Failed to create config directory: ${String(error)}`,
        }),
    });

    const content = JSON.stringify(config, null, 2);

    yield* Effect.tryPromise({
      try: () => fs.writeFile(configPath, content, "utf-8"),
      catch: (error) =>
        new KitConfigError({
          message: `Failed to write config file: ${String(error)}`,
        }),
    });
  });
}
