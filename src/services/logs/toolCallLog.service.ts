import { Effect, Ref } from "effect";
import { MAX_LOG_ENTRIES } from "../../constants";

/**
 * Tool call log entry
 */
export interface ToolCallLogEntry {
  readonly timestamp: number;
  readonly commandName: string; // slash command or "kit/tool invocation"
  readonly args: readonly string[];
  readonly resultSummary?: string; // optional short summary
}

/**
 * Tool Call Log Service API
 *
 * Logs tool calls and command executions for history tracking.
 */
export interface ToolCallLogServiceApi {
  /**
   * Log a tool call entry
   *
   * @param entry - The log entry to add
   */
  log: (entry: ToolCallLogEntry) => Effect.Effect<void>;

  /**
   * Get recent log entries
   *
   * @param limit - Maximum number of entries to return
   */
  getRecent: (limit: number) => Effect.Effect<readonly ToolCallLogEntry[]>;
}

/**
 * Tool Call Log Service
 *
 * Maintains an in-memory log of tool calls and command executions.
 * Uses a bounded queue to limit memory usage.
 */
export class ToolCallLogService extends Effect.Service<ToolCallLogService>()(
  "app/ToolCallLogService",
  {
    effect: Effect.gen(function* () {
      const logRef = yield* Ref.make<ToolCallLogEntry[]>([]);

      return {
        log: (entry: ToolCallLogEntry): Effect.Effect<void> =>
          Effect.gen(function* () {
            const currentLog = yield* Ref.get(logRef);
            const newLog = [...currentLog, entry];

            // Keep only the most recent MAX_LOG_ENTRIES entries
            const trimmedLog =
              newLog.length > MAX_LOG_ENTRIES
                ? newLog.slice(-MAX_LOG_ENTRIES)
                : newLog;

            yield* Ref.set(logRef, trimmedLog);
          }),

        getRecent: (
          limit: number
        ): Effect.Effect<readonly ToolCallLogEntry[]> =>
          Effect.gen(function* () {
            const log = yield* Ref.get(logRef);
            return log.slice(-limit);
          }),
      } as const satisfies ToolCallLogServiceApi;
    }),
    dependencies: [],
  }
) {}
