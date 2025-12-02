import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { Console, Effect } from "effect";
import { KitRegistryService } from "./kits/registry";
import { ToolCallLogService } from "./services/logs";
import { ModeService } from "./services/mode";
import {
  getSessionHistory,
  type SlashCommandContext,
  type SlashCommandResult,
} from "./tui-slash-commands";
import type { TUIError } from "./types";
import { getCurrentBranch, getGitRoot, getStatusSummary } from "./utils/git";

/**
 * Agent harness slash commands
 *
 * These commands provide agent harness features:
 * - /status: Context visualization
 * - /mode: Mode management
 * - /config: Configuration display
 * - /tool-history: Tool call history
 */
export const AGENT_HARNESS_SLASH_COMMANDS = [
  {
    name: "status",
    description: "Show current workspace, active kits, mode, and session info",
    run: (
      context: SlashCommandContext
    ): Effect.Effect<
      SlashCommandResult,
      TUIError,
      KitRegistryService | ModeService
    > =>
      Effect.gen(function* () {
        const kitRegistry = yield* KitRegistryService;
        const modeService = yield* ModeService;

        yield* Console.log("\n" + "=".repeat(60));
        yield* Console.log("Status");
        yield* Console.log("=".repeat(60));

        // Workspace info
        const cwd = process.cwd();
        yield* Console.log(`\nWorkspace: ${cwd}`);

        // Git info
        const gitRoot = yield* getGitRoot();
        if (gitRoot) {
          const branch = yield* getCurrentBranch();
          yield* Console.log(`Git Root: ${gitRoot}`);
          if (branch) {
            yield* Console.log(`Branch: ${branch}`);
          }
          const status = yield* getStatusSummary();
          if (status) {
            yield* Console.log(
              `Status: ${status.split("\n").length} file(s) changed`
            );
          }
        } else {
          yield* Console.log("Git: Not in a git repository");
        }

        // Mode
        const mode = yield* modeService.getMode;
        yield* Console.log(`\nMode: ${mode}`);

        // Enabled kits
        const enabledKits = yield* kitRegistry.listEnabled();
        yield* Console.log(`\nEnabled Kits: ${enabledKits.length}`);
        for (const kit of enabledKits) {
          yield* Console.log(`  - ${kit.id} (${kit.name}) v${kit.version}`);
        }

        // Session history
        const sessionHistory = getSessionHistory();
        const historyEntries = sessionHistory.getAll();
        yield* Console.log(
          `\nSession History: ${historyEntries.length} prompt(s)`
        );

        yield* Console.log("\n" + "=".repeat(60) + "\n");

        return { kind: "continue" } as const;
      }),
  },
  {
    name: "mode",
    description: "Show or set the current operational mode",
    getCompletions: () => ["default", "architect", "executor", "explorer"],
    run: (
      context: SlashCommandContext
    ): Effect.Effect<SlashCommandResult, TUIError, ModeService> =>
      Effect.gen(function* () {
        const modeService = yield* ModeService;

        if (context.args.length === 0) {
          // Show current mode and list available modes
          const currentMode = yield* modeService.getMode;
          const availableModes = yield* modeService.listModes;

          yield* Console.log("\n" + "=".repeat(60));
          yield* Console.log("Mode Management");
          yield* Console.log("=".repeat(60));
          yield* Console.log(`\nCurrent Mode: ${currentMode}`);
          yield* Console.log("\nAvailable Modes:");
          for (const mode of availableModes) {
            const marker = mode === currentMode ? " (current)" : "";
            yield* Console.log(`  - ${mode}${marker}`);
          }
          yield* Console.log("\n" + "=".repeat(60) + "\n");
        } else {
          // Set mode
          const requestedMode = context.args[0]!.toLowerCase() as
            | "default"
            | "architect"
            | "executor"
            | "explorer";
          const availableModes = yield* modeService.listModes;

          if (!availableModes.includes(requestedMode)) {
            yield* Console.log(`\nError: Invalid mode "${requestedMode}"`);
            yield* Console.log(
              `Available modes: ${availableModes.join(", ")}\n`
            );
            return { kind: "continue" } as const;
          }

          yield* modeService.setMode(requestedMode);
          yield* Console.log(`\nMode set to: ${requestedMode}\n`);
        }

        return { kind: "continue" } as const;
      }),
  },
  {
    name: "config",
    description: "Show current configuration (kits, mode, settings)",
    run: (
      context: SlashCommandContext
    ): Effect.Effect<
      SlashCommandResult,
      TUIError,
      KitRegistryService | ModeService
    > =>
      Effect.gen(function* () {
        const kitRegistry = yield* KitRegistryService;
        const modeService = yield* ModeService;

        yield* Console.log("\n" + "=".repeat(60));
        yield* Console.log("Configuration");
        yield* Console.log("=".repeat(60));

        // Mode
        const mode = yield* modeService.getMode;
        yield* Console.log(`\nMode: ${mode}`);

        // Enabled kits
        const enabledKits = yield* kitRegistry.listEnabled();
        yield* Console.log(`\nEnabled Kits (${enabledKits.length}):`);
        if (enabledKits.length === 0) {
          yield* Console.log("  (none)");
        } else {
          for (const kit of enabledKits) {
            yield* Console.log(`  - ${kit.id}: ${kit.name} v${kit.version}`);
            if (kit.description) {
              yield* Console.log(`    ${kit.description}`);
            }
          }
        }

        // Available kits
        const availableKits = yield* kitRegistry.listAvailable();
        yield* Console.log(`\nAvailable Kits (${availableKits.length}):`);
        if (availableKits.length === 0) {
          yield* Console.log("  (none)");
        } else {
          for (const kit of availableKits) {
            const isEnabled = enabledKits.some((k) => k.id === kit.id);
            const status = isEnabled ? "[enabled]" : "[disabled]";
            yield* Console.log(
              `  ${status} ${kit.id}: ${kit.name} v${kit.version}`
            );
          }
        }

        // Config file path
        const configDir = path.join(os.homedir(), ".effect-cli-tui");
        const configPath = path.join(configDir, "kits.json");
        yield* Console.log(`\nConfig File: ${configPath}`);

        // Check if config file exists
        const configExists = yield* Effect.either(
          Effect.tryPromise({
            try: () => fs.access(configPath),
            catch: () => new Error("File not found"),
          })
        );
        if (configExists._tag === "Left") {
          yield* Console.log("  (config file does not exist - using defaults)");
        }

        yield* Console.log("\n" + "=".repeat(60) + "\n");

        return { kind: "continue" } as const;
      }),
  },
  {
    name: "tool-history",
    description: "Show recent tool call and command execution history",
    aliases: ["tool-log", "tools"],
    run: (
      context: SlashCommandContext
    ): Effect.Effect<SlashCommandResult, TUIError, ToolCallLogService> =>
      Effect.gen(function* () {
        const toolLog = yield* ToolCallLogService;

        const limit = context.args[0]
          ? Number.parseInt(context.args[0]!, 10) || 20
          : 20;

        const entries = yield* toolLog.getRecent(limit);

        if (entries.length === 0) {
          yield* Console.log("\nNo tool call history available.\n");
          return { kind: "continue" } as const;
        }

        yield* Console.log("\n" + "=".repeat(60));
        yield* Console.log(
          `Tool Call History (last ${entries.length} entries)`
        );
        yield* Console.log("=".repeat(60) + "\n");

        for (const [index, entry] of entries.entries()) {
          const time = new Date(entry.timestamp).toLocaleTimeString();
          const argsStr =
            entry.args.length > 0 ? ` ${entry.args.join(" ")}` : "";
          yield* Console.log(
            `  ${index + 1}. [${time}] ${entry.commandName}${argsStr}`
          );
          if (entry.resultSummary) {
            yield* Console.log(`      → ${entry.resultSummary}`);
          }
        }

        yield* Console.log("\n" + "=".repeat(60) + "\n");

        return { kind: "continue" } as const;
      }),
  },
] as const;
