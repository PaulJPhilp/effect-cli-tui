/**
 * System signal types and error codes
 *
 * Provides type-safe constants for Unix signals, Node.js error codes,
 * and common git command arguments.
 */

/** Unix signal types for process termination */
export type SystemSignal = "SIGINT" | "SIGTERM";

/** Node.js error codes */
export type NodeErrorCode = "ENOENT" | "EACCES" | "ETIMEDOUT";

/** Git command argument arrays */
export const GIT_COMMANDS = {
  /** Get git repository root directory */
  REV_PARSE_TOPLEVEL: ["rev-parse", "--show-toplevel"],
  /** Get current branch name */
  REV_PARSE_BRANCH: ["rev-parse", "--abbrev-ref", "HEAD"],
  /** Get short status summary */
  STATUS_SHORT: ["status", "--short"],
} as const;

/** Signal name constants */
export const SIGNAL_SIGINT: SystemSignal = "SIGINT";
export const SIGNAL_SIGTERM: SystemSignal = "SIGTERM";

/** Error code constants */
export const ERROR_CODE_ENOENT: NodeErrorCode = "ENOENT";
