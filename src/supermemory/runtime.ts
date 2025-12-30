import { Effect } from "effect";
import { withSlashCommands } from "@/tui-slash-commands";
import { SupermemoryLayer } from "../services/supermemory";
import { SUPERMEMORY_SLASH_COMMANDS } from "./slash-commands";

/**
 * Effect that provides Supermemory functionality with slash commands
 */
export const withSupermemory = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  withSlashCommands(
    SUPERMEMORY_SLASH_COMMANDS,
    effect.pipe(Effect.provide(SupermemoryLayer))
  );
