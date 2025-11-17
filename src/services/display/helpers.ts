import { applyChalkStyle } from "../../core/colors";
import { getDisplayColor, getDisplayIcon } from "../../core/icons";
import type { DisplayOptions, DisplayType } from "./types";

/**
 * Internal helper to format and style display output
 *
 * Uses theme colors and icons when available.
 *
 * @param message - The message to display
 * @param type - Display type
 * @param options - Display options
 * @returns Formatted output string
 */
export function formatDisplayOutput(
  message: string,
  type: DisplayType,
  options: DisplayOptions = {}
): string {
  const prefix = options.prefix ?? getDisplayIcon(type);

  // Apply theme color if no custom style provided
  let styledMessage = message;
  let styledPrefix = prefix;

  if (options.style) {
    // Custom style overrides theme
    styledMessage = applyChalkStyle(message, options.style);
    styledPrefix = applyChalkStyle(prefix, options.style);
  } else {
    // Use theme color for message
    const themeColor = getDisplayColor(type);
    styledMessage = applyChalkStyle(message, { color: themeColor as any });
    styledPrefix = applyChalkStyle(prefix, { color: themeColor as any });
  }

  const output =
    options.newline !== false
      ? `\n${styledPrefix} ${styledMessage}`
      : `${styledPrefix} ${styledMessage}`;

  return output;
}
