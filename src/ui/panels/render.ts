/**
 * Panel rendering utilities
 *
 * Provides helpers to render panels as formatted text output.
 * These work with the current Console.log architecture and can be
 * upgraded to React components when persistent layout is integrated.
 */

import chalk from "chalk";
import { Console, Effect } from "effect";
import type { KeyValuePanelProps, TablePanelProps } from "./Panel";

/**
 * Render a key-value panel as formatted text
 *
 * Outputs a panel-like structure using Console.log.
 * Compatible with current architecture; can be upgraded to React components later.
 *
 * @param props - KeyValuePanel props
 * @returns Effect that renders the panel
 */
export function renderKeyValuePanel(
  props: KeyValuePanelProps
): Effect.Effect<void> {
  return Effect.gen(function* () {
    yield* Console.log(""); // Blank line before panel

    // Top border with title
    const titleLine = `┌─ ${chalk.cyan.bold(props.title)} ─`;
    yield* Console.log(chalk.dim(titleLine));

    // Key-value pairs
    const maxKeyWidth = Math.max(
      ...props.items.map((item) => item.key.length),
      0
    );

    for (const item of props.items) {
      const keyPadded = item.key.padEnd(maxKeyWidth);
      yield* Console.log(
        chalk.dim("│") + ` ${chalk.cyan.bold(keyPadded)}: ${item.value}`
      );
    }

    // Footer if provided
    if (props.footer) {
      yield* Console.log(chalk.dim(`│ ${props.footer}`));
    }

    // Bottom border
    yield* Console.log(chalk.dim("└─"));

    yield* Console.log(""); // Blank line after panel
  });
}

/**
 * Render a table panel as formatted text
 *
 * Outputs a table-like structure using Console.log.
 *
 * @param props - TablePanel props
 * @returns Effect that renders the panel
 */
export function renderTablePanel(props: TablePanelProps): Effect.Effect<void> {
  return Effect.gen(function* () {
    yield* Console.log(""); // Blank line before panel

    // Top border with title
    const titleLine = `┌─ ${chalk.cyan.bold(props.title)} ─`;
    yield* Console.log(chalk.dim(titleLine));

    // Calculate column widths
    const columnWidths = props.columns.map((col, colIndex) => {
      if (col.width) {
        return col.width;
      }
      const headerWidth = col.header.length;
      const maxCellWidth = Math.max(
        ...props.rows.map((row) => row.cells[colIndex]?.length ?? 0),
        headerWidth
      );
      return Math.max(maxCellWidth, 10);
    });

    // Header row
    const headerCells = props.columns.map((col, colIndex) => {
      const width = columnWidths[colIndex] ?? 10;
      return chalk.cyan.bold(col.header.padEnd(width));
    });
    yield* Console.log(chalk.dim("│") + ` ${headerCells.join(" ")}`);

    // Separator
    const separatorLength =
      columnWidths.reduce((sum, w) => sum + w, 0) + (columnWidths.length - 1);
    yield* Console.log(chalk.dim(`│${"─".repeat(separatorLength + 2)}`));

    // Data rows
    for (const row of props.rows) {
      const cells = row.cells.map((cell, colIndex) => {
        const width = columnWidths[colIndex] ?? 10;
        const paddedCell =
          cell.length > width
            ? `${cell.slice(0, width - 3)}...`
            : cell.padEnd(width);
        return paddedCell;
      });
      yield* Console.log(chalk.dim("│") + ` ${cells.join(" ")}`);
    }

    // Footer if provided
    if (props.footer) {
      yield* Console.log(chalk.dim(`│ ${props.footer}`));
    }

    // Bottom border
    yield* Console.log(chalk.dim("└─"));

    yield* Console.log(""); // Blank line after panel
  });
}
