/**
 * Layout service types
 */

import type React from "react";
import type { OutputItem as LayoutOutputItem } from "../../ui/layout/TUILayout";

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
  readonly outputItems: ReadonlyArray<OutputItem>;

  /**
   * Optional status strip content
   */
  readonly statusStrip?: React.ReactNode;
}
