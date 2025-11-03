import { Effect } from 'effect'
import chalk from 'chalk'
import { display } from './display'

/**
 * Apply chalk styling based on color options
 */
export function applyChalkStyle(
  text: string,
  options?: {
    bold?: boolean
    dim?: boolean
    italic?: boolean
    underline?: boolean
    inverse?: boolean
    strikethrough?: boolean
    color?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'
    bgColor?: 'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite'
  }
): string {
  if (!options) return text

  let styled = text

  // Apply color
  if (options.color) {
    styled = chalk[options.color](styled)
  }
  if (options.bgColor) {
    styled = chalk[options.bgColor](styled)
  }

  // Apply text styles
  if (options.bold) styled = chalk.bold(styled)
  if (options.dim) styled = chalk.dim(styled)
  if (options.italic) styled = chalk.italic(styled)
  if (options.underline) styled = chalk.underline(styled)
  if (options.inverse) styled = chalk.inverse(styled)
  if (options.strikethrough) styled = chalk.strikethrough(styled)

  return styled
}

/**
 * Display a highlighted message (cyan bold)
 */
export function displayHighlight(message: string): Effect.Effect<void> {
  const styledMessage = applyChalkStyle(message, { bold: true, color: 'cyan' })
  return display(styledMessage, { type: 'info' })
}

/**
 * Display a muted message (dim gray)
 */
export function displayMuted(message: string): Effect.Effect<void> {
  const styledMessage = applyChalkStyle(message, { dim: true })
  return display(styledMessage, { type: 'info' })
}

/**
 * Display a warning message (yellow bold with ⚠ prefix)
 */
export function displayWarning(message: string): Effect.Effect<void> {
  const styledMessage = applyChalkStyle(message, { color: 'yellow', bold: true })
  return display(styledMessage, { prefix: '⚠' })
}

/**
 * Display an info message (blue)
 */
export function displayInfo(message: string): Effect.Effect<void> {
  const styledMessage = applyChalkStyle(message, { color: 'blue' })
  return display(styledMessage, { type: 'info' })
}

/**
 * Display a bullet list item
 */
export function displayListItem(
  item: string,
  bullet?: string,
  options?: { color?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' }
): Effect.Effect<void> {
  return Effect.sync(() => {
    const bulletChar = bullet || '•'
    const styledBullet = applyChalkStyle(bulletChar, { color: options?.color || 'cyan' })
    console.log(`\n${styledBullet} ${item}`)
  })
}

// applyChalkStyle is already exported above
