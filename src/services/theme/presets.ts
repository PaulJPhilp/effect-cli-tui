import {
  COLOR_ERROR,
  COLOR_HIGHLIGHT,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
} from "../../core/icons";
import type { Theme } from "./types";

/**
 * Default theme matching current behavior
 *
 * Uses the existing icon and color constants.
 * This is the global default theme used throughout the application.
 * Exported from src/theme.ts for public API access.
 */
export const defaultTheme: Theme = {
  icons: {
    success: ICON_SUCCESS,
    error: ICON_ERROR,
    warning: ICON_WARNING,
    info: ICON_INFO,
  },
  colors: {
    success: COLOR_SUCCESS,
    error: COLOR_ERROR,
    warning: COLOR_WARNING,
    info: COLOR_INFO,
    highlight: COLOR_HIGHLIGHT,
  },
};

/**
 * Minimal theme with no icons and simple colors
 *
 * Useful for clean, text-only output.
 */
export const minimalTheme: Theme = {
  icons: {
    success: "",
    error: "",
    warning: "",
    info: "",
  },
  colors: {
    success: COLOR_SUCCESS,
    error: COLOR_ERROR,
    warning: COLOR_WARNING,
    info: COLOR_INFO,
    highlight: COLOR_HIGHLIGHT,
  },
};

/**
 * Dark theme optimized for dark terminal backgrounds
 *
 * Uses brighter colors for better visibility on dark backgrounds.
 */
export const darkTheme: Theme = {
  icons: {
    success: ICON_SUCCESS,
    error: ICON_ERROR,
    warning: ICON_WARNING,
    info: ICON_INFO,
  },
  colors: {
    success: "green",
    error: "red",
    warning: "yellow",
    info: "cyan", // Changed from blue for better visibility
    highlight: "cyan",
  },
};

/**
 * Emoji theme using emoji icons
 *
 * More visually distinctive, especially useful for modern terminals.
 */
export const emojiTheme: Theme = {
  icons: {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  },
  colors: {
    success: "green",
    error: "red",
    warning: "yellow",
    info: "blue",
    highlight: "cyan",
  },
};

/**
 * Preset themes collection
 *
 * Provides easy access to all built-in themes.
 */
export const themes = {
  default: defaultTheme,
  minimal: minimalTheme,
  dark: darkTheme,
  emoji: emojiTheme,
} as const;
