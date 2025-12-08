import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { Console, Effect } from "effect";
import { SEPARATOR_WIDTH } from "../constants";

/**
 * Check if this is the first run (no config file exists)
 *
 * @returns Effect that resolves to true if config file doesn't exist
 */
function isFirstRun(): Effect.Effect<boolean> {
  return Effect.gen(function* () {
    const configPath = path.join(os.homedir(), ".effect-cli-tui", "kits.json");
    const exists = yield* Effect.either(
      Effect.tryPromise({
        try: () => fs.access(configPath),
        catch: () => new Error("File not found"),
      })
    );
    return exists._tag === "Left";
  });
}

/**
 * Show onboarding banner on first run
 *
 * @returns Effect that displays onboarding message if first run
 */
export function showOnboardingIfNeeded(): Effect.Effect<void> {
  return Effect.gen(function* () {
    const firstRun = yield* isFirstRun();
    if (!firstRun) {
      return;
    }

    yield* Console.log(`\n${"=".repeat(SEPARATOR_WIDTH)}`);
    yield* Console.log("🚀 Welcome to Effect CLI TUI!");
    yield* Console.log("=".repeat(SEPARATOR_WIDTH));
    yield* Console.log("\nThis is your first time using effect-cli-tui.");
    yield* Console.log("\nQuick Start:");
    yield* Console.log("  • Use /help to see all available commands");
    yield* Console.log("  • Use /status to view your current workspace state");
    yield* Console.log("  • Use /config to view and manage configuration");
    yield* Console.log("  • Use /mode to switch between operational modes");
    yield* Console.log(
      "\nTip: Enable kits (like MemKit) to extend functionality"
    );
    yield* Console.log(`${"=".repeat(SEPARATOR_WIDTH)}\n`);
  });
}
