import { Console, Effect } from "effect";

import {
  createEffectCliSlashCommand,
  type SlashCommandDefinition,
} from "@/tui-slash-commands";
import { TUIError } from "@/types";
import {
  handleAddCommand,
  handleApiKeyCommand,
  handleSearchCommand,
} from "./commands";

/**
 * Supermemory slash commands
 */
export const SUPERMEMORY_SLASH_COMMANDS: readonly SlashCommandDefinition[] = [
  createEffectCliSlashCommand({
    name: "supermemory",
    description: "Supermemory integration commands",
    aliases: ["sm"],
    effect: (context) => {
      // Handle subcommands
      const subcommand = context.args[0]?.toLowerCase();

      switch (subcommand) {
        case "api-key":
          return handleApiKeyCommand(context).pipe(
            Effect.mapError(
              (error) => new TUIError("RenderError", error.message)
            )
          );
        case "add":
          return handleAddCommand(context);
        case "search":
          return handleSearchCommand(context);
        default:
          return Effect.gen(function* () {
            yield* Console.log(
              "[Supermemory] Unknown subcommand. Available commands: api-key, add, search"
            );
            yield* Console.log(
              "[Supermemory] Usage: /supermemory <api-key|add|search> [args...]"
            );
            return { kind: "continue" } as const;
          });
      }
    },
  }),
];
