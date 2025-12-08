import { applyChalkStyle } from "@core/colors";
import { Terminal } from "@core/terminal";
import type { DisplayType } from "@services/display/types";
import chalk from "chalk";
import { Effect } from "effect";
import { table } from "table";
import type { ChalkColor, TableAlignment } from "@/types";

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
): Effect.Effect<void, never, Terminal> {
  return Effect.gen(function* () {
    const terminal = yield* Terminal;

    if (!data || data.length === 0) {
      yield* terminal.line("\nℹ No data to display");
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
    let tableConfig: {
      drawHorizontalLine: () => boolean;
      border?: {
        topBody: string;
        topJoin: string;
        topLeft: string;
        topRight: string;
        bottomBody: string;
        bottomJoin: string;
        bottomLeft: string;
        bottomRight: string;
        bodyLeft: string;
        bodyRight: string;
        bodyJoin: string;
        joinBody: string;
        joinLeft: string;
        joinRight: string;
        joinJoin: string;
      };
      columns?: Record<number, { alignment?: "left" | "center" | "right" }>;
    } = {
      drawHorizontalLine: options.bordered ? () => true : () => false,
    };
    if (options.bordered) {
      tableConfig = {
        ...tableConfig,
        border: {
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
        },
      };
    }

    // Add column configs
    if (options.columns.some((col) => col.width || col.align || col.truncate)) {
      tableConfig.columns = {};
      options.columns.forEach((col, index) => {
        if (tableConfig.columns) {
          let alignment: "left" | "center" | "right" = "left";
          if (col.align === "right") {
            alignment = "right";
          } else if (col.align === "center") {
            alignment = "center";
          }
          tableConfig.columns[index] = {
            // width: col.width,
            alignment,
            // truncate: col.truncate ? 100 : undefined,
          };
        }
      });
    }

    const output = table(tableData, tableConfig);
    yield* terminal.line(`\n${output}`);
  });
}
