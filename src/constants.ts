// This file is the entry point for constants.
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
  getDisplayColor,
  getDisplayIcon,
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
  SYMBOL_BULLET,
} from "./core/icons";

import type { DisplayType } from "./types";

// Display constants
export const DEFAULT_DISPLAY_TYPE = "info" satisfies DisplayType;

// Title constraints
export const MIN_TITLE_LENGTH = 1;
export const MAX_TITLE_LENGTH = 100;

// ============================================================================
// UI Formatting Constants
// ============================================================================

/** Width for separator lines (e.g., "=".repeat(SEPARATOR_WIDTH)) */
export const SEPARATOR_WIDTH = 60;

/** Minimum length to show partial API key instead of full masking */
export const API_KEY_MIN_VISIBLE_LENGTH = 8;

/** Number of characters to show at start and end of masked API key */
export const API_KEY_VISIBLE_CHARS = 4;

/** Maximum content length before truncating with ellipsis */
export const CONTENT_TRUNCATION_LENGTH = 80;

/** Multiplier to convert decimal score (0-1) to percentage (0-100) */
export const SCORE_PERCENTAGE_MULTIPLIER = 100;

/** Number of decimal places for score display */
export const SCORE_DECIMAL_PLACES = 1;

// ============================================================================
// Timeout Constants
// ============================================================================

/** Timeout in milliseconds for git command operations */
export const GIT_COMMAND_TIMEOUT_MS = 5000;

/** Conversion factor from milliseconds to seconds */
export const MILLISECONDS_PER_SECOND = 1000;

// ============================================================================
// Logging Constants
// ============================================================================

/** Maximum number of entries to keep in tool call log */
export const MAX_LOG_ENTRIES = 1000;

// ============================================================================
// Supermemory Constants
// ============================================================================

/** Default number of results to return from search */
export const DEFAULT_SEARCH_TOP_K = 5;

/** Default similarity threshold for search results (0-1) */
export const DEFAULT_SEARCH_THRESHOLD = 0.5;

/** Expected prefix for Supermemory API keys */
export const SUPERMEMORY_API_KEY_PREFIX = "sk_";

/** Default limit for history display */
export const DEFAULT_HISTORY_LIMIT = 20;

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
