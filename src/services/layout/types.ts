/**
 * Layout service types
 */

import type { OutputItem as LayoutOutputItem } from "@ui/layout/TUILayout";
import type React from "react";

/**
 * Re-export OutputItem from layout component
 */
export type OutputItem = LayoutOutputItem;

/**
 * Layout state
 */
export interface LayoutState {
  /**
   * Current output items (text + panels)
   */
  readonly outputItems: readonly OutputItem[];

  /**
   * Optional status strip content
   */
  readonly statusStrip?: React.ReactNode;
}
