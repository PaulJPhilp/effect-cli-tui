import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { Data, Effect } from "effect";

export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly message: string;
}> {}

export interface SupermemoryTuiConfig {
  readonly apiKey: string | null;
}

export class SupermemoryTuiConfigService extends Effect.Service<SupermemoryTuiConfigService>()(
  "SupermemoryTuiConfig",
  {
    sync: (): SupermemoryTuiConfig => ({ apiKey: null }),
  }
) {}

const CONFIG_FILE_NAME = ".effect-supermemory.json";
const DEFAULT_CONFIG: SupermemoryTuiConfig = {
  apiKey: null,
};

function getConfigPath(): string {
  return path.join(os.homedir(), CONFIG_FILE_NAME);
}

export function loadConfig(): Effect.Effect<SupermemoryTuiConfig, ConfigError> {
  return Effect.gen(function* () {
    const configPath = getConfigPath();

    // Try to read from config file first
    const fileCheckResult = yield* Effect.either(
      Effect.tryPromise({
        try: () => fs.access(configPath),
        catch: () => new Error("File not found"),
      })
    );

    if (fileCheckResult._tag === "Left") {
      // Fall back to environment variable if no config file exists
      const envApiKey = process.env.SUPERMEMORY_API_KEY;
      return {
        apiKey: envApiKey ?? null,
      };
    }

    const content = yield* Effect.tryPromise({
      try: () => fs.readFile(configPath, "utf-8"),
      catch: (error) =>
        new ConfigError({
          message: `Failed to read config file: ${String(error)}`,
        }),
    });

    const config = yield* Effect.try({
      try: () => JSON.parse(content) as SupermemoryTuiConfig,
      catch: (error) =>
        new ConfigError({
          message: `Invalid JSON in config file: ${String(error)}`,
        }),
    });

    // Validate config shape
    if (typeof config.apiKey !== "string" && config.apiKey !== null) {
      return DEFAULT_CONFIG;
    }

    return config;
  });
}

export function saveConfig(
  config: SupermemoryTuiConfig
): Effect.Effect<void, ConfigError> {
  return Effect.gen(function* () {
    const configPath = getConfigPath();
    const content = JSON.stringify(config, null, 2);

    yield* Effect.tryPromise({
      try: () => fs.writeFile(configPath, content, "utf-8"),
      catch: (error) =>
        new ConfigError({
          message: `Failed to write config file: ${String(error)}`,
        }),
    });
  });
}

export function updateApiKey(
  apiKey: string | null
): Effect.Effect<void, ConfigError> {
  return Effect.gen(function* () {
    const currentConfig = yield* loadConfig();
    const updatedConfig = { ...currentConfig, apiKey };
    yield* saveConfig(updatedConfig);
  });
}
