/**
 * Panel component for structured output
 *
 * Provides a base panel component and specialized panels for common patterns
 * like key-value lists and tables.
 */

import { Box, Text } from "ink";
import type React from "react";

/**
 * Base panel props
 */
export interface PanelProps {
  /**
   * Panel title (displayed at top)
   */
  title: string;

  /**
   * Panel body content (flexible React node or string)
   */
  body: React.ReactNode | string;

  /**
   * Optional footer text
   */
  footer?: string;

  /**
   * Optional border style
   */
  borderStyle?: "single" | "double" | "round" | "bold";

  /**
   * Optional padding
   */
  padding?: number;
}

/**
 * Base Panel component
 *
 * Renders a structured panel with title, body, and optional footer.
 * Uses Ink Box components for layout.
 *
 * @param props - Panel props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Panel
 *   title="STATUS"
 *   body="System is operational"
 *   footer="Last updated: 2024-01-01"
 * />
 * ```
 */
export const Panel: React.FC<PanelProps> = ({
  title,
  body,
  footer,
  borderStyle = "single",
  padding = 1,
}) => {
  const borderChars = {
    single: {
      topLeft: "┌",
      topRight: "┐",
      bottomLeft: "└",
      bottomRight: "┘",
      horizontal: "─",
      vertical: "│",
    },
    double: {
      topLeft: "╔",
      topRight: "╗",
      bottomLeft: "╚",
      bottomRight: "╝",
      horizontal: "═",
      vertical: "║",
    },
    round: {
      topLeft: "╭",
      topRight: "╮",
      bottomLeft: "╰",
      bottomRight: "╯",
      horizontal: "─",
      vertical: "│",
    },
    bold: {
      topLeft: "┏",
      topRight: "┓",
      bottomLeft: "┗",
      bottomRight: "┛",
      horizontal: "━",
      vertical: "┃",
    },
  };

  const chars = borderChars[borderStyle];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Top border with title */}
      <Text dimColor>
        {chars.topLeft}
        {chars.horizontal.repeat(2)}
        <Text bold color="cyan">
          {` ${title} `}
        </Text>
        {chars.horizontal}
        {chars.topRight}
      </Text>

      {/* Body content */}
      <Box flexDirection="column" paddingLeft={padding} paddingRight={padding}>
        {typeof body === "string" ? <Text>{body}</Text> : body}
      </Box>

      {/* Footer if provided */}
      {footer && (
        <Box paddingLeft={padding} paddingRight={padding}>
          <Text dimColor>{footer}</Text>
        </Box>
      )}

      {/* Bottom border */}
      <Text dimColor>
        {chars.bottomLeft}
        {chars.horizontal}
        {chars.bottomRight}
      </Text>
    </Box>
  );
};

/**
 * Key-value item for KeyValuePanel
 */
export interface KeyValueItem {
  /**
   * Key label
   */
  key: string;

  /**
   * Value text
   */
  value: string;
}

/**
 * Key-value panel props
 */
export interface KeyValuePanelProps {
  /**
   * Panel title
   */
  title: string;

  /**
   * Array of key-value pairs
   */
  items: readonly KeyValueItem[];

  /**
   * Optional footer
   */
  footer?: string;
}

/**
 * KeyValuePanel component
 *
 * Renders a panel with key-value pairs in a structured format.
 *
 * @param props - KeyValuePanel props
 * @returns React component
 *
 * @example
 * ```tsx
 * <KeyValuePanel
 *   title="CONFIGURATION"
 *   items={[
 *     { key: "Mode", value: "Development" },
 *     { key: "Workspace", value: "/path/to/project" }
 *   ]}
 * />
 * ```
 */
export const KeyValuePanel: React.FC<KeyValuePanelProps> = ({
  title,
  items,
  footer,
}) => {
  // Calculate max key width for alignment
  const maxKeyWidth = Math.max(...items.map((item) => item.key.length), 0);

  const body = (
    <Box flexDirection="column">
      {items.map((item) => (
        <Box flexDirection="row" key={item.key as string}>
          <Box minWidth={maxKeyWidth + 2}>
            <Text bold color="cyan">
              {item.key}:
            </Text>
          </Box>
          <Box>
            <Text>{item.value}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return <Panel body={body} footer={footer} title={title} />;
};

/**
 * Table column definition for panels
 */
export interface PanelTableColumn {
  /**
   * Column header
   */
  header: string;

  /**
   * Optional fixed/minimum width
   */
  width?: number;
}

/**
 * Table row data
 */
export interface TableRow {
  /**
   * Array of cell values (one per column)
   */
  cells: readonly string[];
}

/**
 * Table panel props
 */
export interface TablePanelProps {
  /**
   * Panel title
   */
  title: string;

  /**
   * Column definitions
   */
  columns: readonly PanelTableColumn[];

  /**
   * Table rows
   */
  rows: readonly TableRow[];

  /**
   * Optional footer
   */
  footer?: string;
}

/**
 * TablePanel component
 *
 * Renders a panel with tabular data.
 *
 * @param props - TablePanel props
 * @returns React component
 *
 * @example
 * ```tsx
 * <TablePanel
 *   title="COMMANDS"
 *   columns={[
 *     { header: "Command", width: 15 },
 *     { header: "Aliases", width: 20 },
 *     { header: "Description" }
 *   ]}
 *   rows={[
 *     { cells: ["/help", "none", "Show available commands"] },
 *     { cells: ["/quit", "/exit", "Exit session"] }
 *   ]}
 * />
 * ```
 */
export const TablePanel: React.FC<TablePanelProps> = ({
  title,
  columns,
  rows,
  footer,
}) => {
  // Calculate column widths
  const columnWidths = columns.map((col, colIndex) => {
    if (col.width) {
      return col.width;
    }
    // Auto-calculate based on content
    const headerWidth = col.header.length;
    const maxCellWidth = Math.max(
      ...rows.map((row) => row.cells[colIndex]?.length ?? 0),
      headerWidth
    );
    return Math.max(maxCellWidth, 10); // Minimum 10 chars
  });

  const renderRow = (cells: readonly string[], isHeader = false) => (
    <Box flexDirection="row">
      {cells.map((cell, colIndex) => {
        const width = columnWidths[colIndex] ?? 10;
        const paddedCell =
          cell.length > width
            ? `${cell.slice(0, width - 3)}...`
            : cell.padEnd(width);
        return (
          <Box key={colIndex} marginRight={1} minWidth={width}>
            {isHeader ? (
              <Text bold color="cyan">
                {paddedCell}
              </Text>
            ) : (
              <Text>{paddedCell}</Text>
            )}
          </Box>
        );
      })}
    </Box>
  );

  const body = (
    <Box flexDirection="column">
      {/* Header row */}
      {renderRow(
        columns.map((col) => col.header),
        true
      )}
      {/* Separator */}
      <Text dimColor>
        {"─".repeat(columnWidths.reduce((sum, w) => sum + w + 1, 0) - 1)}
      </Text>
      {/* Data rows */}
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex}>{renderRow(row.cells)}</Box>
      ))}
    </Box>
  );

  return <Panel body={body} footer={footer} title={title} />;
};
