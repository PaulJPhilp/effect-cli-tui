import chalk from "chalk";
import { Console, Effect } from "effect";
import stringWidth from "string-width";
import { applyChalkStyle } from "../../core/colors";
import type { ChalkColor } from "../../types";
import type { BoxStyle } from "./box-style";
import { initializeBoxStyling } from "./box-style";

/**
 * Calculate the maximum content width needed for the box
 */
function calculateContentWidth(lines: string[], title?: string): number {
  const contentWidths = lines.map((line) => stringWidth(line));
  const titleWidth = title ? stringWidth(title) : 0;
  return Math.max(...contentWidths, titleWidth, 0);
}

/**
 * Calculate the total box width including padding and borders
 */
function calculateBoxWidth(contentWidth: number, padding: number): number {
  return contentWidth + padding * 2 + 4; // +4 for two borders and two spaces
}

/**
 * Render the top border line
 */
function renderTopBorder(
  style: { topLeft: string; topRight: string; horizontal: string },
  width: number,
  title?: string,
  titleColor?: string
): string {
  const borderWidth = width - 2; // Subtract corner chars

  if (title) {
    const titleSpace = ` ${title} `;
    const titleSpaceWidth = stringWidth(titleSpace);
    const borderLeft = style.topLeft + style.horizontal.repeat(2);
    const borderRightLength = Math.max(
      0,
      borderWidth - borderLeft.length - titleSpaceWidth
    );
    const borderRight =
      style.horizontal.repeat(borderRightLength) + style.topRight;
    const styledTitle = titleColor
      ? applyChalkStyle(titleSpace, {
          color: titleColor as ChalkColor,
          bold: true,
        })
      : titleSpace;
    return borderLeft + styledTitle + borderRight;
  }

  return style.topLeft + style.horizontal.repeat(borderWidth) + style.topRight;
}

/**
 * Render a content line with padding
 */
function renderContentLine(
  line: string,
  style: { vertical: string },
  contentWidth: number
): string {
  const lineWidth = stringWidth(line);
  const padding = " ".repeat(contentWidth - lineWidth);
  return `${style.vertical} ${line}${padding} ${style.vertical}`;
}

/**
 * Render a padding line (empty line with borders)
 */
function renderPaddingLine(
  style: { vertical: string },
  contentWidth: number
): string {
  const spaces = " ".repeat(contentWidth);
  return `${style.vertical} ${spaces} ${style.vertical}`;
}

/**
 * Render the bottom border line
 */
function renderBottomBorder(
  style: { bottomLeft: string; bottomRight: string; horizontal: string },
  width: number
): string {
  const borderWidth = width - 2; // Subtract corner chars
  return (
    style.bottomLeft + style.horizontal.repeat(borderWidth) + style.bottomRight
  );
}

/**
 * Build all box lines as an array
 */
function buildBoxLines(
  content: string,
  styling: {
    style: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
      horizontal: string;
      vertical: string;
    };
    title?: string;
    padding: number;
    typeColor: string;
  }
): string[] {
  const lines = content.split("\n");
  const contentWidth = calculateContentWidth(lines, styling.title);
  const boxWidth = calculateBoxWidth(contentWidth, styling.padding);
  const outputLines: string[] = [];

  // Top border
  outputLines.push(
    renderTopBorder(styling.style, boxWidth, styling.title, styling.typeColor)
  );

  // Top padding
  for (let i = 0; i < styling.padding; i++) {
    outputLines.push(renderPaddingLine(styling.style, contentWidth));
  }

  // Content lines
  for (const line of lines) {
    outputLines.push(renderContentLine(line, styling.style, contentWidth));
  }

  // Bottom padding
  for (let i = 0; i < styling.padding; i++) {
    outputLines.push(renderPaddingLine(styling.style, contentWidth));
  }

  // Bottom border
  outputLines.push(renderBottomBorder(styling.style, boxWidth));

  return outputLines;
}

/**
 * Apply dim styling to border lines
 */
function applyBorderStyling(lines: string[]): string[] {
  return lines.map((line) => chalk.dim(line));
}

/**
 * Add margin (empty lines) around the box
 */
function addMargin(lines: string[], margin: number): string[] {
  if (margin <= 0) {
    return lines;
  }
  const emptyLines = new Array(margin).fill("");
  return [...emptyLines, ...lines, ...emptyLines];
}

/**
 * Display content in a styled box with borders
 *
 * @param content - The content to display in the box
 * @param options - Box styling options
 * @returns Effect that displays the box
 *
 * @example
 * ```ts
 * yield* displayBox('Hello, world!', {
 *   borderStyle: 'rounded',
 *   title: 'Greeting',
 *   padding: 1,
 *   type: 'success'
 * })
 * ```
 */
export function displayBox(
  content: string,
  options?: BoxStyle
): Effect.Effect<void> {
  return Effect.gen(function* () {
    // Initialize styling - handle title validation gracefully
    // If title validation fails (e.g., too long), use the original title string
    const styling = yield* Effect.try({
      try: () => initializeBoxStyling(options),
      catch: () => {
        // If title validation fails, create styling with unvalidated title
        // This allows long titles to be displayed even if they exceed limits
        if (options?.title) {
          const { title, ...restOptions } = options;
          const baseStyling = initializeBoxStyling(restOptions);
          // Override with unvalidated title
          // We bypass Title validation to allow long titles
          return {
            ...baseStyling,
            title: title as unknown as typeof baseStyling.title,
          } as ReturnType<typeof initializeBoxStyling>;
        }
        return initializeBoxStyling(options);
      },
    }).pipe(
      Effect.catchAll((fallbackStyling) => Effect.succeed(fallbackStyling))
    );

    // Build box lines
    const boxLines = buildBoxLines(content, styling);

    // Apply border styling (dim)
    const styledLines = applyBorderStyling(boxLines);

    // Add margin if specified
    const finalLines = addMargin(styledLines, options?.margin ?? 0);

    // Output box lines using Console directly
    // (DisplayService adds prefixes/icons which we don't want for box borders)
    const boxOutput = finalLines.join("\n");
    yield* Console.log(`\n${boxOutput}\n`);
  });
}

/**
 * Display content in a titled panel (convenience wrapper)
 *
 * @param content - The content to display
 * @param title - The panel title
 * @param options - Additional box styling options
 * @returns Effect that displays the panel
 *
 * @example
 * ```ts
 * yield* displayPanel('Content here', 'Panel Title', {
 *   borderStyle: 'double',
 *   type: 'info'
 * })
 * ```
 */
export function displayPanel(
  content: string,
  title: string,
  options?: BoxStyle
): Effect.Effect<void> {
  return displayBox(content, { ...options, title });
}
