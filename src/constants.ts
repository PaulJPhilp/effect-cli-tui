// This file is the entry point for constants.
// biome-ignore assist/source/organizeImports: <>
export {
  ANSI_CARRIAGE_RETURN,
  ANSI_CARRIAGE_RETURN_CLEAR,
  ANSI_CLEAR_LINE,
  ANSI_HIDE_CURSOR,
  ANSI_SHOW_CURSOR,
  COLOR_DEFAULT,
  COLOR_ERROR,
  COLOR_HIGHLIGHT,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  EXIT_CODE_SIGINT,
  EXIT_CODE_SIGTERM,
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
  SYMBOL_BULLET,
  getDisplayColor,
  getDisplayIcon,
} from "./core/icons";

import type { DisplayType } from "./types";

// Display constants
export const DEFAULT_DISPLAY_TYPE = "info" satisfies DisplayType;

// Title constraints
export const MIN_TITLE_LENGTH = 1;
export const MAX_TITLE_LENGTH = 100;

import type { BorderStyle, BoxBorderChars } from "./types";

// ============================================================================
// Slash Command Constants
// ============================================================================

/** Default maximum suggestions for slash command completion */
export const DEFAULT_MAX_SUGGESTIONS = 5;

/** Mask displayed for password inputs in history */
export const PASSWORD_MASK = "********";

/** File prefix for saved session files */
export const SESSION_FILE_PREFIX = "session-";

/** Prefix for negated boolean flags (--no-xyz) */
export const NEGATED_FLAG_PREFIX = "no-";

/** Minimum length for negated flag to be valid (prefix + at least 1 char) */
export const NEGATED_FLAG_MIN_LENGTH = 3;

/** JSON indentation for pretty-printing */
export const JSON_INDENT = 2;

/** ANSI escape sequence to clear screen and move cursor home */
export const ANSI_CLEAR_SCREEN = "\x1b[2J\x1b[H";

/** Common short-flag to long-flag mappings */
export const SHORT_TO_LONG_FLAGS: Readonly<Record<string, string>> = {
  f: "force",
  t: "tag",
  c: "count",
  v: "verbose",
  q: "quiet",
  h: "help",
} as const;

/** Generic flags suggested for all commands */
export const GENERIC_FLAGS: readonly string[] = [
  "--help",
  "--verbose",
  "--quiet",
  "-h",
  "-v",
  "-q",
] as const;

// ============================================================================
// Table Column Widths
// ============================================================================

/** Column widths for help command table */
export const HELP_TABLE_COLUMN_WIDTHS = {
  command: 20,
  aliases: 15,
} as const;

/** Column widths for history command table */
export const HISTORY_TABLE_COLUMN_WIDTHS = {
  index: 4,
  time: 12,
  type: 12,
} as const;

// ============================================================================
// Box Styles
// ============================================================================

export const BOX_STYLES: Record<BorderStyle, BoxBorderChars> = {
  single: {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    t: "┬",
    b: "┴",
    l: "├",
    r: "┤",
  },
  double: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
    cross: "╬",
    t: "╦",
    b: "╩",
    l: "╠",
    r: "╣",
  },
  rounded: {
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    t: "┬",
    b: "┴",
    l: "├",
    r: "┤",
  },
  bold: {
    topLeft: "┏",
    topRight: "┓",
    bottomLeft: "┗",
    bottomRight: "┛",
    horizontal: "━",
    vertical: "┃",
    cross: "╋",
    t: "┳",
    b: "┻",
    l: "┣",
    r: "┫",
  },
  classic: {
    topLeft: "+",
    topRight: "+",
    bottomLeft: "+",
    bottomRight: "+",
    horizontal: "-",
    vertical: "|",
    cross: "+",
    t: "+",
    b: "+",
    l: "+",
    r: "+",
  },
};
