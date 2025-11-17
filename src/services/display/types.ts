import type { ChalkStyleOptions } from "../../types";

/**
 * Display type for message styling
 */
export type DisplayType = "info" | "success" | "error" | "warning";

/**
 * Options for display functions
 */
export interface DisplayOptions {
  type?: DisplayType;
  prefix?: string;
  newline?: boolean;
  style?: ChalkStyleOptions;
}

/**
 * Options for JSON display
 */
export interface JsonDisplayOptions extends Omit<DisplayOptions, "prefix"> {
  spaces?: number;
  /**
   * Show/hide the default prefix icon
   * @default true
   */
  showPrefix?: boolean;
  /**
   * Custom prefix string (overrides default icon when provided)
   */
  customPrefix?: string;
}
