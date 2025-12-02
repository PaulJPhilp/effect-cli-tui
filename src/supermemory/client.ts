import { Data, Effect } from "effect";
import { loadConfig } from "./config";

export class SupermemoryError extends Data.TaggedError("SupermemoryError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class MissingSupermemoryApiKey extends Data.TaggedError(
  "MissingSupermemoryApiKey"
)<{
  readonly message: string;
}> {}

export interface SupermemoryClient {
  readonly addText: (text: string) => Effect.Effect<void, SupermemoryError>;
  readonly search: (
    query: string,
    options?: { topK?: number; threshold?: number }
  ) => Effect.Effect<readonly any[], SupermemoryError>;
}

export class SupermemoryClientService extends Effect.Service<SupermemoryClientService>()("SupermemoryClient", {
  effect: Effect.gen(function* () {
    const config = yield* loadConfig();
    
    if (!config.apiKey) {
      yield* Effect.fail(
        new MissingSupermemoryApiKey({
          message: "No Supermemory API key configured. Run '/supermemory api-key <key>' first."
        })
      );
    }

    // TODO: Replace with actual effect-supermemory implementation
    // For now, return a mock implementation
    return {
      addText: (text: string) =>
        Effect.gen(function* () {
          yield* Effect.log(`Mock: Adding text: ${text}`);
          // Mock implementation - would use Ingest.addText
        }),

      search: (
        query: string,
        options: { topK?: number; threshold?: number } = {}
      ) =>
        Effect.gen(function* () {
          const { topK = 5, threshold = 0.5 } = options;
          yield* Effect.log(`Mock: Searching for: ${query} (topK: ${topK}, threshold: ${threshold})`);
          // Mock implementation - would use Search.searchMemories
          return [];
        }),
    } as SupermemoryClient;
  }),
  dependencies: [],
}) {}
