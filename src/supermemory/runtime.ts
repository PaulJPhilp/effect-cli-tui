import { Effect } from "effect";

import { withSlashCommands } from "@/tui-slash-commands";
import {
  type MissingSupermemoryApiKey,
  SupermemoryClientService,
  type SupermemoryError,
} from "./client";
import type { ConfigError } from "./config";
import { SUPERMEMORY_SLASH_COMMANDS } from "./slash-commands";

/**
 * Effect that provides Supermemory functionality with slash commands
 */
export const withSupermemory = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<
  A,
  E | SupermemoryError | MissingSupermemoryApiKey | ConfigError,
  R
> =>
  withSlashCommands(
    SUPERMEMORY_SLASH_COMMANDS,
    effect.pipe(Effect.provide(SupermemoryClientService.Default))
  );
