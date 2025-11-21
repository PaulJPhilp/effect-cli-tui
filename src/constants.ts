// This file is the entry point for constants.
// Explicit exports to avoid barrel file linting error
// biome-ignore lint/performance/noBarrelFile: This file is intentionally a central export point for constants
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
