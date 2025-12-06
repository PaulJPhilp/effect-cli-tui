/**
 * Persistent TUI Layout component
 *
 * Provides a layout with:
 * - Scrollable main content area (for history + panels)
 * - Pinned input bar at bottom (always visible)
 * - Optional status strip
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

/**
 * Output item types
 */
export interface TextOutputItem {
  readonly _tag: "text";
  readonly content: string;
  readonly id?: string;
}

export interface PanelOutputItem {
  readonly _tag: "panel";
  readonly panel: React.ReactElement;
  readonly id?: string;
}

export type OutputItem = TextOutputItem | PanelOutputItem;

/**
 * Generate a stable key for an output item
 */
function getItemKey(item: OutputItem, index: number): string {
  if (item.id) {
    return item.id;
  }
  // Use content hash for text items, or fall back to index with tag prefix
  if (item._tag === "text") {
    // Simple hash based on content and position
    return `text-${index}-${item.content.slice(0, 20).replace(/\s/g, "_")}`;
  }
  return `panel-${index}`;
}

/**
 * TUI Layout props
 */
export interface TUILayoutProps {
  /**
   * Current input prompt message
   */
  promptMessage: string;

  /**
   * Input component to render in pinned area
   */
  inputComponent: React.ReactElement;

  /**
   * Output items to display in main area
   */
  outputItems: readonly OutputItem[];

  /**
   * Optional status strip content (e.g., cwd, mode, kits)
   */
  statusStrip?: React.ReactNode;

  /**
   * Callback when output should be scrolled
   */
  onScroll?: (direction: "up" | "down") => void;
}

/**
 * TUI Layout component
 *
 * Provides a persistent layout with pinned input and scrollable content.
 *
 * @param props - Layout props
 * @returns React component
 */
export const TUILayout: React.FC<TUILayoutProps> = ({
  promptMessage: _promptMessage,
  inputComponent,
  outputItems,
  statusStrip,
  onScroll,
}) => {
  // Track scroll position for future virtual scrolling implementation
  const [_scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll keys
  const handleScroll = useCallback(
    (direction: "up" | "down") => {
      if (onScroll) {
        onScroll(direction);
      }
      setScrollPosition((prev) =>
        direction === "up" ? Math.max(0, prev - 1) : prev + 1
      );
    },
    [onScroll]
  );

  useInput((_input, key) => {
    if (key.upArrow) {
      handleScroll("up");
    } else if (key.downArrow) {
      handleScroll("down");
    }
  });

  // Memoize output items with stable keys
  const outputItemsWithKeys: ReadonlyArray<{ item: OutputItem; key: string }> =
    useMemo(
      () =>
        outputItems.map((item, index) => ({
          item,
          key: getItemKey(item, index),
        })),
      [outputItems]
    );

  return (
    <Box flexDirection="column" height="100%">
      {/* Optional status strip */}
      {statusStrip && (
        <Box
          borderBottom={true}
          borderStyle="single"
          borderTop={false}
          height={1}
          paddingX={1}
        >
          {statusStrip}
        </Box>
      )}

      {/* Main content area - scrollable */}
      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {outputItemsWithKeys.length === 0 ? (
          <Box paddingY={1}>
            <Text dimColor>No output yet. Start typing to interact.</Text>
          </Box>
        ) : (
          <Box flexDirection="column">
            {outputItemsWithKeys.map(({ item, key }) => (
              <Box flexDirection="column" key={key}>
                {item._tag === "text" ? (
                  <Text>{item.content}</Text>
                ) : (
                  item.panel
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Separator line */}
      <Box borderStyle="single" borderTop={true} marginY={0}>
        <Text dimColor>{"─".repeat(50)}</Text>
      </Box>

      {/* Pinned input area */}
      <Box flexDirection="column" minHeight={3}>
        {inputComponent}
      </Box>
    </Box>
  );
};
