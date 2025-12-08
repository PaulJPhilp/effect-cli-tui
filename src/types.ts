import { Data } from "effect";

// ============================================================================
// Slash Command Types
// ============================================================================

/**
 * Valid prompt kinds for interactive prompts
 */
export type PromptKind = "input" | "password" | "select" | "multiSelect";

/**
 * Result kinds from slash command execution
 */
export type SlashCommandResultKind = "continue" | "abortPrompt" | "exitSession";

// ============================================================================
// UI Types
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

export interface CLIResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface CLIRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  maxBuffer?: number;
}

export interface PromptOptions {
  default?: string;
  validate?: (input: string) => boolean | string;
}

// Error types
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason:
      | "CommandFailed"
      | "Timeout"
      | "NotFound"
      | "ExecutionError",
    readonly message: string,
    readonly exitCode?: number
  ) {
    super();
  }
}

export class TUIError extends Data.TaggedError("TUIError") {
  constructor(
    readonly reason:
      | "Cancelled"
      | "ValidationFailed"
      | "RenderError"
      | "SlashCommandAbort"
      | "SlashCommandExit",
    readonly message: string
  ) {
    super();
  }
}

/**
 * Ink rendering error type
 *
 * Thrown when Ink component rendering fails.
 */
export class InkError extends Data.TaggedError("InkError") {
  constructor(
    readonly reason: "RenderError" | "ComponentError" | "TerminalError",
    readonly message: string
  ) {
    super();
  }
}

// Box border style types
export type BorderStyle = "single" | "double" | "rounded" | "bold" | "classic";

export interface BoxBorderChars {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
  cross: string;
  t: string;
  b: string;
  l: string;
  r: string;
}

// Table types
export type TableAlignment = "left" | "center" | "right";

// Color types
export type ChalkColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray";

/**
 * Colors used for display types (info, success, error, warning)
 * Discriminated union mapping DisplayType to its corresponding color
 */
export type DisplayTypeColor =
  | { type: "info"; color: "blue" }
  | { type: "success"; color: "green" }
  | { type: "error"; color: "red" }
  | { type: "warning"; color: "yellow" };

export type ChalkBgColor =
  | "bgBlack"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan"
  | "bgWhite";

export interface ChalkStyleOptions {
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
  strikethrough?: boolean;
  color?: ChalkColor;
  bgColor?: ChalkBgColor;
}

// Display types moved to src/services/display/types.ts
// Re-exported here for backward compatibility
export type {
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
} from "./services/display/types";
