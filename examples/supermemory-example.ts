#!/usr/bin/env bun
/**
 * Supermemory Integration Example
 *
 * This example demonstrates how to use the Supermemory integration
 * with effect-cli-tui to store and search memories interactively.
 */

import { Console, Effect } from "effect";
import { runWithTUI, TUIHandler } from "effect-cli-tui";
import { SupermemoryClientService, withSupermemory } from "../src/supermemory";

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler;
  const supermemory = yield* SupermemoryClientService;

  yield* tui.display("🧠 Supermemory Integration Demo", "info");
  yield* tui.display("Try these slash commands:", "info");
  yield* tui.display("  /supermemory api-key sk_your_api_key", "info");
  yield* tui.display(
    "  /supermemory add Remember to review the quarterly report",
    "info"
  );
  yield* tui.display("  /supermemory search quarterly report", "info");
  yield* tui.display("");

  // Interactive loop
  while (true) {
    const action = yield* tui.selectOption("What would you like to do?", [
      "Add a memory",
      "Search memories",
      "Test direct API",
      "Exit",
    ]);

    switch (action) {
      case "Add a memory": {
        const memory = yield* tui.prompt("What do you want to remember?");
        yield* supermemory.addText(memory);
        yield* tui.display("✅ Memory added successfully!", "success");
        break;
      }

      case "Search memories": {
        yield* handleSearch(tui, supermemory);
        break;
      }

      case "Test direct API": {
        yield* handleTestApi(tui, supermemory);
        break;
      }

      case "Exit":
        yield* tui.display("👋 Goodbye!", "success");
        return;

      default:
        break;
    }

    yield* tui.display("");
  }
});

const handleSearch = (tui: TUIHandler, supermemory: SupermemoryClient) =>
  Effect.gen(function* () {
    const query = yield* tui.prompt("Search for:");
    const memories = yield* supermemory.search(query, { topK: 5 });

    if (memories.length === 0) {
      yield* tui.display("No memories found matching your query.", "warning");
    } else {
      yield* tui.display(`Found ${memories.length} memories:`, "success");
      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        const score = memory.score ? (memory.score * 100).toFixed(1) : "N/A";
        const snippet =
          memory.content.length > 80
            ? `${memory.content.slice(0, 80)}...`
            : memory.content;

        yield* tui.display(
          `  ${i + 1}. "${snippet}" (score: ${score})`,
          "info"
        );
      }
    }
  });

const handleTestApi = (tui: TUIHandler, supermemory: SupermemoryClient) =>
  Effect.gen(function* () {
    yield* tui.display("Testing direct Supermemory API...", "info");
    yield* supermemory.addText("Test memory from effect-cli-tui example");
    const testMemories = yield* supermemory.search("test memory", {
      topK: 3,
    });
    yield* tui.display(
      `✅ API test complete. Found ${testMemories.length} test memories.`,
      "success"
    );
  });

// Run with Supermemory integration
console.log("🚀 Starting Supermemory Integration Example...\n");

await runWithTUI(withSupermemory(program)).catch((error) => {
  Console.error(`Error: ${error.message}`);
  process.exit(1);
});
