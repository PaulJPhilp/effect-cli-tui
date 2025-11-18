import chalk from "chalk";
import { Effect } from "effect";
import stringWidth from "string-width";
import { applyChalkStyle } from "../core/colors";
import {
  COLOR_ERROR,
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
      return "cyan"; // Use cyan for brighter, more visible title
    default:
      return "cyan";
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
    const maxContentWidth = Math.max(
      ...lines.map((l) => stringWidth(l)),
      title ? stringWidth(title) : 0
    );
    const maxWidth = maxContentWidth + padding * 2 + 4; // +4 for two borders and two spaces

    let box = "";

    // Top border with optional title
    if (title) {
      const borderLeft = style.topLeft + style.horizontal.repeat(2);
      const titleSpace = ` ${title} `;
      const titleSpaceWidth = stringWidth(titleSpace);
      // Calculate borderRight: maxWidth - borderLeft (3) - titleSpaceWidth - topRight (1)
      const borderRightLength =
        maxWidth - borderLeft.length - titleSpaceWidth - 1;
      const borderRight =
        style.horizontal.repeat(Math.max(0, borderRightLength)) +
        style.topRight;
      const topLine =
        borderLeft +
        applyChalkStyle(titleSpace, { color: typeColor, bold: true }) +
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
        `${style.vertical} ${" ".repeat(maxContentWidth)} ${style.vertical}\n`
      );
    }

    // Content lines
    for (const line of lines) {
      const contentLength = stringWidth(line);
      const spacesNeeded = maxContentWidth - contentLength;
      const paddedLine = `${line}${" ".repeat(spacesNeeded)}`;
      box += chalk.dim(`${style.vertical} ${paddedLine} ${style.vertical}\n`);
    }

    // Bottom padding
    for (let i = 0; i < padding; i++) {
      box += chalk.dim(
        `${style.vertical} ${" ".repeat(maxContentWidth)} ${style.vertical}\n`
      );
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
