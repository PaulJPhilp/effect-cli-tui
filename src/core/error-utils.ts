/**
 * Error checking utilities
 *
 * Provides robust error type checking with fallback support for environments
 * that don't yet support Error.isError().
 */

/**
 * Check if a value is an Error instance
 *
 * Uses Error.isError() when available (ECMAScript 2026+), otherwise
 * falls back to instanceof Error check.
 *
 * This is more robust than instanceof Error because it works across realms
 * and avoids false positives/negatives.
 *
 * @param value - The value to check
 * @returns true if value is an Error instance
 *
 * @example
 * ```ts
 * if (isError(err)) {
 *   console.log(err.message)
 * }
 * ```
 */
export function isError(value: unknown): value is Error {
  // Use Error.isError() if available (ECMAScript 2026+)
  if (typeof Error.isError === "function") {
    return Error.isError(value);
  }
  // Fallback to instanceof for older environments
  return value instanceof Error;
}

/**
 * Type guard for Node.js ErrnoException
 *
 * Checks if an error has the `code` property that Node.js errors typically have.
 *
 * @param err - The error to check
 * @returns true if error has a code property (Node.js ErrnoException pattern)
 *
 * @example
 * ```ts
 * if (isErrnoException(err)) {
 *   console.log(err.code) // TypeScript knows err.code exists
 * }
 * ```
 */
export function isErrnoException(
  err: unknown
): err is NodeJS.ErrnoException {
  return (
    isError(err) &&
    typeof (err as NodeJS.ErrnoException).code === "string"
  );
}
