import chalk from "chalk";
import { Effect } from "effect";
import { table } from "table";
import { applyChalkStyle } from "../core/colors";
import type { ChalkColor, DisplayType, TableAlignment } from "../types";

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  width?: number;
  align?: TableAlignment;
  truncate?: boolean;
  formatter?: (value: unknown) => string;
}

export interface TableOptions<T> {
  columns: TableColumn<T>[];
  type?: DisplayType;
  style?: {
    color?: ChalkColor;
    bold?: boolean;
  };
  bordered?: boolean;
  head?: {
    color?: ChalkColor;
    bold?: boolean;
  };
  stripColors?: boolean;
}

/**
 * Display a formatted table with structured data
 */
export function displayTable<T>(
  data: T[],
  options: TableOptions<T>
): Effect.Effect<void> {
  return Effect.sync(() => {
    if (!data || data.length === 0) {
      console.log("\nℹ No data to display\n");
      return;
    }

    // Prepare headers
    const headers = options.columns.map((col) => {
      const header = col.header;
      return options.head
        ? applyChalkStyle(header, options.head)
        : chalk.bold(header);
    });

    // Prepare rows
    const rows = data.map((row) =>
      options.columns.map((col) => {
        let value = (row as Record<string, unknown>)[col.key as string];

        // Apply formatter if provided
        if (col.formatter) {
          value = col.formatter(value);
        }

        // Apply style if provided
        const stringValue = String(value || "");
        return options.style
          ? applyChalkStyle(stringValue, options.style)
          : stringValue;
      })
    );

    // Combine headers and rows
    const tableData = [headers, ...rows];

    // Table options
    const tableConfig: any = {
      drawHorizontalLine: options.bordered ? () => true : () => false,
    };

    if (options.bordered) {
      tableConfig.border = {
        topBody: "─",
        topJoin: "┬",
        topLeft: "┌",
        topRight: "┐",
        bottomBody: "─",
        bottomJoin: "┴",
        bottomLeft: "└",
        bottomRight: "┘",
        bodyLeft: "│",
        bodyRight: "│",
        bodyJoin: "│",
        joinBody: "─",
        joinLeft: "├",
        joinRight: "┤",
        joinJoin: "┼",
      };
    }

    // Add column configs
    if (options.columns.some((col) => col.width || col.align || col.truncate)) {
      tableConfig.columns = {};
      options.columns.forEach((col, index) => {
        tableConfig.columns[index] = {
          // width: col.width,
          alignment:
            col.align === "right"
              ? "right"
              : col.align === "center"
                ? "center"
                : "left",
          // truncate: col.truncate ? 100 : undefined,
        };
      });
    }

    const output = table(tableData, tableConfig);
    console.log(`\n${output}\n`);
  });
}
