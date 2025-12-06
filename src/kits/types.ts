import { Data, type Effect } from "effect";

import type { SlashCommandDefinition } from "@/tui-slash-commands";

/**
 * Kit definition - a named, versioned collection of slash commands
 */
export interface Kit {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly commands: readonly SlashCommandDefinition[];
}

/**
 * Kit registry interface - methods for managing kits
 */
export interface KitRegistry {
  /**
   * Register a kit (does not enable it)
   */
  readonly register: (kit: Kit) => Effect.Effect<void, KitError>;

  /**
   * Enable a kit (adds commands to slash command registry)
   */
  readonly enable: (kitId: string) => Effect.Effect<void, KitError>;

  /**
   * Disable a kit (removes commands)
   */
  readonly disable: (kitId: string) => Effect.Effect<void, KitError>;

  /**
   * List all registered kits
   */
  readonly listAvailable: () => Effect.Effect<readonly Kit[]>;

  /**
   * List currently enabled kits
   */
  readonly listEnabled: () => Effect.Effect<readonly Kit[]>;

  /**
   * Check if a kit is enabled
   */
  readonly isEnabled: (kitId: string) => Effect.Effect<boolean>;

  /**
   * Get kit by ID
   */
  readonly getKit: (kitId: string) => Effect.Effect<Kit, KitError>;
}

/**
 * Kit configuration - persisted config structure with enabled kit IDs
 */
export interface KitConfig {
  readonly enabledKits: readonly string[];
}

/**
 * Kit error types
 */

export class KitError extends Data.TaggedError("KitError")<{
  readonly reason:
    | "KitNotFound"
    | "KitAlreadyEnabled"
    | "KitNotEnabled"
    | "KitAlreadyRegistered"
    | "ConfigError";
  readonly message: string;
}> {}
