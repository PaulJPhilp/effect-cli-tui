import { Console, Effect } from "effect";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { TUIError, type CLIError } from "./types";

export interface SlashCommandContext {
  readonly promptMessage: string;
  readonly promptKind: "input" | "password" | "select" | "multiSelect";
  readonly rawInput: string; // Full raw input line (e.g. /deploy prod --force)
  readonly command: string; // Parsed command name (lowercase)
  readonly args: readonly string[]; // Positional arguments
  readonly flags: Readonly<Record<string, string | boolean>>; // Parsed flags (--key / --key=value)
  readonly tokens: readonly string[]; // Tokenized input (without leading slash)
  readonly registry: SlashCommandRegistry; // Registry at time of execution
}

/**
 * Session history entry
 */
export interface SessionHistoryEntry {
  readonly timestamp: string;
  readonly promptKind: string;
  readonly promptMessage: string;
  readonly input: string;
}

/**
 * Session history manager
 * Tracks user inputs across all prompts in the current session
 */
class SessionHistory {
  private entries: SessionHistoryEntry[] = [];

  add(entry: SessionHistoryEntry): void {
    this.entries.push(entry);
  }

  getAll(): readonly SessionHistoryEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries = [];
  }

  toJSON(): string {
    return JSON.stringify(
      {
        sessionStart: this.entries[0]?.timestamp ?? new Date().toISOString(),
        entries: this.entries,
      },
      null,
      2
    );
  }

  fromJSON(json: string): void {
    try {
      const data = JSON.parse(json);
      if (data.entries && Array.isArray(data.entries)) {
        this.entries = data.entries;
      }
    } catch {
      // Ignore invalid JSON
    }
  }
}

const globalSessionHistory = new SessionHistory();

export function getSessionHistory(): SessionHistory {
  return globalSessionHistory;
}

/**
 * Add an entry to the session history
 * Called internally when prompts complete (not for slash commands)
 */
export function addToHistory(
  promptKind: string,
  promptMessage: string,
  input: string
): void {
  globalSessionHistory.add({
    timestamp: new Date().toISOString(),
    promptKind,
    promptMessage,
    input,
  });
}

export type SlashCommandResult =
  | { readonly kind: "continue" }
  | { readonly kind: "abortPrompt"; readonly message?: string }
  | { readonly kind: "exitSession"; readonly message?: string };

// Type for slash command effect with flexible requirements
// This allows slash commands to have dependencies like EffectCLI
type SlashCommandEffect = Effect.Effect<
  SlashCommandResult,
  CLIError | TUIError,
  // biome-ignore lint/suspicious/noExplicitAny: Requirements must be flexible for commands with different dependencies
  any
>;

export interface SlashCommandDefinition {
  readonly name: string;
  readonly description: string;
  readonly aliases?: readonly string[];
  readonly shortFlags?: Readonly<Record<string, string>>;
  readonly getCompletions?: (
    context: ParsedSlashCommand
  ) => ReadonlyArray<string> | Promise<ReadonlyArray<string>>;
  readonly run: (context: SlashCommandContext) => SlashCommandEffect;
}

export interface SlashCommandRegistry {
  readonly commands: readonly SlashCommandDefinition[];
  readonly lookup: ReadonlyMap<string, SlashCommandDefinition>;
}

function normalizeCommandName(command: string): string {
  return command.trim().toLowerCase();
}

export function parseSlashCommandName(input: string): string | null {
  const parsed = parseSlashCommand(input);
  return parsed ? parsed.command : null;
}

export interface ParsedSlashCommand {
  readonly command: string;
  readonly args: readonly string[];
  readonly flags: Readonly<Record<string, string | boolean>>;
  readonly tokens: readonly string[]; // tokens excluding leading slash on first token
}

/**
 * Parse a full slash command string into command name, args and flags.
 * Supports:
 *   /deploy production --force --tag=latest --count=3
 */
export function parseSlashCommand(input: string): ParsedSlashCommand | null {
  if (!input.startsWith("/")) return null;
  const trimmed = input.trim();
  if (trimmed === "/") return null;

  const parts = tokenizeSlashInput(trimmed);
  if (parts.length === 0) return null;

  const first = parts[0];
  const commandNameRaw = first.slice(1);
  if (!commandNameRaw) return null;
  const command = normalizeCommandName(commandNameRaw);

  const tokens: string[] = [];
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  // Common short-flag to long-flag mappings for convenience
  const shortToLong: Record<string, string> = {
    f: "force",
    t: "tag",
    c: "count",
    v: "verbose",
    q: "quiet",
    h: "help",
  };

  const setFlag = (key: string, value: string | boolean) => {
    const k = normalizeCommandName(key);
    flags[k] = value;
    const long = shortToLong[k];
    if (long) {
      flags[long] = value;
    }
  };

  for (let i = 1; i < parts.length; i++) {
    const token = parts[i];
    if (!token) continue;
    if (token.startsWith("--")) {
      const flagToken = token.slice(2);
      if (!flagToken) continue;
      // Negated flag --no-xyz => xyz=false
      if (flagToken.startsWith("no-") && flagToken.length > 3) {
        const key = flagToken.slice(3);
        setFlag(key, false);
        tokens.push(token);
        continue;
      }
      const eqIndex = flagToken.indexOf("=");
      if (eqIndex === -1) {
        // boolean flag
        setFlag(flagToken, true);
      } else {
        const key = normalizeCommandName(flagToken.slice(0, eqIndex));
        const value = flagToken.slice(eqIndex + 1);
        setFlag(key, value);
      }
      tokens.push(token);
    } else if (token.startsWith("-") && token.length > 1) {
      // Short flags cluster, e.g., -f, -tv, -t=latest, -c 3
      const body = token.slice(1);
      const hasEq = body.includes("=");
      if (hasEq) {
        const [letters, value] = body.split("=", 2);
        if (letters.length > 0) {
          // All but last are boolean, last gets value
          for (let j = 0; j < letters.length; j++) {
            const letter = letters[j]!
              .trim()
              .toLowerCase();
            if (!letter) continue;
            if (j === letters.length - 1) {
              setFlag(letter, value ?? "");
            } else {
              setFlag(letter, true);
            }
          }
        }
        tokens.push(token);
      } else {
        // No equals. If next token is a value, assign to last letter
        const letters = body.split("");
        if (letters.length > 0) {
          for (let j = 0; j < letters.length; j++) {
            const letter = letters[j]!
              .trim()
              .toLowerCase();
            if (!letter) continue;
            if (j === letters.length - 1) {
              const next = parts[i + 1];
              if (next && !next.startsWith("-")) {
                setFlag(letter, next);
                tokens.push(token);
                tokens.push(next);
                i++; // consume value
              } else {
                setFlag(letter, true);
                tokens.push(token);
              }
            } else {
              setFlag(letter, true);
              // Only push token once overall
            }
          }
        }
      }
    } else {
      args.push(token);
      tokens.push(token);
    }
  }

  return { command, args, flags, tokens };
}

/** Tokenize input respecting quotes and escapes */
function tokenizeSlashInput(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let escaping = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (escaping) {
      current += ch;
      escaping = false;
      continue;
    }
    if (ch === "\\") {
      escaping = true;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inDouble && /\s/.test(ch)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }
  if (current.length > 0) tokens.push(current);
  return tokens;
}

/** Apply per-command short flag mapping by duplicating short keys as long */
export function applyShortFlagMapping(
  flags: Readonly<Record<string, string | boolean>>,
  mapping?: Readonly<Record<string, string>>
): Readonly<Record<string, string | boolean>> {
  if (!mapping || Object.keys(mapping).length === 0) return flags;
  const out: Record<string, string | boolean> = { ...flags };
  for (const [shortKeyRaw, longKeyRaw] of Object.entries(mapping)) {
    const shortKey = normalizeCommandName(shortKeyRaw);
    const longKey = normalizeCommandName(longKeyRaw);
    if (shortKey in flags) {
      if (!(longKey in out)) {
        out[longKey] = flags[shortKey]!;
      }
    }
  }
  return out;
}

/** Suggest slash commands given a prefix (without slash or with) */
export function getSlashCommandSuggestions(
  input: string,
  registry: SlashCommandRegistry,
  max: number = 5
): readonly string[] {
  const parsed = parseSlashCommand(input);
  const suggestions: string[] = [];

  // If not a slash yet or just "/" → suggest command names
  if (!parsed) {
    const prefix = input.startsWith("/") ? input.slice(1).toLowerCase() : input.toLowerCase();
    for (const def of registry.commands) {
      const names = [def.name, ...(def.aliases ?? [])];
      for (const n of names) {
        if (!prefix || n.toLowerCase().startsWith(prefix)) {
          suggestions.push(`/${n}`);
        }
      }
    }
    return Array.from(new Set(suggestions)).slice(0, max);
  }

  // If we have a parsed command, check per-command completions
  const def = registry.lookup.get(parsed.command);
  // If only the command fragment typed (no tokens besides the leading command),
  // suggest matching command names and aliases that start with the fragment.
  if ((parsed.tokens.length === 0) && (!input.endsWith(" "))) {
    const prefix = parsed.command.toLowerCase();
    for (const d of registry.commands) {
      const names = [d.name, ...(d.aliases ?? [])];
      for (const n of names) {
        if (n.toLowerCase().startsWith(prefix)) {
          suggestions.push(`/${n}`);
        }
      }
    }
    return Array.from(new Set(suggestions)).slice(0, max);
  }

  if (def?.getCompletions) {
    // Note: getCompletions may return Promise or sync array
    // This function returns sync results only; Input component handles async via computeSlashSuggestions
    try {
      const res = def.getCompletions(parsed);
      // Only handle sync results here; async will be handled by Input's Promise detection
      if (!res || res instanceof Promise) {
        // Skip async results in sync path
      } else {
        const list = Array.isArray(res) ? res : [];
        for (const s of list) {
          suggestions.push(s);
        }
      }
    } catch {
      // ignore completion errors
    }
  } else {
    // Default suggestions: when last token starts with '-' suggest known short/long flags
    const last = parsed.tokens.at(-1) ?? "";
    if (last.startsWith("-")) {
      const names = [def?.name ?? "", ...((def?.aliases ?? []) as string[])];
      // Generic flags
      const generic = ["--help", "--verbose", "--quiet", "-h", "-v", "-q"];
      suggestions.push(...generic);
      // Per-command shortFlags
      if (def?.shortFlags) {
        for (const [shortKey, longKey] of Object.entries(def.shortFlags)) {
          suggestions.push(`-${shortKey}`);
          suggestions.push(`--${longKey}`);
        }
      }
    }
  }

  return Array.from(new Set(suggestions)).slice(0, max);
}

/**
 * Async-aware version of getSlashCommandSuggestions
 * Resolves both sync and async completions
 */
export async function getSlashCommandSuggestionsAsync(
  input: string,
  registry: SlashCommandRegistry,
  max: number = 5
): Promise<readonly string[]> {
  const parsed = parseSlashCommand(input);
  const suggestions: string[] = [];

  // If not a slash yet or just "/" → suggest command names
  if (!parsed) {
    const prefix = input.startsWith("/")
      ? input.slice(1).toLowerCase()
      : input.toLowerCase();
    for (const def of registry.commands) {
      const names = [def.name, ...(def.aliases ?? [])];
      for (const n of names) {
        if (!prefix || n.toLowerCase().startsWith(prefix)) {
          suggestions.push(`/${n}`);
        }
      }
    }
    return Array.from(new Set(suggestions)).slice(0, max);
  }

  const def = registry.lookup.get(parsed.command);
  // If only the command fragment typed (no tokens besides the leading command),
  // suggest matching command names and aliases that start with the fragment.
  if (parsed.tokens.length === 0 && !input.endsWith(" ")) {
    const prefix = parsed.command.toLowerCase();
    for (const d of registry.commands) {
      const names = [d.name, ...(d.aliases ?? [])];
      for (const n of names) {
        if (n.toLowerCase().startsWith(prefix)) {
          suggestions.push(`/${n}`);
        }
      }
    }
    return Array.from(new Set(suggestions)).slice(0, max);
  }

  if (def?.getCompletions) {
    try {
      const res = def.getCompletions(parsed);
      const list = res instanceof Promise ? await res : res;
      if (Array.isArray(list)) {
        for (const s of list) {
          suggestions.push(s);
        }
      }
    } catch {
      // ignore completion errors
    }
  } else {
    // Default suggestions: when last token starts with '-' suggest known short/long flags
    const last = parsed.tokens.at(-1) ?? "";
    if (last.startsWith("-")) {
      // Generic flags
      const generic = ["--help", "--verbose", "--quiet", "-h", "-v", "-q"];
      suggestions.push(...generic);
      // Per-command shortFlags
      if (def?.shortFlags) {
        for (const [shortKey, longKey] of Object.entries(def.shortFlags)) {
          suggestions.push(`-${shortKey}`);
          suggestions.push(`--${longKey}`);
        }
      }
    }
  }

  return Array.from(new Set(suggestions)).slice(0, max);
}

// Slash command usage history (raw input). Separate from session history.
const slashCommandHistory: string[] = [];

export function addSlashCommandHistoryEntry(raw: string): void {
  const entry = raw.trim();
  if (!entry.startsWith("/")) return;
  // Avoid consecutive duplicates
  if (slashCommandHistory.at(-1) !== entry) {
    slashCommandHistory.push(entry);
  }
}

export function getSlashCommandHistory(): readonly string[] {
  return slashCommandHistory;
}

export function createSlashCommandRegistry(
  definitions: readonly SlashCommandDefinition[]
): SlashCommandRegistry {
  const lookupEntries: [string, SlashCommandDefinition][] = [];

  for (const definition of definitions) {
    const baseName = normalizeCommandName(definition.name);
    lookupEntries.push([baseName, definition]);

    if (definition.aliases) {
      for (const alias of definition.aliases) {
        lookupEntries.push([normalizeCommandName(alias), definition]);
      }
    }
  }

  return {
    commands: definitions,
    lookup: new Map(lookupEntries),
  };
}

export const EMPTY_SLASH_COMMAND_REGISTRY: SlashCommandRegistry =
  createSlashCommandRegistry([]);

let currentSlashCommandRegistry: SlashCommandRegistry =
  EMPTY_SLASH_COMMAND_REGISTRY;

export function getGlobalSlashCommandRegistry(): SlashCommandRegistry {
  return currentSlashCommandRegistry;
}

export function setGlobalSlashCommandRegistry(
  definitions: readonly SlashCommandDefinition[]
): void {
  currentSlashCommandRegistry = createSlashCommandRegistry(definitions);
}

/**
 * Built-in slash commands
 *
 * These provide a baseline UX that can be extended in future iterations.
 */
export const DEFAULT_SLASH_COMMANDS: readonly SlashCommandDefinition[] = [
  {
    name: "help",
    description: "Show available slash commands",
    run: (context) =>
      Effect.gen(function* () {
        const header = "\nAvailable slash commands:\n";
        yield* Console.log(header);

        for (const command of context.registry.commands) {
          const names = [command.name, ...(command.aliases ?? [])]
            .map((name) => `/${name}`)
            .join(", ");
          yield* Console.log(`  ${names} - ${command.description}`);
        }

        return { kind: "continue" } as const;
      }),
  },
  {
    name: "quit",
    description: "Exit the current interactive session",
    aliases: ["exit"],
    run: () =>
      Effect.succeed<SlashCommandResult>({
        kind: "exitSession",
        message: "Slash command requested session exit",
      }),
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    aliases: ["cls"],
    run: () =>
      Effect.gen(function* () {
        // Clear screen using ANSI escape codes
        // \x1b[2J clears entire screen
        // \x1b[H moves cursor to home position (0,0)
        yield* Console.log("\x1b[2J\x1b[H");
        return { kind: "continue" } as const;
      }),
  },
  {
    name: "history",
    description: "Show session command history",
    aliases: ["h"],
    run: () =>
      Effect.gen(function* () {
        const history = globalSessionHistory.getAll();

        if (history.length === 0) {
          yield* Console.log("\nNo history available in this session.\n");
          return { kind: "continue" } as const;
        }

        yield* Console.log("\nSession History:\n");
        for (const [index, entry] of history.entries()) {
          const time = new Date(entry.timestamp).toLocaleTimeString();
          const maskedInput =
            entry.promptKind === "password" ? "********" : entry.input;
          yield* Console.log(
            `  ${index + 1}. [${time}] ${entry.promptKind}: ${maskedInput}`
          );
        }
        yield* Console.log("");

        return { kind: "continue" } as const;
      }),
  },
  {
    name: "save",
    description: "Save session history to a file",
    run: () =>
      Effect.gen(function* () {
        const history = globalSessionHistory.getAll();

        if (history.length === 0) {
          yield* Console.log("\nNo history to save.\n");
          return { kind: "continue" } as const;
        }

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .slice(0, -5);
        const filename = `session-${timestamp}.json`;
        const filepath = path.join(process.cwd(), filename);

        const json = globalSessionHistory.toJSON();

        yield* Effect.tryPromise({
          try: () => fs.writeFile(filepath, json, "utf-8"),
          catch: (error) =>
            new Error(`Failed to save history: ${String(error)}`),
        }).pipe(
          Effect.mapError(
            (error) => new TUIError("RenderError", String(error))
          )
        );

        yield* Console.log(`\nSession history saved to: ${filename}\n`);
        return { kind: "continue" } as const;
      }),
  },
  {
    name: "load",
    description: "Load and display a previous session from file",
    run: () =>
      Effect.gen(function* () {
        // List available session files
        const files = yield* Effect.tryPromise({
          try: () => fs.readdir(process.cwd()),
          catch: (error) =>
            new Error(`Failed to read directory: ${String(error)}`),
        }).pipe(
          Effect.mapError(
            (error) => new TUIError("RenderError", String(error))
          )
        );

        const sessionFiles = files.filter((file) =>
          file.startsWith("session-")
        );

        if (sessionFiles.length === 0) {
          yield* Console.log("\nNo saved sessions found in current directory.\n");
          return { kind: "continue" } as const;
        }

        yield* Console.log("\nAvailable session files:\n");
        for (const file of sessionFiles) {
          yield* Console.log(`  - ${file}`);
        }

        // Use most recent file
        const latestFile = sessionFiles.sort().reverse()[0];
        if (!latestFile) {
          yield* Console.log("\nNo session file to load.\n");
          return { kind: "continue" } as const;
        }

        const filepath = path.join(process.cwd(), latestFile);
        const content = yield* Effect.tryPromise({
          try: () => fs.readFile(filepath, "utf-8"),
          catch: (error) =>
            new Error(`Failed to read file: ${String(error)}`),
        }).pipe(
          Effect.mapError(
            (error) => new TUIError("RenderError", String(error))
          )
        );

        const tempHistory = new SessionHistory();
        tempHistory.fromJSON(content);
        const entries = tempHistory.getAll();

        yield* Console.log(`\nLoaded session from: ${latestFile}\n`);
        yield* Console.log("Session contents:\n");

        for (const [index, entry] of entries.entries()) {
          const time = new Date(entry.timestamp).toLocaleTimeString();
          const maskedInput =
            entry.promptKind === "password" ? "********" : entry.input;
          yield* Console.log(
            `  ${index + 1}. [${time}] ${entry.promptKind}: ${maskedInput}`
          );
        }
        yield* Console.log("");

        return { kind: "continue" } as const;
      }),
  },
];

export const DEFAULT_SLASH_COMMAND_REGISTRY: SlashCommandRegistry =
  createSlashCommandRegistry(DEFAULT_SLASH_COMMANDS);

// Initialize global registry with default commands by default
currentSlashCommandRegistry = DEFAULT_SLASH_COMMAND_REGISTRY;

export function configureDefaultSlashCommands(
  extraCommands?: readonly SlashCommandDefinition[]
): void {
  if (!extraCommands || extraCommands.length === 0) {
    setGlobalSlashCommandRegistry(DEFAULT_SLASH_COMMANDS);
    return;
  }

  setGlobalSlashCommandRegistry([...DEFAULT_SLASH_COMMANDS, ...extraCommands]);
}

export function withSlashCommands<A, E, R>(
  definitions: readonly SlashCommandDefinition[],
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> {
  return Effect.acquireUseRelease(
    Effect.sync(() => {
      const previous = getGlobalSlashCommandRegistry();
      setGlobalSlashCommandRegistry(definitions);
      return previous;
    }),
    () => effect,
    (previous) =>
      Effect.sync(() => {
        setGlobalSlashCommandRegistry(previous.commands);
      })
  );
}

export interface EffectCliSlashCommandOptions<R = never> {
  readonly name: string;
  readonly description: string;
  readonly aliases?: readonly string[];
  readonly effect: (
    context: SlashCommandContext
  ) => Effect.Effect<SlashCommandResult, CLIError | TUIError, R>;
}

export function createEffectCliSlashCommand<R = never>(
  options: EffectCliSlashCommandOptions<R>
): SlashCommandDefinition {
  return {
    name: options.name,
    description: options.description,
    aliases: options.aliases,
    run: (context: SlashCommandContext) => options.effect(context),
  };
}
