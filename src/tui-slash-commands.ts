/** biome-ignore-all assist/source/organizeImports: <> */
import { Console, Effect } from "effect";
import { promises as fs } from "node:fs";
import { join as pathJoin } from "node:path";
import {
  ANSI_CLEAR_SCREEN,
  DEFAULT_MAX_SUGGESTIONS,
  GENERIC_FLAGS,
  HELP_TABLE_COLUMN_WIDTHS,
  HISTORY_TABLE_COLUMN_WIDTHS,
  JSON_INDENT,
  NEGATED_FLAG_MIN_LENGTH,
  NEGATED_FLAG_PREFIX,
  PASSWORD_MASK,
  SESSION_FILE_PREFIX,
  SHORT_TO_LONG_FLAGS,
} from "./constants";
import type { KitRegistryService } from "./kits/registry";
import type { ToolCallLogService } from "./services/logs";
import type { ModeService } from "./services/mode";
import type { SupermemoryClientService } from "./supermemory/client";
import { TUIError, type CLIError, type PromptKind } from "./types";
import { renderTablePanel } from "./ui/panels/render";

/**
 * Union type of all possible slash command service dependencies.
 *
 * Slash commands may require different services. This type captures
 * all known service dependencies that slash commands can have.
 * Commands are provided with their dependencies when executed.
 */
export type SlashCommandRequirements =
  | KitRegistryService
  | ModeService
  | ToolCallLogService
  | SupermemoryClientService;

export interface SlashCommandContext {
  readonly promptMessage: string;
  readonly promptKind: PromptKind;
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
      JSON_INDENT
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

/**
 * Type for slash command effect with known service requirements.
 *
 * Commands may depend on various services (KitRegistryService, ModeService, etc.).
 * The caller is responsible for providing these services when executing commands.
 */
type SlashCommandEffect = Effect.Effect<
  SlashCommandResult,
  CLIError | TUIError,
  SlashCommandRequirements
>;

export interface SlashCommandDefinition {
  readonly name: string;
  readonly description: string;
  readonly aliases?: readonly string[];
  readonly shortFlags?: Readonly<Record<string, string>>;
  readonly getCompletions?: (
    context: ParsedSlashCommand
  ) => Effect.Effect<readonly string[]>;
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

/** Set a flag with optional short-to-long expansion */
function setFlag(
  flags: Record<string, string | boolean>,
  key: string,
  value: string | boolean
): void {
  const k = normalizeCommandName(key);
  flags[k] = value;
  const long = SHORT_TO_LONG_FLAGS[k];
  if (long) {
    flags[long] = value;
  }
}

/** Parse a long flag (--flag, --flag=value, --no-flag) */
function parseLongFlag(
  token: string,
  flags: Record<string, string | boolean>
): boolean {
  const flagToken = token.slice(2);
  if (!flagToken) {
    return false;
  }

  // Negated flag --no-xyz => xyz=false
  if (
    flagToken.startsWith(NEGATED_FLAG_PREFIX) &&
    flagToken.length > NEGATED_FLAG_MIN_LENGTH
  ) {
    setFlag(flags, flagToken.slice(NEGATED_FLAG_PREFIX.length), false);
    return true;
  }

  const eqIndex = flagToken.indexOf("=");
  if (eqIndex === -1) {
    setFlag(flags, flagToken, true);
  } else {
    const key = normalizeCommandName(flagToken.slice(0, eqIndex));
    setFlag(flags, key, flagToken.slice(eqIndex + 1));
  }
  return true;
}

/** Parse short flags with equals (-t=value, -tv=value) */
function parseShortFlagsWithEquals(
  body: string,
  flags: Record<string, string | boolean>
): void {
  const [letters, value] = body.split("=", 2);
  for (let j = 0; j < letters.length; j++) {
    const letter = letters[j]?.trim().toLowerCase();
    if (!letter) {
      continue;
    }
    // Last letter gets the value, others are boolean
    setFlag(flags, letter, j === letters.length - 1 ? (value ?? "") : true);
  }
}

/** Context for parsing short flags */
interface ShortFlagParseContext {
  parts: string[];
  currentIndex: number;
  flags: Record<string, string | boolean>;
  tokens: string[];
}

/** Parse short flags without equals, returns tokens consumed */
function parseShortFlagsNoEquals(
  body: string,
  ctx: ShortFlagParseContext
): number {
  const letters = body.split("");
  let consumed = 0;

  for (let j = 0; j < letters.length; j++) {
    const letter = letters[j]?.trim().toLowerCase();
    if (!letter) {
      continue;
    }

    if (j === letters.length - 1) {
      // Last letter: check if next token is a value
      const next = ctx.parts[ctx.currentIndex + 1];
      if (next && !next.startsWith("-")) {
        setFlag(ctx.flags, letter, next);
        ctx.tokens.push(next);
        consumed = 1;
      } else {
        setFlag(ctx.flags, letter, true);
      }
    } else {
      setFlag(ctx.flags, letter, true);
    }
  }
  return consumed;
}

/** Validate and extract initial parts from slash command input */
function validateSlashInput(
  input: string
): { parts: string[]; commandName: string } | null {
  if (!input.startsWith("/")) {
    return null;
  }

  const trimmed = input.trim();
  if (trimmed === "/") {
    return null;
  }

  const parts = tokenizeSlashInput(trimmed);
  if (parts.length === 0) {
    return null;
  }

  const commandNameRaw = parts[0].slice(1);
  if (!commandNameRaw) {
    return null;
  }

  return { parts, commandName: normalizeCommandName(commandNameRaw) };
}

/** Process a single token in slash command parsing */
function processSlashToken(token: string, ctx: ShortFlagParseContext): number {
  if (token.startsWith("--")) {
    if (parseLongFlag(token, ctx.flags)) {
      ctx.tokens.push(token);
    }
    return 0;
  }

  if (token.startsWith("-") && token.length > 1) {
    const body = token.slice(1);
    ctx.tokens.push(token);
    if (body.includes("=")) {
      parseShortFlagsWithEquals(body, ctx.flags);
      return 0;
    }
    return parseShortFlagsNoEquals(body, ctx);
  }

  return -1; // Signal: treat as positional arg
}

export function parseSlashCommand(input: string): ParsedSlashCommand | null {
  const validated = validateSlashInput(input);
  if (!validated) {
    return null;
  }

  const { parts, commandName } = validated;
  const tokens: string[] = [];
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < parts.length; i++) {
    const token = parts[i];
    if (!token) {
      continue;
    }

    const result = processSlashToken(token, {
      parts,
      currentIndex: i,
      flags,
      tokens,
    });
    if (result === -1) {
      args.push(token);
      tokens.push(token);
    } else {
      i += result;
    }
  }

  return { command: commandName, args, flags, tokens };
}

// Whitespace regex hoisted to top level for performance
const WHITESPACE_REGEX = /\s/;

/** State for tokenizer */
interface TokenizerState {
  tokens: string[];
  current: string;
  inSingle: boolean;
  inDouble: boolean;
  escaping: boolean;
}

/** Check if character is a quote toggle */
function handleQuoteChar(ch: string, state: TokenizerState): boolean {
  if (ch === '"' && !state.inSingle) {
    state.inDouble = !state.inDouble;
    return true;
  }
  if (ch === "'" && !state.inDouble) {
    state.inSingle = !state.inSingle;
    return true;
  }
  return false;
}

/** Check if character is whitespace outside quotes */
function handleWhitespace(ch: string, state: TokenizerState): boolean {
  if (state.inSingle || state.inDouble) {
    return false;
  }
  if (!WHITESPACE_REGEX.test(ch)) {
    return false;
  }
  if (state.current.length > 0) {
    state.tokens.push(state.current);
    state.current = "";
  }
  return true;
}

/** Tokenize input respecting quotes and escapes */
function tokenizeSlashInput(input: string): string[] {
  const state: TokenizerState = {
    tokens: [],
    current: "",
    inSingle: false,
    inDouble: false,
    escaping: false,
  };

  for (const ch of input) {
    if (state.escaping) {
      state.current += ch;
      state.escaping = false;
      continue;
    }
    if (ch === "\\") {
      state.escaping = true;
      continue;
    }
    if (handleQuoteChar(ch, state)) {
      continue;
    }
    if (handleWhitespace(ch, state)) {
      continue;
    }
    state.current += ch;
  }

  if (state.current.length > 0) {
    state.tokens.push(state.current);
  }
  return state.tokens;
}

/** Apply per-command short flag mapping by duplicating short keys as long */
export function applyShortFlagMapping(
  flags: Readonly<Record<string, string | boolean>>,
  mapping?: Readonly<Record<string, string>>
): Readonly<Record<string, string | boolean>> {
  if (!mapping || Object.keys(mapping).length === 0) {
    return flags;
  }
  const out: Record<string, string | boolean> = { ...flags };
  for (const [shortKeyRaw, longKeyRaw] of Object.entries(mapping)) {
    const shortKey = normalizeCommandName(shortKeyRaw);
    const longKey = normalizeCommandName(longKeyRaw);
    if (shortKey in flags && !(longKey in out)) {
      out[longKey] = flags[shortKey] as string | boolean;
    }
  }
  return out;
}

/** Collect matching command names from registry */
function collectCommandSuggestions(
  registry: SlashCommandRegistry,
  prefix: string
): string[] {
  const suggestions: string[] = [];
  const lowerPrefix = prefix.toLowerCase();

  for (const def of registry.commands) {
    const names = [def.name, ...(def.aliases ?? [])];
    for (const name of names) {
      if (!lowerPrefix || name.toLowerCase().startsWith(lowerPrefix)) {
        suggestions.push(`/${name}`);
      }
    }
  }
  return suggestions;
}

/** Collect flag suggestions for a command */
function collectFlagSuggestions(
  def: SlashCommandDefinition | undefined
): string[] {
  const suggestions = [...GENERIC_FLAGS];

  if (def?.shortFlags) {
    for (const [shortKey, longKey] of Object.entries(def.shortFlags)) {
      suggestions.push(`-${shortKey}`, `--${longKey}`);
    }
  }
  return suggestions;
}

/** Deduplicate and limit suggestions */
function finalizeSuggestions(
  suggestions: string[],
  max: number
): readonly string[] {
  return Array.from(new Set(suggestions)).slice(0, max);
}

/** Suggest slash commands given a prefix (without slash or with) */
/** Fetch sync completions from command definition */
function fetchSyncCompletions(
  def: SlashCommandDefinition,
  parsed: ParsedSlashCommand
): string[] {
  if (!def.getCompletions) {
    return [];
  }
  return Effect.runSync(
    def.getCompletions(parsed).pipe(
      Effect.map((list) => (Array.isArray(list) ? [...list] : [])),
      Effect.catchAll(() => Effect.succeed([]))
    )
  );
}

export function getSlashCommandSuggestions(
  input: string,
  registry: SlashCommandRegistry,
  max = DEFAULT_MAX_SUGGESTIONS
): readonly string[] {
  const parsed = parseSlashCommand(input);

  // No valid parse → suggest command names matching input prefix
  if (!parsed) {
    const prefix = input.startsWith("/") ? input.slice(1) : input;
    return finalizeSuggestions(
      collectCommandSuggestions(registry, prefix),
      max
    );
  }

  // Command fragment only → suggest matching commands
  if (parsed.tokens.length === 0 && !input.endsWith(" ")) {
    return finalizeSuggestions(
      collectCommandSuggestions(registry, parsed.command),
      max
    );
  }

  const def = registry.lookup.get(parsed.command);

  // Use command completions if available, otherwise suggest flags
  const suggestions = def?.getCompletions
    ? fetchSyncCompletions(def, parsed)
    : collectDefaultSuggestions(parsed, def);

  return finalizeSuggestions(suggestions, max);
}

/** Fetch completions from command definition */
function fetchCommandCompletions(
  def: SlashCommandDefinition,
  parsed: ParsedSlashCommand
): Effect.Effect<string[]> {
  if (!def.getCompletions) {
    return Effect.succeed([]);
  }
  return def.getCompletions(parsed).pipe(
    Effect.map((list) => (Array.isArray(list) ? [...list] : [])),
    Effect.catchAll(() => Effect.succeed([]))
  );
}

/**
 * Effect-based version of getSlashCommandSuggestions
 * Handles async completions via Effects
 */
export function getSlashCommandSuggestionsEffect(
  input: string,
  registry: SlashCommandRegistry,
  max = DEFAULT_MAX_SUGGESTIONS
): Effect.Effect<readonly string[]> {
  const parsed = parseSlashCommand(input);

  // No valid parse → suggest command names matching input prefix
  if (!parsed) {
    const prefix = input.startsWith("/") ? input.slice(1) : input;
    return Effect.succeed(
      finalizeSuggestions(collectCommandSuggestions(registry, prefix), max)
    );
  }

  // Command fragment only → suggest matching commands
  if (parsed.tokens.length === 0 && !input.endsWith(" ")) {
    return Effect.succeed(
      finalizeSuggestions(
        collectCommandSuggestions(registry, parsed.command),
        max
      )
    );
  }

  const def = registry.lookup.get(parsed.command);

  // Use command completions if available, otherwise suggest flags
  if (def?.getCompletions) {
    return fetchCommandCompletions(def, parsed).pipe(
      Effect.map((suggestions) => finalizeSuggestions(suggestions, max))
    );
  }

  return Effect.succeed(
    finalizeSuggestions(collectDefaultSuggestions(parsed, def), max)
  );
}

/**
 * Promise-based wrapper for React components
 * Converts Effect-based suggestions to Promise for React boundary
 */
export function getSlashCommandSuggestionsAsync(
  input: string,
  registry: SlashCommandRegistry,
  max = DEFAULT_MAX_SUGGESTIONS
): Promise<readonly string[]> {
  return Effect.runPromise(
    getSlashCommandSuggestionsEffect(input, registry, max)
  );
}

/** Collect default suggestions (flags) based on current input */
function collectDefaultSuggestions(
  parsed: ParsedSlashCommand,
  def: SlashCommandDefinition | undefined
): string[] {
  const last = parsed.tokens.at(-1) ?? "";
  return last.startsWith("-") ? collectFlagSuggestions(def) : [];
}

// Slash command usage history (raw input). Separate from session history.
const slashCommandHistory: string[] = [];

export function addSlashCommandHistoryEntry(raw: string): void {
  const entry = raw.trim();
  if (!entry.startsWith("/")) {
    return;
  }
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

import { AGENT_HARNESS_SLASH_COMMANDS } from "./tui-slash-commands-agent";

/**
 * Built-in slash commands
 *
 * These provide a baseline UX that can be extended in future iterations.
 */
export const DEFAULT_SLASH_COMMANDS: readonly SlashCommandDefinition[] = [
  ...AGENT_HARNESS_SLASH_COMMANDS,
  {
    name: "help",
    description: "Show available slash commands",
    run: (context) =>
      Effect.gen(function* () {
        // Build table rows from all commands
        const rows = context.registry.commands.map((command) => {
          const names = [command.name, ...(command.aliases ?? [])]
            .map((name) => `/${name}`)
            .join(", ");
          const aliases =
            command.aliases && command.aliases.length > 0
              ? command.aliases.map((a) => `/${a}`).join(", ")
              : "none";
          return {
            cells: [names, aliases, command.description],
          };
        });

        // Render as table panel
        yield* renderTablePanel({
          title: "AVAILABLE COMMANDS",
          columns: [
            { header: "Command", width: HELP_TABLE_COLUMN_WIDTHS.command },
            { header: "Aliases", width: HELP_TABLE_COLUMN_WIDTHS.aliases },
            { header: "Description" },
          ],
          rows,
          footer: "Tip: Use /status to see current workspace state",
        });

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
        yield* Console.log(ANSI_CLEAR_SCREEN);
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

        // Build table rows from history
        const rows = history.map((entry, index) => {
          const time = new Date(entry.timestamp).toLocaleTimeString();
          const maskedInput =
            entry.promptKind === "password" ? PASSWORD_MASK : entry.input;
          return {
            cells: [String(index + 1), time, entry.promptKind, maskedInput],
          };
        });

        // Render as table panel
        yield* renderTablePanel({
          title: "SESSION HISTORY",
          columns: [
            { header: "#", width: HISTORY_TABLE_COLUMN_WIDTHS.index },
            { header: "Time", width: HISTORY_TABLE_COLUMN_WIDTHS.time },
            { header: "Type", width: HISTORY_TABLE_COLUMN_WIDTHS.type },
            { header: "Input" },
          ],
          rows,
          footer: `Total: ${history.length} entries`,
        });

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
        const filename = `${SESSION_FILE_PREFIX}${timestamp}.json`;
        const filepath = pathJoin(process.cwd(), filename);

        const json = globalSessionHistory.toJSON();

        yield* Effect.tryPromise({
          try: () => fs.writeFile(filepath, json, "utf-8"),
          catch: (error) =>
            new Error(`Failed to save history: ${String(error)}`),
        }).pipe(
          Effect.mapError((error) => new TUIError("RenderError", String(error)))
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
          Effect.mapError((error) => new TUIError("RenderError", String(error)))
        );

        const sessionFiles = (files as string[]).filter((file: string) =>
          file.startsWith(SESSION_FILE_PREFIX)
        );

        if (sessionFiles.length === 0) {
          yield* Console.log(
            "\nNo saved sessions found in current directory.\n"
          );
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

        const filepath = pathJoin(process.cwd(), latestFile);
        const content = yield* Effect.tryPromise({
          try: () => fs.readFile(filepath, "utf-8"),
          catch: (error) => new Error(`Failed to read file: ${String(error)}`),
        }).pipe(
          Effect.mapError((error) => new TUIError("RenderError", String(error)))
        );

        const tempHistory = new SessionHistory();
        tempHistory.fromJSON(content);
        const entries = tempHistory.getAll();

        yield* Console.log(`\nLoaded session from: ${latestFile}\n`);
        yield* Console.log("Session contents:\n");

        for (const [index, entry] of entries.entries()) {
          const time = new Date(entry.timestamp).toLocaleTimeString();
          const maskedInput =
            entry.promptKind === "password" ? PASSWORD_MASK : entry.input;
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

export interface EffectCliSlashCommandOptions<
  R extends SlashCommandRequirements | never = never,
> {
  readonly name: string;
  readonly description: string;
  readonly aliases?: readonly string[];
  readonly effect: (
    context: SlashCommandContext
  ) => Effect.Effect<SlashCommandResult, CLIError | TUIError, R>;
}

export function createEffectCliSlashCommand<
  R extends SlashCommandRequirements | never = never,
>(options: EffectCliSlashCommandOptions<R>): SlashCommandDefinition {
  return {
    name: options.name,
    description: options.description,
    aliases: options.aliases,
    run: (context: SlashCommandContext) =>
      options.effect(context) as SlashCommandEffect,
  };
}
