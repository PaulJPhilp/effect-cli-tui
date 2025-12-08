import { Console, Effect } from "effect";

import { TUIHandler } from "@/tui";
import type { TUIError } from "@/types";
import { SEPARATOR_WIDTH } from "../../constants";

/**
 * Operation kind for approval requests
 */
export type OperationKind = "shell" | "file-edit" | "network" | "other";

/**
 * Operation summary for approval requests
 */
export interface OperationSummary {
  readonly kind: OperationKind;
  readonly title: string; // short label, e.g. "Run tests"
  readonly summary: string; // one-line summary
  readonly details?: string; // optional multi-line details
}

/**
 * Approval Service API
 *
 * Provides approval workflow for side-effectful operations.
 * Displays operation details and prompts user for confirmation.
 */
export interface ApprovalServiceApi {
  /**
   * Request approval for an operation
   *
   * @param op - Operation summary with kind, title, summary, and optional details
   * @returns Effect that resolves to true if approved, false if declined
   */
  approve(op: OperationSummary): Effect.Effect<boolean, TUIError>;
}

/**
 * Approval Service
 *
 * Manages approval workflows for potentially dangerous operations.
 * Displays operation information and prompts user for confirmation.
 */
export class ApprovalService extends Effect.Service<ApprovalService>()(
  "app/ApprovalService",
  {
    effect: Effect.gen(function* () {
      const tui = yield* TUIHandler;

      return {
        approve: (op: OperationSummary): Effect.Effect<boolean, TUIError> =>
          Effect.gen(function* () {
            // Display operation information
            yield* Console.log(`\n${"=".repeat(SEPARATOR_WIDTH)}`);
            yield* Console.log(`Operation: ${op.title}`);
            yield* Console.log(`Kind: ${op.kind}`);
            yield* Console.log(`Summary: ${op.summary}`);
            if (op.details) {
              yield* Console.log("\nDetails:");
              yield* Console.log(op.details);
            }
            yield* Console.log("=".repeat(SEPARATOR_WIDTH));

            // Prompt for confirmation
            const confirmed = yield* tui.confirm("Proceed?", {
              default: false,
            });

            if (!confirmed) {
              yield* tui.display("Operation cancelled by user.", "info");
            }

            return confirmed;
          }),
      } as const satisfies ApprovalServiceApi;
    }),
    dependencies: [TUIHandler.Default],
  }
) {}
