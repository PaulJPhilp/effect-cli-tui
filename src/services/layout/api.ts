/**
 * Layout service API interface
 */

import type { Effect } from "effect";
import type React from "react";
import type { LayoutError } from "./errors";
import type { OutputItem } from "./types";

/**
 * Layout service API
 *
 * Manages persistent TUI layout state including output items and panels.
 */
export interface LayoutService {
  /**
   * Add a text output item
   *
   * @param content - Text content to add
   * @returns Effect that adds the text to output
   */
  addText: (content: string) => Effect.Effect<void, LayoutError>;

  /**
   * Add a panel output item
   *
   * @param panel - Panel React element to add
   * @returns Effect that adds the panel to output
   */
  addPanel: (panel: React.ReactElement) => Effect.Effect<void, LayoutError>;

  /**
   * Clear all output items
   *
   * @returns Effect that clears output
   */
  clearOutput: () => Effect.Effect<void, LayoutError>;

  /**
   * Get current output items
   *
   * @returns Effect that resolves with current output items
   */
  getOutputItems: () => Effect.Effect<readonly OutputItem[], LayoutError>;

  /**
   * Set status strip content
   *
   * @param content - Status strip React node
   * @returns Effect that sets status strip
   */
  setStatusStrip: (
    content: React.ReactNode
  ) => Effect.Effect<void, LayoutError>;

  /**
   * Clear status strip
   *
   * @returns Effect that clears status strip
   */
  clearStatusStrip: () => Effect.Effect<void, LayoutError>;
}
