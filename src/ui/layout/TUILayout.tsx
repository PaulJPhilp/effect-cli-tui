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
import { useEffect, useRef, useState } from "react";

/**
 * Output item types
 */
export type OutputItem =
  | { readonly _tag: "text"; readonly content: string }
  | { readonly _tag: "panel"; readonly panel: React.ReactElement };

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
  outputItems: ReadonlyArray<OutputItem>;

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
  promptMessage,
  inputComponent,
  outputItems,
  statusStrip,
  onScroll,
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const outputRef = useRef<{ scrollTop: number }>({ scrollTop: 0 });

  // Handle scroll keys
  useInput((_input, key) => {
    if (key.upArrow && onScroll) {
      onScroll("up");
      setScrollOffset((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow && onScroll) {
      onScroll("down");
      setScrollOffset((prev) => prev + 1);
    }
  });

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    setScrollOffset(0);
  }, [outputItems.length]);

  // Calculate visible output items based on scroll offset
  // For now, show all items (Ink handles scrolling naturally)
  // In a more advanced implementation, we could limit visible items

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
        {outputItems.length === 0 ? (
          <Box paddingY={1}>
            <Text dimColor>No output yet. Start typing to interact.</Text>
          </Box>
        ) : (
          <Box flexDirection="column">
            {outputItems.map((item, index) => (
              <Box flexDirection="column" key={index}>
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
