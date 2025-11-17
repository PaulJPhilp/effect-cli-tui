import chalk from "chalk";
import { Effect } from "effect";
import { applyChalkStyle } from "../core/colors";
import {
  COLOR_ERROR,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  DEFAULT_DISPLAY_TYPE,
} from "../core/icons";
import type { BorderStyle, DisplayType } from "../types";

export interface BoxStyle {
  borderStyle?: BorderStyle;
  type?: DisplayType;
  title?: string;
  padding?: number;
  margin?: number;
  dimBorder?: boolean;
}

const BOX_STYLES = {
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

function getTypeColor(type?: "info" | "success" | "error" | "warning"): string {
  switch (type) {
    case "success":
      return COLOR_SUCCESS;
    case "error":
      return COLOR_ERROR;
    case "warning":
      return COLOR_WARNING;
    case "info":
      return COLOR_INFO;
    default:
      return COLOR_INFO;
  }
}

/**
 * Display content in a styled box with borders
 */
export function displayBox(
  content: string,
  options?: BoxStyle
): Effect.Effect<void> {
  return Effect.sync(() => {
    const borderStyle = options?.borderStyle || "rounded";
    const style = BOX_STYLES[borderStyle];
    const type = options?.type || DEFAULT_DISPLAY_TYPE;
    const title = options?.title;
    const padding = options?.padding || 0;
    const typeColor = getTypeColor(type) as
      | "black"
      | "red"
      | "green"
      | "yellow"
      | "blue"
      | "magenta"
      | "cyan"
      | "white"
      | "gray";

    const lines = content.split("\n");
    const maxWidth =
      Math.max(...lines.map((l) => l.length), title?.length || 0) +
      padding * 2 +
      2;

    let box = "";

    // Top border with optional title
    if (title) {
      const borderLeft = style.topLeft + style.horizontal.repeat(2);
      const titleSpace = ` ${title} `;
      // Calculate borderRight: maxWidth - borderLeft (3) - titleSpace (title.length + 2) - topRight (1)
      const borderRightLength =
        maxWidth - borderLeft.length - titleSpace.length - 1;
      const borderRight =
        style.horizontal.repeat(Math.max(0, borderRightLength)) +
        style.topRight;
      const topLine =
        borderLeft +
        applyChalkStyle(titleSpace, { color: typeColor }) +
        borderRight;
      box += chalk.dim(`${topLine}\n`);
    } else {
      box += chalk.dim(
        `${style.topLeft + style.horizontal.repeat(maxWidth - 2) + style.topRight}\n`
      );
    }

    // Top padding
    for (let i = 0; i < padding; i++) {
      box += chalk.dim(
        `${style.vertical} ${" ".repeat(maxWidth - 2)} ${style.vertical}\n`
      );
      " ".repeat(maxWidth - 2) + chalk.dim(`${style.vertical}\n`);
    }

    // Content lines
    for (const line of lines) {
      const contentLength = line.length;
      const paddedLine = `${line} ${" ".repeat(maxWidth - contentLength - 2)}`;
      box += chalk.dim(`${style.vertical} ${paddedLine} ${style.vertical}\n`);
    }

    // Bottom padding
    for (let i = 0; i < padding; i++) {
      box += chalk.dim(
        `${style.vertical} ${" ".repeat(maxWidth - 2)} ${style.vertical}\n`
      );
      " ".repeat(maxWidth - 2) + chalk.dim(`${style.vertical}\n`);
    }

    // Bottom border
    box += chalk.dim(
      `${style.bottomLeft + style.horizontal.repeat(maxWidth - 2) + style.bottomRight}\n`
    );

    console.log(`\n${box}\n`);
  });
}

/**
 * Display content in a titled panel (convenience wrapper)
 */
export function displayPanel(
  content: string,
  title: string,
  options?: BoxStyle
): Effect.Effect<void> {
  return displayBox(content, { ...options, title });
}
