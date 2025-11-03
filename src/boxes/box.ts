import { Effect } from 'effect';
import chalk from 'chalk';
import { applyChalkStyle } from '../core/colors';

export interface BoxStyle {
  borderStyle?: 'single' | 'double' | 'rounded' | 'bold' | 'classic';
  type?: 'info' | 'success' | 'error' | 'warning';
  title?: string;
  padding?: number;
  margin?: number;
  dimBorder?: boolean;
}

const BOX_STYLES = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    t: '┬',
    b: '┴',
    l: '├',
    r: '┤',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
    cross: '╬',
    t: '╦',
    b: '╩',
    l: '╠',
    r: '╣',
  },
  rounded: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    t: '┬',
    b: '┴',
    l: '├',
    r: '┤',
  },
  bold: {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
    cross: '╋',
    t: '┳',
    b: '┻',
    l: '┣',
    r: '┫',
  },
  classic: {
    topLeft: '+',
    topRight: '+',
    bottomLeft: '+',
    bottomRight: '+',
    horizontal: '-',
    vertical: '|',
    cross: '+',
    t: '+',
    b: '+',
    l: '+',
    r: '+',
  },
};

function getTypeColor(type?: 'info' | 'success' | 'error' | 'warning'): string {
  switch (type) {
    case 'success':
      return 'green';
    case 'error':
      return 'red';
    case 'warning':
      return 'yellow';
    case 'info':
    default:
      return 'blue';
  }
}

/**
 * Display content in a styled box with borders
 */
export function displayBox(content: string, options?: BoxStyle): Effect.Effect<void> {
  return Effect.sync(() => {
    const borderStyle = options?.borderStyle || 'rounded';
    const style = BOX_STYLES[borderStyle];
    const type = options?.type || 'info';
    const title = options?.title;
    const padding = options?.padding || 0;
    const typeColor = getTypeColor(type) as 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';

    const lines = content.split('\n');
    const maxWidth = Math.max(...lines.map((l) => l.length), title?.length || 0) + padding *
2 + 2;

    let box = '';

    // Top border with optional title
    if (title) {
      const borderLeft = style.topLeft + style.horizontal.repeat(2);
      const titleSpace = ` ${title} `;
      const borderRight = style.horizontal.repeat(Math.max(0, maxWidth - title.length -
borderLeft.length - 2)) + style.topRight;
      const topLine = borderLeft + applyChalkStyle(titleSpace, {color: typeColor}) + borderRight;
      box += chalk.dim(topLine) + '\n';
    } else {
      box += chalk.dim(style.topLeft + style.horizontal.repeat(maxWidth - 2) +
style.topRight) + '\n';
    }

    // Top padding
    for (let i = 0; i < padding; i++) {
      box += chalk.dim(style.vertical) + ' '.repeat(maxWidth - 2) + chalk.dim(style.vertical)
 + '\n';
    }

    // Content lines
    lines.forEach((line) => {
      const contentLength = line.length;
      const paddedLine = line + ' '.repeat(maxWidth - contentLength - 2);
      box += chalk.dim(style.vertical) + ' ' + paddedLine + ' ' + chalk.dim(style.vertical) +
 '\n';
    });

    // Bottom padding
    for (let i = 0; i < padding; i++) {
      box += chalk.dim(style.vertical) + ' '.repeat(maxWidth - 2) + chalk.dim(style.vertical)
 + '\n';
    }

    // Bottom border
    box += chalk.dim(style.bottomLeft + style.horizontal.repeat(maxWidth - 2) +
style.bottomRight) + '\n';

    console.log('\n' + box + '\n');
  });
}

/**
 * Display content in a titled panel (convenience wrapper)
 */
export function displayPanel(
  content: string,
  title: string,
  options?: BoxStyle
): Effect.Effect<void> {
  return displayBox(content, { ...options, title });
}
