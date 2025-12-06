import { applyChalkStyle } from "@core/colors";
import { getDisplayColor, getDisplayIcon } from "@core/icons";
import type { Theme } from "@services/theme/types";
import type { ChalkColor } from "@/types";
import type { DisplayOptions, DisplayType } from "./types";

/**
 * Format display output with optional theme
 *
 * @param message - The message to display
 * @param type - Display type
 * @param options - Display options
 * @param theme - Optional theme to use
 * @returns Formatted output string
 */
export function formatDisplayOutput(
  message: string,
  type: DisplayType,
  options: DisplayOptions = {},
  theme?: Theme
): string {
  const prefix = options.prefix ?? getDisplayIcon(type, theme);

  // Apply theme color if no custom style provided
  let styledMessage = message;
  let styledPrefix = prefix;

  if (options.style) {
    // Custom style overrides theme
    styledMessage = applyChalkStyle(message, options.style);
    styledPrefix = applyChalkStyle(prefix, options.style);
  } else {
    // Use theme color for message
    const themeColor = getDisplayColor(type, theme);
    styledMessage = applyChalkStyle(message, {
      color: themeColor as ChalkColor,
    });
    styledPrefix = applyChalkStyle(prefix, { color: themeColor as ChalkColor });
  }

  const output =
    options.newline !== false
      ? `\n${styledPrefix} ${styledMessage}`
      : `${styledPrefix} ${styledMessage}`;

  return output;
}
