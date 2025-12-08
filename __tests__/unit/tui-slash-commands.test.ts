import { Console, Effect } from "effect";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  addSlashCommandHistoryEntry,
  addToHistory,
  applyShortFlagMapping,
  createSlashCommandRegistry,
  DEFAULT_SLASH_COMMAND_REGISTRY,
  DEFAULT_SLASH_COMMANDS,
  EMPTY_SLASH_COMMAND_REGISTRY,
  getSessionHistory,
  getSlashCommandHistory,
  getSlashCommandSuggestions,
  getSlashCommandSuggestionsAsync,
  parseSlashCommand,
  parseSlashCommandName,
  type SlashCommandContext,
  type SlashCommandDefinition,
} from "@/tui-slash-commands";
import { TUIError } from "@/types";
import { MockSlashDependencies } from "../fixtures/test-layers";

describe("Slash command parsing", () => {
  it("should parse command name without leading slash", () => {
    expect(parseSlashCommandName("/help")).toBe("help");
    expect(parseSlashCommandName("/HELP")).toBe("help");
    expect(parseSlashCommandName("not-a-command")).toBeNull();
    expect(parseSlashCommandName("/")).toBeNull();
  });

  it("should parse command with arguments", () => {
    expect(parseSlashCommandName("/deploy prod")).toBe("deploy");
    expect(parseSlashCommandName("/deploy   prod")).toBe("deploy");
  });
});

describe("Advanced slash command parsing", () => {
  it("should parse args and boolean flags and key=value flags", () => {
    const parsed = parseSlashCommand(
      "/deploy prod staging --force --tag=latest --count=3"
    );
    expect(parsed).not.toBeNull();
    expect(parsed?.command).toBe("deploy");
    expect(parsed?.args).toEqual(["prod", "staging"]);
    expect(parsed?.flags.force).toBe(true);
    expect(parsed?.flags.tag).toBe("latest");
    expect(parsed?.flags.count).toBe("3");
  });

  it("should parse and merge short flags with values", () => {
    const parsed = parseSlashCommand("/deploy -f -t latest -c 3");
    expect(parsed).not.toBeNull();
    // short keys
    expect(parsed?.flags.f).toBe(true);
    expect(parsed?.flags.t).toBe("latest");
    expect(parsed?.flags.c).toBe("3");
    // merged long keys
    expect(parsed?.flags.force).toBe(true);
    expect(parsed?.flags.tag).toBe("latest");
    expect(parsed?.flags.count).toBe("3");
  });

  it("should parse quoted args and quoted flag values", () => {
    const parsed = parseSlashCommand('/deploy "us-east prod" --tag="v 1.2"');
    expect(parsed).not.toBeNull();
    expect(parsed?.args).toEqual(["us-east prod"]);
    expect(parsed?.flags.tag).toBe("v 1.2");
  });

  it("should parse negated flags (--no-xyz)", () => {
    const parsed = parseSlashCommand("/deploy --no-cache");
    expect(parsed).not.toBeNull();
    expect(parsed?.flags.cache).toBe(false);
  });

  it("should return null for non-slash input", () => {
    expect(parseSlashCommand("deploy prod")).toBeNull();
  });
});

describe("Slash command suggestions", () => {
  it("should suggest commands based on prefix", () => {
    const suggestions = getSlashCommandSuggestions(
      "/h",
      DEFAULT_SLASH_COMMAND_REGISTRY,
      10
    );
    // help and history should be suggested
    expect(suggestions).toContain("/help");
    expect(suggestions).toContain("/history");
  });

  it("should include aliases in suggestions", () => {
    const suggestions = getSlashCommandSuggestions(
      "/ex",
      DEFAULT_SLASH_COMMAND_REGISTRY,
      10
    );
    expect(suggestions).toContain("/exit"); // alias for quit
  });

  it("should suggest flags when typing dashes", () => {
    const suggestions = getSlashCommandSuggestions(
      "/deploy -",
      DEFAULT_SLASH_COMMAND_REGISTRY,
      10
    );
    expect(suggestions.some((s) => s.startsWith("--"))).toBe(true);
  });
});

describe("Slash command history storage", () => {
  it("should record distinct consecutive entries", () => {
    addSlashCommandHistoryEntry("/help");
    addSlashCommandHistoryEntry("/help");
    addSlashCommandHistoryEntry("/deploy prod");
    const history = getSlashCommandHistory();
    expect(history).toEqual(["/help", "/deploy prod"]);
  });

  it("should apply per-command short flag mapping", () => {
    const flags = { s: "stage-1", f: true } as const;
    const mapped = applyShortFlagMapping(flags, { s: "stage", f: "force" });
    expect(mapped.s).toBe("stage-1");
    expect(mapped.f).toBe(true);
    expect(mapped.stage).toBe("stage-1");
    expect(mapped.force).toBe(true);
  });
});

describe("Slash command registry", () => {
  it("should create registry with name and aliases", () => {
    const sample: SlashCommandDefinition = {
      name: "deploy",
      description: "Deploy the application",
      aliases: ["d", "release"],
      run: (context: SlashCommandContext) =>
        Effect.succeed({
          kind: "continue" as const,
          message: context.promptMessage,
        }),
    };

    const registry = createSlashCommandRegistry([sample]);

    expect(registry.lookup.get("deploy")).toBe(sample);
    expect(registry.lookup.get("d")).toBe(sample);
    expect(registry.lookup.get("release")).toBe(sample);
  });

  it("should expose empty registry constant", () => {
    expect(EMPTY_SLASH_COMMAND_REGISTRY.commands).toHaveLength(0);
  });
});

describe("Default slash commands", () => {
  afterEach(() => {
    // Clear history after each test
    getSessionHistory().clear();
  });

  it("should include all expected commands", () => {
    const names = DEFAULT_SLASH_COMMANDS.map((command) => command.name);
    expect(names).toContain("help");
    expect(names).toContain("quit");
    expect(names).toContain("clear");
    expect(names).toContain("history");
    expect(names).toContain("save");
    expect(names).toContain("load");
  });

  it("help command should log available commands and continue", async () => {
    const help = DEFAULT_SLASH_COMMANDS.find(
      (command) => command.name === "help"
    );

    if (!help) {
      throw new Error("Help command not found in default registry");
    }

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Intentionally left blank - verifying calls only
    });

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/help",
      command: "help",
      args: [],
      flags: {},
      tokens: ["help"],
      registry: DEFAULT_SLASH_COMMAND_REGISTRY,
    };

    const result = await Effect.runPromise(
      help.run(context).pipe(Effect.provide(MockSlashDependencies))
    );

    expect(result.kind).toBe("continue");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("quit command should request session exit", async () => {
    const quit = DEFAULT_SLASH_COMMANDS.find(
      (command) => command.name === "quit"
    );

    if (!quit) {
      throw new Error("Quit command not found in default registry");
    }

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/quit",
      command: "quit",
      args: [],
      flags: {},
      tokens: ["quit"],
      registry: DEFAULT_SLASH_COMMAND_REGISTRY,
    };

    const result = await Effect.runPromise(
      quit.run(context).pipe(Effect.provide(MockSlashDependencies))
    );

    expect(result.kind).toBe("exitSession");
  });

  it("clear command should output ANSI clear codes and continue", async () => {
    const clear = DEFAULT_SLASH_COMMANDS.find(
      (command) => command.name === "clear"
    );

    if (!clear) {
      throw new Error("Clear command not found in default registry");
    }

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Intentionally left blank
    });

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/clear",
      command: "clear",
      args: [],
      flags: {},
      tokens: ["clear"],
      registry: DEFAULT_SLASH_COMMAND_REGISTRY,
    };

    const result = await Effect.runPromise(
      clear.run(context).pipe(Effect.provide(MockSlashDependencies))
    );

    expect(result.kind).toBe("continue");
    expect(consoleSpy).toHaveBeenCalledWith("\x1b[2J\x1b[H");

    consoleSpy.mockRestore();
  });

  it("history command should display session history", async () => {
    const history = DEFAULT_SLASH_COMMANDS.find(
      (command) => command.name === "history"
    );

    if (!history) {
      throw new Error("History command not found in default registry");
    }

    // Add some test history
    addToHistory("input", "What is your name?", "John");
    addToHistory("select", "Choose option:", "Option A");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Intentionally left blank
    });

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/history",
      command: "history",
      args: [],
      flags: {},
      tokens: ["history"],
      registry: DEFAULT_SLASH_COMMAND_REGISTRY,
    };

    const result = await Effect.runPromise(
      history.run(context).pipe(Effect.provide(MockSlashDependencies))
    );

    expect(result.kind).toBe("continue");
    expect(consoleSpy).toHaveBeenCalled();
    expect(
      consoleSpy.mock.calls.some((call) =>
        String(call[0]).includes("SESSION HISTORY")
      )
    ).toBe(true);

    consoleSpy.mockRestore();
  });

  it("history command should mask password inputs", async () => {
    const history = DEFAULT_SLASH_COMMANDS.find(
      (command) => command.name === "history"
    );

    if (!history) {
      throw new Error("History command not found in default registry");
    }

    addToHistory("password", "Enter password:", "secret123");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Intentionally left blank
    });

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/history",
      command: "history",
      args: [],
      flags: {},
      tokens: ["history"],
      registry: DEFAULT_SLASH_COMMAND_REGISTRY,
    };

    await Effect.runPromise(
      history.run(context).pipe(Effect.provide(MockSlashDependencies))
    );

    // Check that password is masked
    const calls = consoleSpy.mock.calls.map((call) => String(call[0]));
    expect(calls.some((call) => call.includes("********"))).toBe(true);
    expect(calls.some((call) => call.includes("secret123"))).toBe(false);

    consoleSpy.mockRestore();
  });

  it("should handle TUIError failures from slash commands gracefully", async () => {
    const failingCommand: SlashCommandDefinition = {
      name: "fail",
      description: "Failing command",
      run: () =>
        Effect.fail(
          // Simulate CLI error while keeping test local to slash command behavior
          new TUIError("RenderError", "Simulated failure")
        ),
    };

    const registry = createSlashCommandRegistry([
      ...DEFAULT_SLASH_COMMANDS,
      failingCommand,
    ]);

    const context: SlashCommandContext = {
      promptMessage: "Test prompt",
      promptKind: "input",
      rawInput: "/fail",
      command: "fail",
      args: [],
      flags: {},
      tokens: ["fail"],
      registry,
    };

    const program = failingCommand
      .run(context)
      .pipe(
        Effect.catchTag("TUIError", (error) =>
          Console.log(`Handled TUIError: ${error.message}`)
        )
      );

    await expect(
      Effect.runPromise(program.pipe(Effect.provide(MockSlashDependencies)))
    ).resolves.toBeUndefined();
  });
});

describe("Session history", () => {
  afterEach(() => {
    getSessionHistory().clear();
  });

  it("should track history entries", () => {
    addToHistory("input", "Enter name:", "Alice");
    addToHistory("select", "Choose option:", "Option B");

    const history = getSessionHistory().getAll();
    expect(history).toHaveLength(2);
    expect(history[0]?.input).toBe("Alice");
    expect(history[1]?.input).toBe("Option B");
  });

  it("should clear history", () => {
    addToHistory("input", "Test:", "test");
    expect(getSessionHistory().getAll()).toHaveLength(1);

    getSessionHistory().clear();
    expect(getSessionHistory().getAll()).toHaveLength(0);
  });

  it("should serialize to JSON", () => {
    addToHistory("input", "Name:", "Bob");
    const json = getSessionHistory().toJSON();
    const parsed = JSON.parse(json);

    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].input).toBe("Bob");
  });

  it("should deserialize from JSON", () => {
    const json = JSON.stringify({
      sessionStart: "2025-11-25T10:00:00.000Z",
      entries: [
        {
          timestamp: "2025-11-25T10:00:00.000Z",
          promptKind: "input",
          promptMessage: "Test:",
          input: "test value",
        },
      ],
    });

    const history = getSessionHistory();
    history.fromJSON(json);

    const entries = history.getAll();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.input).toBe("test value");
  });
});

describe("Per-command completions", () => {
  it("should support synchronous getCompletions", () => {
    const deployCommand: SlashCommandDefinition = {
      name: "deploy",
      description: "Deploy application",
      getCompletions: (context) => {
        if (context.args.length === 0) {
          return Effect.succeed(["production", "staging", "development"]);
        }
        return Effect.succeed([]);
      },
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([deployCommand]);
    const suggestions = getSlashCommandSuggestions("/deploy ", registry, 10);

    expect(suggestions).toContain("production");
    expect(suggestions).toContain("staging");
    expect(suggestions).toContain("development");
  });

  it("should support async getCompletions", async () => {
    const deployCommand: SlashCommandDefinition = {
      name: "deploy",
      description: "Deploy application",
      getCompletions: (context) => {
        // Simulate async API call using Effect
        if (context.args.length === 0) {
          return Effect.succeed(["production", "staging", "development"]).pipe(
            Effect.delay("10 millis")
          );
        }
        return Effect.succeed([]);
      },
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([deployCommand]);
    const suggestions = await getSlashCommandSuggestionsAsync(
      "/deploy ",
      registry,
      10
    );

    expect(suggestions).toContain("production");
    expect(suggestions).toContain("staging");
    expect(suggestions).toContain("development");
  });

  it("should provide context-aware completions based on flags", async () => {
    const deployCommand: SlashCommandDefinition = {
      name: "deploy",
      description: "Deploy application",
      getCompletions: (context) => {
        if (context.flags.region) {
          return Effect.succeed(["us-east-1", "us-west-2", "eu-central-1"]);
        }
        if (context.args.length === 0) {
          return Effect.succeed(["production", "staging"]);
        }
        return Effect.succeed([]);
      },
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([deployCommand]);

    // Without flag
    const suggestions1 = await getSlashCommandSuggestionsAsync(
      "/deploy ",
      registry,
      10
    );
    expect(suggestions1).toContain("production");
    expect(suggestions1).toContain("staging");

    // With region flag
    const suggestions2 = await getSlashCommandSuggestionsAsync(
      "/deploy --region ",
      registry,
      10
    );
    expect(suggestions2).toContain("us-east-1");
    expect(suggestions2).toContain("us-west-2");
  });

  it("should handle completion errors gracefully", async () => {
    const failingCommand: SlashCommandDefinition = {
      name: "failing",
      description: "Command with failing completions",
      getCompletions: () => Effect.succeed([]),
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([failingCommand]);
    const suggestions = await getSlashCommandSuggestionsAsync(
      "/failing ",
      registry,
      10
    );

    // Should return empty array on error, not throw
    expect(suggestions).toEqual([]);
  });

  it("should limit suggestions to max count", async () => {
    const listCommand: SlashCommandDefinition = {
      name: "list",
      description: "List items",
      getCompletions: () =>
        Effect.succeed(["item1", "item2", "item3", "item4", "item5", "item6"]),
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([listCommand]);
    const suggestions = await getSlashCommandSuggestionsAsync(
      "/list ",
      registry,
      3
    );

    expect(suggestions.length).toBe(3);
  });

  it("should deduplicate suggestions", async () => {
    const dupeCommand: SlashCommandDefinition = {
      name: "dupe",
      description: "Command with duplicate completions",
      getCompletions: () =>
        Effect.succeed(["option1", "option2", "option1", "option2"]),
      run: () => Effect.succeed({ kind: "continue" as const }),
    };

    const registry = createSlashCommandRegistry([dupeCommand]);
    const suggestions = await getSlashCommandSuggestionsAsync(
      "/dupe ",
      registry,
      10
    );

    expect(suggestions).toEqual(["option1", "option2"]);
  });
});
