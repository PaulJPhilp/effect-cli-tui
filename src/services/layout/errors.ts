/**
 * Layout service errors
 */

import { Data } from "effect";

/**
 * Layout error types
 */
export class LayoutError extends Data.TaggedError("LayoutError")<{
  readonly reason: "RenderError" | "StateError";
  readonly message: string;
}> {}
