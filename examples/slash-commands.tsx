/**
 * Slash commands example
 *
 * Demonstrates how to configure global "/" commands that work with TUIHandler
 * prompts, including integration with EffectCLI.
 *
 * Shows slash command support across all interactive methods:
 * - prompt() - Type /help, /clear, /history, /quit directly
 * - selectOption() - Include slash commands as selectable options
 * - multiSelect() - If any selected option starts with "/", it's intercepted
 * - password() - Type slash commands (passwords are masked in /history)
 *
 * Built-in Commands:
 * - /help - Show available commands
 * - /quit or /exit - Exit the session
 * - /clear or /cls - Clear terminal screen
 * - /history or /h - Show session history
 * - /save - Save session history to file
 * - /load - Load previous session from file
 *
 * Run with: bun run examples/slash-commands.tsx
 */

import { Effect } from "effect";
import {
  configureDefaultSlashCommands,
  createEffectCliSlashCommand,
  DEFAULT_SLASH_COMMANDS,
  EffectCLI,
  TUIHandler,
} from "../src";
import { EffectCLITUILayer } from "../src/runtime";

const slashCommands = [
  ...DEFAULT_SLASH_COMMANDS,
  createEffectCliSlashCommand({
    name: "deploy",
    description: "Simulate a deploy command using EffectCLI",
    effect: () =>
      Effect.gen(function* () {
        const cli = yield* EffectCLI;
        const result = yield* cli.run("echo", ["Deploying application..."]);
        console.log(result.stdout.trim());
        return { kind: "continue" } as const;
      }),
  }),
] as const;

configureDefaultSlashCommands(slashCommands);

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler;

  console.log(
    "\n=== Slash Commands Demo ===\n" +
      "Try these commands at any prompt:\n" +
      "  /help - Show all available commands\n" +
      "  /history - View session history\n" +
      "  /clear - Clear the screen\n" +
      "  /save - Save session to file\n" +
      "  /load - Load previous session\n" +
      "  /deploy - Custom deploy command\n" +
      "  /quit - Exit the session\n"
  );

  // Example 1: Slash commands in prompt()
  console.log("\n--- Example 1: prompt() ---");
  const name = yield* tui.prompt("Enter your name (try /help or /history):");
  yield* tui.display(`Hello, ${name}!`, "success");

  // Example 2: Slash commands in selectOption()
  console.log("\n--- Example 2: selectOption() ---");
  const template = yield* tui.selectOption("Choose template:", [
    "Basic",
    "CLI",
    "Full Stack",
    "/help", // User can select this to see help
    "/history", // User can select this to see history
    "/quit", // User can select this to exit
  ]);
  yield* tui.display(`Selected template: ${template}`, "info");

  // Example 3: Slash commands in multiSelect()
  console.log("\n--- Example 3: multiSelect() ---");
  const features = yield* tui.multiSelect("Choose features:", [
    "Testing",
    "Linting",
    "TypeScript",
    "ESM Support",
    "/help", // If selected, will trigger help command
  ]);
  yield* tui.display(`Selected features: ${features.join(", ")}`, "info");

  // Example 4: Slash commands in password()
  console.log("\n--- Example 4: password() ---");
  const _password = yield* tui.password("Enter password (try /history after):");
  yield* tui.display("Password entered successfully!", "success");
  console.log("Note: Passwords are masked as ******** in /history output");

  yield* tui.display(
    "\n=== Demo Complete ===\nTry /save to save this session!",
    "success"
  );
}).pipe(Effect.provide(EffectCLITUILayer));

export const main = () => Effect.runPromise(program);

if (import.meta.main) {
  main().catch((error) => {
    console.error("Slash commands example error:", error);
    process.exit(1);
  });
}
