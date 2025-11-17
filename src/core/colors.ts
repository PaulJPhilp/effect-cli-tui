import chalk from "chalk";
import { Effect } from "effect";
import type { ChalkBgColor, ChalkColor } from "../types";
import { display } from "./display";
import {
  COLOR_HIGHLIGHT,
  DEFAULT_DISPLAY_TYPE,
  getDisplayColor,
  getDisplayIcon,
  SYMBOL_BULLET,
} from "./icons";

/**
 * Apply chalk styling based on color options
 */
export function applyChalkStyle(
  text: string,
  options?: {
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    inverse?: boolean;
    strikethrough?: boolean;
    color?: ChalkColor;
    bgColor?: ChalkBgColor;
  }
): string {
  if (!options) return text;

  let styled = text;

  // Apply color
  if (options.color) {
    styled = chalk[options.color](styled);
  }
  if (options.bgColor) {
    styled = chalk[options.bgColor](styled);
  }

  // Apply text styles
  if (options.bold) styled = chalk.bold(styled);
  if (options.dim) styled = chalk.dim(styled);
  if (options.italic) styled = chalk.italic(styled);
  if (options.underline) styled = chalk.underline(styled);
  if (options.inverse) styled = chalk.inverse(styled);
  if (options.strikethrough) styled = chalk.strikethrough(styled);

  return styled;
}

/**
 * Display a highlighted message (cyan bold)
 *
 * Uses theme highlight color if available.
 */
export function displayHighlight(message: string): Effect.Effect<void> {
  // Try to get theme highlight color, fallback to default
  let highlightColor: ChalkColor = COLOR_HIGHLIGHT;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const themeModule: {
      getCurrentThemeSync?: () => { colors: { highlight: ChalkColor } };
    } = require("../services/theme/service");
    if (themeModule?.getCurrentThemeSync) {
      const theme = themeModule.getCurrentThemeSync();
      if (theme?.colors?.highlight) {
        highlightColor = theme.colors.highlight;
      }
    }
  } catch {
    // Fallback to default
  }

  const styledMessage = applyChalkStyle(message, {
    bold: true,
    color: highlightColor,
  });
  return display(styledMessage, { type: DEFAULT_DISPLAY_TYPE });
}

/**
 * Display a muted message (dim gray)
 */
export function displayMuted(message: string): Effect.Effect<void> {
  const styledMessage = applyChalkStyle(message, { dim: true });
  return display(styledMessage, { type: DEFAULT_DISPLAY_TYPE });
}

/**
 * Display a warning message (yellow bold with ⚠ prefix)
 *
 * Uses theme warning color and icon if available.
 */
export function displayWarning(message: string): Effect.Effect<void> {
  const warningColor = getDisplayColor("warning");
  const styledMessage = applyChalkStyle(message, {
    color: warningColor as ChalkColor,
    bold: true,
  });
  return display(styledMessage, { prefix: getDisplayIcon("warning") });
}

/**
 * Display an info message (blue)
 *
 * Uses theme info color if available.
 */
export function displayInfo(message: string): Effect.Effect<void> {
  const infoColor = getDisplayColor("info");
  const styledMessage = applyChalkStyle(message, {
    color: infoColor as ChalkColor,
  });
  return display(styledMessage, { type: DEFAULT_DISPLAY_TYPE });
}

/**
 * Display a bullet list item
 *
 * Uses theme highlight color if available and no custom color provided.
 */
export function displayListItem(
  item: string,
  bullet?: string,
  options?: {
    color?: ChalkColor;
  }
): Effect.Effect<void> {
  return Effect.gen(function* () {
    const bulletChar = bullet || SYMBOL_BULLET;

    // Use custom color if provided, otherwise try theme highlight color
    let bulletColor: ChalkColor = options?.color || COLOR_HIGHLIGHT;
    if (!options?.color) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
        const themeModule: {
          getCurrentThemeSync?: () => { colors: { highlight: ChalkColor } };
        } = require("../services/theme/service");
        if (themeModule?.getCurrentThemeSync) {
          const theme = themeModule.getCurrentThemeSync();
          if (theme?.colors?.highlight) {
            bulletColor = theme.colors.highlight;
          }
        }
      } catch {
        // Fallback to default
      }
    }

    const styledBullet = applyChalkStyle(bulletChar, {
      color: bulletColor,
    });
    yield* Effect.log(`\n${styledBullet} ${item}`);
  });
}

// applyChalkStyle is already exported above
