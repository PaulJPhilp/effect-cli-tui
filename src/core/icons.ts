import { getCurrentThemeSync } from '../services/theme/service'
import type { ChalkColor } from '../types'

/**
 * Display icons/symbols used throughout the CLI TUI
 *
 * These constants provide consistent, meaningful names for display symbols
 * used in messages, prompts, and UI components.
 */

/** Success/checkmark icon (✓) */
export const ICON_SUCCESS = '✓'

/** Error/cross icon (✗) */
export const ICON_ERROR = '✗'

/** Warning icon (⚠) */
export const ICON_WARNING = '⚠'

/** Info icon (ℹ) */
export const ICON_INFO = 'ℹ'

/**
 * ANSI escape sequences for terminal control
 */

/** ANSI escape sequence to show the cursor */
export const ANSI_SHOW_CURSOR = '\x1B[?25h'

/** ANSI escape sequence to hide the cursor */
export const ANSI_HIDE_CURSOR = '\x1B[?25l'

/** ANSI escape sequence to clear the current line */
export const ANSI_CLEAR_LINE = '\x1B[K'

/** ANSI escape sequence for carriage return (move cursor to start of line) */
export const ANSI_CARRIAGE_RETURN = '\r'

/** ANSI escape sequence for carriage return + clear line */
export const ANSI_CARRIAGE_RETURN_CLEAR = '\r\x1B[K'

/**
 * Process exit codes
 */

/** Standard exit code for SIGINT (Ctrl+C) */
export const EXIT_CODE_SIGINT = 130

/** Standard exit code for SIGTERM */
export const EXIT_CODE_SIGTERM = 143

/**
 * Spinner constants
 */

/** Default spinner type */
export const SPINNER_DEFAULT_TYPE = 'dots' as const

/** Default spinner interval in milliseconds */
export const SPINNER_DEFAULT_INTERVAL = 100

/** Default success message for spinner */
export const SPINNER_MESSAGE_DONE = 'Done!'

/** Default error message for spinner */
export const SPINNER_MESSAGE_FAILED = 'Failed!'

/**
 * UI symbols
 */

/** Bullet point character */
export const SYMBOL_BULLET = '•'

/**
 * Default display type
 */
export const DEFAULT_DISPLAY_TYPE = 'info' as const

/**
 * Display type color mappings
 */
export const COLOR_SUCCESS = 'green' as const
export const COLOR_ERROR = 'red' as const
export const COLOR_WARNING = 'yellow' as const
export const COLOR_INFO = 'blue' as const
export const COLOR_HIGHLIGHT = 'cyan' as const
export const COLOR_DEFAULT = COLOR_INFO

/**
 * Get the appropriate icon for a display type
 *
 * Uses the current theme if available, otherwise falls back to default icons.
 *
 * @param type - The display type
 * @returns The corresponding icon symbol
 */
export function getDisplayIcon(type: 'info' | 'success' | 'error' | 'warning'): string {
  const theme = getCurrentThemeSync()
  switch (type) {
    case 'success':
      return theme.icons.success
    case 'error':
      return theme.icons.error
    case 'warning':
      return theme.icons.warning
    case 'info':
      return theme.icons.info
    default:
      return ICON_INFO
  }
}

/**
 * Get the appropriate color for a display type
 *
 * Uses the current theme if available, otherwise falls back to default colors.
 *
 * @param type - The display type
 * @returns The corresponding color
 */
export function getDisplayColor(type: 'info' | 'success' | 'error' | 'warning'): ChalkColor {
  const theme = getCurrentThemeSync()
  switch (type) {
    case 'success':
      return theme.colors.success
    case 'error':
      return theme.colors.error
    case 'warning':
      return theme.colors.warning
    case 'info':
      return theme.colors.info
    default:
      return COLOR_INFO
  }
}
